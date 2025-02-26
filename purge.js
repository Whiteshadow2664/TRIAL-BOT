const { Permissions } = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Purges a specified number of messages from the channel.',
    async execute(message, args) {
        // Check if the user has the required permissions
        if (message.author.id !== '540129267728515072' && !message.member.roles.cache.some(role => role.name === 'Moderator')) {
            return message.reply("You don't have permission to use this command.");
        }

        // Ensure the number is provided and is valid
        const amount = parseInt(args[0]);

        if (!amount || amount < 1 || amount > 100) {
            return message.reply('Please provide a valid number of messages to delete (1-100).');
        }

        // Include the command message in the list of messages to delete
        try {
            // Fetch the messages, including the !purge command itself
            const messages = await message.channel.messages.fetch({ limit: amount + 1 }); // Add 1 to include the command itself
            await message.channel.bulkDelete(messages, true);
            message.channel.send(`Successfully deleted ${amount} messages.`).then(msg => msg.delete({ timeout: 5000 }));
        } catch (error) {
            console.error(error);
            message.reply('There was an error while trying to purge messages.');
        }
    }
};