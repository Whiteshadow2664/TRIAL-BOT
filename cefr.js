const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "cefr",
    description: "Provides a comprehensive overview of the CEFR language proficiency framework.",
    async execute(message) {
        const pages = [
            // Page 1: Introduction to CEFR
            new EmbedBuilder()
                .setTitle("🌍 Common European Framework of Reference for Languages (CEFR)")
                .setDescription(
                    "The **CEFR (Common European Framework of Reference for Languages)** is an internationally recognized standard used to assess language proficiency.\n\n" +
                    "It is widely accepted by educational institutions, employers, and certification bodies worldwide, providing a **structured framework** for language learning and assessment."
                )
                .setColor("#ACF508")
                .setThumbnail("https://media.discordapp.net/attachments/1278983067205373964/1352596267422715975/20250321_162115.png")
                .addFields(
                    { name: "📌 **Why CEFR Matters**", value: "CEFR **classifies language skills** into six levels, helping learners, educators, and employers assess proficiency objectively." },
                    { name: "📖 **More Info**", value: "[Click here](https://en.m.wikipedia.org/wiki/Common_European_Framework_of_Reference_for_Languages)" }
                )
                .setFooter({ text: "Page 1/7 | Use ▶️ to navigate" }),

            // Page 2: A1 - Beginner
    new EmbedBuilder()
        .setTitle("🔰 **A1 - Beginner Level**")
        .setDescription(
            "**At A1 level, learners can:**\n" +
            "• Understand and use **basic everyday expressions** related to greetings, introductions, and personal details.\n" +
            "• Introduce themselves and provide simple personal information (e.g., name, nationality, occupation).\n" +
            "• Ask and answer **very basic questions** about familiar topics such as family, shopping, or daily routines.\n" +
            "• Interact in a **simple way**, provided the other person speaks **slowly, clearly, and is willing to help**.\n" +
            "• Recognize simple written and spoken words (e.g., signs, menus, basic notices)."
        )
        .setColor("#ACF508")
        .setFooter({ text: "Page 2/7 | Use ◀️▶️ to navigate" }),

    // Page 3: A2 - Elementary
    new EmbedBuilder()
        .setTitle("🔰 **A2 - Elementary Level**")
        .setDescription(
            "**At A2 level, learners can:**\n" +
            "• Understand **frequently used phrases** related to areas of immediate relevance (e.g., shopping, local geography, employment).\n" +
            "• Communicate in **simple and routine tasks** requiring direct exchange of information on familiar topics.\n" +
            "• Express basic personal opinions, preferences, and descriptions of **past and future events**.\n" +
            "• Understand **short and simple texts**, such as advertisements, timetables, and personal letters.\n" +
            "• Write short, simple notes and messages related to personal needs."
        )
        .setColor("#ACF508")
        .setFooter({ text: "Page 3/7 | Use ◀️▶️ to navigate" }),

    // Page 4: B1 - Intermediate
    new EmbedBuilder()
        .setTitle("🟡 **B1 - Intermediate Level**")
        .setDescription(
            "**At B1 level, learners can:**\n" +
            "• Handle **most travel situations** in a country where the language is spoken.\n" +
            "• Understand and produce **simple connected texts** on familiar topics such as personal interests, work, or education.\n" +
            "• Express thoughts on **experiences, events, and personal aspirations**, providing simple reasons and explanations.\n" +
            "• Participate in **unprepared conversations** on everyday topics with native speakers.\n" +
            "• Write clear, well-structured texts on **familiar subjects**, summarizing basic points of information."
        )
        .setColor("#ACF508")
        .setFooter({ text: "Page 4/7 | Use ◀️▶️ to navigate" }),

    // Page 5: B2 - Upper Intermediate
    new EmbedBuilder()
        .setTitle("🟡 **B2 - Upper Intermediate Level**")
        .setDescription(
            "**At B2 level, learners can:**\n" +
            "• Understand **the main ideas of complex texts**, including those discussing **abstract and technical subjects**.\n" +
            "• Communicate **fluently and spontaneously** without significant effort for either party.\n" +
            "• Participate actively in discussions, arguing **for and against different viewpoints**.\n" +
            "• Express opinions and analyze information in a structured manner.\n" +
            "• Write **clear and detailed texts** on a range of subjects, including essays and reports."
        )
        .setColor("#ACF508")
        .setFooter({ text: "Page 5/7 | Use ◀️▶️ to navigate" }),

    // Page 6: C1 - Advanced
    new EmbedBuilder()
        .setTitle("🔴 **C1 - Advanced Level**")
        .setDescription(
            "**At C1 level, learners can:**\n" +
            "• Understand **long, complex texts**, recognizing **nuanced meanings** and implied ideas.\n" +
            "• Express themselves fluently and effectively in **social, academic, and professional settings**.\n" +
            "• Communicate ideas with **a high degree of precision**, adapting language to different contexts.\n" +
            "• Participate in **formal discussions and debates**, presenting complex arguments convincingly.\n" +
            "• Produce **well-structured, detailed, and coherent texts** on sophisticated topics."
        )
        .setColor("#ACF508")
        .setFooter({ text: "Page 6/7 | Use ◀️▶️ to navigate" }),

    // Page 7: C2 - Proficiency
    new EmbedBuilder()
        .setTitle("🔴 **C2 - Proficiency (Near-Native Level)**")
        .setDescription(
            "**At C2 level, learners can:**\n" +
            "• Understand **virtually everything** heard or read with ease, including idiomatic and colloquial expressions.\n" +
            "• Summarize and synthesize **complex information** from different sources into a coherent argument.\n" +
            "• Express themselves **spontaneously, fluently, and with high accuracy**, even in nuanced and abstract discussions.\n" +
            "• Use language creatively and flexibly in **professional, academic, or artistic** contexts.\n" +
            "• Produce sophisticated written and spoken texts that **demonstrate mastery of grammar, vocabulary, and style**."
        )
        .setColor("#ACF508")
        .setFooter({ text: "Page 7/7 | Use ◀️ to navigate" }),
        ];

        let currentPage = 0;
        const embedMessage = await message.channel.send({ embeds: [pages[currentPage]] });

        // Add reactions for navigation
        await embedMessage.react("◀️");
        await embedMessage.react("▶️");

        const filter = (reaction, user) => ["◀️", "▶️"].includes(reaction.emoji.name) && user.id === message.author.id;
        const collector = embedMessage.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", async (reaction) => {
            if (reaction.emoji.name === "▶️") {
                currentPage = (currentPage + 1) % pages.length;
            } else if (reaction.emoji.name === "◀️") {
                currentPage = (currentPage - 1 + pages.length) % pages.length;
            }
            await embedMessage.edit({ embeds: [pages[currentPage]] });
            await reaction.users.remove(message.author.id); // Remove user reaction for a clean experience
        });
    },
};