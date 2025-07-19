// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Global flag to track MongoDB connection status
let isMongoConnected = false;

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    isMongoConnected = true;
  })
  .catch((err) => {
    console.warn('MongoDB connection failed, running in demo mode:', err.message);
    console.log('Application will use in-memory storage for demonstration');
    isMongoConnected = false;
  });

// Make MongoDB connection status available to routes
app.use((req, res, next) => {
  req.isMongoConnected = isMongoConnected;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: isMongoConnected ? 'connected' : 'disconnected',
    mode: isMongoConnected ? 'production' : 'demo'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB status: ${isMongoConnected ? 'Connected' : 'Demo mode (in-memory storage)'}`);
});
