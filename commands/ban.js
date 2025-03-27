const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Bans a mentioned user.",
    execute: async (message) => {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply("❌ You don't have permission to use this command.");
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
            return message.reply("❌ I cannot ban this user. They might have a higher role.");
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