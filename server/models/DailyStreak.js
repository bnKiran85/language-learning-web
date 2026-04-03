const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyStreakSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  wordsLearned: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  goalCompleted: {
    type: Boolean,
    default: false
  }
});

// Compound index for efficient querying by user and date
dailyStreakSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('DailyStreak', dailyStreakSchema);
