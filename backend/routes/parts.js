const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { 
  getParts, 
  getPart, 
  createPart, 
  updatePart, 
  deletePart,
  getCategories,
  getBrands
} = require('../controllers/partsController');
const { 
  getReviews, 
  addReview 
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Get all parts and categories/brands
router.get('/', getParts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);

// Get single part
router.get('/:id', getPart);

// Create part - protected
router.post(
  '/', 
  protect,
  [
    check('name', 'Name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('category', 'Category is required').notEmpty(),
    check('brand', 'Brand is required').notEmpty(),
    check('partNumber', 'Part number is required').notEmpty(),
    check('price', 'Price is required').isNumeric()
  ],
  createPart
);

// Update and delete part - protected
router.route('/:id')
  .put(protect, updatePart)
  .delete(protect, deletePart);

// Reviews for a specific part
router.route('/:partId/reviews')
  .get(getReviews)
  .post(
    protect,
    [
      check('rating', 'Rating is required and must be between 1-5').isInt({ min: 1, max: 5 }),
      check('title', 'Title is required').notEmpty(),
      check('comment', 'Comment is required').notEmpty()
    ],
    addReview
  );

module.exports = router;