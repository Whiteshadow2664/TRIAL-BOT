const { EmbedBuilder } = require('discord.js');

// Disboard bot ID and settings
const BUMP_BOT_ID = '302050872383242240'; // Disboard bot ID
const REMINDER_ROLE_NAME = 'bump me'; // Role to be pinged for reminders
const REMINDER_CHANNEL_ID = '1337072576597463084'; // Target channel for reminders
const REMINDER_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Store user who bumped the server temporarily
let lastUserWhoBumped = null;

module.exports = {
    startBumpReminder(client) {
        // Reminder every 2 hours to bump
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

    async handleBumpInteraction(interaction) {
        if (interaction.commandName === 'bump') {
            // Track the user who issued the bump command
            lastUserWhoBumped = interaction.user.id;

            // Send a confirmation message to the channel
            await interaction.reply({ content: 'Bump request received! Please wait for confirmation from Disboard.', ephemeral: true });
        }
    },

    async handleBumpConfirmation(message) {
        if (message.author.id !== BUMP_BOT_ID) return; // Ensure it's from Disboard

        if (message.embeds.length > 0) {
            const embed = message.embeds[0];

            // Check for the "Bump done!" message
            if (embed.description && embed.description.includes('Bump done! :thumbsup:')) {
                // Check if we have a user who bumped
                if (lastUserWhoBumped) {
                    // Send a thank-you message to the user who bumped
                    const user = await message.guild.members.fetch(lastUserWhoBumped);
                    message.channel.send(`Thx for bumping our Server! We will remind you in 2 hours! <@${user.id}>`);

                    // Optionally reset after thanking
                    lastUserWhoBumped = null;
                }
            }
        }
    }
};