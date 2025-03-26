const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  setup: async (client) => {
    const channel = await client.channels.fetch("1354334158599753741").catch(() => null);
    if (!channel) return console.error("❌ Ticket setup channel not found!");

    const messages = await channel.messages.fetch({ limit: 10 });
    if (
      messages.some(
        (msg) =>
          msg.embeds.length > 0 &&
          msg.embeds[0].title === "🎫 Support Ticket System"
      )
    ) {
      console.log("🎟️ Ticket setup message already exists. Skipping setup.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("🎫 Support Ticket System")
      .setDescription("Click the button below to create a support ticket.")
      .setColor("#acf508");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("create_ticket")
        .setLabel("Create Ticket")
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });
  },

  createTicket: async (interaction) => {
    if (!interaction.isButton() || interaction.customId !== "create_ticket") return;

    try {
      await interaction.deferReply();

      const guild = interaction.guild;
      const user = interaction.user;

      const category = guild.channels.cache.find(
        (c) => c.name === "Channels" && c.type === ChannelType.GuildCategory
      );

      if (!category) {
        return interaction.editReply({ content: '❌ Error: Category "Channels" not found.' })
          .then(msg => setTimeout(() => msg.delete(), 5000));
      }

      if (guild.channels.cache.some((ch) => ch.name === `ticket-${user.id}`)) {
        return interaction.editReply({ content: "❌ You already have an open ticket." })
          .then(msg => setTimeout(() => msg.delete(), 5000));
      }

      const modRole = guild.roles.cache.find((r) => r.name === "Moderator");
      if (!modRole) {
        return interaction.editReply({ content: "❌ Moderator role not found." })
          .then(msg => setTimeout(() => msg.delete(), 5000));
      }

      const ticketChannel = await guild.channels.create({
        name: `ticket-${user.id}`,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          {
            id: user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: interaction.client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ManageMessages,
              PermissionFlagsBits.ManageChannels,
            ],
          },
          { id: modRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ],
      });

      const embed = new EmbedBuilder()
        .setTitle("🎟️ Support Ticket Created")
        .setDescription(`Hello ${user.username}, staff will assist you shortly.\n\nReact with ⏹️ to close this ticket.`)
        .setColor("#acf508");

      const ticketMessage = await ticketChannel.send({ embeds: [embed] });
      await ticketMessage.react("⏹️");

      // Notify moderators
      await ticketChannel.send(`@Moderator please assist ${user.username}'s ticket!`);

      interaction.editReply({ content: `✅ Your ticket has been created: ${ticketChannel}` })
        .then(msg => setTimeout(() => msg.delete(), 5000));

    } catch (error) {
      console.error("❌ Error creating ticket:", error);
      if (interaction.deferred) {
        interaction.editReply({ content: "❌ An error occurred while creating your ticket." })
          .then(msg => setTimeout(() => msg.delete(), 5000));
      }
    }
  },

  handleReactions: async (reaction, user) => {
    if (reaction.emoji.name !== "⏹️") return;

    const ticketChannel = reaction.message.channel;
    if (!ticketChannel.name.startsWith("ticket-")) return;

    try {
      const guild = ticketChannel.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);
      if (!member) return;

      const modRole = guild.roles.cache.find((r) => r.name === "Moderator");
      const ticketOwnerId = ticketChannel.name.split("-")[1];
      const ticketOwner = await guild.members.fetch(ticketOwnerId).catch(() => null);

      if (!ticketOwner) {
        return ticketChannel.send("❌ Unable to verify ticket owner.");
      }

      if (user.id === ticketOwner.id || (modRole && member.roles.cache.has(modRole.id))) {
        await ticketChannel.send("✅ Closing ticket in 3 seconds...");
        setTimeout(async () => {
          if (guild.channels.cache.has(ticketChannel.id)) {
            await ticketChannel.delete();
          }
        }, 3000);
      } else {
        await ticketChannel.send("❌ You do not have permission to close this ticket.");
      }
    } catch (error) {
      console.error("❌ Error handling reaction:", error);
    }
  },
};