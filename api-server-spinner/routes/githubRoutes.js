const express = require('express');
const { createWebHook } = require('../auth/createWebHook');

const { getGitHubAuthUrl,
    exchangeCodeForToken,
    saveAccessToken } = require('../auth/githubAuth');

const router = express.Router();

router.get('/aut-url', getGitHubAuthUrl);
router.post('/token', exchangeCodeForToken);
router.post('/save-token', saveAccessToken);

//routers for creating webhooks
router.post('/create-webhook', createWebHook);

module.exports = router;