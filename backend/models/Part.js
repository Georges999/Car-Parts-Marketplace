const express = require('express');
const router = express.Router();

// Get all parts (placeholder)
router.get('/', (req, res) => {
  res.json({
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
});

// Get single part
router.get('/:id', (req, res) => {
  res.json({
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
});

module.exports = router;