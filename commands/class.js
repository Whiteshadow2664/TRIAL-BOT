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
                .setDescription('Stay informed about our upcoming sessions and events!');

            for (const event of events.values()) {
                const startTime = new Date(event.scheduledStartTimestamp).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const endTime = event.scheduledEndTimestamp
                    ? new Date(event.scheduledEndTimestamp).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
                    : startTime; // Use start time if no end time is available

                const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description || 'No details provided')}&location=${encodeURIComponent(event.location || '')}`;

                const organizer = event.creator ? `<@${event.creatorId}>` : 'Unknown';
                const eventDescription = event.description ? event.description : '*No description provided.*';

                embed.addFields({
                    name: event.name,
                    value: `📅 **Date:** <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:F>\n👤 **Organizer:** ${organizer}\n📝 **Description:** ${eventDescription}\n🔗 [Event Link](${event.url})\n🗓️ [Add to Google Calendar](${googleCalendarLink})`,
                    inline: false
                });
            }

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching events:', error);
            message.reply('An error occurred while fetching events.');
        }
    }
};