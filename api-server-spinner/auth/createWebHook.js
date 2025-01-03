const axios = require('axios');
require('dotenv').config({ path: '../.env' });
// Create a GitHub webhook for the provided repository
async function createWebHook(req, res) {
    try {
        console.log('Headers:', req.headers); // Log headers
        console.log('Body:', req.body); // Log the parsed body
        console.log('env',process.env.WEBHOOK_SECRET);
        const { repo, accessToken, webhookUrl } = req.body;

        // Validate input data
        if (!repo || !accessToken || !webhookUrl) {
            return res.status(400).json({ message: 'Missing required parameters: repo, accessToken, webhookUrl' });
        }

        const [owner, repoName] = repo.split('/'); // Split repo into owner and repo name
        console.log('owner:', owner, 'repoName:', repoName);
        // Send request to GitHub API to create the webhook
        const response = await axios.post(
            `https://api.github.com/repos/${owner}/${repoName}/hooks`,
            {
                name: 'web',
                active: true,
                events: ['push'], // Listen to push events
                config: {
                    url: webhookUrl,  // The URL that GitHub will send events to
                    content_type: 'json',
                    secret: process.env.WEBHOOK_SECRET,  // Secret for webhook verification
                },
            },
            {
                headers: {
                    Authorization: `token ${accessToken}`,  // GitHub OAuth token
                    Accept: 'application/vnd.github.v3+json', // Specify GitHub API version
                },
            }
        );

        // Respond with the webhook data if successful
        return res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating webhook:', error.message);
        return res.status(500).json({ message: 'Error creating webhook', error: error.message });
    }
}

module.exports = { createWebHook };
