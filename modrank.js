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

const BUMP_BOT_ID = '1338037787924107365'; // Replace with actual bump bot ID

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
 * Tracks bump points when a bump interaction occurs.
 */
async function trackBumpingPoints(interaction) {
  if (interaction.user.bot || interaction.commandName !== 'bump') return;

  if (interaction.targetId === BUMP_BOT_ID) {
    const userId = interaction.user.id;
    const username = interaction.user.username;

    try {
      const client = await pool.connect();
      try {
        // Update bump leaderboard for the user
        await client.query(`
          INSERT INTO bump_leaderboard (user_id, username, bumps)
          VALUES ($1, $2, 1)
          ON CONFLICT (user_id) DO UPDATE
          SET username = EXCLUDED.username, bumps = bump_leaderboard.bumps + 1
        `, [userId, username]);
      } finally {
        client.release(); // Release connection back to the pool
      }

      console.log(`Bump tracked for ${username} (${userId})`);
    } catch (error) {
      console.error('Error tracking bump points:', error);
    }
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

      let leaderboard = '';
      result.rows.forEach((row, index) => {
        leaderboard += `**#${index + 1}** | **${row.username}** - **${row.bumps} Bumps**\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#acf508')
        .setTitle('Bump Leaderboard')
        .setDescription(leaderboard);

      message.channel.send({ embeds: [embed] });
    } finally {
      client.release(); // Release connection back to the pool
    }
  } catch (error) {
    console.error('Error fetching bump leaderboard:', error);
    message.channel.send('Error retrieving bump leaderboard.');
  }
}

// Add this part to handle interaction events
module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
      if (interaction.commandName === 'bump') {
        await trackBumpingPoints(interaction);
      }
    }
  });

  // Expose functions for usage in other parts of the bot
  return {
    updateModRank,
    trackBumpingPoints,
    executeBumpLeaderboard
  };
};