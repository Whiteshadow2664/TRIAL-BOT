const { EmbedBuilder } = require('discord.js');

const BUMP_BOT_ID = '302050872383242240'; // Disboard bot ID
const REMINDER_ROLE_NAME = 'bump me'; // Role to be pinged for reminders
const REMINDER_DELAY = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

module.exports = {
    async handleBump(message) {
        if (message.author.id !== BUMP_BOT_ID) return; // Ensure it's from Disboard

        if (message.embeds.length > 0) {
            const embed = message.embeds[0];
            if (embed.description && embed.description.includes('Bump done!')) {
                const userMatch = embed.description.match(/<@!?(\d+)>/);
                if (!userMatch) return;

                const bumperId = userMatch[1];
                const bumper = await message.guild.members.fetch(bumperId).catch(() => null);
                if (!bumper) return;

                // Send a thank-you message
                message.channel.send(`Thx for bumping our Server! We will remind you in 2 hours! <@${bumperId}>`);

                // Schedule the bump reminder
                setTimeout(async () => {
                    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === REMINDER_ROLE_NAME.toLowerCase());
                    if (!role) return;

                    // Send bump reminder
                    const embedReminder = new EmbedBuilder()
                        .setColor('#acf508')
                        .setDescription("**It's time to bump!**\nBump our server by typing **/bump!**");

                    await message.channel.send({ content: `<@&${role.id}>`, embeds: [embedReminder] });
                }, REMINDER_DELAY);
            }
        }
    }
};