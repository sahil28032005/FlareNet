const axios = require('axios');
require('dotenv').config({ path: '../.env' });
const { Octokit } = require('@octokit/core');
// Create a GitHub webhook for the provided repository

//making octaakit instance here
const octokit = new Octokit({ auth: process.env.WEBHOOK_SECRET });
console.log(process.env.WEBHOOK_SECRET); // Remove after debugging

async function createWebHook(req, res) {
    try {
        console.log('Headers:', req.headers); // Log headers
        console.log('Body:', req.body); // Log the parsed body
        console.log('env', process.env.WEBHOOK_SECRET);
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

async function createWebhookOcta(oauthToken, owner, repo) {
    try {
        const response = await octokit.request('POST /repos/{owner}/{repo}/hooks', {
            owner: 'sahil28032005',
            repo: 'Docker-cheatsheet',
            name: 'web',
            active: true,
            events: ['push', 'pull_request'], // Add other events as needed
            config: {
                url: 'https://d5a1-103-252-53-110.ngrok-free.app/api/github/webhook-notifier', // Replace with your server URL
                content_type: 'json',
                insecure_ssl: '0'
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        console.log('Webhook created successfully:', response.data);
    } catch (error) {
        console.error('Error creating webhook:', error);
    }
}

//   createWebhookOcta(); single call is made already

module.exports = { createWebHook };
