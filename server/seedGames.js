const fs = require('fs');
const mongoose = require('mongoose');
const GameData = require('./models/GameData');
require('dotenv').config();

// Connect to DB immediately
mongoose.connect('mongodb://127.0.0.1:27017/gameLangApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB')).catch(err => console.error(err));

async function seed() {
    try {
        const flashFile = fs.readFileSync('../src/pages/FlashcardGame.jsx', 'utf8');
        const wordSetMatch = flashFile.match(/const wordSets = (\{[\s\S]*?\});\n\n\n\/\/ Language display names/);
        const wordSets = eval('(' + wordSetMatch[1] + ')');

        const puzzleFile = fs.readFileSync('../src/pages/WordPuzzleGame.jsx', 'utf8');
        const wordsMatch = puzzleFile.match(/const words = (\[[\s\S]*?\]);\n\n\n/);
        const puzzleWords = eval('(' + wordsMatch[1] + ')');

        const quizFile = fs.readFileSync('../src/pages/VocabularyQuiz.jsx', 'utf8');
        const quizMatch = quizFile.match(/const quizData = (\{[\s\S]*?\});\n\n\/\/ Difficulty level metadata/);
        const quizData = eval('(' + quizMatch[1] + ')');

        const listenFile = fs.readFileSync('../src/pages/ListeningChallenge.jsx', 'utf8');
        const listenMatch = listenFile.match(/const phrases = (\{[\s\S]*?\});\n\n    \/\/ References/);
        const phrases = eval('(' + listenMatch[1] + ')');

        await GameData.deleteMany({});
        
        await GameData.create({ gameType: 'FlashcardGame', data: wordSets });
        await GameData.create({ gameType: 'WordPuzzleGame', data: puzzleWords });
        await GameData.create({ gameType: 'VocabularyQuiz', data: quizData });
        await GameData.create({ gameType: 'ListeningChallenge', data: phrases });

        console.log('Seeded GameData successfully!');
    } catch (e) {
        console.error('Error during seeding:', e);
    } finally {
        mongoose.disconnect();
    }
}

seed();
