const express = require('express');

const { getGitHubAuthUrl,
    exchangeCodeForToken,
    saveAccessToken } = require('../auth/githubAuth');

const router = express.Router();

router.get('/aut-url',getGitHubAuthUrl);
router.post('/token',exchangeCodeForToken);
router.post('/save-token',saveAccessToken);

module.exports = router;