const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "event",
    description: "Creates an event with user-defined details.",
    async execute(message) {
        // Create Modal (Form)
        const modal = new ModalBuilder()
            .setCustomId('eventForm')
            .setTitle('📅 Event Creation Form');

        // Form Fields
        const eventName = new TextInputBuilder()
            .setCustomId('eventName')
            .setLabel('Event Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const eventDate = new TextInputBuilder()
            .setCustomId('eventDate')
            .setLabel('Event Date (YYYY-MM-DD)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const eventTime = new TextInputBuilder()
            .setCustomId('eventTime')
            .setLabel('Event Time (HH:MM AM/PM)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const eventDescription = new TextInputBuilder()
            .setCustomId('eventDescription')
            .setLabel('Short Event Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        // Add Fields to Modal
        const row1 = new ActionRowBuilder().addComponents(eventName);
        const row2 = new ActionRowBuilder().addComponents(eventDate);
        const row3 = new ActionRowBuilder().addComponents(eventTime);
        const row4 = new ActionRowBuilder().addComponents(eventDescription);

        modal.addComponents(row1, row2, row3, row4);

        // Show the form to the user
        await message.reply({ content: "📌 Please fill out the event form.", ephemeral: true });
        await message.member.send({ content: "Fill out the event details below:", components: [modal] })
            .catch(() => message.channel.send("I couldn't DM you. Make sure your DMs are open!"));
    }
};

// Event Listener for Modal Submission
module.exports.handleModalSubmit = async (interaction) => {
    if (interaction.customId === 'eventForm') {
        const eventName = interaction.fields.getTextInputValue('eventName');
        const eventDate = interaction.fields.getTextInputValue('eventDate');
        const eventTime = interaction.fields.getTextInputValue('eventTime');
        const eventDescription = interaction.fields.getTextInputValue('eventDescription');

        // Create an embed for the event announcement
        const embed = new EmbedBuilder()
            .setTitle(`📅 Upcoming Event: ${eventName}`)
            .setDescription(`**📝 Description:** ${eventDescription}`)
            .addFields(
                { name: "📅 Date", value: eventDate, inline: true },
                { name: "🕒 Time", value: eventTime, inline: true }
            )
            .setColor("#0099ff")
            .setFooter({ text: "Event Created Successfully!" });

        // Announce the event in the channel
        await interaction.channel.send({ embeds: [embed] });

        await interaction.reply({ content: "✅ Event created successfully!", ephemeral: true });
    }
};