const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "exam",
    description: "Provides detailed information on German language proficiency exams, including descriptions, fees, and difficulty rankings.",
    async execute(message) {
        const pages = [
            // Page 1: Introduction
            new EmbedBuilder()
                .setTitle("🇩🇪 German Language Proficiency Exams Overview")
                .setDescription(
                    "This guide covers the most recognized German language proficiency exams:\n\n" +
                    "📌 **Goethe-Zertifikat**\n" +
                    "📌 **TestDaF**\n" +
                    "📌 **DSH**\n" +
                    "📌 **telc**\n" +
                    "📌 **ÖSD**\n\n" +
                    "Navigate through the pages to learn about each exam's details, fees, and difficulty levels."
                )
                .setColor("#FFD700")
                .setFooter({ text: "Page 1/6 | Use ▶️ to navigate" }),

            // Page 2: Goethe-Zertifikat
            new EmbedBuilder()
                .setTitle("📄 Goethe-Zertifikat")
                .setDescription(
                    "**Description:**\n" +
                    "The Goethe-Zertifikat is an internationally recognized German language proficiency test offered by the Goethe-Institut. It assesses candidates across all CEFR levels (A1 to C2) in reading, writing, listening, and speaking skills.\n\n" +
                    "**Fees (INR):**\n" +
                    "- A1: ₹7,000 (internal), ₹9,400 (external)\n" +
                    "- A2: ₹8,000 (internal), ₹10,600 (external)\n" +
                    "- B1: ₹14,000 (internal), ₹18,800 (external)\n" +
                    "- B2: ₹16,000 (internal), ₹21,200 (external)\n" +
                    "- C1: ₹18,000 (internal), ₹24,000 (external)\n" +
                    "- C2: ₹19,600 (internal), ₹26,000 (external)\n\n" +
                    "*(Fees are approximate and may vary by location.)*"
                )
                .setColor("#FFD700")
                .setFooter({ text: "Page 2/6 | Use ◀️▶️ to navigate" }),

            // Page 3: TestDaF
            new EmbedBuilder()
                .setTitle("📄 TestDaF (Test Deutsch als Fremdsprache)")
                .setDescription(
                    "**Description:**\n" +
                    "TestDaF is designed for non-native German speakers aiming to study in German universities. It evaluates advanced language skills necessary for academic settings.\n\n" +
                    "**Fees:**\n" +
                    "Approximately ₹13,000 to ₹15,000.\n\n" +
                    "*(Fees are approximate and may vary by location.)*"
                )
                .setColor("#FFD700")
                .setFooter({ text: "Page 3/6 | Use ◀️▶️ to navigate" }),

            // Page 4: DSH
            new EmbedBuilder()
                .setTitle("📄 DSH (Deutsche Sprachprüfung für den Hochschulzugang)")
                .setDescription(
                    "**Description:**\n" +
                    "The DSH exam is tailored for students seeking admission to German universities. It assesses proficiency in understanding and using academic language.\n\n" +
                    "**Fees:**\n" +
                    "Typically ranges from ₹8,000 to ₹15,000, depending on the university administering the exam.\n\n" +
                    "*(Fees are approximate and may vary by institution.)*"
                )
                .setColor("#FFD700")
                .setFooter({ text: "Page 4/6 | Use ◀️▶️ to navigate" }),

            // Page 5: telc and ÖSD
            new EmbedBuilder()
                .setTitle("📄 telc and ÖSD Exams")
                .setDescription(
                    "**telc (The European Language Certificates):**\n" +
                    "telc offers German language exams recognized across Europe for academic, professional, and migration purposes. They cover CEFR levels A1 to C2.\n\n" +
                    "**Fees:**\n" +
                    "- A1/A2: ₹8,100\n" +
                    "- B1/B2: ₹16,650\n" +
                    "- C1: ₹19,500\n\n" +
                    "**ÖSD (Österreichisches Sprachdiplom Deutsch):**\n" +
                    "ÖSD is an Austrian German language certificate recognized in Germany, Austria, and Switzerland. It assesses proficiency from A1 to C2 levels.\n\n" +
                    "**Fees:**\n" +
                    "Approximately ₹9,000 to ₹11,000.\n\n" +
                    "*(Fees are approximate and may vary by location.)*"
                )
                .setColor("#FFD700")
                .setFooter({ text: "Page 5/6 | Use ◀️▶️ to navigate" }),

            // Page 6: Exam Difficulty Ranking
            new EmbedBuilder()
                .setTitle("📊 German Language Exams Ranked by Difficulty")
                .setDescription(
                    "The difficulty of each exam can vary based on individual language proficiency and preparation. However, a general ranking from hardest to easiest is as follows:\n\n" +
                    "1. **DSH**\n" +
                    "2. **TestDaF**\n" +
                    "3. **Goethe-Zertifikat C2**\n" +
                    "4. **telc C1/C2**\n" +
                    "5. **ÖSD C1/C2**\n" +
                    "6. **Goethe-Zertifikat B2**\n" +
                    "7. **telc B2**\n" +
                    "8. **ÖSD B2**\n" +
                    "9. **Goethe-Zertifikat B1**\n" +
                    "10. **telc B1**\n" +
                    "11. **ÖSD B1**\n" +
                    "12. **Goethe-Zertifikat A2**\n" +
                    "13. **telc A2**\n" +
                    "14. **ÖSD A2**\n" +
                    "15. **Goethe-Zertifikat A1**\n" +
                    "16. **telc A1**\n" +
                    "17. **ÖSD A1**\n\n" +
                    "*(This ranking is subjective and may vary based on individual experiences.)*"
                )
                .setColor("#FFD700")
                .setFooter({ text: "Page 6/6 | Use ◀️ to navigate" }),
        ];

        let currentPage = 0;
        const embedMessage = await message.channel.send({ embeds: [pages[currentPage]] });

        await embedMessage.react("◀️");
        await embedMessage.react("▶️");

        const filter = (reaction, user) => ["◀️", "▶️"].includes(reaction.emoji.name) && !user.bot;
        const collector = embedMessage.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (reaction, user) => {
            if (reaction.emoji.name === "▶️" && currentPage < pages.length - 1) {
                currentPage++;
            } else if (reaction.emoji.name === "◀️" && currentPage > 0) {
                currentPage--;
            }
            embedMessage.edit({ embeds: [pages[currentPage]] });
            reaction.users.remove(user.id);
        });

        collector.on("end", () => embedMessage.reactions.removeAll().catch(console.error));
    }
};