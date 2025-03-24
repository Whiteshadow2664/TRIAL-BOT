const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "tips",
    description: "Provides comprehensive study tips for learning a new language effectively.",
    async execute(message) {
        const pages = [
            // Page 1: Introduction & Resources
            new EmbedBuilder()
                .setTitle("🌍 Mastering a Language: Study Tips & Resources")
                .setDescription(
                    "**Want to learn a language effectively?** Here’s a complete guide covering:\n" +
                    "📌 **How to Study Efficiently**\n" +
                    "📌 **Best Books & Apps**\n" +
                    "📌 **Speaking & Listening Strategies**\n" +
                    "📌 **Reading & Writing Methods**\n" +
                    "📌 **Memory Techniques & Note-taking**\n\n" +
                    "➡️ **Resources**: [Click here](https://bit.ly/Iingualounge)"
                )
                .setColor("#ACF508")
                .setThumbnail("https://media.discordapp.net/attachments/1278983067205373964/1352596267422715975/20250321_162115.png")
                .setFooter({ text: "Page 1/7 | Use ▶️ to navigate" }),

            // Page 2: How to Study Efficiently
            new EmbedBuilder()
                .setTitle("📚 How to Study Efficiently")
                .setDescription(
                    "**1. Set SMART Goals:**\n" +
                    "   • Be Specific: 'Learn 20 new words daily' instead of 'Get better at French'.\n" +
                    "   • Make it Measurable & Achievable.\n" +
                    "   • Track progress weekly.\n\n" +
                    "**2. Use the 80/20 Rule:**\n" +
                    "   • Focus on the **most common 20% of words** that appear **80% of the time** in conversations.\n\n" +
                    "**3. Immersion Learning:**\n" +
                    "   • Switch phone, apps, and media to the target language.\n" +
                    "   • Surround yourself with content like podcasts, YouTube, and books."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 2/7 | Use ◀️▶️ to navigate" }),

            // Page 3: Best Books & Apps
            new EmbedBuilder()
                .setTitle("📖 Best Books & Apps")
                .setDescription(
                    "**Top Apps:**\n" +
                    "📌 **Anki** – Smart flashcards with spaced repetition.\n" +
                    "📌 **LingQ** – Great for reading & listening practice.\n" +
                    "📌 **HelloTalk** – Chat with native speakers.\n" +
                    "📌 **Language Reactor** – Makes YouTube & Netflix interactive.\n\n" +
                    "**Top Books:**\n" +
                    "📌 *Assimil Series* – Great for self-study.\n" +
                    "📌 *Teach Yourself Series* – Well-structured lessons.\n" +
                    "📌 *Fluent Forever* by Gabriel Wyner – Focuses on memory techniques."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 3/7 | Use ◀️▶️ to navigate" }),

            // Page 4: Speaking & Listening Strategies
            new EmbedBuilder()
                .setTitle("🗣️ Speaking & Listening Strategies")
                .setDescription(
                    "**Speaking Tips:**\n" +
                    "✅ Start with **Shadowing** (repeat after native speakers).\n" +
                    "✅ Use **Italki / Preply** for 1-on-1 speaking practice.\n" +
                    "✅ Think in your target language.\n" +
                    "✅ Join **Discord servers** or **language exchange communities**.\n\n" +
                    "**Listening Tips:**\n" +
                    "🎧 **Listen to Slow Podcasts** (e.g., ‘Slow German’ or ‘News in Slow Spanish’).\n" +
                    "🎧 Use **subtitled YouTube videos** & then watch again without subtitles.\n" +
                    "🎧 Focus on **phrases, not individual words**."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 4/7 | Use ◀️▶️ to navigate" }),

            // Page 5: Reading & Writing Methods
            new EmbedBuilder()
                .setTitle("📖 Reading & Writing Methods")
                .setDescription(
                    "**Reading Tips:**\n" +
                    "📖 **Start with graded readers** (books written for learners).\n" +
                    "📖 Highlight unknown words but don’t stop reading.\n" +
                    "📖 Use **Language Reactor** for subtitles & word definitions.\n\n" +
                    "**Writing Tips:**\n" +
                    "✍️ Keep a **daily journal** in your target language.\n" +
                    "✍️ Use **ChatGPT / Grammarly / Deepl Write** to correct mistakes.\n" +
                    "✍️ Copy **sentences from native speakers** (sentence mining)."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 5/7 | Use ◀️▶️ to navigate" }),

            // Page 6: Memory Techniques & Note-taking
            new EmbedBuilder()
                .setTitle("📝 Memory Techniques & Note-taking")
                .setDescription(
                    "**Best Memory Techniques:**\n" +
                    "🧠 **Spaced Repetition** – Review words at increasing intervals.\n" +
                    "🧠 **Mnemonics & Stories** – Create funny images for words.\n" +
                    "🧠 **Memory Palaces** – Place words in a familiar location in your mind.\n\n" +
                    "**Effective Note-taking:**\n" +
                    "📌 Use the **Cornell Method** (divide notes into sections: words, meanings, examples).\n" +
                    "📌 Keep a **personal phrasebook** (write sentences, not just words).\n" +
                    "📌 Write in **colors** (blue for nouns, red for verbs, etc.)."
                )
                .setColor("#ACF508")
                .setFooter({ text: "Page 6/7 | Use ◀️▶️ to navigate" }),

            // Page 7: How to Stay Motivated
            new EmbedBuilder()
                .setTitle("🔥 Staying Motivated in Language Learning")
                .setDescription(
                    "📌 **Find Your Purpose:** Why do you want to learn? Travel? Work? Love?\n" +
                    "📌 **Make It Fun:** Watch movies, listen to music, and read about topics you love.\n" +
                    "📌 **Join a Community:** Engage in Discord, Reddit, or online study groups.\n" +
                    "📌 **Track Progress:** Keep a streak tracker (use apps like Duolingo, Anki, or a notebook).\n" +
                    "📌 **Reward Yourself:** Set goals and celebrate milestones."
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