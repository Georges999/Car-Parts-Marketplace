const mongoose = require('mongoose');

const CompatibilitySchema = new mongoose.Schema({
  make: String,
  model: String,
  yearStart: Number,
  yearEnd: Number,
  trim: String,
  engine: String
}, { _id: false });

const PartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a part name'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    index: true
  },
  subcategory: {
    type: String,
    index: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand name'],
    index: true
  },
  partNumber: {
    type: String,
    required: [true, 'Please provide a part number'],
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  retailPrice: {
    type: Number
  },
  images: [String],
  compatibility: [CompatibilitySchema],
  specifications: {
    type: Map,
    of: String
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'lbs'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['in', 'cm'],
      default: 'in'
    }
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

PartSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'part',
  justOne: false
});
PartSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Part', PartSchema);