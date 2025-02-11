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
    )`,
    (err) => {
      if (err) {
        console.error("Failed to create bumps table:", err.message);
      } else {
        console.log("Bump table ensured.");
      }
    }
  );
});

const BUMP_BOT_ID = "1338037787924107365";
const BUMP_MESSAGE = "Thx for bumping our Server! We will remind you in 2 hours!";

module.exports = {
  handleBumpMessage: async (message) => {
    if (message.author.id === BUMP_BOT_ID && message.content.startsWith(BUMP_MESSAGE)) {
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser) {
        console.log("No user mentioned in bump message.");
        return;
      }

      const userId = mentionedUser.id;
      const username = mentionedUser.username;

      console.log(`Bump detected from: ${username} (${userId})`);

      db.get(`SELECT count FROM bumps WHERE userId = ?`, [userId], (err, row) => {
        if (err) {
          console.error("Database error (SELECT):", err.message);
          return;
        }

        if (row) {
          console.log(`User ${username} exists. Current count: ${row.count}. Updating count...`);
          db.run(`UPDATE bumps SET count = count + 1 WHERE userId = ?`, [userId], function (err) {
            if (err) console.error("Update error:", err.message);
            else console.log(`Bump count updated to ${row.count + 1} for ${username}`);
          });
        } else {
          console.log(`User ${username} not found in database. Adding new entry.`);
          db.run(`INSERT INTO bumps (userId, username, count) VALUES (?, ?, 1)`, [userId, username], function (err) {
            if (err) console.error("Insert error:", err.message);
            else console.log(`New user ${username} added with 1 bump.`);
          });
        }
      });
    }
  },

  showLeaderboard: async (message) => {
    console.log("Fetching leaderboard data...");

    db.all(`SELECT username, count FROM bumps ORDER BY count DESC LIMIT 10`, [], (err, rows) => {
      if (err) {
        console.error("Database error (SELECT leaderboard):", err.message);
        message.channel.send("Error retrieving leaderboard.");
        return;
      }

      console.log("Leaderboard data:", rows);

      if (rows.length === 0) {
        console.log("No bumps recorded in the database.");
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
  }
};