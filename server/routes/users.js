const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { MongoClient, ObjectId } = require('mongodb'); //
const cors = require('cors');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/:firebaseUid', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user or login
router.post('/login', async (req, res) => {
  try {
    const { firebaseUid, displayName, email } = req.body;

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user if not found
      user = new User({ firebaseUid, displayName, email });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, firebaseUid, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user via token
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update current user via token
router.patch('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...req.body, lastActive: Date.now() },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update game score
router.post('/me/score', verifyToken, async (req, res) => {
  try {
    const { score, gameName } = req.body;
    if (score == null || typeof score !== 'number') {
      return res.status(400).json({ message: 'Invalid score payload' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.xp += score;
    
    // Initialize stats block if missing
    if (!user.stats) user.stats = {};
    if (!user.recentActivity) user.recentActivity = [];
    
    user.stats.totalXP = (user.stats.totalXP || 0) + score;
    user.stats.gamesPlayed = (user.stats.gamesPlayed || 0) + 1;

    // Advanced Level Up processing
    while (user.xp >= user.xpToNextLevel) {
      user.xp -= user.xpToNextLevel;
      user.level += 1;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.25); // Scale next level requirement
    }

    // Streak and Daily Active tracking
    const now = new Date();
    const lastActiveDate = user.lastActive ? new Date(user.lastActive) : new Date(0);
    // Calculate hours difference
    const diffTime = Math.abs(now - lastActiveDate);
    const diffHours = diffTime / (1000 * 60 * 60);

    if (diffHours >= 24 && diffHours < 48) {
        user.streak += 1;
        user.stats.daysActive = (user.stats.daysActive || 0) + 1;
    } else if (diffHours >= 48) {
        // Reset streak if more than 48 hours passed
        user.streak = 1;
    } else if (user.streak === 0) {
        // First ever play
        user.streak = 1;
        user.stats.daysActive = (user.stats.daysActive || 0) + 1;
    }

    user.lastActive = now;

    // Append to recentActivity
    if (gameName) {
        user.recentActivity.unshift({
            type: "game",
            title: gameName,
            xp: score,
            date: now.toISOString()
        });
        // Keep only top 10 recent activities
        if (user.recentActivity.length > 10) {
            user.recentActivity = user.recentActivity.slice(0, 10);
        }
    }

    user.markModified('stats');
    user.markModified('recentActivity');
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.patch('/:firebaseUid', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { ...req.body, lastActive: Date.now() },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
