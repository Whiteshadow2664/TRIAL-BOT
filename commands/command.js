const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "commands",
  description: "Displays a list of all available commands.",
  execute: async (message) => {
    const embed = new EmbedBuilder()
      .setTitle("📜 Frau Lingua Command Guide")
      .setDescription(
        "Below is a list of available commands categorized for easy navigation.\n" +
        "Use the appropriate commands in the designated channels."
      )
      .setColor("#acf508") // Light green
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        { 
          name: "🔹 **General Commands**", 
          value: 
            "`!help` — Get assistance with the bot\n" +
            "`!resources` — Access learning materials\n" +
            "`!ddd` — Play the Die Der Das game *(use in <#quiz-bot>)*\n" +
            "`!quiz` — Start a vocabulary quiz *(use in <#quiz-bot>)*\n" +
            "`!updates` — View recent bot updates\n" +
            "`!leaderboard` — Display the quiz leaderboard\n" +
            "`!modrank` — View moderator rankings\n" +
            "`!tips` — Receive study tips\n" +
            "`!class` — Check upcoming events and classes\n" +
            "`!exam` — Get information on German proficiency exams",
          inline: false 
        },
        { 
          name: "🛠️ **Moderator Commands**", 
          value: 
            "`!purge` — Clear a specified number of messages\n" +
            "`!announcement` — Send a server-wide announcement\n" +
            "`!ws` — Provide a worksheet for users to complete\n" +
            "`!ban @username` — Ban a user from the server\n" +
            "`!kick @username` — Remove a user from the server\n" +
            "`!mute @username` — Temporarily mute a user",
          inline: false 
        }
      )
      .setFooter({ text: "Use commands responsibly. For assistance, type !help." });

    message.channel.send({ embeds: [embed] });
  },
};