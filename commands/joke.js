const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "joke",
    description: "Fetches a random joke from an API.",
    execute: async (message) => {
        try {
            const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
            const joke = `**${response.data.setup}**\n\n*${response.data.punchline}*`;

            const embed = new EmbedBuilder()
                .setColor("#acf508")
                .setTitle("📢 Random Joke")
                .setDescription(joke)
                .setFooter({ text: "Hope this made you smile!" })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching joke:", error);
            message.reply("Sorry, I couldn't fetch a joke at the moment.");
        }
    },
};