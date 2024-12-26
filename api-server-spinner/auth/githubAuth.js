const axios = require('axios');
const { prisma } = require('../utils/prismaClient');
require('dotenv').config({ path: '../.env' });
//required vars
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
//redurect user to github authentication

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
async function saveAccessToken(userId,accessToken){
  
}
module.exports = {
    getGitHubAuthUrl,
    exchangeCodeForToken,
    saveAccessToken,
  };