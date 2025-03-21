const { EmbedBuilder } = require('discord.js');

module.exports = {
    async handleEventSubmission(interaction) {
        if (!interaction.isModalSubmit() || interaction.customId !== 'eventForm') return;

        // Retrieve input values
        const eventName = interaction.fields.getTextInputValue('eventName');
        const eventDate = interaction.fields.getTextInputValue('eventDate');
        const eventDesc = interaction.fields.getTextInputValue('eventDesc');

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
            await interaction.reply({ content: 'Event created successfully!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Could not find the event channel.', ephemeral: true });
        }
    },
};