const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'event',
    description: 'Create an event by filling out a form.',
    async execute(message) {
        // Check if the command is used in a guild
        if (!message.guild) {
            return message.reply('This command can only be used in a server.');
        }

        // Create a button to trigger the modal
        const eventButton = new ButtonBuilder()
            .setCustomId('openEventModal')
            .setLabel('Create Event') // Ensure the label is valid
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(eventButton);

        try {
            // Send the message with the button
            await message.reply({ content: 'Click the button below to create an event.', components: [row] });
        } catch (error) {
            console.error('Error sending event button:', error);
            await message.reply('An error occurred while trying to send the event button.');
        }
    }
};