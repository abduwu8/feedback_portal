import express from 'express';
import {
  createFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
  getFeedbackById,
} from '../controllers/feedbackController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createFeedback)
  .get(protect, getFeedbacks);

router.route('/:id')
  .get(protect, getFeedbackById)
  .put(protect, updateFeedback)
  .delete(protect, admin, deleteFeedback);

export default router; 