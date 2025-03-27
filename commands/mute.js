const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "mute",
    description: "Mutes a mentioned user (Moderator only).",
    execute: async (message) => {
        if (!message.member.roles.cache.some(role => role.name === "Moderator")) {
            return message.reply("❌ You must have the **Moderator** role to use this command.");
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply("❌ Please mention a user to mute.");
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.reply("❌ The mentioned user is not in this server.");
        }

        try {
            await member.timeout(60 * 60 * 1000, `Muted by ${message.author.tag}`);
            message.channel.send(`✅ **${user.tag}** has been muted for 10 minutes.`);
        } catch (error) {
            console.error("❌ Error muting user:", error);
            message.reply("❌ Failed to mute the user.");
        }
    },
};