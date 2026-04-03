const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  nativeName: String,
  flag: String,
  accentColor: String,
  isActive: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Language', languageSchema);
