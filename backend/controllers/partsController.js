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
    
    res.status(200).json({
      success: true,
      count: 2,
      data: [
        {
          id: '1',
          name: 'Brake Pads',
          description: 'High-performance brake pads for all weather conditions',
          price: 39.99,
          brand: 'Akebono',
          category: 'Brakes'
        },
        {
          id: '2',
          name: 'Oil Filter',
          description: 'Premium oil filter with superior filtration',
          price: 12.99,
          brand: 'Bosch',
          category: 'Filters'
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
 * @desc    Get single part
 * @route   GET /api/parts/:id
 * @access  Public
 */
exports.getPart = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.params.id,
        name: 'Brake Pads',
        description: 'High-performance brake pads for all weather conditions',
        price: 39.99,
        brand: 'Akebono',
        category: 'Brakes',
        compatibility: [
          {
            make: 'Toyota',
            model: 'Camry',
            yearStart: 2018,
            yearEnd: 2022
          }
        ]
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
      message: 'Server error: ' + error.message
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
      message: 'Server error: ' + error.message
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
      message: 'Server error: ' + error.message
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
    res.status(200).json({
      success: true,
      data: ['Brakes', 'Filters', 'Suspension', 'Electrical', 'Engine']
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
    res.status(200).json({
      success: true,
      data: ['Bosch', 'Akebono', 'Denso', 'NGK', 'AC Delco']
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};