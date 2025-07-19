// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Initialize global in-memory storage
if (!global.inMemoryUsers) {
  global.inMemoryUsers = [];
}
if (!global.userIdCounter) {
  global.userIdCounter = 1;
}

// Helper function to find user in memory
const findUserInMemory = (email) => {
  return global.inMemoryUsers.find(user => user.email === email);
};

// Helper function to create user in memory
const createUserInMemory = ({ name, email, password }) => {
  const user = {
    _id: global.userIdCounter++,
    name,
    email,
    password,
    role: 'user',
    uploadHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  global.inMemoryUsers.push(user);
  return user;
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let existingUser;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      existingUser = await User.findOne({ email });
    } else {
      // Use in-memory storage
      existingUser = findUserInMemory(email);
    }
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    let user;
    
    if (req.isMongoConnected) {
      // Create user in MongoDB
      user = new User({
        name,
        email,
        password: hashedPassword
      });
      await user.save();
    } else {
      // Create user in memory
      user = createUserInMemory({
        name,
        email,
        password: hashedPassword
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role || 'user' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let user;
    
    if (req.isMongoConnected) {
      // Find user in MongoDB
      user = await User.findOne({ email });
    } else {
      // Find user in memory
      user = findUserInMemory(email);
    }
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role || 'user' }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
