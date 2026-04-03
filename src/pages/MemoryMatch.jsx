// src/pages/MemoryMatch.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Card, CardContent, Typography, Grid, Button, Container,
  Select, MenuItem, Box, AppBar, Toolbar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider,
  Slide, Zoom, Fade, Chip, Avatar, LinearProgress,
  useMediaQuery, useTheme, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Paper, Badge, CircularProgress, Tooltip
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpOutline, EmojiEvents, Refresh, Home, Settings,
  VolumeUp, VolumeMute, ArrowBack, Share, Leaderboard,
  Timer, Psychology, Lightbulb, School, MenuBook, Translate,
  Person, Star, StarBorder, StarHalf, Notifications, Dashboard
} from "@mui/icons-material";
import confetti from "canvas-confetti";
import "./MemoryMatch.css";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Word sets with expanded vocabulary by language and category
const wordSets = {
  es: [
    { id: 1, word: "Apple", translation: "Manzana", category: "food" },
    { id: 2, word: "Car", translation: "Coche", category: "transport" },
    { id: 3, word: "Book", translation: "Libro", category: "objects" },
    { id: 4, word: "House", translation: "Casa", category: "places" },
    { id: 5, word: "Dog", translation: "Perro", category: "animals" },
    { id: 6, word: "Cat", translation: "Gato", category: "animals" },
    { id: 7, word: "Sun", translation: "Sol", category: "nature" },
    { id: 8, word: "Water", translation: "Agua", category: "nature" },
    { id: 9, word: "Friend", translation: "Amigo", category: "people" },
    { id: 10, word: "Time", translation: "Tiempo", category: "concepts" },
    { id: 11, word: "Money", translation: "Dinero", category: "concepts" },
    { id: 12, word: "Food", translation: "Comida", category: "food" },
    { id: 13, word: "School", translation: "Escuela", category: "places" },
    { id: 14, word: "Family", translation: "Familia", category: "people" },
    { id: 15, word: "Love", translation: "Amor", category: "concepts" },
    { id: 16, word: "Tree", translation: "Árbol", category: "nature" },
  ],
  fr: [
    { id: 1, word: "Apple", translation: "Pomme", category: "food" },
    { id: 2, word: "Car", translation: "Voiture", category: "transport" },
    { id: 3, word: "Book", translation: "Livre", category: "objects" },
    { id: 4, word: "House", translation: "Maison", category: "places" },
    { id: 5, word: "Dog", translation: "Chien", category: "animals" },
    { id: 6, word: "Cat", translation: "Chat", category: "animals" },
    { id: 7, word: "Sun", translation: "Soleil", category: "nature" },
    { id: 8, word: "Water", translation: "Eau", category: "nature" },
    { id: 9, word: "Friend", translation: "Ami", category: "people" },
    { id: 10, word: "Time", translation: "Temps", category: "concepts" },
    { id: 11, word: "Money", translation: "Argent", category: "concepts" },
    { id: 12, word: "Food", translation: "Nourriture", category: "food" },
    { id: 13, word: "School", translation: "École", category: "places" },
    { id: 14, word: "Family", translation: "Famille", category: "people" },
    { id: 15, word: "Love", translation: "Amour", category: "concepts" },
    { id: 16, word: "Tree", translation: "Arbre", category: "nature" },
  ],
  de: [
    { id: 1, word: "Apple", translation: "Apfel", category: "food" },
    { id: 2, word: "Car", translation: "Auto", category: "transport" },
    { id: 3, word: "Book", translation: "Buch", category: "objects" },
    { id: 4, word: "House", translation: "Haus", category: "places" },
    { id: 5, word: "Dog", translation: "Hund", category: "animals" },
    { id: 6, word: "Cat", translation: "Katze", category: "animals" },
    { id: 7, word: "Sun", translation: "Sonne", category: "nature" },
    { id: 8, word: "Water", translation: "Wasser", category: "nature" },
    { id: 9, word: "Friend", translation: "Freund", category: "people" },
    { id: 10, word: "Time", translation: "Zeit", category: "concepts" },
    { id: 11, word: "Money", translation: "Geld", category: "concepts" },
    { id: 12, word: "Food", translation: "Essen", category: "food" },
    { id: 13, word: "School", translation: "Schule", category: "places" },
    { id: 14, word: "Family", translation: "Familie", category: "people" },
    { id: 15, word: "Love", translation: "Liebe", category: "concepts" },
    { id: 16, word: "Tree", translation: "Baum", category: "nature" },
  ],
  it: [
    { id: 1, word: "Apple", translation: "Mela", category: "food" },
    { id: 2, word: "Car", translation: "Macchina", category: "transport" },
    { id: 3, word: "Book", translation: "Libro", category: "objects" },
    { id: 4, word: "House", translation: "Casa", category: "places" },
    { id: 5, word: "Dog", translation: "Cane", category: "animals" },
    { id: 6, word: "Cat", translation: "Gatto", category: "animals" },
    { id: 7, word: "Sun", translation: "Sole", category: "nature" },
    { id: 8, word: "Water", translation: "Acqua", category: "nature" },
    { id: 9, word: "Friend", translation: "Amico", category: "people" },
    { id: 10, word: "Time", translation: "Tempo", category: "concepts" },
    { id: 11, word: "Money", translation: "Denaro", category: "concepts" },
    { id: 12, word: "Food", translation: "Cibo", category: "food" },
    { id: 13, word: "School", translation: "Scuola", category: "places" },
    { id: 14, word: "Family", translation: "Famiglia", category: "people" },
    { id: 15, word: "Love", translation: "Amore", category: "concepts" },
    { id: 16, word: "Tree", translation: "Albero", category: "nature" },
  ]
};

