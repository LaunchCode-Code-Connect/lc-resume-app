// Import dependencies
const express = require('express');
const { google } = require('googleapis');
const open = require('open');

const app = express();
const PORT = 5000;

// Set up Google OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Scopes for Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Route to initiate Google login
app.get('/auth', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

// Google OAuth2 callback route
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('Authorization code not found');
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Save a new Google Document
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });
        const timestamp = new Date().toISOString().replace(/:/g, '-');

        const fileMetadata = {
            name: `Test-${timestamp}`,
            mimeType: 'application/vnd.google-apps.document',
        };

        const media = {
            mimeType: 'text/plain',
            body: 'This is a test document created via the Google Drive API.',
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        res.send(`Document created successfully! File ID: ${file.data.id}`);
    } catch (error) {
        console.error('Error during authentication or file creation:', error);
        res.status(500).send('Failed to create document');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Navigate to http://localhost:${PORT}/auth to log in`);
});
