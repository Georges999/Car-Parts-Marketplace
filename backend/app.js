const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/parts', require('./routes/parts'));
app.use('/api/reviews', require('./routes/reviews'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Car Parts Marketplace API' });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
