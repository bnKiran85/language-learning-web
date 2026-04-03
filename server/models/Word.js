const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema({
  sourceLanguage: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  sourceWord: {
    type: String,
    required: true
  },
  targetWord: {
    type: String,
    required: true
  },
  pronunciation: String,
  audioUrl: String,
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  category: String,
  tags: [String],
  examples: [{
    source: String,
    target: String
  }],
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient querying by language pair
wordSchema.index({ sourceLanguage: 1, targetLanguage: 1 });

module.exports = mongoose.model('Word', wordSchema);
