const { EmbedBuilder, TextInputBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    async handleEventSubmission(interaction) {
        if (!interaction.isModalSubmit() || interaction.customId !== 'eventForm') return;

        try {
            // Retrieve input values
            const eventName = interaction.fields.getTextInputValue('eventName');
            const eventDate = interaction.fields.getTextInputValue('eventDate');
            const eventDesc = interaction.fields.getTextInputValue('eventDesc');

            // Validate input lengths
            if (eventName.length < 1 || eventName.length > 100) {
                return interaction.reply({ content: 'Event Name must be between 1 and 100 characters.', ephemeral: true });
            }
            if (eventDate.length < 1 || eventDate.length > 100) {
                return interaction.reply({ content: 'Event Date must be between 1 and 100 characters.', ephemeral: true });
            }
            if (eventDesc.length < 1 || eventDesc.length > 4000) {
                return interaction.reply({ content: 'Event Description must be between 1 and 4000 characters.', ephemeral: true });
            }

            // Create an event embed
            const eventEmbed = new EmbedBuilder()
                .setTitle(`📅 New Event: ${eventName}`)
                .addFields(
                    { name: '📆 Date & Time', value: eventDate },
                    { name: '📝 Description', value: eventDesc }
                )
                .setColor('#0099ff')
                .setFooter({ text: `Created by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            // Send the event to a specific channel
            const eventChannelId = 'YOUR_EVENT_CHANNEL_ID'; // Replace with your event channel ID
            const eventChannel = interaction.client.channels.cache.get(eventChannelId);

            if (eventChannel) {
                await eventChannel.send({ embeds: [eventEmbed] });
                await interaction.reply({ content: '✅ Event created successfully!', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Could not find the event channel. Please check the channel ID.', ephemeral: true });
            }

        } catch (error) {
            console.error('Error handling event submission:', error);
            await interaction.reply({ content: '❌ An error occurred while processing the event.', ephemeral: true });
        }
    },
};