const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kicks a mentioned user (Moderator only).",
    execute: async (message) => {
        if (!message.member.roles.cache.some(role => role.name === "Moderator")) {
            return message.reply("❌ You must have the **Moderator** role to use this command.");
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply("❌ Please mention a user to kick.");
        }

        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            return message.reply("❌ The mentioned user is not in this server.");
        }

        if (!member.kickable) {
            return message.reply("❌ I cannot kick this user. They might have a higher role.");
        }

        try {
            await member.kick(`Kicked by ${message.author.tag}`);
            message.channel.send(`✅ **${user.tag}** has been kicked.`);
        } catch (error) {
            console.error("❌ Error kicking user:", error);
            message.reply("❌ Failed to kick the user.");
        }
    },
};