const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging requests and responses and response status code
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Clearr Backend API',
    version: '1.0.0',
    status: 'running',
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/example', (req, res) => {
  res.json({
    success: true,
    message: 'This is an example API endpoint',
    data: {
      example: true,
      timestamp: new Date().toISOString(),
    },
  });
});

// Posts routes
app.get('/api/posts', (req, res) => {
  res.json({
    success: true,
    message: 'Chill out, it\'s just a test',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/posts', (req, res) => {
  res.json({
    success: true,
    message: 'Chill out, it\'s just a test',
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});


// Connection to MongoDB using Mongoose
mongoose
    .connect(process.env.MONGODB_URI, {dbName: "clearr"})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` API docs: http://localhost:${PORT}/api/v1/health`);
});

module.exports = app;