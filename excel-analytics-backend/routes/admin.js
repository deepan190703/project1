// routes/admin.js
const express = require('express');
const User = require('../models/User');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    let users;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });
    } else {
      // Use in-memory storage
      users = global.inMemoryUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    let totalUsers, totalAnalyses, recentAnalyses, userStats;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      totalUsers = await User.countDocuments();
      totalAnalyses = await Analysis.countDocuments();
      recentAnalyses = await Analysis.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email');

      userStats = await User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            adminUsers: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
            regularUsers: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } }
          }
        }
      ]);
    } else {
      // Use in-memory storage
      totalUsers = global.inMemoryUsers.length;
      totalAnalyses = global.inMemoryAnalyses.length;
      recentAnalyses = global.inMemoryAnalyses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(analysis => {
          const user = global.inMemoryUsers.find(u => u._id == analysis.userId);
          return {
            ...analysis,
            userId: user ? { name: user.name, email: user.email } : null
          };
        });

      const adminUsers = global.inMemoryUsers.filter(u => u.role === 'admin').length;
      const regularUsers = global.inMemoryUsers.filter(u => u.role === 'user').length;
      
      userStats = [{
        totalUsers,
        adminUsers,
        regularUsers
      }];
    }

    res.json({
      totalUsers,
      totalAnalyses,
      recentAnalyses,
      userStats: userStats[0] || { totalUsers: 0, adminUsers: 0, regularUsers: 0 }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Update user role
router.patch('/users/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    let user;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select('-password');
    } else {
      // Use in-memory storage
      const userIndex = global.inMemoryUsers.findIndex(u => u._id == req.params.id);
      if (userIndex !== -1) {
        global.inMemoryUsers[userIndex].role = role;
        global.inMemoryUsers[userIndex].updatedAt = new Date();
        const { password, ...userWithoutPassword } = global.inMemoryUsers[userIndex];
        user = userWithoutPassword;
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    let user;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      user = await User.findByIdAndDelete(req.params.id);
      if (user) {
        await Analysis.deleteMany({ userId: req.params.id });
      }
    } else {
      // Use in-memory storage
      const userIndex = global.inMemoryUsers.findIndex(u => u._id == req.params.id);
      if (userIndex !== -1) {
        user = global.inMemoryUsers.splice(userIndex, 1)[0];
        // Remove user's analyses
        global.inMemoryAnalyses = global.inMemoryAnalyses.filter(a => a.userId != req.params.id);
      }
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get all analyses
router.get('/analyses', auth, adminAuth, async (req, res) => {
  try {
    let analyses;
    
    if (req.isMongoConnected) {
      // Use MongoDB
      analyses = await Analysis.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Use in-memory storage
      analyses = global.inMemoryAnalyses
        .map(analysis => {
          const user = global.inMemoryUsers.find(u => u._id == analysis.userId);
          return {
            ...analysis,
            userId: user ? { name: user.name, email: user.email } : null
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ message: 'Error fetching analyses' });
  }
});

module.exports = router;