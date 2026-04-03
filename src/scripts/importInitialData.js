// src/scripts/importInitialData.js
const mongoose = require('mongoose');
require('dotenv').config();
const Language = require('../models/Language');
const Word = require('../models/Word');
const WordSet = require('../models/WordSet');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Language data from FlashcardGame component
const languageInfo = {
  EnglishToKannada: { name: "Kannada", code: "kn-IN", flag: "🇮🇳", color: "#FF9933" },
  EnglishToSpanish: { name: "Spanish", code: "es-ES", flag: "🇪🇸", color: "#F1BF00" },
  EnglishToFrench: { name: "French", code: "fr-FR", flag: "🇫🇷", color: "#0055A4" },
  EnglishToGerman: { name: "German", code: "de-DE", flag: "🇩🇪", color: "#DD0000" },
  EnglishToItalian: { name: "Italian", code: "it-IT", flag: "🇮🇹", color: "#009246" },
  EnglishToJapanese: { name: "Japanese", code: "ja-JP", flag: "🇯🇵", color: "#BC002D" }
};

// Word data from FlashcardGame component
const wordSets = {
  EnglishToKannada: [
    { question: "Hello", answer: "ನಮಸ್ಕಾರ" },
    { question: "Thank you", answer: "ಧನ್ಯವಾದಗಳು" },
    { question: "Yes", answer: "ಹೌದು" },
    { question: "No", answer: "ಇಲ್ಲ" },
    { question: "Please", answer: "ದಯವಿಟ್ಟು" }
  ],
  EnglishToSpanish: [
    { question: "Hello", answer: "Hola" },
    { question: "Thank you", answer: "Gracias" },
    { question: "Yes", answer: "Sí" },
    { question: "No", answer: "No" },
    { question: "Please", answer: "Por favor" }
  ],
  EnglishToFrench: [
    { question: "Hello", answer: "Bonjour" },
    { question: "Thank you", answer: "Merci" },
    { question: "Yes", answer: "Oui" },
    { question: "No", answer: "Non" },
    { question: "Please", answer: "S'il vous plaît" }
  ],
  EnglishToGerman: [
    { question: "Hello", answer: "Hallo" },
    { question: "Thank you", answer: "Danke" },
    { question: "Yes", answer: "Ja" },
    { question: "No", answer: "Nein" },
    { question: "Please", answer: "Bitte" }
  ],
  EnglishToItalian: [
    { question: "Hello", answer: "Ciao" },
    { question: "Thank you", answer: "Grazie" },
    { question: "Yes", answer: "Sì" },
    { question: "No", answer: "No" },
    { question: "Please", answer: "Per favore" }
  ],
  EnglishToJapanese: [
    { question: "Hello", answer: "こんにちは" },
    { question: "Thank you", answer: "ありがとう" },
    { question: "Yes", answer: "はい" },
    { question: "No", answer: "いいえ" },
    { question: "Please", answer: "お願いします" }
  ]
};

async function importData() {
  try {
    // Clear existing data
    await Language.deleteMany({});
    await Word.deleteMany({});
    await WordSet.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Import languages
    const languages = [];
    for (const [key, value] of Object.entries(languageInfo)) {
      const language = new Language({
        code: value.code,
        name: value.name,
        flag: value.flag,
        accentColor: value.color,
        isActive: true
      });
      await language.save();
      languages.push(language);
      console.log(`Imported language: ${value.name}`);
    }
    
    // Import words and word sets
    for (const [key, words] of Object.entries(wordSets)) {
      const [source, target] = key.split('To');
      const sourceCode = 'en-US';
      const targetCode = languageInfo[key].code;
      
      // Create word set
      const wordSet = new WordSet({
        name: `${source} to ${languageInfo[key].name} Basics`,
        description: `Basic vocabulary from ${source} to ${languageInfo[key].name}`,
        sourceLanguage: sourceCode,
        targetLanguage: targetCode,
        level: 'Beginner',
        category: 'Vocabulary',
        isPublic: true,
        words: []
      });
      
      // Create words
      for (const wordPair of words) {
        const word = new Word({
          sourceLanguage: sourceCode,
          targetLanguage: targetCode,
          sourceWord: wordPair.question,
          targetWord: wordPair.answer,
          category: 'Basic'
        });
        await word.save();
        wordSet.words.push(word._id);
      }
      
      
      await wordSet.save();
      console.log(`Imported word set: ${wordSet.name} with ${words.length} words`);
    }
    
    console.log('Data import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