// Language information with flags and names
const languageInfo = {
  es: { flag: "🇪🇸", name: "Spanish", nativeName: "Español" },
  fr: { flag: "🇫🇷", name: "French", nativeName: "Français" },
  de: { flag: "🇩🇪", name: "German", nativeName: "Deutsch" },
  it: { flag: "🇮🇹", name: "Italian", nativeName: "Italiano" }
};

// Difficulty settings with pairs count and time limits
const difficultySettings = {
  easy: { pairs: 4, timeLimit: 120, label: "Easy", bonusMultiplier: 1 },
  medium: { pairs: 6, timeLimit: 90, label: "Medium", bonusMultiplier: 1.5 },
  hard: { pairs: 8, timeLimit: 60, label: "Hard", bonusMultiplier: 2 },
  expert: { pairs: 12, timeLimit: 45, label: "Expert", bonusMultiplier: 3 }
};

// Category icons mapping
const categoryIcons = {
  food: "🍎",
  transport: "🚗",
  objects: "📱",
  places: "🏠",
  animals: "🐾",
  nature: "🌿",
  people: "👥",
  concepts: "💭"
};

// Theme colors for cards by category
const categoryColors = {
  food: "linear-gradient(135deg, #FF9A8B, #FF6B6B)",
  transport: "linear-gradient(135deg, #4facfe, #00f2fe)",
  objects: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  places: "linear-gradient(135deg, #84fab0, #8fd3f4)",
  animals: "linear-gradient(135deg, #fad0c4, #ffd1ff)",
  nature: "linear-gradient(135deg, #96fbc4, #f9f586)",
  people: "linear-gradient(135deg, #f6d365, #fda085)",
  concepts: "linear-gradient(135deg, #a1c4fd, #c2e9fb)"
};

