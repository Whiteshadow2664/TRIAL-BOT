const { Client } = require("pg");
const fs = require("fs");
const { google } = require("googleapis");
const { exec } = require("child_process");
const cron = require("node-cron");
require("dotenv").config();

// PostgreSQL connection URL from Render
const DATABASE_URL = process.env.DATABASE_URL;

// Google Drive authentication (from Render's environment variable)
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

// Folder ID of your Google Drive backup folder
const GOOGLE_DRIVE_FOLDER_ID = "1jLl72PXtyet39jY3bTTKKLKSOi2w97KJ"; // Replace this with your actual folder ID

// Function to back up the PostgreSQL database
async function backupDatabase() {
    console.log("Starting database backup...");

    // Backup file name with timestamp
    const backupFileName = `backup_${new Date().toISOString().replace(/[:.]/g, "-")}.sql`;
    const backupFilePath = `/tmp/${backupFileName}`; // Use /tmp for Render compatibility

    // Run pg_dump command to export the database
    exec(`pg_dump ${DATABASE_URL} -F c -f ${backupFilePath}`, async (error) => {
        if (error) {
            console.error("Database backup failed:", error);
            return;
        }

        console.log(`Backup created: ${backupFilePath}`);

        // Upload the backup file to Google Drive
        await uploadToGoogleDrive(backupFilePath, backupFileName);
    });
}

// Function to upload backup to Google Drive
async function uploadToGoogleDrive(filePath, fileName) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: [GOOGLE_DRIVE_FOLDER_ID], // Upload to a specific folder
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

        console.log(`Backup uploaded to Google Drive: ${file.data.id}`);

        // Delete the local backup file after upload
        fs.unlinkSync(filePath);
        console.log("Local backup file deleted.");
    } catch (error) {
        console.error("Error uploading to Google Drive:", error);
    }
}

// Schedule the backup to run daily at 00:00 IST (IST = UTC+5:30)
cron.schedule("30 18 * * *", () => {
    console.log("Running scheduled database backup...");
    backupDatabase();
}, {
    timezone: "Asia/Kolkata", // IST timezone
});

// Export the function (optional, in case you want to trigger it manually)
module.exports = { backupDatabase };