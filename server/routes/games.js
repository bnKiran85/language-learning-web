const express = require('express');
const router = express.Router();
const WordSet = require('../models/WordSet');
const GameProgress = require('../models/GameProgress');
const User = require('../models/User');

// Get all word sets
router.get('/wordsets', async (req, res) => {
  try {
    const wordSets = await WordSet.find({ isPublic: true });
    res.json(wordSets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get word set by ID with populated words
router.get('/wordsets/:id', async (req, res) => {
  try {
    const wordSet = await WordSet.findById(req.params.id).populate('words');
    if (!wordSet) {
      return res.status(404).json({ message: 'Word set not found' });
    }
    res.json(wordSet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save game progress
router.post('/progress', async (req, res) => {
  const gameProgress = new GameProgress(req.body);
  try {
    const savedProgress = await gameProgress.save();
    
    // Update user stats
    await User.findByIdAndUpdate(req.body.userId, {
      $inc: {
        'stats.totalScore': req.body.score || 0,
        'stats.gamesPlayed': 1,
        'stats.totalTimeSpent': req.body.timeSpent || 0
      },
      'stats.lastStreak': Date.now()
    });
    
    res.status(201).json(savedProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's game progress
router.get('/progress/:userId', async (req, res) => {
  try {
    const progress = await GameProgress.find({ userId: req.params.userId })
      .populate('wordSetId')
      .sort({ createdAt: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dynamically seeded game data by gameType
router.get('/data/:gameType', async (req, res) => {
  try {
    const gameData = await require('../models/GameData').findOne({ gameType: req.params.gameType });
    if (!gameData) {
      return res.status(404).json({ message: 'Game data not found' });
    }
    res.json(gameData.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
