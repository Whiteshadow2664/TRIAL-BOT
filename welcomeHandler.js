const { TextChannel, EmbedBuilder } = require('discord.js');

// Function to send a message with retry logic
async function sendMessageWithRetry(channel, messageContent) {
    try {
        await channel.send(messageContent);
        
    } catch (error) {
        if (error.status === 503) {
            console.error('Discord service unavailable, retrying...');
            setTimeout(() => sendMessageWithRetry(channel, messageContent), 5000); // Retry after 5 seconds
        } else {
            console.error('Error sending message:', error);
        }
    }
}

// Function to handle member joins
const handleMemberJoin = async (member) => {
    const guild = member.guild;
    const memberCount = guild.memberCount;

    // Find the "welcome" channel
    const channel = guild.channels.cache.find(ch => ch.name === 'welcome');
    if (channel && channel instanceof TextChannel) {
        const welcomeMessage = `Welcome to **LinguaLounge**, <@${member.id}>! We are excited to have you join our community. You are now member **#${memberCount}**. Enjoy your time here!`;
        await sendMessageWithRetry(channel, welcomeMessage);
    }
};

// Function to handle member leaves
const handleMemberLeave = async (member) => {
    const guild = member.guild;
    const memberCount = guild.memberCount;

    // Find the "welcome" channel
    const channel = guild.channels.cache.find(ch => ch.name === 'welcome');
    if (channel && channel instanceof TextChannel) {
        const leaveMessage = `We're sorry to see you go, **${member.user.username}**. You will be missed. We now have **${memberCount}** members in **LinguaLounge**.`;
        await sendMessageWithRetry(channel, leaveMessage);
    }
};

module.exports = {
    handleMemberJoin,
    handleMemberLeave
};