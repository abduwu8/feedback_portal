import Feedback from '../models/feedbackModel.js';

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
  try {
    const { category, priority, title, description } = req.body;

    const feedback = await Feedback.create({
      user: req.user._id,
      category,
      priority,
      title,
      description,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all feedbacks
// @route   GET /api/feedback
// @access  Private
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = req.user.role === 'admin'
      ? await Feedback.find().populate('user', 'name email')
      : await Feedback.find({ user: req.user._id });
    
    res.json(feedbacks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Private
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (
      feedback.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (
      feedback.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
}; 