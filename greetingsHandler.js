const greetings = {
    german: ['hallo', 'guten tag', 'servus'], // German greetings
    french: ['bonjour', 'salut'],            // French greetings
    russian: ['здравствуйте', 'привет'],    // Russian greetings
};

const responses = {
    german: {
        greeting: 'Wie geht es dir?',  // "How are you?" in German
        haveNiceDay: 'Gut, hab einen schönen Tag!', // "Good, have a nice day!" in German
    },
    french: {
        greeting: 'Comment ça va?',  // "How are you?" in French
        haveNiceDay: 'Bien, passez une bonne journée!', // "Good, have a nice day!" in French
    },
    russian: {
        greeting: 'Как дела?',      // "How are you?" in Russian
        haveNiceDay: 'Хорошо, хорошего дня!', // "Good, have a nice day!" in Russian
    }
};

// Define language-specific channels
const languageChannels = {
    german: '1225363050207514675',
    french: '1225362787581296640',
    russian: '1303664003444379649',
};

let conversationState = {
    previousLanguage: null, // To track the last language used
    hasAskedHowAreYou: false, // To track if the bot has already asked "How are you?"
};

const handleGreeting = (message) => {
    const content = message.content.toLowerCase(); // Convert message to lowercase for matching

    // Special response for "Ich liebe Frau Lingua" (allowed in all channels)
    if (content === 'ich liebe frau lingua') {
        return 'Ich liebe dich auch ❤️';
    }

    // Check for greetings in each language
    for (const [language, greetingsList] of Object.entries(greetings)) {
        if (greetingsList.some(greeting => content.includes(greeting))) {
            // Only respond if the message is in the correct channel for that language
            if (message.channel.id !== languageChannels[language]) {
                return null; // Ignore messages from incorrect channels
            }

            // If the user starts a new greeting
            conversationState.previousLanguage = language;
            conversationState.hasAskedHowAreYou = true; // Mark that the bot has asked "How are you?"
            return responses[language].greeting;
        }
    }

    // If the bot has already asked "How are you?" and user responds with anything
    if (conversationState.hasAskedHowAreYou) {
        const language = conversationState.previousLanguage;
        conversationState.previousLanguage = null; // Reset after completing the conversation
        conversationState.hasAskedHowAreYou = false; // Reset the flag
        
        // Only respond if in the correct channel
        if (message.channel.id === languageChannels[language]) {
            return responses[language].haveNiceDay; // Respond with "Have a nice day"
        }
    }

    // Return null if no match is found
    return null;
};

module.exports = { handleGreeting };