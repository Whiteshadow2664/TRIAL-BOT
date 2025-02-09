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
    await createTable(); // Ensure table exists
    const query = `
        INSERT INTO bump_leaderboard (user_id, username, bump_count)
        VALUES ($1, $2, 1)
        ON CONFLICT (user_id)
        DO UPDATE SET bump_count = bump_leaderboard.bump_count + 1, username = EXCLUDED.username;
    `;
    await pool.query(query, [userId, username]);
};

// Get leaderboard data
const getLeaderboard = async () => {
    const query = `SELECT username, bump_count FROM bump_leaderboard ORDER BY bump_count DESC LIMIT 10;`;
    const result = await pool.query(query);
    return result.rows;
};

// Handle bump detection
const trackBump = async (message) => {
    if (message.author.id !== '1338037787924107365') return; // Only track messages from the bump bot

    const bumpMessage = "Thx for bumping our Server! We will remind you in 2 hours!";
    if (message.content.includes(bumpMessage) && message.mentions.users.size > 0) {
        const bumpedUser = message.mentions.users.first();
        await updateBumpCount(bumpedUser.id, bumpedUser.username);
        console.log(`Bump counted for: ${bumpedUser.username}`);
    }
};

// Handle `!bumps` command
const execute = async (message) => {
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
};

module.exports = { trackBump, execute };