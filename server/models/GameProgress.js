const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    required: true,
    enum: ['flashcard', 'wordPuzzle', 'listeningChallenge', 'vocabularyQuiz']
  },
  wordSetId: {
    type: Schema.Types.ObjectId,
    ref: 'WordSet'
  },
  languagePair: {
    source: String,
    target: String
  },
  score: {
    type: Number,
    default: 0
  },
  masteredWords: [{
    type: Schema.Types.ObjectId,
    ref: 'Word'
  }],
  streak: {
    type: Number,
    default: 0
  },
  completedAt: Date,
  timeSpent: Number, // in seconds
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient querying by user and game type
gameProgressSchema.index({ userId: 1, gameType: 1 });

module.exports = mongoose.model('GameProgress', gameProgressSchema);
