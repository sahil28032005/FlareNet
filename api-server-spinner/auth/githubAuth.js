const axios = require('axios');
const { prisma } = require('../utils/prismaClient');
require('dotenv').config({ path: '../.env' });
const crypto = require('crypto');
//required vars
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

// 1. Redirect user to GitHub authentication
function getGitHubAuthUrl() {
    const scope = 'repo admin:repo_hook'; // Permissions for repo and webhook
    return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
}

//exchange code for access token this will return access tolem required for all activities
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
    try {
        const encryptedAccessToken = encryptToken(accessToken);

        //check if the user already has a token stored
        const existingToken = await prisma.oAuthToken.findUnique({
            where: { userId },
        });

        if (existingToken) {
            // Update the existing token
            const updatedToken = await prisma.oAuthToken.update({
                where: { userId },
                data: { token: encryptedToken },
            });
            console.log('Access token updated:', updatedToken);
            return updatedToken;
        } else {
            // Create a new token entry
            const newToken = await prisma.oAuthToken.create({
                data: {
                    userId,
                    token: encryptedToken,
                },
            });
            console.log('Access token saved:', newToken);
            return newToken;
        }
    }
    catch (e) {
        console.error('Error saving access token:', error);
        throw new Error('Failed to save access token');
    }

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

        //needs to be saved in database

        //get userId from anyWhere
        // const userId = req.user.id;
        const userId = 1;

        await saveAccessToken(userId, accessToken);

        res.json({ message: 'Access token received and stored in database', accessToken: accessToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//getting user information from access
async function getUserInfoHelper(accessToken) {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        return response.data; // Return the user info like login, name, email, etc.
    } catch (error) {
        throw new Error('Failed to fetch user info from GitHub');
    }
}

// Helper function to fetch repositories from GitHub
async function fetchRepositoriesFromGitHub(accessToken) {
    try {
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        return response.data; // Return the array of repositories
    } catch (error) {
        throw new Error('Failed to fetch repositories from GitHub');
    }
}


//caller files
async function getUserInfo(req, res) {
    try {
        //get access token form query or body or from any source might be temp database
        let accessToken = req.query.accessToken || req.body.accessToken;

        if (!accessToken) {
            return res.status(400).json({ message: 'Missing access token' });
        }

        //fetch user info using provided access token
        const userInfo = await getUserInfoHelper(accessToken);

        //send user infor in response
        res.json(userInfo);
    }
    catch (err) {
        res.status(500).send({
            success: false,
            message: 'error fetching user info',
            error: err.message
        });
    }
}

async function listRepositories(req, res) {
    try {
        //get access token from query or body
        let accessToken = req.query.accessToken || req.body.accessToken;

        if (!accessToken) {
            return res.status(400).json({ message: 'Missing access token' });
        }

        //fetch repositories using provided access token
        const repositories = await fetchRepositoriesFromGitHub(accessToken);

        //send repositories in the response
        res.json(repositories);
    }
    catch (err) {
        res.status(500).send({
            success: false,
            message: 'error fetching repositories',
            error: err.message
        });
    }
}


//basic helper functions
function encryptToken(token) {
    const cipher = crypto.createCipher('aes256', 'your-secret-key');
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

module.exports = {
    getGitHubAuthUrl,
    exchangeCodeForToken,
    saveAccessToken,
    githubRedirect,
    githubCallback,
    getUserInfo,
    listRepositories
};