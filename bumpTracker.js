const { EmbedBuilder } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Set up a persistent SQLite database file
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the `bumps` table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS bumps (
      userId TEXT PRIMARY KEY,
      username TEXT,
      count INTEGER DEFAULT 0
    )`
  );
  console.log("Bump table ensured.");
});

const BUMP_BOT_ID = "1338037787924107365";
const BUMP_MESSAGE = "Thx for bumping our Server! We will remind you in 2 hours!";

module.exports = {
  handleBumpMessage: async (message) => {
    if (message.author.id === BUMP_BOT_ID && message.content.startsWith(BUMP_MESSAGE)) {
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser) return;

      const userId = mentionedUser.id;
      const username = mentionedUser.username;

      db.get(`SELECT count FROM bumps WHERE userId = ?`, [userId], (err, row) => {
        if (err) {
          console.error("Database error:", err.message);
          return;
        }

        if (row) {
          // Update bump count
          db.run(`UPDATE bumps SET count = count + 1 WHERE userId = ?`, [userId], (err) => {
            if (err) console.error("Update error:", err.message);
          });
        } else {
          // Insert new user
          db.run(`INSERT INTO bumps (userId, username, count) VALUES (?, ?, 1)`, [userId, username], (err) => {
            if (err) console.error("Insert error:", err.message);
          });
        }
      });
    }
  },

  showLeaderboard: async (message) => {
    db.all(`SELECT username, count FROM bumps ORDER BY count DESC LIMIT 10`, [], (err, rows) => {
      if (err) {
        console.error("Database error:", err.message);
        message.channel.send("Error retrieving leaderboard.");
        return;
      }

      if (rows.length === 0) {
        message.channel.send("No bumps recorded yet.");
        return;
      }

      const leaderboard = rows
        .map((entry, index) => `**${index + 1}.** ${entry.username} - **${entry.count} bumps**`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle("DISBOARD BUMPS")
        .setColor("#acf508")
        .setDescription(leaderboard)
        .setFooter({ text: "Keep bumping to climb the leaderboard!" });

      message.channel.send({ embeds: [embed] });
    });
  },
};