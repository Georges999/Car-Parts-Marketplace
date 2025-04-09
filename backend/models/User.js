const express = require('express');
const router = express.Router();

// Simple routes for testing
router.post('/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'User registered successfully',
    token: 'sample-token',
    user: {
      id: '123',
      name: req.body.name || 'Test User',
      email: req.body.email || 'test@example.com'
    }
  });
});

router.post('/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'User logged in successfully',
    token: 'sample-token',
    user: {
      id: '123',
      name: 'Test User',
      email: req.body.email
    }
  });
});

router.get('/profile', (req, res) => {
  res.json({ 
    success: true,
    user: {
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    }
  });
});

module.exports = router;