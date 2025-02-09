const { Client, EmbedBuilder } = require('discord.js');
const { setTimeout } = require('timers');

const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'] });

const BUMP_BOT_ID = '1338037787924107365'; // Bump bot ID
const THANK_YOU_MESSAGE = 'Thx for bumping our Server! We will remind you in 2 hours!';

/**
 * This function handles sending the "thank you" message when a user bumps the server.
 */
async function sendThankYouMessage(message) {
  const mentionedUser = message.mentions.users.first();
  if (mentionedUser) {
    await message.channel.send(`Thx for bumping our Server! We will remind you in 2 hours! <@${mentionedUser.id}>`);

    // Set a 5-minute reminder to remind the user to bump again
    setTimeout(() => {
      sendReminder(mentionedUser);
    }, 5 * 60 * 1000); // 5 minutes
  }
}

/**
 * This function sends a reminder message after 5 minutes.
 */
async function sendReminder(user) {
  const reminderEmbed = new EmbedBuilder()
    .setColor('#acf508')
    .setDescription(`@${user.username}, it's time to bump!`)
    .addFields(
      { name: 'Reminder', value: 'Bump our server by typing `/bump`!' },
      { name: 'Time', value: new Date().toLocaleString() }
    );

  const reminderChannel = user.dmChannel || await user.createDM();
  await reminderChannel.send({ content: `@${user.username}`, embeds: [reminderEmbed] });
}

/**
 * Listen to message events and track bumps.
 */
client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check if the message is from the bump bot
  if (message.author.id === BUMP_BOT_ID && message.content.includes('Thx for bumping our Server!')) {
    sendThankYouMessage(message); // Send "thank you" message and set reminder
  }
});

// Export the client for integration in index.js
module.exports = client;