const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
} = require("discord.js");

module.exports = {
  setup: async (client) => {
    const channel = await client.channels.fetch("1354334158599753741"); // Ticket channel ID
    if (!channel) return console.error("Ticket setup channel not found!");

    // Prevent duplicate setup messages
    const messages = await channel.messages.fetch({ limit: 10 });
    if (
      messages.some(
        (msg) =>
          msg.embeds.length > 0 &&
          msg.embeds[0].title === "🎫 Support Ticket System"
      )
    ) {
      console.log("Ticket setup message already exists. Skipping setup.");
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
    if (!interaction.isButton() || interaction.customId !== "create_ticket")
      return;

    const category = interaction.guild.channels.cache.find(
      (c) => c.name === "Channels" && c.type === ChannelType.GuildCategory
    );
    if (!category)
      return interaction.reply({
        content: 'Error: Category "Channels" not found.',
        flags: MessageFlags.Ephemeral,
      });

    // Prevent duplicate ticket creation
    if (
      interaction.guild.channels.cache.some(
        (ch) => ch.name === `ticket-${interaction.user.username.toLowerCase()}`
      )
    ) {
      return interaction.reply({
        content: "You already have an open ticket.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const modRole = interaction.guild.roles.cache.find(
      (r) => r.name === "Moderator"
    );
    if (!modRole)
      return interaction.reply({
        content: "Moderator role not found.",
        flags: MessageFlags.Ephemeral,
      });

    try {
      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username.toLowerCase()}`,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
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
          {
            id: modRole.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
        ],
      });

      const embed = new EmbedBuilder()
        .setTitle("🎟️ Support Ticket Created")
        .setDescription(
          `Hello ${interaction.user.username}, staff will assist you shortly.\n\nReact with ⏹️ to close this ticket.`
        )
        .setColor("#acf508");

      const ticketMessage = await ticketChannel.send({ embeds: [embed] });

      await ticketMessage.react("⏹️");

      await interaction.reply({
        content: `Your ticket has been created: ${ticketChannel}`,
        flags: MessageFlags.Ephemeral,
      });

      // Reaction-based ticket closing
      const filter = (reaction, user) => {
        return (
          reaction.emoji.name === "⏹️" &&
          (user.id === interaction.user.id ||
            interaction.guild.members.cache
              .get(user.id)
              ?.roles.cache.has(modRole.id))
        );
      };

      const collector = ticketMessage.createReactionCollector({
        filter,
        dispose: true,
      });

      collector.on("collect", async (reaction, user) => {
        if (!ticketChannel || !interaction.guild.channels.cache.has(ticketChannel.id)) return;

        await ticketChannel.send("Closing ticket in 3 seconds...");
        setTimeout(() => ticketChannel.delete(), 3000);
      });

      // Ping @Moderator if ticket is still open after 5 minutes
      setTimeout(async () => {
        if (
          ticketChannel &&
          interaction.guild.channels.cache.has(ticketChannel.id)
        ) {
          await ticketChannel.send({
            content: `${modRole}, this ticket is still open and requires assistance.`,
          });
        }
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error("❌ Error creating ticket channel:", error);
      await interaction.reply({
        content:
          "An error occurred while creating your ticket. Please try again later.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};