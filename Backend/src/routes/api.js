const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const videoController = require('../controllers/video.controller');
const engagementController = require('../controllers/engagement.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Authentication Routes
router.post('/auth/login', authController.login);
router.post('/auth/oauth/callback', authController.oauthCallback);

// Video Management Routes
router.post('/videos/upload', authMiddleware, videoController.uploadVideo);
router.get('/videos/stream/:filename', videoController.streamVideo);

// Engagement & Moderation Routes
router.post('/engagement/action', authMiddleware, engagementController.handleEngagement);

module.exports = router;