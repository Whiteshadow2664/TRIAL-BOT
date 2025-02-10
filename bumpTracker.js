const { EmbedBuilder } = require("discord.js");
const Database = require("better-sqlite3");
const db = new Database("./database.sqlite");

const BUMP_BOT_ID = "1338037787924107365"; // Bump Bot's ID
const BUMP_MESSAGE = "Thx for bumping our Server! We will remind you in 2 hours!"; // Message to detect

module.exports = {
  handleBumpMessage: (message) => {
    if (message.author.id === BUMP_BOT_ID && message.content.startsWith(BUMP_MESSAGE)) {
      // Extract user ID from the message
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser) return;

      const userId = mentionedUser.id;
      const username = mentionedUser.username;

      // Increment bump count in database
      const bumps = db.get(`bumps_${userId}`) || 0;
      db.set(`bumps_${userId}`, bumps + 1);

      console.log(`Bump recorded for ${username} (${userId}). Total Bumps: ${bumps + 1}`);
    }
  },

  showLeaderboard: (message) => {
    const allUsers = db.all().filter((entry) => entry.ID.startsWith("bumps_"));

    if (allUsers.length === 0) {
      return message.channel.send("No bumps recorded yet.");
    }

    // Sort by highest bumps
    allUsers.sort((a, b) => b.data - a.data);

    const leaderboard = allUsers
      .map((entry, index) => {
        const userId = entry.ID.replace("bumps_", "");
        return `**${index + 1}.** <@${userId}> - **${entry.data} bumps**`;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Bump Leaderboard")
      .setColor("GOLD")
      .setDescription(leaderboard)
      .setFooter({ text: "Keep bumping to climb the leaderboard!" });

    message.channel.send({ embeds: [embed] });
  },
};