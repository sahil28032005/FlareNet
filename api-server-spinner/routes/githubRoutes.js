const express = require('express');
const { createWebHook } = require('../auth/createWebHook');

const { githubRedirect,
    exchangeCodeForToken,
    saveAccessToken,githubCallback } = require('../auth/githubAuth');

const router = express.Router();

router.get('/auth-url', githubRedirect);
router.post('/token', githubCallback);
router.post('/save-token', saveAccessToken);

//routers for creating webhooks
router.post('/create-webhook', createWebHook);

module.exports = router;