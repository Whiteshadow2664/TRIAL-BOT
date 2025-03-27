const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Bans a mentioned user (Moderator only).",
    execute: async (message) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ You do not have permission to ban members.");
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ I do not have permission to ban members.");
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply("❌ Please mention a user to ban.");
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.reply("❌ The mentioned user is not in this server.");
        }

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