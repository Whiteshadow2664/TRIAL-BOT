const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "exam",
    description: "Provides detailed information on German language proficiency exams, including descriptions, fees, eligibility, and difficulty rankings.",
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
                    "Navigate through the pages to learn about each exam's details, fees, eligibility, and difficulty levels."
                )
                .setColor("#acf508")
                .setFooter({ text: "Page 1/6 | Use ▶️ to navigate" }),

            // Page 2: Goethe-Zertifikat
            new EmbedBuilder()
                .setTitle("📄 Goethe-Zertifikat")
                .setDescription(
                    "**Description:**\n" +
                    "The Goethe-Zertifikat is an internationally recognized German language proficiency test offered by the Goethe-Institut. It assesses reading, writing, listening, and speaking skills across CEFR levels (A1 to C2).\n\n" +
                    "**Who Should Take This Exam?**\n" +
                    "✔️ Students applying to German universities (B2/C1)\n" +
                    "✔️ Professionals seeking jobs in German-speaking countries\n" +
                    "✔️ Individuals applying for visas, residence permits, or citizenship\n\n" +
                    "**Fees:**\n" +
                    "- **A1**: ₹7,000 (internal), ₹9,400 (external) (~$85/$115)\n" +
                    "- **A2**: ₹8,000 (internal), ₹10,600 (external) (~$97/$129)\n" +
                    "- **B1**: ₹14,000 (internal), ₹18,800 (external) (~$170/$230)\n" +
                    "- **B2**: ₹16,000 (internal), ₹21,200 (external) (~$195/$260)\n" +
                    "- **C1**: ₹18,000 (internal), ₹24,000 (external) (~$220/$293)\n" +
                    "- **C2**: ₹19,600 (internal), ₹26,000 (external) (~$239/$317)\n\n" +
                    "*(Internal fees apply to students of the Goethe-Institut; external fees apply to all others.)*\n\n" +
                    "**Official Website:** [Goethe-Institut](https://www.goethe.de/en/spr/prf.html)"
                )
                .setColor("#acf508")
                .setFooter({ text: "Page 2/6 | Use ◀️▶️ to navigate" }),

            // Page 3: TestDaF
            new EmbedBuilder()
                .setTitle("📄 TestDaF (Test Deutsch als Fremdsprache)")
                .setDescription(
                    "**Description:**\n" +
                    "TestDaF is a standardized exam designed for non-native speakers who wish to study at German universities. It assesses advanced language skills required for academic settings.\n\n" +
                    "**Who Should Take This Exam?**\n" +
                    "✔️ Students applying to German universities (TestDaF Level 4 is commonly required)\n\n" +
                    "**Fees:**\n" +
                    "Approximately **₹13,000 - ₹15,000 (~$160 - $185)**\n\n" +
                    "**Official Website:** [TestDaF](https://www.testdaf.de/de/)"
                )
                .setColor("#acf508")
                .setFooter({ text: "Page 3/6 | Use ◀️▶️ to navigate" }),

            // Page 4: DSH
            new EmbedBuilder()
                .setTitle("📄 DSH (Deutsche Sprachprüfung für den Hochschulzugang)")
                .setDescription(
                    "**Description:**\n" +
                    "The DSH exam is conducted by German universities to assess students' ability to understand and use academic language.\n\n" +
                    "**Who Should Take This Exam?**\n" +
                    "✔️ Students applying to German universities (DSH-2 or DSH-3 is typically required)\n\n" +
                    "**Fees:**\n" +
                    "Typically **₹8,000 - ₹15,000 (~$97 - $185)**, depending on the university.\n\n" +
                    "**Official Website:** [DSH Exam](https://en.dsh-germany.com/)"
                )
                .setColor("#acf508")
                .setFooter({ text: "Page 4/6 | Use ◀️▶️ to navigate" }),

            // Page 5: telc and ÖSD
            new EmbedBuilder()
                .setTitle("📄 telc and ÖSD Exams")
                .setDescription(
                    "**telc (The European Language Certificates):**\n" +
                    "telc exams are recognized across Europe and assess language skills for academic, professional, and migration purposes.\n\n" +
                    "**Who Should Take This Exam?**\n" +
                    "✔️ Professionals seeking job opportunities in German-speaking countries\n" +
                    "✔️ Students preparing for university (B2/C1 levels recommended)\n\n" +
                    "**Fees:**\n" +
                    "- **A1/A2**: ₹8,100 (~$98)\n" +
                    "- **B1/B2**: ₹16,650 (~$202)\n" +
                    "- **C1**: ₹19,500 (~$237)\n\n" +
                    "**Official Website:** [telc](https://www.telc.net/en/)\n\n" +
                    "**ÖSD (Österreichisches Sprachdiplom Deutsch):**\n" +
                    "ÖSD is an Austrian German language certificate recognized in Germany, Austria, and Switzerland.\n\n" +
                    "**Fees:**\n" +
                    "Approximately **₹9,000 - ₹11,000 (~$109 - $133)**\n\n" +
                    "**Official Website:** [ÖSD](https://www.osd.at/en/exams/oesd-exams/)"
                )
                .setColor("#acf508")
                .setFooter({ text: "Page 5/6 | Use ◀️▶️ to navigate" }),

            // Page 6: Exam Difficulty Ranking
            new EmbedBuilder()
                .setTitle("📊 German Language Exams Ranked by Difficulty")
                .setDescription(
                    "The difficulty of each exam varies based on preparation and language proficiency. A general ranking from hardest to easiest is as follows:\n\n" +
                    "1. **DSH** (Most difficult, university-specific)\n" +
                    "2. **TestDaF** (Advanced academic German)\n" +
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
                    "*(This ranking is subjective and may vary based on experience.)*"
                )
                .setColor("#acf508")
                .setFooter({ text: "Page 6/6 | Use ◀️ to navigate" }),
        ];

        let currentPage = 0;
        const embedMessage = await message.channel.send({ embeds: [pages[currentPage]] });

        await embedMessage.react("◀️");
        await embedMessage.react("▶️");

        const filter = (reaction, user) => ["◀️", "▶️"].includes(reaction.emoji.name) && !user.bot;
        const collector = embedMessage.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (reaction, user) => {
            if (reaction.emoji.name === "▶️" && currentPage < pages.length - 1) currentPage++;
            else if (reaction.emoji.name === "◀️" && currentPage > 0) currentPage--;

            embedMessage.edit({ embeds: [pages[currentPage]] });
            reaction.users.remove(user.id);
        });

        collector.on("end", () => embedMessage.reactions.removeAll().catch(console.error));
    }
};