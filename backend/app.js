const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/parts', require('./routes/parts'));
app.use('/api/reviews', require('./routes/reviews'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Car Parts Marketplace API' });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

module.exports = app;