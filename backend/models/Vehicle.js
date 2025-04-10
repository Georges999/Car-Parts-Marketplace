const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  make: {
    type: String,
    required: [true, 'Please provide the vehicle make'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please provide the vehicle model'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please provide the vehicle year'],
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  trim: {
    type: String,
    trim: true
  },
  engine: {
    type: String,
    trim: true
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual', 'CVT', 'DCT', 'Other', '']
  },
  modifications: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);