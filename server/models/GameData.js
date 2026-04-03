const mongoose = require('mongoose');

const gameDataSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

module.exports = mongoose.model('GameData', gameDataSchema);
