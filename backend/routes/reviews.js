const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { 
  updateReview, 
  deleteReview,
  markHelpful 
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Update and delete review
router.route('/:id')
  .put(
    [
      check('rating', 'Rating must be between 1-5').optional().isInt({ min: 1, max: 5 }),
      check('title', 'Title is required').optional().notEmpty(),
      check('comment', 'Comment is required').optional().notEmpty()
    ],
    updateReview
  )
  .delete(deleteReview);

// Mark review as helpful
router.put('/:id/helpful', markHelpful);

module.exports = router;