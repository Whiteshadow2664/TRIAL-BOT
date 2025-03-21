const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'class',
    description: 'Displays upcoming events in the server.',
    async execute(message) {
        try {
            const guild = message.guild;
            if (!guild) {
                return message.reply('This command can only be used in a server.');
            }

            // Fetch scheduled events from the guild
            const events = await guild.scheduledEvents.fetch();

            if (!events.size) {
                return message.reply('No upcoming events found.');
            }

            // Create embed message
            const embed = new EmbedBuilder()
                .setTitle('📅 Upcoming Events')
                .setColor('#acf508')
                .setDescription('Here are the upcoming events in the server:')
                .setTimestamp();

            events.forEach(event => {
                embed.addFields({
                    name: event.name,
                    value: `📅 **Date:** <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:F>\n🔗 [Event Link](${event.url})`,
                    inline: false
                });
            });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching events:', error);
            message.reply('An error occurred while fetching events.');
        }
    }
};