const { Client, EmbedBuilder, Intents } = require('discord.js');
const { Pool } = require('pg');

// Set up PostgreSQL pool
let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Ensures quick reconnection
});

// Create tables if they don't exist
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

    // Create bump_leaderboard table for tracking bumps
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

// Ensure tables exist on startup
createTables();

// Define the specific BUMP_BOT_ID to track
const BUMP_BOT_ID = 'YOUR_NEW_BUMP_BOT_ID';  // Replace with the new bump bot ID

/**
 * Handles bump tracking and awarding points when /bump command is used.
 */
async function trackBumpPoints(interaction) {
  // Check if the command is /bump and if it mentions the correct bot
  if (interaction.commandName === 'bump') {
    const mentionedBot = interaction.options.getUser('bot');
    
    // Ensure the mentioned bot matches the BUMP_BOT_ID
    if (mentionedBot && mentionedBot.id === BUMP_BOT_ID) {
      const mentionedUser = interaction.options.getUser('user');
      
      // Ensure a user is mentioned in the bump command
      if (mentionedUser) {
        try {
          // Connect to the database
          const client = await pool.connect();
          try {
            // Update the bump leaderboard
            await client.query(`
              INSERT INTO bump_leaderboard (user_id, username, bumps)
              VALUES ($1, $2, 1)
              ON CONFLICT (user_id) DO UPDATE
              SET username = EXCLUDED.username, bumps = bump_leaderboard.bumps + 1
            `, [mentionedUser.id, mentionedUser.username]);

            // Optionally, award points to the user mentioned in the bump
            await client.query(`
              INSERT INTO mod_rank (user_id, username, points, joined_at)
              VALUES ($1, $2, 3, NOW())
              ON CONFLICT (user_id) DO UPDATE
              SET username = EXCLUDED.username, points = mod_rank.points + 3
            `, [mentionedUser.id, mentionedUser.username]);

            console.log(`Awarded 3 points to ${mentionedUser.username} for bump.`);
          } finally {
            client.release(); // Release connection back to the pool
          }
        } catch (error) {
          console.error('Error tracking bump points:', error);
        }
      }
    }
  }
}

/**
 * Displays the bump leaderboard.
 */
async function executeBumpLeaderboard(interaction) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT user_id, username, bumps
        FROM bump_leaderboard
        ORDER BY bumps DESC
      `);

      if (result.rows.length === 0) {
        return interaction.reply('No bumps recorded yet.');
      }

      let leaderboard = '';
      result.rows.forEach((row, index) => {
        leaderboard += `**#${index + 1}** | **${row.username}** - **${row.bumps} Bumps**\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#acf508')
        .setTitle('Disboard Bump Leaderboard')
        .setDescription(leaderboard);

      interaction.reply({ embeds: [embed] });
    } finally {
      client.release(); // Release connection back to the pool
    }
  } catch (error) {
    console.error('Error fetching bump leaderboard:', error);
    interaction.reply('Error retrieving bump leaderboard.');
  }
}

/**
 * Displays the modrank leaderboard.
 */
async function executeModRankLeaderboard(interaction) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT user_id, username, points, DATE_PART('day', NOW() - joined_at) + 1 AS days_as_mod
        FROM mod_rank
        ORDER BY points DESC
      `);

      if (result.rows.length === 0) {
        return interaction.reply('No moderators tracked yet.');
      }

      let leaderboard = '';
      result.rows.forEach((row, index) => {
        const avgPoints = (row.points / row.days_as_mod).toFixed(2);
        leaderboard += `**#${index + 1}** | **${row.days_as_mod} Days** | **${row.username}** - **P: ${row.points}** | **AVG: ${avgPoints}**\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#acf508')
        .setTitle('Moderator Leaderboard')
        .setDescription(leaderboard);

      interaction.reply({ embeds: [embed] });
    } finally {
      client.release(); // Release connection back to the pool
    }
  } catch (error) {
    console.error('Error fetching modrank leaderboard:', error);
    interaction.reply('Error retrieving modrank leaderboard.');
  }
}

// Create a client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Log the bot in
client.login('YOUR_BOT_TOKEN'); // Replace with your bot token

// Command registration for /bump, /bumpleaderboard, and /modrank
client.once('ready', async () => {
  console.log('Bot is online!');
  
  // Register the commands (assumes you've already created them via Discord Developer Portal)
  await client.application.commands.create({
    name: 'bump',
    description: 'Bump the server and award points to the mentioned user.',
    options: [
      {
        type: 6, // Type 6 refers to a user mention
        name: 'user',
        description: 'The user to award points to',
        required: true,
      },
      {
        type: 6, // Type 6 refers to a bot mention
        name: 'bot',
        description: 'The bot who is bumping the server',
        required: true,
      }
    ],
  });

  await client.application.commands.create({
    name: 'bumpleaderboard',
    description: 'Shows the bump leaderboard.',
  });

  await client.application.commands.create({
    name: 'modrank',
    description: 'Shows the moderator leaderboard.',
  });

  console.log('Commands registered.');
});

// Listen for interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  // Handle /bump command
  if (interaction.commandName === 'bump') {
    await trackBumpPoints(interaction);
  }

  // Handle /bumpleaderboard command
  if (interaction.commandName === 'bumpleaderboard') {
    await executeBumpLeaderboard(interaction);
  }

  // Handle /modrank command
  if (interaction.commandName === 'modrank') {
    await executeModRankLeaderboard(interaction);
  }
});