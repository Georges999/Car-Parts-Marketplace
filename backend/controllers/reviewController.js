const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Part = require('../models/Part');

/**
 * @desc    Get reviews for a part
 * @route   GET /api/parts/:partId/reviews
 * @access  Public
 */
exports.getReviews = async (req, res) => {
  try {
    // For development purposes, returning dummy data
    res.status(200).json({
      success: true,
      count: 2,
      data: [
        {
          id: '1',
          rating: 5,
          title: 'Great product',
          comment: 'These brake pads are amazing. Easy installation and great stopping power.',
          user: {
            id: '101',
            name: 'John D.'
          },
          createdAt: '2023-04-15'
        },
        {
          id: '2',
          rating: 4,
          title: 'Good quality',
          comment: 'Solid brake pads, but installation was a bit tricky.',
          user: {
            id: '102',
            name: 'Sarah M.'
          },
          createdAt: '2023-04-10'
        }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

/**
 * @desc    Add review
 * @route   POST /api/parts/:partId/reviews
 * @access  Private
 */
exports.addReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  try {
    // Check if part exists
    const part = await Part.findById(req.params.partId);
    
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }
    
    // Check if user already reviewed this part
    const existingReview = await Review.findOne({
      user: req.user.id,
      part: req.params.partId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this part'
      });
    }
    
    // Create review
    const review = await Review.create({
      ...req.body,
      user: req.user.id,
      part: req.params.partId
    });
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
exports.updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  try {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Make sure user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }
    
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Make sure user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    await review.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

/**
 * @desc    Mark review as helpful
 * @route   PUT /api/reviews/:id/helpful
 * @access  Private
 */
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user has already marked review as helpful
    const alreadyMarked = review.helpful.users.some(
      userId => userId.toString() === req.user.id
    );
    
    if (alreadyMarked) {
      // Remove user from helpful users array
      review.helpful.users = review.helpful.users.filter(
        userId => userId.toString() !== req.user.id
      );
      review.helpful.count -= 1;
    } else {
      // Add user to helpful users array
      review.helpful.users.push(req.user.id);
      review.helpful.count += 1;
    }
    
    await review.save();
    
    res.status(200).json({
      success: true,
      data: {
        helpfulCount: review.helpful.count,
        markedHelpful: !alreadyMarked
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};