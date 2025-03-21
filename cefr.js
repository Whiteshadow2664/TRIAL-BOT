const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "cefr",
    description: "Provides a comprehensive overview of the CEFR language proficiency framework.",
    execute(message) {
        const embed = new EmbedBuilder()
            .setTitle("🌍 Common European Framework of Reference for Languages (CEFR)")
            .setDescription(
                "The **CEFR (Common European Framework of Reference for Languages)** is an internationally recognized standard used to assess language proficiency.\n\n" +
                "It is widely accepted by educational institutions, employers, and certification bodies worldwide, providing a **structured framework** for language learning and assessment."
            )
            .setColor("#ACF508")
            .setThumbnail("https://media.discordapp.net/attachments/1278983067205373964/1352588061145301022/CEFR.png?ex=67de8f4b&is=67dd3dcb&hm=b884dac80209e9c6b24bc43a631c5fb1d661fc49a6dc07a2faea97cf87d9ed34&") // CEFR Chart Thumbnail
            .addFields(
                { name: "📌 **Why CEFR Matters**", value: "CEFR **classifies language skills** into six levels, helping learners, educators, and employers to assess and compare language proficiency objectively." },
                { name: "🔰 **A1 - Beginner**", value: "• Understands and uses basic everyday expressions.\n• Can introduce themselves and answer simple questions.\n• Can communicate if the other person speaks slowly and clearly." },
                { name: "🔰 **A2 - Elementary**", value: "• Understands common phrases related to personal and daily activities.\n• Can engage in simple conversations on familiar topics.\n• Can describe personal background and immediate needs." },
                { name: "🟡 **B1 - Intermediate**", value: "• Can handle travel situations in regions where the language is spoken.\n• Understands and communicates on familiar topics.\n• Can express opinions and discuss experiences." },
                { name: "🟡 **B2 - Upper Intermediate**", value: "• Understands more complex texts, including technical discussions.\n• Can interact fluently with native speakers.\n• Can express detailed viewpoints on various subjects." },
                { name: "🔴 **C1 - Advanced**", value: "• Understands nuanced meanings in complex texts.\n• Communicates effectively in social, academic, and professional settings.\n• Uses language flexibly and spontaneously." },
                { name: "🔴 **C2 - Proficiency (Near-Native)**", value: "• Understands virtually everything heard or read with ease.\n• Can summarize and synthesize complex information from different sources.\n• Expresses themselves fluently, precisely, and with nuance." },
                { name: "📝 **How to Determine Your Level?**", value: "• Take an official **CEFR language test**.\n• Evaluate your listening, speaking, reading, and writing skills.\n• Use structured study materials aligned with CEFR guidelines." }
            )
            .setFooter({ text: "📖 CEFR: The Global Standard for Language Proficiency" })
            .setTimestamp()
            .setURL("https://en.m.wikipedia.org/wiki/Common_European_Framework_of_Reference_for_Languages"); // More Info Link

        message.channel.send({ embeds: [embed] });
    }
};