const MemoryMatch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Game state
  const [language, setLanguage] = useState("es");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(
    localStorage.getItem('memoryMatchBestScore')
      ? parseInt(localStorage.getItem('memoryMatchBestScore'))
      : 0
  );
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(difficultySettings.medium.timeLimit);
  const [timerActive, setTimerActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintTimeout, setHintTimeout] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gameStats, setGameStats] = useState({
    gamesPlayed: parseInt(localStorage.getItem('memoryMatchGamesPlayed') || '0'),
    gamesWon: parseInt(localStorage.getItem('memoryMatchGamesWon') || '0'),
    bestStreak: parseInt(localStorage.getItem('memoryMatchBestStreak') || '0'),
    totalScore: parseInt(localStorage.getItem('memoryMatchTotalScore') || '0'),
    languageStats: JSON.parse(localStorage.getItem('memoryMatchLanguageStats') || '{}')
  });
  const [showTutorial, setShowTutorial] = useState(
    localStorage.getItem('memoryMatchTutorialSeen') !== 'true'
  );
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const { submitGameScore } = useAuth();

  // Get number of pairs based on difficulty
  const getPairsCount = useCallback(() => {
    return difficultySettings[difficulty].pairs;
  }, [difficulty]);

  // Get time limit based on difficulty
  const getTimeLimit = useCallback(() => {
    return difficultySettings[difficulty].timeLimit;
  }, [difficulty]);

  // Get bonus multiplier based on difficulty
  const getBonusMultiplier = useCallback(() => {
    return difficultySettings[difficulty].bonusMultiplier;
  }, [difficulty]);

  // Calculate progress percentage for timer
  const timeProgress = (timeRemaining / getTimeLimit()) * 100;

  // Shuffle cards when language or difficulty changes
  useEffect(() => {
    shuffleCards();
  }, [language, difficulty, categoryFilter]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setGameOver(true);
      setTimerActive(false);
      playSound('timeUp');
    }

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  // Save best score to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('memoryMatchBestScore', bestScore.toString());
  }, [bestScore]);

  // Save game stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('memoryMatchGamesPlayed', gameStats.gamesPlayed.toString());
    localStorage.setItem('memoryMatchGamesWon', gameStats.gamesWon.toString());
    localStorage.setItem('memoryMatchBestStreak', gameStats.bestStreak.toString());
    localStorage.setItem('memoryMatchTotalScore', gameStats.totalScore.toString());
    localStorage.setItem('memoryMatchLanguageStats', JSON.stringify(gameStats.languageStats));
  }, [gameStats]);

  // Mark tutorial as seen
  useEffect(() => {
    if (!showTutorial) {
      localStorage.setItem('memoryMatchTutorialSeen', 'true');
    }
  }, [showTutorial]);

  // Play sound effects
  const playSound = (soundType) => {
    if (!soundEnabled) return;

    const sounds = {
      flip: new Audio('/sounds/card-flip.mp3'),
      match: new Audio('/sounds/match.mp3'),
      noMatch: new Audio('/sounds/no-match.mp3'),
      victory: new Audio('/sounds/victory.mp3'),
      timeUp: new Audio('/sounds/time-up.mp3'),
      hint: new Audio('/sounds/hint.mp3'),
      bonus: new Audio('/sounds/bonus.mp3')
    };

    // Fallback if sounds aren't available in your project
    try {
      sounds[soundType].volume = 0.5;
      sounds[soundType].play();
    } catch (error) {
      console.log("Sound not available:", error);
    }
  };

  // Trigger confetti effect on victory
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // Filter words by category if needed
  const getFilteredWords = (words) => {
    if (categoryFilter === "all") return words;
    return words.filter(word => word.category === categoryFilter);
  };

  // Shuffle cards and reset game state
  const shuffleCards = () => {
    const pairsCount = getPairsCount();
    const timeLimit = getTimeLimit();

    // Filter words by category if needed
    const filteredWords = getFilteredWords(wordSets[language]);

    // If filtered words are less than needed pairs, use all words
    const wordsToUse = filteredWords.length < pairsCount ? wordSets[language] : filteredWords;

    const selectedWords = [...wordsToUse]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairsCount);

    const shuffledCards = selectedWords
      .flatMap((pair) => [
        { ...pair, id: pair.id * 2, type: "word" },
        { ...pair, id: pair.id * 2 + 1, type: "translation" },
      ])
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setStreak(0);
    setMoves(0);
    setGameComplete(false);
    setGameStarted(false);
    setTimerActive(false);
    setTimeRemaining(timeLimit);
    setGameOver(false);
    setHintUsed(false);
    setScoreSubmitted(false);

    if (hintTimeout) {
      clearTimeout(hintTimeout);
      setHintTimeout(null);
    }
    setShowHint(false);
  };

  // Handle card click
  const handleCardClick = (index) => {
    // Don't allow clicks if game is over or card is already flipped/matched
    if (gameOver || flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    // Start game and timer on first card click
    if (!gameStarted) {
      setGameStarted(true);
      setTimerActive(true);
      setGameStats(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1
      }));
    }

    playSound('flip');

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      setMoves(moves + 1);

      // Check if cards match (same word but different types)
      if (firstCard.word === secondCard.word && firstCard.type !== secondCard.type) {
        // Cards match
        const newMatched = [...matched, firstIdx, secondIdx];
        setMatched(newMatched);

        // Calculate score with streak bonus and difficulty multiplier
        const matchPoints = 10;
        const streakBonus = streak * 2;
        const difficultyBonus = Math.round(matchPoints * getBonusMultiplier());
        const newScore = score + matchPoints + streakBonus + difficultyBonus;

        setScore(newScore);
        setStreak(streak + 1);

        // Update best streak if current streak is higher
        if (streak + 1 > gameStats.bestStreak) {
          setGameStats(prev => ({
            ...prev,
            bestStreak: streak + 1
          }));
        }

        // Update language stats
        const updatedLanguageStats = { ...gameStats.languageStats };
        if (!updatedLanguageStats[language]) {
          updatedLanguageStats[language] = { wordsLearned: 0, matchesMade: 0 };
        }
        updatedLanguageStats[language].wordsLearned += 1;
        updatedLanguageStats[language].matchesMade += 1;

        setGameStats(prev => ({
          ...prev,
          languageStats: updatedLanguageStats
        }));

        playSound('match');

        // Add bonus sound for streaks of 3 or more
        if (streak >= 2) {
          setTimeout(() => playSound('bonus'), 300);
        }

        // Check if game is complete
        if (newMatched.length === cards.length) {
          // Calculate time bonus
          const timeBonus = Math.round(timeRemaining * 0.5);
          const finalScore = newScore + timeBonus;

          // Update best score if needed
          if (finalScore > bestScore) {
            setBestScore(finalScore);
          }

          // Update game stats
          setGameStats(prev => ({
            ...prev,
            gamesWon: prev.gamesWon + 1,
            totalScore: prev.totalScore + finalScore
          }));

          setScore(finalScore); // Update score with time bonus
          setGameComplete(true);
          setTimerActive(false);

          if (!scoreSubmitted && submitGameScore) {
            submitGameScore(finalScore, "Memory Match");
            setScoreSubmitted(true);
          }

          playSound('victory');
          setTimeout(triggerConfetti, 300);
        }

        setFlipped([]);
      } else {
        // Cards don't match
        setStreak(0);
        playSound('noMatch');
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  // Show hint (briefly flip all cards)
  const showHintCards = () => {
    if (hintUsed || matched.length === cards.length) return;

    setHintUsed(true);
    setShowHint(true);
    playSound('hint');

    // Reduce score for using hint
    setScore(Math.max(0, score - 20));

    // Hide hint after 1.5 seconds
    const timeout = setTimeout(() => {
      setShowHint(false);
    }, 1500);

    setHintTimeout(timeout);
  };

  // Calculate star rating based on moves and difficulty
  const getStarRating = () => {
    const pairsCount = getPairsCount();
    const perfectMoves = pairsCount;
    const goodMoves = pairsCount * 1.5;
    const okayMoves = pairsCount * 2;

    if (moves <= perfectMoves) return 3;
    if (moves <= goodMoves) return 2;
    if (moves <= okayMoves) return 1.5;
    return 1;
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        {rating >= 1 ? <Star fontSize="large" sx={{ color: '#FFD700' }} /> :
          rating >= 0.5 ? <StarHalf fontSize="large" sx={{ color: '#FFD700' }} /> :
            <StarBorder fontSize="large" sx={{ color: '#FFD700' }} />}

        {rating >= 2 ? <Star fontSize="large" sx={{ color: '#FFD700' }} /> :
          rating >= 1.5 ? <StarHalf fontSize="large" sx={{ color: '#FFD700' }} /> :
            <StarBorder fontSize="large" sx={{ color: '#FFD700' }} />}

        {rating >= 3 ? <Star fontSize="large" sx={{ color: '#FFD700' }} /> :
          rating >= 2.5 ? <StarHalf fontSize="large" sx={{ color: '#FFD700' }} /> :
            <StarBorder fontSize="large" sx={{ color: '#FFD700' }} />}
      </Box>
    );
  };

  // Get unique categories from current language
  const getCategories = () => {
    const categories = [...new Set(wordSets[language].map(word => word.category))];
    return categories;
  };

  return (
    <Box className="memory-match-page">
      {/* Modern App Header */}
      <AppBar position="fixed" sx={{
        background: 'linear-gradient(90deg, #1a237e, #283593)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <Dashboard />
          </IconButton>

          <Typography variant="h6" component={Link} to="/dashboard" sx={{
            flexGrow: 1,
            fontWeight: 700,
            textDecoration: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img
              src="/logo.png"
              alt="LinguaLearn"
              style={{ height: '32px', marginRight: '10px' }}
              onError={(e) => e.target.style.display = 'none'}
            />
            memorymatch
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Leaderboard">
              <IconButton color="inherit" component={Link} to="/leaderboard">
                <Leaderboard />
              </IconButton>
            </Tooltip>

            <Tooltip title={soundEnabled ? "Mute Sound" : "Enable Sound"}>
              <IconButton color="inherit" onClick={toggleSound}>
                {soundEnabled ? <VolumeUp /> : <VolumeMute />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Help">
              <IconButton color="inherit" onClick={() => setHelpOpen(true)}>
                <HelpOutline />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Avatar
              sx={{
                ml: 2,
                bgcolor: '#f50057',
                cursor: 'pointer',
                border: '2px solid white'
              }}
              alt="User Profile"
            >
              K
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Navigation Drawer */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(180deg, #1a237e, #283593)',
            color: 'white',
            pt: 2
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Avatar sx={{ bgcolor: '#f50057', mr: 2 }}>K</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Kiran</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Premium Member</Typography>
          </Box>
        </Box>

        <List sx={{ pt: 2 }}>
          <ListItem button component={Link} to="/dashboard" onClick={() => setMenuOpen(false)}>
            <ListItemIcon sx={{ color: 'white' }}><Home /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button onClick={() => { setSettingsOpen(true); setMenuOpen(false); }}>
            <ListItemIcon sx={{ color: 'white' }}><Settings /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>

          <ListItem button onClick={() => { setHelpOpen(true); setMenuOpen(false); }}>
            <ListItemIcon sx={{ color: 'white' }}><HelpOutline /></ListItemIcon>
            <ListItemText primary="How to Play" />
          </ListItem>

          <ListItem button onClick={() => { setShowTutorial(true); setMenuOpen(false); }}>
            <ListItemIcon sx={{ color: 'white' }}><School /></ListItemIcon>
            <ListItemText primary="Tutorial" />
          </ListItem>

          <ListItem button component={Link} to="/leaderboard" onClick={() => setMenuOpen(false)}>
            <ListItemIcon sx={{ color: 'white' }}><Leaderboard /></ListItemIcon>
            <ListItemText primary="Leaderboard" />
          </ListItem>

          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

          <ListItem>
            <ListItemIcon sx={{ color: 'white' }}><Translate /></ListItemIcon>
            <ListItemText primary="Language Progress" />
          </ListItem>

          {Object.entries(gameStats.languageStats).map(([lang, stats]) => (
            <ListItem key={lang} sx={{ pl: 4 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%'
              }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {languageInfo[lang]?.flag}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {languageInfo[lang]?.name}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((stats.wordsLearned / 16) * 100, 100)}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      mt: 0.5,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4caf50'
                      }
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {stats.wordsLearned}/16
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
        <Box sx={{ mt: { xs: 4, sm: 6 } }}>
          {/* Game Header Section */}
          <Fade in={true} timeout={800}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 4 },
                mb: 4,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1a237e, #283593)',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'url(/images/pattern-bg.png)',
                backgroundSize: 'cover',
                zIndex: 0
              }} />
              

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" component="h1" sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
                }}>
                  Memory Match
                </Typography>

                <Typography variant="h6" sx={{
                  mb: 3,
                  opacity: 0.9,
                  maxWidth: '700px',
                  mx: 'auto',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                  Match words with their translations to improve your vocabulary in {languageInfo[language].name}
                </Typography>

                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Select Language
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 1
                      }}>
                        {Object.entries(languageInfo).map(([code, info]) => (
                          <Chip
                            key={code}
                            label={`${info.flag} ${info.name}`}
                            onClick={() => setLanguage(code)}
                            sx={{
                              bgcolor: language === code ? 'primary.main' : 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: language === code ? 'bold' : 'normal',
                              '&:hover': {
                                bgcolor: language === code ? 'primary.dark' : 'rgba(255,255,255,0.3)',
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Difficulty Level
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 1
                      }}>
                        {Object.entries(difficultySettings).map(([level, settings]) => (
                          <Chip
                            key={level}
                            label={settings.label}
                            onClick={() => setDifficulty(level)}
                            sx={{
                              bgcolor: difficulty === level ? 'secondary.main' : 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: difficulty === level ? 'bold' : 'normal',
                              '&:hover': {
                                bgcolor: difficulty === level ? 'secondary.dark' : 'rgba(255,255,255,0.3)',
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Filter by Category
                      </Typography>
                      <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        size="small"
                        sx={{
                          width: '100%',
                          color: 'white',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255,255,255,0.5)',
                          },
                          '.MuiSvgIcon-root': {
                            color: 'white',
                          }
                        }}
                      >
                        <MenuItem value="all">All Categories</MenuItem>
                        {getCategories().map(category => (
                          <MenuItem key={category} value={category}>
                            {categoryIcons[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Game Controls
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'center'
                      }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<Refresh />}
                          onClick={shuffleCards}
                          sx={{ fontWeight: 'bold' }}
                        >
                          New Game
                        </Button>

                        <Button
                          variant="contained"
                          color="info"
                          startIcon={<Lightbulb />}
                          onClick={showHintCards}
                          disabled={hintUsed || !gameStarted || gameComplete || gameOver}
                          sx={{ fontWeight: 'bold' }}
                        >
                          Hint
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Fade>

          {/* Game Stats Bar */}
          <Fade in={true} timeout={1000}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 4,
                borderRadius: 2,
                background: 'white',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '100px'
              }}>
                <Typography variant="subtitle2" color="text.secondary">Score</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {score}
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '100px'
              }}>
                <Typography variant="subtitle2" color="text.secondary">Best Score</Typography>
                <Typography variant="h5" fontWeight="bold" color="secondary">
                  {bestScore}
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '100px'
              }}>
                <Typography variant="subtitle2" color="text.secondary">Moves</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {moves}
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '100px'
              }}>
                <Typography variant="subtitle2" color="text.secondary">Streak</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" color={streak >= 3 ? 'success.main' : 'text.primary'}>
                    {streak}
                  </Typography>
                  {streak >= 3 && (
                    <Chip
                      label="Hot!"
                      size="small"
                      color="error"
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '150px'
              }}>
                <Typography variant="subtitle2" color="text.secondary">Time Remaining</Typography>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timer color={timeRemaining < 10 ? "error" : "action"} />
                  <LinearProgress
                    variant="determinate"
                    value={timeProgress}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: timeRemaining < 10 ? '#f44336' :
                          timeRemaining < 30 ? '#ff9800' : '#4caf50',
                        borderRadius: 4
                      }
                    }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {timeRemaining}s
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>

          {/* Game Board */}
          <Fade in={true} timeout={1200}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 2,
                background: 'white',
                position: 'relative',
                minHeight: '400px'
              }}
            >
              {/* Game grid */}
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{
                  perspective: '1000px',
                  maxWidth: '900px',
                  mx: 'auto'
                }}
              >
                <AnimatePresence>
                  {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || matched.includes(index) || showHint;
                    const isMatched = matched.includes(index);

                    // Calculate grid size based on number of cards
                    const gridSize = cards.length <= 8 ? 3 :
                      cards.length <= 16 ? 4 :
                        cards.length <= 24 ? 6 : 3;

                    return (
                      <Grid item xs={4} sm={3} md={12 / gridSize} key={card.id}>
                        <motion.div
                          initial={{ rotateY: 0 }}
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          transition={{ duration: 0.5 }}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <Card
                            onClick={() => handleCardClick(index)}
                            sx={{
                              height: { xs: 100, sm: 120, md: 140 },
                              cursor: isMatched ? 'default' : 'pointer',
                              position: 'relative',
                              transformStyle: 'preserve-3d',
                              transition: 'transform 0.6s',
                              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                              boxShadow: isMatched ? '0 0 15px rgba(76, 175, 80, 0.7)' : '0 2px 8px rgba(0,0,0,0.1)',
                              '&:hover': {
                                boxShadow: isMatched ? '0 0 15px rgba(76, 175, 80, 0.7)' : '0 5px 15px rgba(0,0,0,0.2)',
                              },
                              bgcolor: isMatched ? 'rgba(76, 175, 80, 0.1)' : 'white',
                              border: isMatched ? '2px solid #4caf50' : '1px solid rgba(0,0,0,0.1)',
                              borderRadius: 2
                            }}
                          >
                            {/* Card Back (Hidden) */}
                            <CardContent
                              sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backfaceVisibility: 'hidden',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                                background: 'linear-gradient(135deg, #1a237e, #283593)',
                                borderRadius: 2
                              }}
                            >
                              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                ?
                              </Typography>
                            </CardContent>

                            {/* Card Front (Word/Translation) */}
                            <CardContent
                              sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backfaceVisibility: 'hidden',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                transform: isFlipped ? 'rotateY(0)' : 'rotateY(180deg)',
                                background: categoryColors[card.category] || 'white',
                                borderRadius: 2,
                                p: 1
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 'bold',
                                  color: 'white',
                                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                                }}
                              >
                                {card.type === "word" ? card.word : card.translation}
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{
                                  mt: 1,
                                  color: 'rgba(255,255,255,0.8)',
                                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                }}
                              >
                                {card.type === "word" ? "English" : languageInfo[language].name}
                              </Typography>

                              <Chip
                                label={card.category}
                                size="small"
                                icon={<Typography sx={{ fontSize: '0.8rem', mr: -0.5 }}>{categoryIcons[card.category]}</Typography>}
                                sx={{
                                  position: 'absolute',
                                  bottom: 5,
                                  right: 5,
                                  height: 20,
                                  fontSize: '0.6rem',
                                  bgcolor: 'rgba(255,255,255,0.3)',
                                  color: 'white'
                                }}
                              />
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    );
                  })}
                </AnimatePresence>
              </Grid>

              {/* Game completion overlay */}
              <Dialog
                open={gameComplete}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #1a237e, #283593)',
                    color: 'white',
                    overflow: 'hidden'
                  }
                }}
              >
                <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Congratulations! 🎉
                  </Typography>
                </DialogTitle>

                <DialogContent sx={{ textAlign: 'center', pt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    You've completed the memory match game!
                  </Typography>

                  {renderStars(getStarRating())}

                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    my: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }}>
                    <Typography variant="body1">
                      Final Score: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{score}</span>
                    </Typography>

                    <Typography variant="body2">
                      Moves: {moves} | Time Bonus: +{Math.round(timeRemaining * 0.5)} points
                    </Typography>

                    {score > bestScore && (
                      <Chip
                        icon={<EmojiEvents />}
                        label="New Best Score!"
                        color="secondary"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    You've learned {getPairsCount()} new words in {languageInfo[language].name}!
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<Refresh />}
                      onClick={() => {
                        shuffleCards();
                      }}
                    >
                      Play Again
                    </Button>

                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<Share />}
                      sx={{ borderColor: 'white', color: 'white' }}
                    >
                      Share Result
                    </Button>
                  </Box>
                </DialogContent>
              </Dialog>

              {/* Game over dialog */}
              <Dialog
                open={gameOver}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #b71c1c, #d32f2f)',
                    color: 'white'
                  }
                }}
              >
                <DialogTitle sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Time's Up! ⏰
                  </Typography>
                </DialogTitle>

                <DialogContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    You ran out of time!
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    my: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }}>
                    <Typography variant="body1">
                      Score: <span style={{ fontWeight: 'bold' }}>{score}</span>
                    </Typography>

                    <Typography variant="body2">
                      Matches: {matched.length / 2} of {getPairsCount()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<Refresh />}
                      onClick={() => {
                        shuffleCards();
                        setGameOver(false);
                      }}
                    >
                      Try Again
                    </Button>

                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<Settings />}
                      onClick={() => {
                        setSettingsOpen(true);
                        setGameOver(false);
                      }}
                      sx={{ borderColor: 'white', color: 'white' }}
                    >
                      Change Settings
                    </Button>
                  </Box>
                </DialogContent>
              </Dialog>

              {/* Help dialog */}
              <Dialog
                open={helpOpen}
                onClose={() => setHelpOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 2
                  }
                }}
              >
                <DialogTitle sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <HelpOutline />
                  <Typography variant="h6">How to Play Memory Match</Typography>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Game Rules:</Typography>

                  <Typography variant="body1" paragraph>
                    Memory Match is a vocabulary learning game where you match English words with their translations in your chosen language.
                  </Typography>

                  <Box component="ol" sx={{ pl: 2 }}>
                    <Typography component="li" sx={{ mb: 1 }}>
                      Click on any card to flip it and reveal the word or translation.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      Click on a second card to find its matching pair.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      If the cards match (English word + correct translation), they stay face up.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      If they don't match, both cards flip back face down.
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      Complete the game by matching all pairs before the timer runs out.
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>Scoring:</Typography>

                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Match Points:</strong> 10 points for each matched pair
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Streak Bonus:</strong> +2 points for each consecutive match
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Difficulty Bonus:</strong> Higher multiplier for harder difficulty levels
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Time Bonus:</strong> Remaining time × 0.5 points added to final score
                    </Typography>
                    <Typography component="li" sx={{ mb: 1 }}>
                      <strong>Hint Penalty:</strong> -20 points when using a hint
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>Difficulty Levels:</Typography>

                  <Grid container spacing={2}>
                    {Object.entries(difficultySettings).map(([level, settings]) => (
                      <Grid item xs={12} sm={6} md={3} key={level}>
                        <Paper sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: level === 'easy' ? '#e8f5e9' :
                            level === 'medium' ? '#e3f2fd' :
                              level === 'hard' ? '#fff3e0' : '#fce4ec'
                        }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {settings.label}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2">
                            Pairs: {settings.pairs}
                          </Typography>
                          <Typography variant="body2">
                            Time: {settings.timeLimit}s
                          </Typography>
                          <Typography variant="body2">
                            Bonus: ×{settings.bonusMultiplier}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => setHelpOpen(false)} variant="contained">
                    Got it!
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Settings dialog */}
              <Dialog
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 2
                  }
                }}
              >
                <DialogTitle sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Settings />
                  <Typography variant="h6">Game Settings</Typography>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Language</Typography>
                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 3
                  }}>
                    {Object.entries(languageInfo).map(([code, info]) => (
                      <Chip
                        key={code}
                        avatar={<Avatar>{info.flag}</Avatar>}
                        label={info.name}
                        onClick={() => setLanguage(code)}
                        color={language === code ? "primary" : "default"}
                        variant={language === code ? "filled" : "outlined"}
                        sx={{ px: 1 }}
                      />
                    ))}
                  </Box>

                  <Typography variant="h6" sx={{ mb: 2 }}>Difficulty</Typography>
                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 3
                  }}>
                    {Object.entries(difficultySettings).map(([level, settings]) => (
                      <Chip
                        key={level}
                        label={`${settings.label} (${settings.pairs} pairs)`}
                        onClick={() => setDifficulty(level)}
                        color={difficulty === level ? "secondary" : "default"}
                        variant={difficulty === level ? "filled" : "outlined"}
                      />
                    ))}
                  </Box>

                  <Typography variant="h6" sx={{ mb: 2 }}>Category Filter</Typography>
                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 3
                  }}>
                    <Chip
                      label="All Categories"
                      onClick={() => setCategoryFilter("all")}
                      color={categoryFilter === "all" ? "primary" : "default"}
                      variant={categoryFilter === "all" ? "filled" : "outlined"}
                    />

                    {getCategories().map(category => (
                      <Chip
                        key={category}
                        icon={<Typography sx={{ fontSize: '1rem' }}>{categoryIcons[category]}</Typography>}
                        label={category.charAt(0).toUpperCase() + category.slice(1)}
                        onClick={() => setCategoryFilter(category)}
                        color={categoryFilter === category ? "primary" : "default"}
                        variant={categoryFilter === category ? "filled" : "outlined"}
                      />
                    ))}
                  </Box>

                  <Typography variant="h6" sx={{ mb: 2 }}>Sound</Typography>
                  <Box sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 3
                  }}>
                    <Button
                      variant={!soundEnabled ? "contained" : "outlined"}
                      color={!soundEnabled ? "error" : "default"}
                      startIcon={<VolumeMute />}
                      onClick={() => setSoundEnabled(false)}
                      sx={{ flexGrow: 1 }}
                    >
                      Sound Off
                    </Button>
                  </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => setSettingsOpen(false)} variant="outlined">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      shuffleCards();
                      setSettingsOpen(false);
                    }}
                    variant="contained"
                    startIcon={<Refresh />}
                  >
                    Apply & Restart
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Tutorial dialog */}
              <Dialog
                open={showTutorial}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1a237e, #283593)',
                    color: 'white'
                  }
                }}
              >
                <DialogTitle sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Welcome to Memory Match! <School sx={{ ml: 1, verticalAlign: 'middle' }} />
                  </Typography>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                    Learn vocabulary by matching words with their translations
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                          <Psychology sx={{ mr: 1 }} /> How to Play
                        </Typography>
                        <Box component="ol" sx={{ pl: 2 }}>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Click on a card to flip it and see the word or translation
                          </Typography>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Find the matching pair (English word + translation)
                          </Typography>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Match all pairs before the timer runs out
                          </Typography>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Build streaks for bonus points
                          </Typography>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Use the hint button if you get stuck (costs points)
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                          <MenuBook sx={{ mr: 1 }} /> Game Features
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Choose from 4 languages: Spanish, French, German, Italian
                          </Typography>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Multiple difficulty levels with different time limits
                          </Typography>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Filter words by categories like food, animals, etc.
                          </Typography>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Track your progress for each language
                          </Typography>
                          <Typography component="li" sx={{ mb: 1 }}>
                            Compete for high scores and achievements
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{
                    mt: 4,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Ready to start learning?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Choose your language, difficulty level, and start matching cards!
                    </Typography>
                  </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                  <Button
                    onClick={() => setShowTutorial(false)}
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ px: 4 }}
                  >
                    Let's Play!
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </Fade>

          {/* Footer with stats */}
          <Fade in={true} timeout={1400}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mt: 4,
                borderRadius: 2,
                background: 'white',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents sx={{ color: 'primary.main' }} />
                <Typography variant="body2">
                  Games Won: <strong>{gameStats.gamesWon}</strong> / {gameStats.gamesPlayed}
                </Typography>
              </Box>

              <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem={!isMobile} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: 'primary.main' }} />
                <Typography variant="body2">
                  Best Streak: <strong>{gameStats.bestStreak}</strong>
                </Typography>
              </Box>

              <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem={!isMobile} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Translate sx={{ color: 'primary.main' }} />
                <Typography variant="body2">
                  Languages Practiced: <strong>{Object.keys(gameStats.languageStats).length}</strong> / 4
                </Typography>
              </Box>

              <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem={!isMobile} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology sx={{ color: 'primary.main' }} />
                <Typography variant="body2">
                  Total Score: <strong>{gameStats.totalScore}</strong>
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default MemoryMatch;


