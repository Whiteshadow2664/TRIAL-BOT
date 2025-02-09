const { EmbedBuilder } = require('discord.js');
const { Pool } = require('pg');

// Database connection setup
let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// Step 1: Create the bumps table if it doesn't exist
async function createBumpTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bumps (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                bump_count INT DEFAULT 0
            );
        `);
        console.log('✅ bumps table checked/created.');
    } catch (error) {
        console.error('❌ Error creating bumps table:', error);
    }
}

// Step 2: Call the function right after the pool setup
createBumpTable();

// Step 3: Function to track bumps when Fibo bot sends a bump message
async function trackBumpingPoints(message) {
    // Ensure message is from the Fibo bot
    if (message.author.id !== '540129267728515072') return; 

    // Normalize message content and check if it contains the bump message
    const content = message.content.trim();
    if (!content.includes('Thx for bumping our Server!')) return;

    console.log(`✅ Bump message detected from Fibo bot: ${content}`);

    // Extract the mentioned user
    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
        console.log('❌ No user mentioned in the bump message.');
        return;
    }

    console.log(`🔹 Awarding 3 points to ${mentionedUser.username} (${mentionedUser.id})`);

    try {
        const client = await pool.connect();
        try {
            await client.query(`
                INSERT INTO bumps (user_id, username, bump_count)
                VALUES ($1, $2, 3)
                ON CONFLICT (user_id) 
                DO UPDATE SET 
                    bump_count = bumps.bump_count + 3
            `, [mentionedUser.id, mentionedUser.username]);
            console.log(`✅ Successfully updated bump count for ${mentionedUser.username}`);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ Error tracking bump:', error);
    }
}

// Step 4: Function to display the bump leaderboard when `!bumps` command is triggered
async function displayBumpLeaderboard(message) {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT user_id, username, bump_count
                FROM bumps
                ORDER BY bump_count DESC
                LIMIT 10;
            `);

            if (result.rows.length === 0) {
                return message.channel.send('No bumps recorded yet.');
            }

            let leaderboard = result.rows.map((row, index) =>
                `**#${index + 1}** - **${row.username}** - ${row.bump_count} Bumps`
            ).join('\n');

            const embed = new EmbedBuilder()
                .setColor('#acf508')
                .setTitle('DISBOARD BUMPS')
                .setDescription(leaderboard);

            message.channel.send({ embeds: [embed] });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ Error fetching bump leaderboard:', error);
        message.channel.send('Error retrieving bump leaderboard.');
    }
}

// Keep the database connection alive
setInterval(async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
    } catch (err) {
        console.error('Error keeping database connection alive:', err);
    }
}, 300000); // 5 minutes interval

// Handle database connection errors
pool.on('error', (err) => {
    console.error('Database connection lost. Reconnecting...', err);
});

module.exports = { trackBumpingPoints, displayBumpLeaderboard };