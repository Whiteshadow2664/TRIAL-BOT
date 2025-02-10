const { Client, MessageEmbed } = require('discord.js');
const { Pool } = require('pg');

// Set up database connection using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessary for remote database connection
  },
});

// Function to create the table if it does not exist
async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS mod_rank (
      user_id BIGINT PRIMARY KEY,
      username TEXT NOT NULL,
      points INT DEFAULT 0,
      joined_at TIMESTAMP NOT NULL
    );
  `;
  await pool.query(query);
}

// Function to update the moderator's rank in the database
async function updateModRank(userId, username) {
  const query = `
    INSERT INTO mod_rank (user_id, username, joined_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET points = mod_rank.points + 1;
  `;
  await pool.query(query, [userId, username]);
}

// Function to track bumping points (triggered by specific messages from the bot)
async function trackBumpingPoints(message) {
  const bumpMessage = 'Thx for bumping our Server! We will remind you in 2 hours!';
  const botId = '1338037787924107365'; // The bot ID for detecting the bump

  if (message.author.id === botId && message.content.includes(bumpMessage)) {
    // Find the mentioned user in the bump message
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) {
      // Update the points for the user mentioned in the bump message
      await updateModRank(mentionedUser.id, mentionedUser.username);
    }
  }
}

// Function to get the leaderboard from the database
async function getLeaderboard() {
  const query = `
    SELECT 
      user_id, username, points,
      DATE_PART('day', NOW() - joined_at) + 1 AS days_as_mod
    FROM mod_rank
    ORDER BY points DESC, days_as_mod ASC;
  `;
  const res = await pool.query(query);
  return res.rows;
}

// Function to send the leaderboard embed
async function sendLeaderboard(message) {
  const leaderboard = await getLeaderboard();
  const embed = new MessageEmbed()
    .setColor('#acf508')
    .setTitle('Moderator Leaderboard')
    .setDescription('Here is the leaderboard for moderators with the most points!');
  
  leaderboard.forEach((entry, index) => {
    const avgPoints = (entry.points / entry.days_as_mod).toFixed(2);
    embed.addField(
      `#${index + 1} | ${entry.days_as_mod} days`,
      `${entry.username} - P: ${entry.points} | AVG: ${avgPoints}`,
      false
    );
  });

  message.channel.send({ embeds: [embed] });
}

// Command to handle the modrank display
async function execute(message) {
  if (message.content === '!modrank') {
    await sendLeaderboard(message);
  }
}

// Main handler for tracking messages and points
async function handleMessage(message) {
  if (message.member && message.member.roles.cache.some(role => role.name === 'Moderator')) {
    // Track points for every message sent by a moderator
    await updateModRank(message.author.id, message.author.username);
  }

  // Track bumping points
  await trackBumpingPoints(message);
}

// Export functions for use in the main bot file
module.exports = {
  createTable,
  handleMessage,
  execute,
};