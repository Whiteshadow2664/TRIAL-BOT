const { Events } = require('discord.js');

const AFK_USER_ID = '540129267728515072';
let afkStatus = false; // Tracks whether the user is AFK

/**
 * Handles the AFK command activation
 */
const handleAFKCommand = (message) => {
    if (message.author.id !== AFK_USER_ID) return; // Only allow the specific user

    afkStatus = true;
    message.channel.send('✅ You are now marked as AFK. I will notify users who ping you.');
};

/**
 * Listens for mentions and responds if the AFK user is mentioned
 */
const handleMention = (message) => {
    if (!afkStatus || message.author.bot) return; // Ignore if not AFK or a bot sent the message

    if (message.mentions.has(AFK_USER_ID)) {
        message.reply("⚠️ The user you are trying to reach is currently unavailable. Please try again later.");
    }
};

/**
 * Detects when the AFK user sends a message and removes AFK status
 */
const handleAFKRemoval = (message) => {
    if (afkStatus && message.author.id === AFK_USER_ID) {
        afkStatus = false;
        message.channel.send('✅ You are no longer AFK.');
    }
};

module.exports = { handleAFKCommand, handleMention, handleAFKRemoval };