import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Button,
  TextField,
  Container,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Badge,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from "@mui/material";
// In your imports section, remove Eco from the list
import {
  LightbulbOutlined,
  SkipNext,
  ArrowBack,
  Check,
  EmojiEvents,
  Refresh,
  VolumeUp,
  Close,
  Help,
  MenuBook,
  Settings,
  Person,
  Dashboard,
  SportsEsports,
  Bookmark,
  Notifications,
  Menu as MenuIcon,
  Psychology,
  FlashOn,
  School,
  Translate,
  StarBorder,
  Star,
  TrendingUp,
  Timer,
  Category,
  // Add missing icon imports
  Restaurant,
  // Remove Eco from here
  Pets,
  Public,
  Devices,
  MusicNote,
  WbSunny,
  History,
  Work,
  DirectionsCar,
  LocationOn,
  Science,
  Terrain,
  SportsSoccer,
  Palette,
  // Add a replacement icon for Nature category
  Park
} from "@mui/icons-material";

import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import "./WordPuzzleGame.css";


const shuffleWord = (word) => {
  let shuffled = word.split("").sort(() => 0.5 - Math.random()).join("");
  while (shuffled === word) {
    shuffled = word.split("").sort(() => 0.5 - Math.random()).join("");
  }
  return shuffled;
};

// Difficulty level colors and labels
const difficultyInfo = {
  easy: { color: "#4caf50", label: "Easy" },
  medium: { color: "#ff9800", label: "Medium" },
  hard: { color: "#f44336", label: "Hard" }
};

// Category icons mapping
const categoryIcons = {
  Food: <Restaurant fontSize="small" />,
  Nature: <Park fontSize="small" />, // Replace Eco with Park
  Objects: <Category fontSize="small" />,
  Animals: <Pets fontSize="small" />,
  Space: <Public fontSize="small" />,
  Technology: <Devices fontSize="small" />,
  Music: <MusicNote fontSize="small" />,
  Weather: <WbSunny fontSize="small" />,
  History: <History fontSize="small" />,
  Profession: <Work fontSize="small" />,
  Transportation: <DirectionsCar fontSize="small" />,
  Places: <LocationOn fontSize="small" />,
  Science: <Science fontSize="small" />,
  Geography: <Terrain fontSize="small" />,
  Sports: <SportsSoccer fontSize="small" />,
  Art: <Palette fontSize="small" />,
  Games: <SportsEsports fontSize="small" />
};

