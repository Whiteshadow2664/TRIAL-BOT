const { EmbedBuilder } = require('discord.js');

const BUMP_BOT_ID = '302050872383242240'; // Disboard bot ID
const REMINDER_ROLE_NAME = 'bump me'; // Role to be pinged for reminders
const REMINDER_CHANNEL_ID = '1337072576597463084'; // Target channel for reminders
const REMINDER_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

module.exports = {
    startBumpReminder(client) {
        setInterval(async () => {
            const guild = client.guilds.cache.first(); // Get the first available guild
            if (!guild) return;

            const reminderChannel = guild.channels.cache.get(REMINDER_CHANNEL_ID);
            if (!reminderChannel) return;

            const role = guild.roles.cache.find(r => r.name.toLowerCase() === REMINDER_ROLE_NAME.toLowerCase());
            if (!role) return;

            // Send bump reminder in the specified channel
            const embedReminder = new EmbedBuilder()
                .setColor('#acf508')
                .setDescription("**It's time to bump!**\nBump our server by typing **/bump!**");

            await reminderChannel.send({ content: `<@&${role.id}>`, embeds: [embedReminder] });
        }, REMINDER_INTERVAL);
    },

    async handleBump(message) {
        if (message.author.id !== BUMP_BOT_ID) return; // Ensure it's from Disboard

        if (message.embeds.length > 0) {
            const embed = message.embeds[0];
            if (embed.description && embed.description.includes('Bump done! :thumbsup:')) {
                // Send the after bump message
                message.channel.send("Bump done! :thumbsup:\nCheck it out [on DISBOARD](https://disboard.org/server/793744179066699787).");
            }
        }
    }
};