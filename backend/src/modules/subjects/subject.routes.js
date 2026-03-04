const express = require('express');
const router = express.Router();
const subjectController = require('./subject.controller');
const authMiddleware = require('../../middleware/authMiddleware');

// Public routes
router.get('/', subjectController.getAll);
router.get('/:subjectId', subjectController.getById);

// Protected routes
router.get('/:subjectId/tree', authMiddleware, subjectController.getTree);
router.get('/:subjectId/first-video', authMiddleware, subjectController.getFirstVideo);

module.exports = router;
