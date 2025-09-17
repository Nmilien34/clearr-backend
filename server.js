
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

// Import routes
const authRoutes = require('./dist/Routes/authRoutes.js');
const userRoutes = require('./dist/Routes/userRoutes.js');
const translationRoutes = require('./dist/Routes/translationRoutes.js');

// API routes
app.use('/api', authRoutes.default || authRoutes);
app.use('/api/users', userRoutes.default || userRoutes);
app.use('/api/translations', translationRoutes.default || translationRoutes);

// Health check routes
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
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
    .connect(process.env.MONGODB_URI, {
        dbName: "clearr",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        
        // Start server only after successful database connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`🔗 API docs: http://localhost:${PORT}/api/v1/health`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.log("🔧 Troubleshooting tips:");
        console.log("1. Check if your IP is whitelisted in MongoDB Atlas");
        console.log("2. Verify your connection string is correct");
        console.log("3. Make sure your MongoDB Atlas cluster is running");
        console.log("4. Check if your username/password are correct");
        
        // Still start the server even if DB fails (for development)
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (without database)`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    });

module.exports = app;