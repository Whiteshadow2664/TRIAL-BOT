const { MessageFlags } = require("discord.js");
const ticket = require("./ticket.js");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "create_ticket") {
      try {
        await ticket.createTicket(interaction);
      } catch (error) {
        console.error("❌ Error handling interaction:", error);

        if (!interaction.replied && !interaction.deferred) {
          try {
            await interaction.reply({
              content: "❌ An error occurred while processing your request.",
              ephemeral: true,
            });
          } catch (err) {
            console.error("❌ Failed to reply to interaction:", err);
          }
        }
      }
    }
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    if (!user.bot) {
      try {
        await reaction.fetch();
        await reaction.message.fetch();
        await ticket.handleReactions(reaction, user);
      } catch (error) {
        console.error("❌ Error handling reaction:", error);
      }
    }
  });
};