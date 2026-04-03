const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    sparse: true,
    unique: true
  },
  bio: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: String,
  languages: { 
    type: [Object], 
    default: [{ code: "es", name: "Spanish", flag: "🇪🇸", level: 1, progress: 0 }] 
  },
  achievements: { 
    type: [Object], 
    default: [
      { id: 1, title: "Vocabulary Master", description: "Learn 500 words", icon: "🔤", completed: false, progress: 0 },
      { id: 2, title: "Grammar Guru", description: "Complete all grammar lessons", icon: "📝", completed: false, progress: 0 },
      { id: 3, title: "Conversation Pro", description: "Complete 50 speaking exercises", icon: "🗣️", completed: false, progress: 0 },
      { id: 4, title: "Perfect Streak", description: "Maintain a 30-day streak", icon: "🔥", completed: false, progress: 0 },
      { id: 5, title: "Quiz Champion", description: "Score 100% on 10 quizzes", icon: "🏆", completed: false, progress: 0 },
      { id: 6, title: "Global Communicator", description: "Learn basics in 5 languages", icon: "🌎", completed: false, progress: 0 }
    ] 
  },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  xpToNextLevel: { type: Number, default: 500 },
  streak: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  settings: {
    dailyGoal: {
      type: Number,
      default: 10
    },
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'light'
    },
    soundEnabled: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalXP: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    wordsLearned: { type: Number, default: 0 },
    daysActive: { type: Number, default: 0 }
  },
  recentActivity: {
    type: [Object],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
