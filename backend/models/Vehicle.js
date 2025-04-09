const express = require('express');
const router = express.Router();

// Get all vehicles (placeholder)
router.get('/', (req, res) => {
  res.json({
    success: true,
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
});

// Other vehicle routes
router.post('/', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '3',
      ...req.body
    }
  });
});

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      make: 'Toyota',
      model: 'Camry',
      year: 2020
    }
  });
});

module.exports = router;