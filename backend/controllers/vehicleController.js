const { validationResult } = require('express-validator');
const Vehicle = require('../models/Vehicle');

/**
 * @desc    Get all user vehicles
 * @route   GET /api/vehicles
 * @access  Private
 */
exports.getUserVehicles = async (req, res) => {
  try {
    // For development purposes, return dummy data
    res.status(200).json({
      success: true,
      count: 2,
      data: [
        {
          id: '1',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          trim: 'SE',
          engine: '2.5L 4-cylinder'
        },
        {
          id: '2',
          make: 'Honda',
          model: 'Civic',
          year: 2019,
          trim: 'Sport',
          engine: '1.5L Turbo'
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
 * @desc    Get single vehicle
 * @route   GET /api/vehicles/:id
 * @access  Private
 */
exports.getVehicle = async (req, res) => {
  try {
    // For development, return dummy data
    res.status(200).json({
      success: true,
      data: {
        id: req.params.id,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        trim: 'SE',
        engine: '2.5L 4-cylinder',
        transmission: 'Automatic'
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

/**
 * @desc    Create a vehicle
 * @route   POST /api/vehicles
 * @access  Private
 */
exports.createVehicle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Create vehicle
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      data: vehicle
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
 * @desc    Update vehicle
 * @route   PUT /api/vehicles/:id
 * @access  Private
 */
exports.updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Make sure user owns vehicle
    if (vehicle.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this vehicle'
      });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: vehicle
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
 * @desc    Delete vehicle
 * @route   DELETE /api/vehicles/:id
 * @access  Private
 */
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Make sure user owns vehicle
    if (vehicle.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this vehicle'
      });
    }

    await vehicle.deleteOne();

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