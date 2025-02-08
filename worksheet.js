const { EmbedBuilder } = require('discord.js');

const languageData = [
    { name: "German", color: "#f4ed09", channelId: "1225363050207514675", keywords: ["der", "die", "das", "und", "nicht", "sie", "er", "ist"] },
    { name: "French", color: "#09ebf6", channelId: "1225362787581296640", keywords: ["le", "la", "et", "vous", "nous", "est", "sont", "les"] },
    { name: "Russian", color: "#7907ff", channelId: "1303664003444379649", keywords: ["и", "он", "она", "они", "мы", "вы", "есть", "это"] }
];

module.exports = async (message, client) => {
    // Ensure the command runs only in the specified channel
    if (message.channel.id !== "1224730855717470299") return;

    await message.channel.send("✏️ **Please send the full worksheet lesson:**");

    const filter = m => m.author.id === message.author.id && m.channel.id === message.channel.id;
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 120000 });

    if (!collected.size) return message.channel.send("⏳ You took too long to respond. Please try again.");

    const worksheetText = collected.first().content;

    // Detect language based on keywords
    let detectedLanguage = languageData.find(lang =>
        lang.keywords.some(keyword => worksheetText.toLowerCase().includes(keyword))
    );

    if (!detectedLanguage) return message.channel.send("⚠️ I couldn't detect the language of your worksheet.");

    const embed = new EmbedBuilder()
        .setTitle(`📚 ${detectedLanguage.name} Worksheet`)
        .setColor(detectedLanguage.color)
        .setDescription(`\`\`\`${worksheetText}\`\`\``)
        .setFooter({ text: "📖 Keep Learning & Improving!" });

    const targetChannel = await client.channels.fetch(detectedLanguage.channelId);
    if (!targetChannel) return message.channel.send("⚠️ I couldn't find the correct language channel.");

    await targetChannel.send({ embeds: [embed] });
    message.channel.send(`✅ **Your worksheet has been successfully sent to the ${detectedLanguage.name} channel!**`);
};