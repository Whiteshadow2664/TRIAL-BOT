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

            const embed = new EmbedBuilder()
                .setTitle('📅 Upcoming Events')
                .setColor('#acf508')
                .setDescription(
                    'Stay informed about our upcoming sessions and events!\n\n' +
                    ':calendar: Want to add our sessions schedule to your Google Calendar? Click on the event link and add it manually.'
                );

            events.forEach(event => {
                const startTime = new Date(event.scheduledStartTimestamp).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const endTime = event.scheduledEndTimestamp
                    ? new Date(event.scheduledEndTimestamp).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
                    : startTime; // Use start time if no end time is available

                const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description || 'No details provided')}&location=${encodeURIComponent(event.location || '')}`;

                embed.addFields({
                    name: event.name,
                    value: `📅 **Date:** <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:F>\n🔗 [Event Link](${event.url})\n🗓️ [Add to Google Calendar](${googleCalendarLink})`,
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