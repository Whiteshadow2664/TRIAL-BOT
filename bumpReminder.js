const { MessageEmbed } = require('discord.js');
const { setTimeout } = require('timers');

let bumpedUsers = new Map(); // To keep track of which user bumped

module.exports = {
  name: 'bumpReminder',
  execute(message) {
    // Detect if the message is from Disboard and has the "Bump done!" embed
    if (message.author.id === '1338037787924107365' && message.embeds.length > 0) {
      const embed = message.embeds[0];
      
      // Check if the embed description includes the "Bump done!" message
      if (embed.description && embed.description.includes('Bump done!')) {
        // Check if the user who initiated the bump is stored in the map
        const userId = bumpedUsers.get(message.id); // Use message ID to fetch the user who bumped
        const user = message.guild.members.cache.get(userId);
        
        if (user) {
          // Send a thank you message immediately
          sendThankYouMessage(user, message.guild);

          // Send a reminder message after 5 minutes
          setTimeout(() => {
            sendReminderMessage(user, message.guild);
          }, 5 * 60 * 1000); // 5 minutes in milliseconds
        }
      }
    }
  },

  // Listen for /bump command interactions to track the user who bumps
  trackBumpInteraction(interaction) {
    if (interaction.commandName === 'bump') {
      // Store the user who initiated the bump in the map
      bumpedUsers.set(interaction.message.id, interaction.user.id);
    }
  }
};

// Function to send a thank you message
function sendThankYouMessage(user, guild) {
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Thank you for bumping!')
    .setDescription(`Thank you, ${user}, for bumping the server! Your support is greatly appreciated!`);

  // Send the message in the current channel or you can choose a specific channel
  const channel = guild.channels.cache.find(c => c.name === 'general'); // Change to desired channel name
  if (channel) {
    channel.send({ embeds: [embed] });
  }
}

// Function to send a reminder message after 5 minutes
function sendReminderMessage(user, guild) {
  const embed = new MessageEmbed()
    .setColor('#ff9900')
    .setTitle('Friendly Reminder')
    .setDescription(`Hey ${user}, don't forget to bump the server again! Your support helps us grow!`);

  // Send the reminder message in the same channel or another one
  const channel = guild.channels.cache.find(c => c.name === 'general'); // Change to desired channel name
  if (channel) {
    channel.send({ embeds: [embed] });
  }
}