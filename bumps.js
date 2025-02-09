const { EmbedBuilder } = require('discord.js');
const { Pool } = require('pg');

// Database connection setup
let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    idleTimeoutMillis: 30000,  // Close idle connections after 30s
    connectionTimeoutMillis: 5000  // Ensures quick reconnection
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
createBumpTable();  // Ensure table exists on startup

// Step 3: Function to track bumps when Fibo bot sends a bump message
async function trackBumpingPoints(message) {
    // Check if the message is from Fibo bot and matches the bump format
    if (message.author.id === '540129267728515072' && message.content.includes('Thx for bumping our Server!')) {
        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) return;

        try {
            const client = await pool.connect();
            try {
                await client.query(`
                    INSERT INTO bumps (user_id, username, bump_count)
                    VALUES ($1, $2, 1)
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                        bump_count = bumps.bump_count + 1
                `, [mentionedUser.id, mentionedUser.username]);
                
            } finally {
                client.release();
            }
        } catch (error) {
            console.error('❌ Error tracking bump:', error);
        }
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
                LIMIT 10;  -- Top 10 bumpers
            `);

            if (result.rows.length === 0) {
                return message.channel.send('No bumps recorded yet.');
            }

            let leaderboard = '';
            result.rows.forEach((row, index) => {
                leaderboard += `**#${index + 1}** - **${row.username}** - ${row.bump_count} Bumps\n`;
            });

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

// Solution 1: Keep connection alive by running periodic queries
setInterval(async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1'); // Keeps the connection active
        client.release();
    } catch (err) {
        console.error('Error keeping database connection alive:', err);
    }
}, 300000); // 5 minutes interval

// Solution 2: Auto-reconnect on connection loss
pool.on('error', (err) => {
    console.error('Database connection lost. Reconnecting...', err);
    // You could reinitialize the pool here if necessary
});

module.exports = { trackBumpingPoints, displayBumpLeaderboard };