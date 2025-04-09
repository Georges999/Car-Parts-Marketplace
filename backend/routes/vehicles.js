const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { 
  getUserVehicles, 
  getVehicle, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');

// Protect all routes in this router
router.use(protect);

// Get all user vehicles and create new vehicle
router.route('/')
  .get(getUserVehicles)
  .post(
    [
      check('make', 'Make is required').notEmpty(),
      check('model', 'Model is required').notEmpty(),
      check('year', 'Year is required').notEmpty().isNumeric()
    ],
    createVehicle
  );

// Get, update and delete specific vehicle
router.route('/:id')
  .get(getVehicle)
  .put(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;