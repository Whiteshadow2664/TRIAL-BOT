const { EmbedBuilder } = require('discord.js');

const nativeRoles = {
    '🇩🇪': { roleName: 'German Native', language: 'german' },
    '🇫🇷': { roleName: 'French Native', language: 'french' },
    '🇷🇺': { roleName: 'Russian Native', language: 'russian' }
};

const nativeRoleChannelId = '1348654480325083147';

module.exports = async (client) => {
    // Send the reaction role message automatically
    const channel = await client.channels.fetch(nativeRoleChannelId);
    if (channel) {
        const embed = new EmbedBuilder()
            .setTitle('🌍 React for Native Roles')
            .setDescription('React to the flag corresponding to your native language.\n\n'
                + '🇩🇪 - **German Native**\n'
                + '🇫🇷 - **French Native**\n'
                + '🇷🇺 - **Russian Native**\n\n'
                + 'The bot will check if you have used proper sentences in the language before giving you the role.')
            .setColor('#f4ed09');

        const message = await channel.send({ embeds: [embed] });
        await message.react('🇩🇪');
        await message.react('🇫🇷');
        await message.react('🇷🇺');
    }

    // Listen for reaction add
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot || reaction.message.channel.id !== nativeRoleChannelId) return;
        if (!nativeRoles[reaction.emoji.name]) return;

        const { roleName, language } = nativeRoles[reaction.emoji.name];
        const member = await reaction.message.guild.members.fetch(user.id);
        const role = reaction.message.guild.roles.cache.find(r => r.name === roleName);

        if (!role) {
            console.error(`Role "${roleName}" not found.`);
            return;
        }

        // Fetch last 500 messages from the user across the server
        const messages = await reaction.message.guild.channels.cache
            .filter(c => c.isTextBased())
            .reduce(async (accPromise, channel) => {
                const acc = await accPromise;
                try {
                    const msgs = await channel.messages.fetch({ limit: 100 });
                    return acc.concat(msgs.filter(msg => msg.author.id === user.id));
                } catch (error) {
                    return acc;
                }
            }, Promise.resolve([]));

        // Enhanced language detection logic
        const validMessages = messages.filter(msg => containsProperLanguage(msg.content, language));
        const totalMessages = validMessages.length;

        if (totalMessages >= 3) { // Require at least 3 proper sentences
            await member.roles.add(role);
            await reaction.message.channel.send(`<@${user.id}>, you have been given the **${roleName}** role! 🎉`);
        } else {
            await reaction.message.channel.send(`<@${user.id}>, we couldn't find enough valid ${language} sentences from you. Please try again after participating more.`);
        }
    });
};

function containsProperLanguage(content, language) {
    // Improved language detection with more complex checks
    const patterns = {
        german: /(\b(und|ich|nicht|die|das|der|ist|eine|ein|sind|habe|kann)\b)/i,
        french: /(\b(le|la|et|je|ne|pas|vous|nous|est|une|un)\b)/i,
        russian: /(\b(и|не|я|он|она|ты|мы|они|есть|этот)\b)/i
    };

    const words = content.split(/\s+/);
    const longSentences = content.split(/[.!?]/).filter(s => s.split(' ').length >= 5);

    // Valid if it contains matching words + long sentences
    return patterns[language].test(content) && longSentences.length > 0;
}