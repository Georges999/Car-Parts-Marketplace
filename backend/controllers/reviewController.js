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
    const reviews = await Review.find({ part: req.params.partId })
      .populate('user', 'name')
      .populate('vehicle', 'make model year');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
    
    // Populate user info
    await review.populate('user', 'name');
    
    // If vehicle ID is provided, populate vehicle info
    if (req.body.vehicle) {
      await review.populate('vehicle', 'make model year');
    }
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
    
    // Update review
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name').populate('vehicle', 'make model year');
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
      message: 'Server error'
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
      message: 'Server error'
    });
  }
};