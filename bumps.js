const { EmbedBuilder } = require('discord.js');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Ensure the table exists
const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS bump_leaderboard (
            user_id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            bump_count INTEGER DEFAULT 0
        );
    `;
    await pool.query(query);
};

// Update bump count in the database
const updateBumpCount = async (userId, username) => {
    try {
        await createTable(); // Ensure table exists
        const query = `
            INSERT INTO bump_leaderboard (user_id, username, bump_count)
            VALUES ($1, $2, 1)
            ON CONFLICT (user_id)
            DO UPDATE SET bump_count = bump_leaderboard.bump_count + 1, username = EXCLUDED.username;
        `;
        await pool.query(query, [userId, username]);
        console.log(`Bump recorded for: ${username}`);
    } catch (err) {
        console.error("Error updating bump count:", err);
    }
};

// Get leaderboard data
const getLeaderboard = async () => {
    try {
        const query = `SELECT username, bump_count FROM bump_leaderboard ORDER BY bump_count DESC LIMIT 10;`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        return [];
    }
};

// Handle bump detection
const trackBump = async (message) => {
    const bumpBotId = 'BOT_B_ID'; // Replace with Bot B's actual ID
    const bumpMessageSubstring = "Thx for bumping our Server! We will remind you in 2 hours!"; // Partial match

    // Only track messages from Bot B (the bump bot)
    if (message.author.id !== bumpBotId) return;

    // Check if the message contains the bump message substring and mentions a user
    if (message.content.includes(bumpMessageSubstring) && message.mentions.users.size > 0) {
        const bumpedUser = message.mentions.users.first();
        await updateBumpCount(bumpedUser.id, bumpedUser.username);
    }
};

// Handle `!bumps` command
const execute = async (message) => {
    try {
        const leaderboard = await getLeaderboard();

        if (leaderboard.length === 0) {
            return message.channel.send("No bumps recorded yet.");
        }

        const embed = new EmbedBuilder()
            .setTitle("📊 Bump Leaderboard")
            .setColor("#acf508");

        leaderboard.forEach((entry, index) => {
            embed.addFields({ name: `#${index + 1} - ${entry.username}`, value: `${entry.bump_count} bumps`, inline: false });
        });

        message.channel.send({ embeds: [embed] });
    } catch (err) {
        console.error("Error executing `!bumps` command:", err);
        message.channel.send("An error occurred while fetching the leaderboard.");
    }
};

// Listen to new messages in the server
const setupMessageListener = (client) => {
    client.on('messageCreate', async (message) => {
        // Ignore messages from the bot itself
        if (message.author.bot) return;

        // Track bumps from Bot B's messages
        await trackBump(message);
    });
};

module.exports = { trackBump, execute, setupMessageListener };