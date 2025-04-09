const express = require('express');
const router = express.Router();

// Get reviews for a part
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: 2,
    data: [
      {
        id: '1',
        rating: 5,
        title: 'Great product',
        comment: 'These brake pads are amazing. Easy installation and great stopping power.',
        user: {
          id: '101',
          name: 'John D.'
        },
        createdAt: '2023-04-15'
      },
      {
        id: '2',
        rating: 4,
        title: 'Good quality',
        comment: 'Solid brake pads, but installation was a bit tricky.',
        user: {
          id: '102',
          name: 'Sarah M.'
        },
        createdAt: '2023-04-10'
      }
    ]
  });
});

module.exports = router;