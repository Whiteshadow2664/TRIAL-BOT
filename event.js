const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: 'event',
    description: 'Create an event by filling out a form.',
    async execute(message) {
        // Check if the command was used in a guild
        if (!message.guild) {
            return message.reply('This command can only be used in a server.');
        }

        // Create a modal (pop-up form)
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

        try {
            await message.author.send({ content: 'Please fill out the event form:', components: [modal] });
        } catch (error) {
            console.error('Error sending modal:', error);
            return message.reply('I couldn’t send you the event form. Please check your DMs.');
        }
    },
};