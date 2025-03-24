const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "tips",
    description: "Provides structured and effective study strategies for mastering a new language.",
    async execute(message) {
        const pages = [
            // Page 1: Introduction
            new EmbedBuilder()
                .setTitle("🌍 Mastering a Language: Essential Study Tips")
                .setDescription(
                    "**Looking to improve your language learning approach?**\n\n" +
                    "This guide covers:\n" +
                    "📌 **Efficient Study Techniques**\n" +
                    "📌 **Speaking & Listening Strategies**\n" +
                    "📌 **Reading & Writing Methods**\n" +
                    "📌 **Memory Retention Techniques**\n" +
                    "📌 **How to Stay Motivated**\n\n" +
                    "[📖 Click here for more resources](https://bit.ly/Iingualounge)"
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 1/6 | Use ▶️ to navigate" }),

            // Page 2: Effective Study Techniques
            new EmbedBuilder()
                .setTitle("📚 Effective Study Techniques")
                .setDescription(
                    "**1. Set SMART Goals:**\n" +
                    "   • Be specific: 'Learn 20 words daily' instead of 'Improve vocabulary'.\n" +
                    "   • Track progress weekly for measurable results.\n\n" +
                    "**2. Focus on Core Vocabulary:**\n" +
                    "   • Learn the most frequently used words and phrases first.\n\n" +
                    "**3. Immerse Yourself in the Language:**\n" +
                    "   • Change your surroundings—think, write, and speak in the target language.\n" +
                    "   • Surround yourself with books, music, and conversations in that language."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 2/6 | Use ◀️▶️ to navigate" }),

            // Page 3: Speaking & Listening Strategies
            new EmbedBuilder()
                .setTitle("🗣️ Speaking & Listening Strategies")
                .setDescription(
                    "**Speaking Techniques:**\n" +
                    "✅ Practice shadowing (repeat after native speakers).\n" +
                    "✅ Read aloud to improve pronunciation and confidence.\n" +
                    "✅ Think in your target language to improve fluency.\n\n" +
                    "**Listening Techniques:**\n" +
                    "🎧 Listen to slow, clear speech (news, audiobooks, interviews).\n" +
                    "🎧 Pay attention to sentence structures and common phrases.\n" +
                    "🎧 Repeat phrases until they feel natural."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 3/6 | Use ◀️▶️ to navigate" }),

            // Page 4: Reading & Writing Methods
            new EmbedBuilder()
                .setTitle("📖 Reading & Writing Methods")
                .setDescription(
                    "**Reading Techniques:**\n" +
                    "📖 Start with simplified texts before moving to native materials.\n" +
                    "📖 Read content that interests you—stories, news, or history.\n" +
                    "📖 Avoid translating every word; focus on understanding context.\n\n" +
                    "**Writing Techniques:**\n" +
                    "✍️ Keep a language journal—write short daily entries.\n" +
                    "✍️ Copy well-written sentences to improve structure and vocabulary.\n" +
                    "✍️ Review and refine your writing regularly."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 4/6 | Use ◀️▶️ to navigate" }),

            // Page 5: Memory Retention Techniques
            new EmbedBuilder()
                .setTitle("📝 Memory Retention Techniques")
                .setDescription(
                    "**Enhance Retention with These Methods:**\n\n" +
                    "🧠 **Spaced Repetition** – Review material at increasing intervals.\n" +
                    "🧠 **Mnemonic Devices** – Associate words with vivid images or stories.\n" +
                    "🧠 **Memory Palaces** – Link vocabulary to familiar locations in your mind.\n\n" +
                    "**Note-taking Strategies:**\n" +
                    "📌 Use the **Cornell Method** to structure notes effectively.\n" +
                    "📌 Maintain a **personal phrasebook** with useful expressions.\n" +
                    "📌 Highlight key words in different colors to improve recall."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 5/6 | Use ◀️▶️ to navigate" }),

            // Page 6: Staying Motivated
            new EmbedBuilder()
                .setTitle("🔥 Staying Motivated in Language Learning")
                .setDescription(
                    "📌 **Define Your Purpose:** Why do you want to learn this language?\n" +
                    "📌 **Make It Enjoyable:** Engage with content you love—books, music, movies.\n" +
                    "📌 **Join a Community:** Find conversation partners or study groups.\n" +
                    "📌 **Track Progress:** Maintain a log of achievements and milestones.\n" +
                    "📌 **Celebrate Small Wins:** Recognize and reward your improvements."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 6/6 | Use ◀️ to navigate" }),
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