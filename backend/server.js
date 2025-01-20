// Import dependencies
const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to save data to a .json file
app.post('/save', async (req, res) => {
    const data = req.body;
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `data-${timestamp}.json`;

    // Save data to a local JSON file
    fs.writeFileSync(`./saved_data/${fileName}`, JSON.stringify(data, null, 2));

    try {
        // Authenticate with Google API
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        const fileMetadata = {
            name: `JobData-${timestamp}.docx`,
            mimeType: 'application/vnd.google-apps.document',
        };

        const media = {
            mimeType: 'text/plain',
            body: JSON.stringify(data, null, 2),
        };

        // Save data to Google Docs
        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        res.status(200).json({ message: 'Data saved successfully', fileId: file.data.id });
    } catch (error) {
        console.error('Error saving to Google Docs:', error);
        res.status(500).json({ message: 'Failed to save data to Google Docs' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
