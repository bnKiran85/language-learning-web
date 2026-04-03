const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  sourceLanguage: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  category: String,
  words: [{
    type: Schema.Types.ObjectId,
    ref: 'Word'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WordSet', wordSetSchema);
