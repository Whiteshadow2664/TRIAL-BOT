const { Client, EmbedBuilder } = require('discord.js');
const { Pool } = require('pg');

let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Ensures quick reconnection
});

// Step 1: Place this function just after the pool connection setup
async function createTables() {
  try {
    // Create mod_rank table for moderator leaderboard
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mod_rank (
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        points INT DEFAULT 0,
        joined_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create bump_leaderboard table for Disboard bumps
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bump_leaderboard (
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        bumps INT DEFAULT 0
      );
    `);

    console.log('✅ Tables for mod_rank and bump_leaderboard checked/created.');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

// Step 2: Call the function right after the pool setup
createTables(); // Ensure tables exist on startup

const BUMP_BOT_ID = '540129267728515072';
const BUMP_MESSAGE = 'Thx for bumping our Server! We will remind you in 2 hours!';

/**
 * Keeps the database connection alive by running a query every 5 minutes.
 */
function keepDBAlive() {
  setInterval(async () => {
    try {
      await pool.query('SELECT 1'); // Simple query to prevent Neon from terminating the connection
    } catch (error) {
      console.error('Error keeping DB alive:', error);
    }
  }, 5 * 60 * 1000); // Runs every 5 minutes
}
keepDBAlive(); // Start keep-alive function

/**
 * Handles unexpected database connection errors and reconnects.
 */
pool.on('error', async (err) => {
  console.error('Unexpected DB connection error:', err);
  await pool.end(); // Close the current pool
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
  console.log('Reconnected to database.');
});

/**
 * Updates the moderator's rank when they send a message.
 */
async function updateModRank(userId, username, guild) {
  try {
    const moderatorRole = guild.roles.cache.find(role => role.name.toLowerCase() === 'moderator');
    const member = guild.members.cache.get(userId);

    if (!moderatorRole || !member || !member.roles.cache.has(moderatorRole.id)) return;

    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO mod_rank (user_id, username, points, joined_at)
        VALUES ($1, $2, 1, NOW())
        ON CONFLICT (user_id) DO UPDATE
        SET username = EXCLUDED.username, points = mod_rank.points + 1
      `, [userId, username]);
    } finally {
      client.release(); // Release connection back to the pool
    }
  } catch (error) {
    console.error('Error updating mod rank:', error);
  }
}

/**
 * Tracks bump points when a bump message is detected.
 */
async function trackBumpingPoints(message) {
  if (message.author.id !== BUMP_BOT_ID || !message.content.startsWith(BUMP_MESSAGE)) return;

  const mentionedUser = message.mentions.users.first();
  if (!mentionedUser) return;

  try {
    const client = await pool.connect();
    try {
      // Update bump leaderboard for the user
      await client.query(`
        INSERT INTO bump_leaderboard (user_id, username, bumps)
        VALUES ($1, $2, 1)
        ON CONFLICT (user_id) DO UPDATE
        SET username = EXCLUDED.username, bumps = bump_leaderboard.bumps + 1
      `, [mentionedUser.id, mentionedUser.username]);

      // If the mentioned user is a moderator, award points as well
      const member = message.guild.members.cache.get(mentionedUser.id);
      if (member && member.roles.cache.some(role => role.name.toLowerCase() === 'moderator')) {
        await client.query(`
          INSERT INTO mod_rank (user_id, username, points, joined_at)
          VALUES ($1, $2, 3, NOW())
          ON CONFLICT (user_id) DO UPDATE
          SET username = EXCLUDED.username, points = mod_rank.points + 3
        `, [mentionedUser.id, mentionedUser.username]);
      }
    } finally {
      client.release(); // Release connection back to the pool
    }
  } catch (error) {
    console.error('Error tracking bump points:', error);
  }
}

/**
 * Displays the moderator leaderboard.
 */
async function executeModRank(message) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT user_id, username, points, joined_at, (DATE_PART('day', NOW() - joined_at) + 1) AS days_as_mod
        FROM mod_rank
        WHERE points > 0
        ORDER BY points DESC
      `);

      if (result.rows.length === 0) {
        return message.channel.send('No moderator activity recorded yet.');
      }

      let leaderboard = '**Moderator Leaderboard**\n';
      result.rows.forEach((row, index) => {
        const avgPoints = (row.points / row.days_as_mod).toFixed(2);
        leaderboard += `**#${index + 1}** | **${row.username}** - **P:** ${row.points} | **AVG:** ${avgPoints}\n`;
      });

      // Add cheering for the top moderator
      leaderboard += `\n🎉 Congratulations to **#1** for being the top moderator! 🎉`;

      const embed = new EmbedBuilder()
        .setColor('#acf508')
        .setTitle('Moderator Leaderboard')
        .setDescription(leaderboard)
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    } finally {
      client.release(); // Release connection back to the pool
    }
  } catch (error) {
    console.error('Error fetching mod leaderboard:', error);
    message.channel.send('Error retrieving leaderboard.');
  }
}

/**
 * Displays the bump leaderboard.
 */
async function executeBumpLeaderboard(message) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT user_id, username, bumps
        FROM bump_leaderboard
        ORDER BY bumps DESC
      `);

      if (result.rows.length === 0) {
        return message.channel.send('No bumps recorded yet.');
      }

      let leaderboard = '**Disboard Bump Leaderboard**\n';
      result.rows.forEach((row, index) => {
        leaderboard += `**#${index + 1}** | **${row.username}** - **${row.bumps} Bumps**\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#acf508')
        .setTitle('Disboard Bump Leaderboard')
        .setDescription(leaderboard)
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    } finally {
      client.release(); // Release connection back to the pool
    }
  } catch (error) {
    console.error('Error fetching bump leaderboard:', error);
    message.channel.send('Error retrieving bump leaderboard.');
  }
}

// Add this part to handle message creation event
module.exports = (client) => {
  client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignore bot messages

    // Call updateModRank when a message is sent by a moderator
    updateModRank(message.author.id, message.author.username, message.guild);
    
    // Call trackBumpingPoints to track bump messages
    trackBumpingPoints(message);
  });

  // Expose functions for usage in other parts of the bot
  return {
    updateModRank,
    trackBumpingPoints,
    executeModRank,
    executeBumpLeaderboard
  };
};