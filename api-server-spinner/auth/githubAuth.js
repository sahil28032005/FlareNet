const axios = require('axios');
const { prisma } = require('../utils/prismaClient');
require('dotenv').config({ path: '../.env' });
//required vars
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

// 1. Redirect user to GitHub authentication
function getGitHubAuthUrl() {
    const scope = 'repo admin:repo_hook'; // Permissions for repo and webhook
    return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
}

//exchange code for access token
async function exchangeCodeForToken(code) {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
    }, {
        headers: { Accept: 'application/json' },
    });

    if (response.data.error) {
        throw new Error(response.data.error_description);
    }

    return response.data.access_token;
}

//save access token inside database
async function saveAccessToken(userId, accessToken) {

}

//main working helpers
async function githubRedirect(req, res) {
    try {
        const authUrl = getGitHubAuthUrl();
        res.json({ message: 'Redirect to GitHub for authentication', authUrl }); // Send auth URL in response
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: 'error generating github redirect url'
        });
    }
}
// Route 2: Handle GitHub OAuth callback and exchange code for access token
async function githubCallback(req, res) {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ message: 'Missing code parameter' });
    }

    try {
        const accessToken = await exchangeCodeForToken(code);
        // res.json({ message: 'Access token received', accessToken });
        console.log(accessToken);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//getting user information from access
async function getUserInfo(accessToken) {
    const response = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    return response.data;// This will return user info like login, name, email, etc.
}

//list user repositories
async function listRepositories(accessToken) {
    const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    return response.data; // This will return an array of repositories
}

module.exports = {
    getGitHubAuthUrl,
    exchangeCodeForToken,
    saveAccessToken,
    githubRedirect,
    githubCallback
};