const { EmbedBuilder } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

// Create or connect to the database
const db = new sqlite3.Database("./bumpData.db", (err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.message);
  } else {
    console.log("Connected to the bump database.");
  }
});

// Create the `bumps` table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS bumps (
    userId TEXT PRIMARY KEY,
    username TEXT,
    count INTEGER DEFAULT 0
  )`
);

const BUMP_BOT_ID = "1338037787924107365"; // Bump Bot's ID
const BUMP_MESSAGE = "Thx for bumping our Server! We will remind you in 2 hours!"; // Message to detect

module.exports = {
  handleBumpMessage: (message) => {
    if (message.author.id === BUMP_BOT_ID && message.content.startsWith(BUMP_MESSAGE)) {
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser) return;

      const userId = mentionedUser.id;
      const username = mentionedUser.username;

      // Check if user exists, then update or insert bump count
      db.get(`SELECT count FROM bumps WHERE userId = ?`, [userId], (err, row) => {
        if (err) {
          console.error("Database error:", err.message);
          return;
        }

        if (row) {
          // Update existing user's bump count
          const newCount = row.count + 1;
          db.run(`UPDATE bumps SET count = ? WHERE userId = ?`, [newCount, userId]);
          console.log(`Updated bump count for ${username}: ${newCount}`);
        } else {
          // Insert new user with bump count 1
          db.run(`INSERT INTO bumps (userId, username, count) VALUES (?, ?, ?)`, [userId, username, 1]);
          console.log(`New bump recorded for ${username}`);
        }
      });
    }
  },

  showLeaderboard: (message) => {
    db.all(`SELECT userId, username, count FROM bumps ORDER BY count DESC LIMIT 10`, (err, rows) => {
      if (err) {
        console.error("Database error:", err.message);
        return message.channel.send("Error retrieving leaderboard.");
      }

      if (rows.length === 0) {
        return message.channel.send("No bumps recorded yet.");
      }

      const leaderboard = rows
        .map((entry, index) => `**${index + 1}.** <@${entry.userId}> - **${entry.count} bumps**`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle("🏆 Bump Leaderboard")
        .setColor("#acf508")
        .setDescription(leaderboard)
        .setFooter({ text: "Keep bumping to climb the leaderboard!" });

      message.channel.send({ embeds: [embed] });
    });
  },
};