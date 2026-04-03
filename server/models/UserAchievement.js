const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAchievementSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementType: {
    type: String,
    required: true,
    enum: ['streak', 'wordsMastered', 'gamesCompleted', 'perfectScore', 'timeSpent']
  },
  level: {
    type: Number,
    default: 1
  },
  value: {
    type: Number,
    required: true
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  isNew: {
    type: Boolean,
    default: true
  }
});

// Compound index for efficient querying by user and achievement type
userAchievementSchema.index({ userId: 1, achievementType: 1 });

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
