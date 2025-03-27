const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Bans a mentioned user (Moderator only).",
    execute: async (message) => {
        // Check if the user has the "Moderator" role
        if (!message.member.roles.cache.some(role => role.name === "Moderator")) {
            return message.reply("❌ You must have the **Moderator** role to use this command.");
        }

        // Check if the bot has permission to ban members
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ I do not have permission to ban members.");
        }

        // Get the mentioned user
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply("❌ Please mention a user to ban.");
        }

        // Get the guild member
        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.reply("❌ The mentioned user is not in this server.");
        }

        // Prevent banning users with higher roles
        if (!member.bannable) {
            return message.reply("❌ I cannot ban this user. They might have a higher role than me.");
        }

        try {
            await member.ban({ reason: `Banned by ${message.author.tag}` });
            message.channel.send(`✅ **${user.tag}** has been banned.`);
        } catch (error) {
            console.error("❌ Error banning user:", error);
            message.reply("❌ Failed to ban the user.");
        }
    },
};