const WordPuzzleGame = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [message, setMessage] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [letterHints, setLetterHints] = useState([]);
  const [timeLeft, setTimeLeft] = useState(100);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [letterAnimation, setLetterAnimation] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const { submitGameScore } = useAuth();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  const inputRef = useRef(null);
  const windowSize = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const startTimeRef = useRef(Date.now());

  // Initialize game
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_URL}/games/data/WordPuzzleGame`);
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
  }, [currentIndex, words]);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setIsTimerRunning(false);
          setMessage("Time's up! Try again.");
          setStreak(0);
          return 0;
        }
        return prev - 0.5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Check if all words are completed
  useEffect(() => {
    if (score === words.length) {
      setGameCompleted(true);
      setShowConfetti(true);
      if (!scoreSubmitted && submitGameScore) {
        submitGameScore(points, "Word Puzzle Game");
        setScoreSubmitted(true);
      }
    }
  }, [score, points, scoreSubmitted, submitGameScore, words.length]);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      windowSize.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkAnswer = () => {
    if (input.toLowerCase() === words[currentIndex].word) {
      // Calculate time taken
      const timeTaken = (Date.now() - startTimeRef.current) / 1000;

      // Update score and streak
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);

      // Calculate points based on time and hint usage
      const timeBonus = Math.max(0, Math.floor((100 - timeTaken) / 2));
      const hintPenalty = hintUsed ? -10 : 0;
      const wordPoints = 20 + timeBonus + hintPenalty;

      setPoints((prev) => prev + wordPoints);

      // Show success feedback
      setMessage(`Correct! +${wordPoints} points`);
      setShowConfetti(true);
      setLetterAnimation(true);

      setTimeout(() => {
        setShowConfetti(false);
        nextQuestion();
        setLetterAnimation(false);
      }, 2000);
    } else {
      setMessage("Try again!");
      setStreak(0);
      // Shake animation for wrong answer
      setLetterAnimation(true);
      setTimeout(() => setLetterAnimation(false), 500);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setInput("");
      setMessage("");
      setHintUsed(false);
      setTimeLeft(100);
      setIsTimerRunning(true);
      setSelectedLetters([]);
      setLetterHints(Array(words[currentIndex + 1].word.length).fill(false));
    } else {
      setGameCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setInput("");
      setMessage("");
      setHintUsed(false);
      setTimeLeft(100);
      setIsTimerRunning(true);
      setSelectedLetters([]);
      setLetterHints(Array(words[currentIndex - 1].word.length).fill(false));
    }
  };

  const revealLetter = () => {
    const currentWord = words[currentIndex].word;
    const newLetterHints = [...letterHints];

    // Find the first unrevealed letter
    const firstUnrevealedIndex = newLetterHints.findIndex(hint => !hint);

    if (firstUnrevealedIndex !== -1) {
      newLetterHints[firstUnrevealedIndex] = true;
      setLetterHints(newLetterHints);

      // Update input with revealed letter
      const inputChars = input.split('');
      inputChars[firstUnrevealedIndex] = currentWord[firstUnrevealedIndex];
      setInput(inputChars.join(''));

      setHintUsed(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setInput("");
    setHintUsed(false);
    setMessage("");
    setScore(0);
    setTimeLeft(100);
    setIsTimerRunning(true);
    setGameCompleted(false);
    setScoreSubmitted(false);
    setLetterHints(Array(words[0].word.length).fill(false));
    setScrambledWord(shuffleWord(words[0].word));
    setSelectedLetters([]);
    setStreak(0);
    setPoints(0);
    startTimeRef.current = Date.now();
  };

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(words[currentIndex].word);
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const handleLetterClick = (letter, index) => {
    if (!selectedLetters.includes(index)) {
      setSelectedLetters([...selectedLetters, index]);
      setInput(input + letter);
    }
  };

  const handleClearInput = () => {
    setInput("");
    setSelectedLetters([]);
  };

  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Calculate progress
  const progress = (currentIndex / words.length) * 100;

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    return difficultyInfo[difficulty]?.color || "#2196f3";
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    return categoryIcons[category] || <Category fontSize="small" />;
  };

  // Calculate stats
  const calculateStats = () => {
    const totalWords = words.length;
    const completedWords = score;
    const completionPercentage = (completedWords / totalWords) * 100;
    
    const categoryCounts = {};
    const difficultyCounts = {};
    
    words.forEach(word => {
      if (!categoryCounts[word.category]) categoryCounts[word.category] = 0;
      if (!difficultyCounts[word.difficulty]) difficultyCounts[word.difficulty] = 0;
      
      categoryCounts[word.category]++;
      difficultyCounts[word.difficulty]++;
    });
    
    return {
      totalWords,
      completedWords,
      completionPercentage,
      categoryCounts,
      difficultyCounts
    };
  };

  const stats = calculateStats();

  // Drawer content
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SportsEsports sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          GameLang
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="My Courses" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <MenuBook />
          </ListItemIcon>
          <ListItemText primary="Flashcards" />
        </ListItem>
        <ListItem button selected>
          <ListItemIcon>
            <Psychology color="primary" />
          </ListItemIcon>
          <ListItemText primary="Word Puzzles" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText primary="Saved Items" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => setStatsDialogOpen(true)}>
          <ListItemIcon>
            <TrendingUp />
          </ListItemIcon>
          <ListItemText primary="Statistics" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Box>
  );

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><LinearProgress sx={{ width: "80%" }} /></Box>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <SportsEsports sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              GameLang
            </Typography>
          </Box>
          
          {/* Streak display */}
          {streak > 0 && (
            <Chip
              icon={<FlashOn sx={{ color: '#FF4500 !important' }} />}
              label={`Streak: ${streak}`}
              sx={{ 
                mr: 2,
                bgcolor: "white", 
                fontWeight: "bold",
                boxShadow: 1
              }}
            />
          )}
          
          {/* Points display */}
          <Chip 
            icon={<Star sx={{ color: "#FFD700 !important" }} />}
            label={`${points} pts`}
            sx={{ 
              mr: 2,
              bgcolor: "white", 
              fontWeight: "bold",
              boxShadow: 1
            }}
          />
          
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }} alt="User Profile" src="/user-avatar.jpg" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>

      {/* Confetti effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.current.width}
          height={windowSize.current.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: -250,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            opacity: 0.4,
            filter: 'blur(60px)',
            animation: 'float 15s ease-in-out infinite',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -200,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            opacity: 0.4,
            filter: 'blur(60px)',
            animation: 'float 20s ease-in-out infinite reverse',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            opacity: 0.4,
            filter: 'blur(60px)',
            animation: 'float 18s ease-in-out infinite 2s',
            zIndex: 0
          }}
        />

        {/* Page Header */}
        <Box 
          sx={{ 
            width: '100%',
            maxWidth: 1200,
            mb: 3,
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
            <IconButton 
              sx={{ mr: 1, bgcolor: 'white', boxShadow: 1 }}
              onClick={() => window.history.back()}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" component="h1" fontWeight="bold">
                Word Puzzle Challenge
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unscramble words to improve your vocabulary
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              icon={<EmojiEvents sx={{ color: "#FFD700 !important" }} />}
              label={`Score: ${score}/${words.length}`}
              sx={{ 
                bgcolor: "white", 
                fontWeight: "bold",
                boxShadow: 1
              }}
            />
            
            <IconButton 
              sx={{ bgcolor: 'white', boxShadow: 1 }}
              onClick={() => setHelpDialogOpen(true)}
            >
              <Help />
            </IconButton>
          </Box>
        </Box>

        {/* Main Game Content */}
        <Container maxWidth="lg" sx={{ zIndex: 1 }}>
          {gameCompleted ? (
            <Zoom in={gameCompleted}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  maxWidth: 600,
                  mx: 'auto',
                  textAlign: 'center',
                  p: 4
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <EmojiEvents 
                    sx={{ 
                      fontSize: 80, 
                      color: '#FFD700',
                      mb: 2,
                      animation: 'bounce 2s infinite'
                    }} 
                  />
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    Congratulations!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    You've completed all word puzzles!
                  </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Final Score
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {score}/{words.length}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Points Earned
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFD700' }}>
                        {points}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Best Streak
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF4500' }}>
                        {streak}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={resetGame}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                      boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
                      fontWeight: "bold",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                        transform: "translateY(-2px)",
                        boxShadow: '0 6px 16px rgba(79, 172, 254, 0.5)',
                      }
                    }}
                  >
                    Play Again
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Dashboard />}
                    onClick={() => { window.location.href = '/dashboard' }}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      fontWeight: "bold",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    Return to Dashboard
                  </Button>
                </Box>
              </Paper>
            </Zoom>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    background: "#ffffff",
                    position: "relative",
                    mb: 3
                  }}
                >
                  {/* Card Header */}
                  <Box
                    sx={{
                      p: { xs: 2, md: 3 },
                      background: 'linear-gradient(135deg, #2a3f5f, #5d7eaf)',
                      color: 'white',
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 600, letterSpacing: 1, mb: 1 }}>
                          PUZZLE {currentIndex + 1} OF {words.length}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          Unscramble the Word
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={difficultyInfo[words[currentIndex].difficulty].label}
                        sx={{ 
                          bgcolor: getDifficultyColor(words[currentIndex].difficulty),
                          color: 'white',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          height: 28
                        }}
                      />
                    </Box>
                    
                    <Chip
                      icon={getCategoryIcon(words[currentIndex].category)}
                      label={words[currentIndex].category}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        mb: 2
                      }}
                    />
                    
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Timer sx={{ fontSize: 16, mr: 0.5 }} /> Time Remaining
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {Math.round(timeLeft)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={timeLeft} 
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "rgba(255,255,255,0.3)",
                          '& .MuiLinearProgress-bar': {
                            bgcolor: timeLeft < 30 ? '#f44336' : '#4caf50',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <Box sx={{ p: 3 }}>
                    {/* Scrambled word display */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                        Tap the letters to form a word
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center',
                        gap: 1.5,
                        mb: 2
                      }}>
                        {scrambledWord.split('').map((letter, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              width: 50,
                              height: 50,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: selectedLetters.includes(index) 
                                ? 'rgba(0,0,0,0.1)' 
                                : 'linear-gradient(135deg, #f5f7fa, #e4e8ef)',
                              borderRadius: 10,
                              boxShadow: selectedLetters.includes(index) 
                                ? 'none' 
                                : '0 4px 8px rgba(0,0,0,0.1)',
                              cursor: 'pointer',
                              userSelect: 'none',
                              opacity: selectedLetters.includes(index) ? 0.5 : 1,
                              transform: selectedLetters.includes(index) ? 'scale(0.9)' : 'scale(1)'
                            }}
                            onClick={() => handleLetterClick(letter, index)}
                          >
                            <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ textTransform: 'uppercase' }}>
                              {letter}
                            </Typography>
                          </motion.div>
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Tooltip title="Hear pronunciation">
                          <IconButton onClick={speakWord} sx={{ color: '#5d7eaf' }}>
                            <VolumeUp />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Clear input">
                          <IconButton onClick={handleClearInput} sx={{ color: '#f44336' }}>
                            <Close />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Answer display */}
                    <Box sx={{ mb: 3 }}>
                      <Box 
                        sx={{ 
                          minHeight: 60,
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          gap: 1,
                          p: 2,
                          bgcolor: 'rgba(93, 126, 175, 0.1)',
                          borderRadius: 2,
                          mb: 2,
                          animation: letterAnimation 
                            ? message.includes('Correct') 
                              ? 'correctShake 0.5s ease' 
                              : 'wrongShake 0.5s ease'
                            : 'none'
                        }}
                      >
                        {input ? input.split('').map((letter, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'white',
                              borderRadius: 1,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ textTransform: 'uppercase' }}>
                              {letter}
                            </Typography>
                          </Box>
                        )) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Your answer will appear here
                          </Typography>
                        )}
                      </Box>
                                            {/* Message display */}
                      {message && (
                        <Fade in={Boolean(message)}>
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2,
                              textAlign: 'center',
                              bgcolor: message.includes('Correct') 
                                ? 'rgba(76, 175, 80, 0.1)' 
                                : 'rgba(244, 67, 54, 0.1)',
                              border: message.includes('Correct')
                                ? '1px solid rgba(76, 175, 80, 0.3)'
                                : '1px solid rgba(244, 67, 54, 0.3)',
                              color: message.includes('Correct') ? '#4caf50' : '#f44336',
                              fontWeight: 'medium'
                            }}
                          >
                            <Typography variant="body1" fontWeight="medium">
                              {message}
                            </Typography>
                          </Box>
                        </Fade>
                      )}
                    </Box>

                    {/* Hint display */}
                    <Box sx={{ mb: 3 }}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'rgba(255, 193, 7, 0.1)',
                          border: '1px solid rgba(255, 193, 7, 0.3)'
                        }}
                      >
                        <LightbulbOutlined sx={{ color: '#ffc107', mr: 1.5, fontSize: 24 }} />
                        <Typography variant="body1" color="#5d4037" fontWeight="medium">
                          {words[currentIndex].hint}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action buttons */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={checkAnswer}
                        startIcon={<Check />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 30,
                          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                          boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
                          fontWeight: "bold",
                          textTransform: 'none',
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                            transform: "translateY(-2px)",
                            boxShadow: '0 6px 16px rgba(79, 172, 254, 0.5)',
                          }
                        }}
                      >
                        Check Answer
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="medium"
                        onClick={revealLetter}
                        startIcon={<LightbulbOutlined />}
                        disabled={hintUsed}
                        sx={{
                          py: 1,
                          px: 3,
                          borderRadius: 30,
                          borderColor: '#ff9800',
                          color: '#ff9800',
                          textTransform: 'none',
                          fontWeight: "medium",
                          "&:hover": {
                            borderColor: '#ff9800',
                            bgcolor: 'rgba(255, 152, 0, 0.1)',
                          },
                          "&.Mui-disabled": {
                            borderColor: 'rgba(255, 152, 0, 0.3)',
                            color: 'rgba(255, 152, 0, 0.3)',
                          }
                        }}
                      >
                        {hintUsed ? "Hint Used" : "Get a Hint"}
                      </Button>
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Button
                          variant="outlined"
                          size="medium"
                          onClick={prevQuestion}
                          disabled={currentIndex === 0}
                          sx={{
                            flex: 1,
                            py: 1,
                            borderRadius: 30,
                            borderColor: '#5d7eaf',
                            color: '#5d7eaf',
                            textTransform: 'none',
                            fontWeight: "medium",
                            "&:hover": {
                              borderColor: '#5d7eaf',
                              bgcolor: 'rgba(93, 126, 175, 0.1)',
                            },
                            "&.Mui-disabled": {
                              borderColor: 'rgba(93, 126, 175, 0.3)',
                              color: 'rgba(93, 126, 175, 0.3)',
                            }
                          }}
                        >
                          Previous Word
                        </Button>
                        
                        <Button
                          variant="outlined"
                          size="medium"
                          onClick={nextQuestion}
                          disabled={currentIndex === words.length - 1}
                          endIcon={<SkipNext />}
                          sx={{
                            flex: 1,
                            py: 1,
                            borderRadius: 30,
                            borderColor: '#5d7eaf',
                            color: '#5d7eaf',
                            textTransform: 'none',
                            fontWeight: "medium",
                            "&:hover": {
                              borderColor: '#5d7eaf',
                              bgcolor: 'rgba(93, 126, 175, 0.1)',
                            },
                            "&.Mui-disabled": {
                              borderColor: 'rgba(93, 126, 175, 0.3)',
                              color: 'rgba(93, 126, 175, 0.3)',
                            }
                          }}
                        >
                          Skip to Next
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  {/* Card Footer */}
                  <Box sx={{ p: 2, bgcolor: '#f5f7fa' }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {Math.round(progress)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "rgba(0,0,0,0.05)",
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>
                </Paper>

                {/* Stats Card */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={2}
                      sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        p: 3
                      }}
                    >
                      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                        Your Progress
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(79, 172, 254, 0.1)', borderRadius: 2 }}>
                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                              {score}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Words Solved
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 193, 7, 0.1)', borderRadius: 2 }}>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#ff9800' }}>
                              {words.length - score}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Words Remaining
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Completion
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {Math.round(progress)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "rgba(0,0,0,0.05)",
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={2}
                      sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        p: 3
                      }}
                    >
                      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <EmojiEvents sx={{ mr: 1, color: '#FFD700' }} />
                        Game Stats
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFD700' }}>
                              {points}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Points
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF4500' }}>
                              {streak}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Current Streak
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight="bold" color="text.primary">
                              {timeLeft > 0 ? Math.round(timeLeft) : 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Time Left
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </motion.div>
            </AnimatePresence>
          )}
        </Container>
      </Box>

      {/* Help Dialog */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Help sx={{ mr: 1 }} />
            How to Play
          </Box>
          <IconButton 
            onClick={() => setHelpDialogOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Welcome to Word Puzzle Challenge! This game helps you improve your vocabulary through fun word puzzles.
          </Typography>
          
          <Typography variant="h6" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
            Game Rules:
          </Typography>
          <ol>
            <li>
              <Typography variant="body1" paragraph>
                You'll be presented with scrambled letters that form a word.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Tap on the letters to form the correct word.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Use the hint if you're stuck - but you'll earn fewer points.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Complete words quickly to earn more points and build your streak.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Watch the timer - if it runs out, you'll lose your streak!
              </Typography>
            </li>
          </ol>
          
          <Typography variant="h6" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
            Scoring:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1" paragraph>
                Base points: 20 points per word
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Time bonus: Up to 50 extra points for solving quickly
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Hint penalty: -10 points if you use a hint
              </Typography>
            </li>
          </ul>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f5f7fa' }}>
          <Button 
            onClick={() => setHelpDialogOpen(false)}
            variant="contained"
            sx={{
              borderRadius: 30,
              background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
              textTransform: 'none',
              px: 3
            }}
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog
        open={statsDialogOpen}
        onClose={() => setStatsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1 }} />
            Game Statistics
          </Box>
          <IconButton 
            onClick={() => setStatsDialogOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Overall Progress
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Completion
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {Math.round(stats.completionPercentage)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={stats.completionPercentage} 
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(0,0,0,0.05)",
                mb: 2,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                  borderRadius: 4
                }
              }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(79, 172, 254, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {stats.completedWords}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Words Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 193, 7, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#ff9800' }}>
                    {stats.totalWords}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Words
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Word Categories
            </Typography>
            
            <Grid container spacing={1}>
              {Object.entries(stats.categoryCounts).map(([category, count]) => (
                <Grid item xs={6} key={category}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'rgba(0,0,0,0.02)'
                  }}>
                    {getCategoryIcon(category)}
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {count} words
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Difficulty Levels
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(stats.difficultyCounts).map(([difficulty, count]) => (
                <Grid item xs={4} key={difficulty}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: `${getDifficultyColor(difficulty)}22`
                  }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: getDifficultyColor(difficulty) }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: getDifficultyColor(difficulty) }}>
                      {difficultyInfo[difficulty].label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f5f7fa' }}>
          <Button 
            onClick={() => setStatsDialogOpen(false)}
            variant="contained"
            sx={{
              borderRadius: 30,
              background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
              textTransform: 'none',
              px: 3
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WordPuzzleGame;
