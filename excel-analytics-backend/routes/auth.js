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
const createUserInMemory = ({ name, email, password, role = 'user' }) => {
  const user = {
    _id: global.userIdCounter++,
    name,
    email,
    password,
    role,
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
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }
    
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }
    
    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }
    
    let existingUser;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      existingUser = await User.findOne({ email });
    } else {
      // Use in-memory storage
      existingUser = findUserInMemory(email);
    }
    
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    let user;
    
    if (req.isMongoConnected) {
      // Create user in MongoDB
      const isFirstUser = await User.countDocuments() === 0;
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: isFirstUser ? 'admin' : 'user' // Make first user admin
      });
      await user.save();
    } else {
      // Create user in memory
      const isFirstUser = global.inMemoryUsers.length === 0;
      user = createUserInMemory({
        name,
        email,
        password: hashedPassword,
        role: isFirstUser ? 'admin' : 'user' // Make first user admin
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

// Temporary endpoint to promote user to admin (for demo purposes)
router.post('/promote-to-admin', async (req, res) => {
  try {
    const { email } = req.body;
    
    let user;
    
    if (req.isMongoConnected) {
      // Update user in MongoDB
      user = await User.findOneAndUpdate(
        { email },
        { role: 'admin' },
        { new: true }
      );
    } else {
      // Update user in memory
      const userIndex = global.inMemoryUsers.findIndex(u => u.email === email);
      if (userIndex !== -1) {
        global.inMemoryUsers[userIndex].role = 'admin';
        user = global.inMemoryUsers[userIndex];
      }
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User promoted to admin successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Promotion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user info (requires authentication)
router.get('/me', async (req, res) => {
  try {
    // This endpoint will be called with Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    
    if (req.isMongoConnected) {
      // Find user in MongoDB
      user = await User.findById(decoded.userId).select('-password');
    } else {
      // Find user in memory
      user = global.inMemoryUsers.find(u => u._id == decoded.userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role || 'user' }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
