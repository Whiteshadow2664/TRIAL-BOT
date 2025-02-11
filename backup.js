const { exec } = require("child_process");
const fs = require("fs");
const { google } = require("googleapis");
const cron = require("node-cron");
require("dotenv").config();

// ✅ Load PostgreSQL connection from environment
const DATABASE_URL = process.env.DATABASE_URL;

// ✅ Google Drive Authentication
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

// ✅ Google Drive Backup Folder ID
const GOOGLE_DRIVE_FOLDER_ID = "1jLl72PXtyet39jY3bTTKKLKSOi2w97KJ"; // Replace with your actual folder ID

// ✅ Function to Backup PostgreSQL Database
async function backupDatabase() {
    console.log(`[BACKUP] Starting database backup at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}...`);

    // ✅ Generate backup filename
    const backupFileName = `backup_${new Date().toISOString().replace(/[:.]/g, "-")}.sql`;
    const backupFilePath = `/tmp/${backupFileName}`; // ✅ /tmp is required for Render

    // ✅ Execute `pg_dump` to dump the PostgreSQL database
    exec(`pg_dump --dbname=${DATABASE_URL} -F c -f ${backupFilePath}`, async (error) => {
        if (error) {
            console.error("❌ Database backup failed:", error);
            return;
        }

        console.log(`✅ Backup created: ${backupFilePath}`);

        // ✅ Upload to Google Drive
        await uploadToGoogleDrive(backupFilePath, backupFileName);
    });
}

// ✅ Function to Upload Backup File to Google Drive
async function uploadToGoogleDrive(filePath, fileName) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: [GOOGLE_DRIVE_FOLDER_ID],
        };
        const media = {
            mimeType: "application/sql",
            body: fs.createReadStream(filePath),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        console.log(`✅ Backup uploaded to Google Drive: ${file.data.id}`);

        // ✅ Delete local file after upload
        fs.unlinkSync(filePath);
        console.log("✅ Local backup file deleted.");
    } catch (error) {
        console.error("❌ Error uploading to Google Drive:", error);
    }
}

// ✅ Schedule the Backup at 19:00 IST (13:30 UTC)
cron.schedule("30 13 * * *", () => {
    console.log(`[CRON] Running scheduled database backup at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
    backupDatabase();
}, {
    timezone: "Asia/Kolkata" // ✅ IST timezone
});

// ✅ Export Function (for manual testing)
module.exports = { backupDatabase };