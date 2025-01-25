const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

router.delete('/:id', protect, admin, feedbackController.deleteFeedback);

module.exports = router; 