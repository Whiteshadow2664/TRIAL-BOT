const { Events } = require("discord.js");

const warnedUsers = new Map(); // Track warnings
const allowedChannelId = "1326458294994210877"; // Allowed channel for invites
const allowedServerId = "793744179066699787"; // Replace with your server ID

module.exports = (client) => {
    client.on(Events.MessageCreate, async (message) => {
        if (message.author.bot || !message.guild) return;

        // Updated regex to detect both discord.gg and discord.com/invite/
        const inviteRegex = /(?:discord\.gg\/|discord\.com\/invite\/)(\w+)/i;
        const match = message.content.match(inviteRegex);

        if (match) {
            try {
                const inviteCode = match[1];

                // Fetch invite details to check if it's for your server
                const invite = await client.fetchInvite(inviteCode).catch(() => null);

                // Allow invites from the same server
                if (invite && invite.guild.id === allowedServerId) return;

                // Ignore if the message is in the allowed channel
                if (message.channel.id === allowedChannelId) return;

                await message.delete(); // Delete the invite message

                const userId = message.author.id;
                const guildId = message.guild.id;
                const key = `${guildId}-${userId}`; // Unique key for the user in the server

                if (!warnedUsers.has(key)) {
                    // First offense, send a warning
                    warnedUsers.set(key, 1);
                    return message.channel.send(
                        `${message.author}, don't advertise other servers! This isn't your dad's server. If you do this again, you'll be timed out.`
                    );
                } else {
                    // Second offense, timeout for 7 days
                    const member = await message.guild.members.fetch(userId);
                    if (member.moderatable) {
                        await member.timeout(7 * 24 * 60 * 60 * 1000, "Sent invite link twice.");
                        return message.channel.send(
                            `${message.author} has been timed out for 7 days for advertising other servers.`
                        );
                    } else {
                        return message.channel.send(
                            `I don't have permission to timeout ${message.author}.`
                        );
                    }
                }
            } catch (error) {
                console.error("Error handling invite message:", error);
            }
        }
    });
};