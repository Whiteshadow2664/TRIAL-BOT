const { EmbedBuilder } = require("discord.js");
const { Pool } = require("pg");

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for some cloud-hosted Postgres services
  },
});

// Create the `bumps` table if it doesn't exist
(async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS bumps (
        userId TEXT PRIMARY KEY,
        username TEXT,
        count INTEGER DEFAULT 0
      )
    `);
    console.log("Connected to the bump database and ensured table exists.");
    client.release();
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
  }
})();

const BUMP_BOT_ID = "1338037787924107365"; // Bump Bot's ID
const BUMP_MESSAGE = "Thx for bumping our Server! We will remind you in 2 hours!"; // Message to detect

module.exports = {
  handleBumpMessage: async (message) => {
    if (message.author.id === BUMP_BOT_ID && message.content.startsWith(BUMP_MESSAGE)) {
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser) return;

      const userId = mentionedUser.id;
      const username = mentionedUser.username;

      try {
        const client = await pool.connect();

        // Check if user exists, then update or insert bump count
        const res = await client.query(`SELECT count FROM bumps WHERE userId = $1`, [userId]);

        if (res.rows.length > 0) {
          // Update existing user's bump count
          const newCount = res.rows[0].count + 1;
          await client.query(`UPDATE bumps SET count = $1 WHERE userId = $2`, [newCount, userId]);
          console.log(`Updated bump count for ${username}: ${newCount}`);
        } else {
          // Insert new user with bump count 1
          await client.query(`INSERT INTO bumps (userId, username, count) VALUES ($1, $2, $3)`, [userId, username, 1]);
          console.log(`New bump recorded for ${username}`);
        }

        client.release();
      } catch (err) {
        console.error("Database error:", err.message);
      }
    }
  },

  showLeaderboard: async (message) => {
    try {
      const client = await pool.connect();
      const res = await client.query(`SELECT username, count FROM bumps ORDER BY count DESC LIMIT 10`);
      client.release();

      if (res.rows.length === 0) {
        return message.channel.send("No bumps recorded yet.");
      }

      const leaderboard = res.rows
        .map((entry, index) => `**${index + 1}.** ${entry.username} - **${entry.count} bumps**`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle("DISBOARD BUMPS")
        .setColor("#acf508")
        .setDescription(leaderboard)
        .setFooter({ text: "Keep bumping to climb the leaderboard!" });

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("Database error:", err.message);
      message.channel.send("Error retrieving leaderboard.");
    }
  },
};