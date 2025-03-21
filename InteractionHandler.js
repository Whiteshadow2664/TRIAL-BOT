const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    async handleInteraction(interaction) {
        // Handle button interaction
        if (interaction.isButton() && interaction.customId === 'openEventModal') {
            const modal = new ModalBuilder()
                .setCustomId('eventForm')
                .setTitle('Create an Event');

            // Event Name Input
            const eventNameInput = new TextInputBuilder()
                .setCustomId('eventName')
                .setLabel('Event Name')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            // Event Date Input
            const eventDateInput = new TextInputBuilder()
                .setCustomId('eventDate')
                .setLabel('Event Date & Time (e.g., 25th March, 5 PM IST)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            // Event Description Input
            const eventDescInput = new TextInputBuilder()
                .setCustomId('eventDesc')
                .setLabel('Event Description')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            // Create Action Rows
            const firstRow = new ActionRowBuilder().addComponents(eventNameInput);
            const secondRow = new ActionRowBuilder().addComponents(eventDateInput);
            const thirdRow = new ActionRowBuilder().addComponents(eventDescInput);

            // Add components to the modal
            modal.addComponents(firstRow, secondRow, thirdRow);

            await interaction.showModal(modal);
        }

        // Handle modal submission
        if (interaction.isModalSubmit() && interaction.customId === 'eventForm') {
            const eventName = interaction.fields.getTextInputValue('eventName');
            const eventDate = interaction.fields.getTextInputValue('eventDate');
            const eventDesc = interaction.fields.getTextInputValue('eventDesc');

            const eventEmbed = new EmbedBuilder()
                .setTitle(`📅 New Event: ${eventName}`)
                .addFields(
                    { name: '📆 Date & Time', value: eventDate },
                    { name: '📝 Description', value: eventDesc }
                )
                .setColor('#0099ff')
                .setFooter({ text: `Created by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            const eventChannelId = 'YOUR_EVENT_CHANNEL_ID'; // Replace with your event channel ID
            const eventChannel = interaction.client.channels.cache.get(eventChannelId);

            if (eventChannel) {
                await eventChannel.send({ embeds: [eventEmbed] });
                await interaction.reply({ content: 'Event created successfully!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Could not find the event channel.', ephemeral: true });
            }
        }
    }
};