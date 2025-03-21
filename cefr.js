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
                    "• Understand and use very basic everyday expressions and phrases.\n" +
                    "• Introduce themselves and ask/answer personal questions (e.g., Where do you live? What do you do?).\n" +
                    "• Interact in a **simple way**, provided the other person speaks **slowly and clearly**."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 2/7 | Use ◀️▶️ to navigate" }),

            // Page 3: A2 - Elementary
            new EmbedBuilder()
                .setTitle("🔰 **A2 - Elementary Level**")
                .setDescription(
                    "**At A2 level, learners can:**\n" +
                    "• Understand frequently used expressions related to personal and daily life.\n" +
                    "• Communicate in **simple and routine** situations requiring basic exchanges of information.\n" +
                    "• Describe aspects of their background, immediate environment, and basic needs (e.g., ordering food, shopping)."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 3/7 | Use ◀️▶️ to navigate" }),

            // Page 4: B1 - Intermediate
            new EmbedBuilder()
                .setTitle("🟡 **B1 - Intermediate Level**")
                .setDescription(
                    "**At B1 level, learners can:**\n" +
                    "• Handle **most travel situations** in a country where the language is spoken.\n" +
                    "• Understand and produce simple connected texts on familiar topics (e.g., hobbies, work, studies).\n" +
                    "• Describe experiences, events, dreams, hopes, and give reasons/opinions on familiar subjects."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 4/7 | Use ◀️▶️ to navigate" }),

            // Page 5: B2 - Upper Intermediate
            new EmbedBuilder()
                .setTitle("🟡 **B2 - Upper Intermediate Level**")
                .setDescription(
                    "**At B2 level, learners can:**\n" +
                    "• Understand the **main ideas** of complex texts on both concrete and abstract topics.\n" +
                    "• Interact fluently and spontaneously with native speakers **without much strain**.\n" +
                    "• Produce detailed texts, explaining **viewpoints** on a range of subjects, giving advantages and disadvantages."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 5/7 | Use ◀️▶️ to navigate" }),

            // Page 6: C1 - Advanced
            new EmbedBuilder()
                .setTitle("🔴 **C1 - Advanced Level**")
                .setDescription(
                    "**At C1 level, learners can:**\n" +
                    "• Understand **demanding texts** and recognize implicit meanings.\n" +
                    "• Express themselves **fluently and spontaneously** without struggling to find words.\n" +
                    "• Use language effectively for **social, academic, and professional** purposes.\n" +
                    "• Write clear, well-structured, detailed texts on complex subjects."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 6/7 | Use ◀️▶️ to navigate" }),

            // Page 7: C2 - Proficiency
            new EmbedBuilder()
                .setTitle("🔴 **C2 - Proficiency (Near-Native Level)**")
                .setDescription(
                    "**At C2 level, learners can:**\n" +
                    "• Understand **virtually everything** heard or read with ease.\n" +
                    "• Summarize information from different sources, reconstructing arguments in a coherent presentation.\n" +
                    "• Express themselves spontaneously, fluently, and with **precise meaning**, even in complex discussions."
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