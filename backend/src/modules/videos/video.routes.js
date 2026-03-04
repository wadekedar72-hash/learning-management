const express = require('express');
const router = express.Router();
const videoController = require('./video.controller');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/:videoId', authMiddleware, videoController.getById);

module.exports = router;
