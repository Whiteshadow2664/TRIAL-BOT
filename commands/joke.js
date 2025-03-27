const axios = require("axios");

module.exports = {
    name: "joke",
    description: "Fetches a random joke from an API.",
    execute: async (message) => {
        try {
            const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
            const joke = `${response.data.setup}\n\n${response.data.punchline}`;

            message.channel.send(`😂 **Here's a joke for you:**\n${joke}`);
        } catch (error) {
            console.error("❌ Error fetching joke:", error);
            message.reply("❌ Sorry, I couldn't fetch a joke at the moment.");
        }
    },
};