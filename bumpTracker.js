const { EmbedBuilder } = require("discord.js");
const { Pool } = require("pg");

// Set up PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

// Auto-reconnect on database errors
pool.on("error", async (err) => {
  console.error("Database connection lost. Attempting to reconnect...", err);
  try {
    await pool.query("SELECT 1"); // Test reconnection
    console.log("Database reconnected successfully.");
  } catch (error) {
    console.error("Reconnection attempt failed:", error);
  }
});

// Keep the connection alive every 2 minutes
setInterval(async () => {
  try {
    await pool.query("SELECT now()"); // Lightweight keep-alive query
  } catch (err) {
    console.error("Database keep-alive failed:", err);
  }
}, 120000); // 120000ms = 2 minutes

// Create the `bumps` table if it doesn't exist
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bumps (
        userId TEXT PRIMARY KEY,
        username TEXT,
        count INTEGER DEFAULT 0
      )
    `);
    console.log("Bump table ensured.");
  } catch (err) {
    console.error("Failed to initialize database:", err.message);
  }
})();

const BUMP_BOT_ID = "1338037787924107365";
const BUMP_MESSAGE = "Thx for bumping our Server! We will remind you in 2 hours!";

module.exports = {
  handleBumpMessage: async (message) => {
    if (message.author.id === BUMP_BOT_ID && message.content.startsWith(BUMP_MESSAGE)) {
        console.log("Bump detected! Processing...");
        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) {
            console.log("No user mentioned.");
            return;
        }

        const userId = mentionedUser.id;
        const username = mentionedUser.username;

        try {
            const res = await pool.query(`SELECT count FROM bumps WHERE userId = $1`, [userId]);
            console.log(`Current bump count for ${username}:`, res.rows[0]?.count || 0);

            if (res.rows.length > 0) {
                await pool.query(`UPDATE bumps SET count = count + 1 WHERE userId = $1`, [userId]);
                console.log(`Bump count updated for ${username}.`);
            } else {
                await pool.query(`INSERT INTO bumps (userId, username, count) VALUES ($1, $2, 1)`, [userId, username]);
                console.log(`New user added: ${username}, Bump count set to 1.`);
            }

            // Fetch updated count for verification
            const updatedRes = await pool.query(`SELECT count FROM bumps WHERE userId = $1`, [userId]);
            console.log(`Updated bump count for ${username}:`, updatedRes.rows[0]?.count);

        } catch (err) {
            console.error("Database error:", err.message);
        }
    }
},

  showLeaderboard: async (message) => {
    try {
        console.log("Fetching leaderboard data...");
        const res = await pool.query(`SELECT username, count FROM bumps ORDER BY count DESC LIMIT 10`);
        console.log(res.rows); // Debug log

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