const { validationResult } = require('express-validator');
const Part = require('../models/Part');

/**
 * @desc    Get all parts
 * @route   GET /api/parts
 * @access  Public
 */
exports.getParts = async (req, res) => {
  try {
    // Build query
    let query = {};
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by subcategory
    if (req.query.subcategory) {
      query.subcategory = req.query.subcategory;
    }
    
    // Filter by brand
    if (req.query.brand) {
      query.brand = req.query.brand;
    }
    
    // Filter by in stock
    if (req.query.inStock) {
      query.inStock = req.query.inStock === 'true';
    }
    
    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Vehicle compatibility search (more complex)
    if (req.query.make && req.query.model && req.query.year) {
      const year = parseInt(req.query.year);
      query['compatibility'] = {
        $elemMatch: {
          make: req.query.make,
          model: req.query.model,
          yearStart: { $lte: year },
          yearEnd: { $gte: year }
        }
      };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Part.countDocuments(query);
    
    // Build the final query with pagination and populate
    const parts = await Part.find(query)
      .populate('seller', 'name')
      .skip(startIndex)
      .limit(limit);
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: parts.length,
      pagination,
      data: parts
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
 * @desc    Get single part
 * @route   GET /api/parts/:id
 * @access  Public
 */
exports.getPart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      })
      .populate('seller', 'name');
    
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: part
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
 * @desc    Create new part
 * @route   POST /api/parts
 * @access  Private
 */
exports.createPart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  try {
    // Add user as seller
    req.body.seller = req.user.id;
    
    // Create part
    const part = await Part.create(req.body);
    
    res.status(201).json({
      success: true,
      data: part
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
 * @desc    Update part
 * @route   PUT /api/parts/:id
 * @access  Private
 */
exports.updatePart = async (req, res) => {
  try {
    let part = await Part.findById(req.params.id);
    
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }
    
    // Make sure user is the seller
    if (part.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this part'
      });
    }
    
    part = await Part.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: part
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
 * @desc    Delete part
 * @route   DELETE /api/parts/:id
 * @access  Private
 */
exports.deletePart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }
    
    // Make sure user is the seller
    if (part.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this part'
      });
    }
    
    await part.deleteOne();
    
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
 * @desc    Get part categories
 * @route   GET /api/parts/categories
 * @access  Public
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Part.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
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
 * @desc    Get part brands
 * @route   GET /api/parts/brands
 * @access  Public
 */
exports.getBrands = async (req, res) => {
  try {
    const brands = await Part.distinct('brand');
    
    res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};