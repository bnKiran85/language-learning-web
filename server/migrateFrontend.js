const fs = require('fs');

function updateFlashcard() {
  const file = '../src/pages/FlashcardGame.jsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const wordSets = \{[\s\S]*?\};\n\n\n/, '');
  content = content.replace('import { useAuth } from "../context/AuthContext";', 'import { useAuth } from "../context/AuthContext";\nimport axios from "axios";');
  
  const stateReplacement = `const [language, setLanguage] = useState("EnglishToSpanish");
  const [wordSets, setWordSets] = useState({});
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(\`\${API_URL}/games/data/FlashcardGame\`);
        setWordSets(res.data);
        setWords(res.data["EnglishToSpanish"]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchWords();
  }, []);`;
  content = content.replace(/const \[language, setLanguage\] = useState\("EnglishToSpanish"\);\n  const \[words, setWords\] = useState\(wordSets\[language\]\);/, stateReplacement);
  
  // Loading check at root return
  content = content.replace(/return \(\n    <Box sx=\{\{ display: 'flex'/, 'if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><LinearProgress sx={{ width: "80%" }} /></Box>;\n\n  return (\n    <Box sx={{ display: \'flex\'');
  
  fs.writeFileSync(file, content);
}

function updateWordPuzzle() {
  const file = '../src/pages/WordPuzzleGame.jsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const words = \[[\s\S]*?\];\n\n\n\n/, '');
  content = content.replace('import { useAuth } from "../context/AuthContext";', 'import { useAuth } from "../context/AuthContext";\nimport axios from "axios";');
  
  const stateReplace = `const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);`;
  
  content = content.replace('const [currentIndex, setCurrentIndex] = useState(0);', stateReplace);
  
  const fetchReplace = `useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(\`\${API_URL}/games/data/WordPuzzleGame\`);
        setWords(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (words.length > 0) {
      setScrambledWord(shuffleWord(words[currentIndex].word));
      setLetterHints(Array(words[currentIndex].word.length).fill(false));
      startTimeRef.current = Date.now();
      if (inputRef.current) inputRef.current.focus();
    }
  }, [currentIndex, words]);`;
  
  content = content.replace(/useEffect\(\(\) => \{\n    setScrambledWord\(shuffleWord\(words\[currentIndex\]\.word\)\);\n[\s\S]*?\}, \[currentIndex\]\);/, fetchReplace);
  
  content = content.replace(/return \(\n    <Box sx=\{\{ display: 'flex'/, 'if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><LinearProgress sx={{ width: "80%" }} /></Box>;\n\n  return (\n    <Box sx={{ display: \'flex\'');
  fs.writeFileSync(file, content);
}

function updateQuiz() {
  const file = '../src/pages/VocabularyQuiz.jsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const quizData = \{[\s\S]*?\};\n\n\/\/ Difficulty/, '// Difficulty');
  content = content.replace('import { useAuth } from "../context/AuthContext";', 'import { useAuth } from "../context/AuthContext";\nimport axios from "axios";');
  
  const stateReplace = `const [quizData, setQuizData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");`;
  content = content.replace('const [currentDifficulty, setCurrentDifficulty] = useState("easy");', stateReplace);
  
  const fetchReplace = `useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(\`\${API_URL}/games/data/VocabularyQuiz\`);
        setQuizData(res.data);
        setQuestions(res.data["easy"]);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);`;
  content = content.replace('const [questions, setQuestions] = useState(quizData[currentDifficulty]);', `const [questions, setQuestions] = useState([]);\n  ${fetchReplace}`);
  
  content = content.replace(/return \(\n    <Box sx=\{\{ display: 'flex'/, 'if (loading || !questions.length) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><LinearProgress sx={{ width: "80%" }} /></Box>;\n\n  return (\n    <Box sx={{ display: \'flex\'');
  fs.writeFileSync(file, content);
}

function updateListening() {
  const file = '../src/pages/ListeningChallenge.jsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/    \/\/ Phrases by difficulty\n    const phrases = \{[\s\S]*?\};\n/, '');
  content = content.replace('import { useAuth } from "../context/AuthContext";', 'import { useAuth } from "../context/AuthContext";\nimport axios from "axios";');
  
  const stateReplace = `const [phrases, setPhrases] = useState({});
    const [loading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState("easy");`;
  content = content.replace('const [difficulty, setDifficulty] = useState("easy");', stateReplace);
  
  const fetchReplace = `useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                const res = await axios.get(\`\${API_URL}/games/data/ListeningChallenge\`);
                setPhrases(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);\n\n    const MAX_PHRASES = 5;`;
  content = content.replace('const MAX_PHRASES = 5;', fetchReplace);
  
  content = content.replace(/return \(\n        <Box sx=\{\{ minHeight: "100vh"/, 'if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><LinearProgress sx={{ width: "80%" }} /></Box>;\n\n    return (\n        <Box sx={{ minHeight: "100vh"');
  fs.writeFileSync(file, content);
}

try { updateFlashcard(); console.log('Flashcard updated'); } catch(e) { console.error('Flashcard error', e); }
try { updateWordPuzzle(); console.log('WordPuzzle updated'); } catch(e) { console.error('WordPuzzle error', e); }
try { updateQuiz(); console.log('Quiz updated'); } catch(e) { console.error('Quiz error', e); }
try { updateListening(); console.log('Listening updated'); } catch(e) { console.error('Listening error', e); }
