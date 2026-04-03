import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  IconButton,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider,
  AppBar,
  Toolbar,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Tab,
  Tabs
} from "@mui/material";
import {
  VolumeUp,
  NavigateNext,
  RestartAlt,
  EmojiEvents,
  School,
  Translate,
  Language,
  FlashOn,
  CheckCircle,
  Dashboard,
  Bookmark,
  Settings,
  Person,
  Notifications,
  Menu as MenuIcon,
  ArrowBack,
  SportsEsports,
  MenuBook,
  Psychology,
  StarBorder,
  Star
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
const WORDS_PER_SESSION = 5;
// Import the wordSets from your existing code
// Language display names and accent codes
const languageInfo = {
  EnglishToKannada: { name: "Kannada", code: "kn-IN", flag: "🇮🇳", color: "#FF9933" },
  EnglishToSpanish: { name: "Spanish", code: "es-ES", flag: "🇪🇸", color: "#F1BF00" },
  EnglishToFrench: { name: "French", code: "fr-FR", flag: "🇫🇷", color: "#0055A4" },
  EnglishToGerman: { name: "German", code: "de-DE", flag: "🇩🇪", color: "#DD0000" },
  EnglishToItalian: { name: "Italian", code: "it-IT", flag: "🇮🇹", color: "#009246" },
  EnglishToJapanese: { name: "Japanese", code: "ja-JP", flag: "🇯🇵", color: "#BC002D" }
};

const FlashcardGame = () => {
  const [language, setLanguage] = useState("EnglishToSpanish");
  const [wordSets, setWordSets] = useState({});
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_URL}/games/data/FlashcardGame`);
        setWordSets(res.data);
        const allWords = res.data["EnglishToSpanish"] || [];

        // Shuffle (optional but better)
        const shuffled = allWords.sort(() => 0.5 - Math.random());

        // Take only limited words
        const sessionWords = shuffled.slice(0, WORDS_PER_SESSION);

        setWords(sessionWords);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchWords();
  }, []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [mastered, setMastered] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const { submitGameScore } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // Reset animation state after each card change
  useEffect(() => {
    setAnimation(true);
    const timer = setTimeout(() => setAnimation(false), 500);
    return () => clearTimeout(timer);
  }, [index]);

  // Show confetti when score increases by 5
  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [score]);

  // Submit score when all flashcards are mastered
  useEffect(() => {
    if (mastered.length === words.length && mastered.length > 0) {
      if (!scoreSubmitted && submitGameScore) {
        submitGameScore(score * 10, "Flashcard Game");
        setScoreSubmitted(true);
      }
    }
  }, [mastered.length, words.length, score, scoreSubmitted, submitGameScore]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageInfo[language].code;
    speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
      speak(words[index].answer);
      setIsCorrect(true);

      // Add to mastered if not already there
      if (!mastered.includes(index)) {
        setMastered([...mastered, index]);
      }
    }
  };

  const handleNext = () => {
    if (flipped) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    setFlipped(false);
    setIsCorrect(null);
    setIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handleReset = () => {
    const allWords = wordSets[language] || [];
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    const sessionWords = shuffled.slice(0, WORDS_PER_SESSION);

    setWords(sessionWords);
    setIndex(0);
    setScore(0);
    setFlipped(false);
    setIsCorrect(null);
    setStreak(0);
    setMastered([]);
    setScoreSubmitted(false);
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    const allWords = wordSets[newLanguage] || [];
    const shuffled = allWords.sort(() => 0.5 - Math.random());
    const sessionWords = shuffled.slice(0, WORDS_PER_SESSION);

    setWords(sessionWords); handleReset();
  };

  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Calculate progress percentage
  const progress = ((index + 1) / words.length) * 100;
  const masteredPercentage = (mastered.length / words.length) * 100;

  const drawer = (
    <Box sx={{ width: 250 }}>
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
        <ListItem button selected>
          <ListItemIcon>
            <MenuBook color="primary" />
          </ListItemIcon>
          <ListItemText primary="Flashcards" />
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f5f7fa',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {/* Confetti effect */}
        {showConfetti && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              zIndex: 1000,
              overflow: "hidden"
            }}
          >
            {[...Array(50)].map((_, i) => (
              <Box
                key={i}
                component={motion.div}
                sx={{
                  position: "absolute",
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  borderRadius: "50%"
                }}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  opacity: 1
                }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: 0,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  ease: "easeOut"
                }}
              />
            ))}
          </Box>
        )}

        {/* Page Header */}
        <Box
          sx={{
            py: 3,
            px: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between'
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
                Language Flashcards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Master vocabulary through interactive learning
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<EmojiEvents sx={{ color: "#FFD700 !important" }} />}
              label={`Score: ${score}`}
              sx={{
                bgcolor: "white",
                fontWeight: "bold",
                boxShadow: 1
              }}
            />

            <Chip
              icon={<FlashOn sx={{ color: "#FF4500 !important" }} />}
              label={`Streak: ${streak}`}
              sx={{
                bgcolor: "white",
                fontWeight: "bold",
                boxShadow: 1
              }}
            />
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            sx={{
              mb: 3,
              bgcolor: 'white',
              borderRadius: 1,
              boxShadow: 1,
              '& .MuiTab-root': {
                minHeight: 64,
              }
            }}
          >
            <Tab
              icon={<MenuBook />}
              label="Flashcards"
              iconPosition="start"
            />
            <Tab
              icon={<Psychology />}
              label="Practice"
              iconPosition="start"
            />
            <Tab
              icon={<StarBorder />}
              label="Mastered"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Container maxWidth="lg" sx={{ mb: 4 }}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Main Flashcard Column */}
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    background: "#ffffff",
                    position: "relative",
                    mb: 3
                  }}
                >
                  {/* Header Section */}
                  <Box
                    sx={{
                      p: { xs: 2, md: 3 },
                      background: `linear-gradient(135deg, ${languageInfo[language].color}22 0%, ${languageInfo[language].color}44 100%)`,
                      borderBottom: `4px solid ${languageInfo[language].color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>
                        {languageInfo[language].flag} {languageInfo[language].name}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${mastered.length}/${words.length} mastered`}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Box>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <Select
                        value={language}
                        onChange={handleLanguageChange}
                        displayEmpty
                        variant="outlined"
                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                      >
                        <MenuItem value="EnglishToKannada">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 1 }}>🇮🇳</Typography>
                            English to Kannada
                          </Box>
                        </MenuItem>
                        <MenuItem value="EnglishToSpanish">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 1 }}>🇪🇸</Typography>
                            English to Spanish
                          </Box>
                        </MenuItem>
                        <MenuItem value="EnglishToFrench">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 1 }}>🇫🇷</Typography>
                            English to French
                          </Box>
                        </MenuItem>
                        <MenuItem value="EnglishToGerman">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 1 }}>🇩🇪</Typography>
                            English to German
                          </Box>
                        </MenuItem>
                        <MenuItem value="EnglishToItalian">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 1 }}>🇮🇹</Typography>
                            English to Italian
                          </Box>
                        </MenuItem>
                        <MenuItem value="EnglishToJapanese">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 1 }}>🇯🇵</Typography>
                            English to Japanese
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ px: 3, pt: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Card {index + 1} of {words.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(progress)}% Complete
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
                          background: `linear-gradient(90deg, ${languageInfo[language].color}88, ${languageInfo[language].color})`,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>

                  {/* Flashcard */}
                  <Box sx={{ p: 3, perspective: "1000px" }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          animate={{ rotateY: flipped ? 180 : 0 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          style={{
                            width: "100%",
                            transformStyle: "preserve-3d",
                            position: "relative"
                          }}
                        >
                          <Box
                            onClick={handleFlip}
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: { xs: 200, sm: 250, md: 300 },
                              cursor: "pointer",
                              borderRadius: 4,
                              boxShadow: flipped
                                ? `0 10px 30px ${languageInfo[language].color}44`
                                : "0 10px 30px rgba(0,0,0,0.1)",
                              transition: "box-shadow 0.6s ease",
                            }}
                          >
                            {/* Front of card */}
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 3,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)`,
                                border: `2px solid ${languageInfo[language].color}22`,
                                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                transition: "transform 0.6s ease-in-out",
                              }}
                            >
                              <Typography
                                variant={isMobile ? "h4" : "h3"}
                                fontWeight="bold"
                                color="#333"
                                sx={{ mb: 2, textAlign: "center" }}
                              >
                                {words[index].question}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
                                Tap to reveal translation
                              </Typography>
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 16,
                                  left: 16,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1
                                }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  ENGLISH
                                </Typography>
                              </Box>
                            </Box>

                            {/* Back of card */}
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 3,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${languageInfo[language].color}22 0%, ${languageInfo[language].color}44 100%)`,
                                border: `2px solid ${languageInfo[language].color}`,
                                transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)",
                                transition: "transform 0.6s ease-in-out",
                              }}
                            >
                              <Typography
                                variant={isMobile ? "h4" : "h3"}
                                fontWeight="bold"
                                color="#333"
                                sx={{ mb: 3, textAlign: "center" }}
                              >
                                {words[index].answer}
                              </Typography>

                              <Tooltip title="Listen to pronunciation">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speak(words[index].answer);
                                  }}
                                  sx={{
                                    bgcolor: "rgba(255,255,255,0.5)",
                                    color: languageInfo[language].color,
                                    '&:hover': {
                                      bgcolor: "rgba(255,255,255,0.7)",
                                    }
                                  }}
                                >
                                  <VolumeUp />
                                </IconButton>
                              </Tooltip>

                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 16,
                                  left: 16,
                                  bgcolor: "rgba(255,255,255,0.5)",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                <Typography variant="caption" sx={{ mr: 0.5 }}>
                                  {languageInfo[language].flag}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "medium" }}>
                                  {languageInfo[language].name.toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </Box>

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      flexWrap: "wrap",
                      p: 3,
                      pt: 0
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNext}
                      endIcon={<NavigateNext />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${languageInfo[language].color}88, ${languageInfo[language].color})`,
                        boxShadow: `0 4px 10px ${languageInfo[language].color}44`,
                        fontWeight: "bold",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          background: `linear-gradient(90deg, ${languageInfo[language].color}, ${languageInfo[language].color})`,
                          transform: "translateY(-2px)",
                          boxShadow: `0 6px 15px ${languageInfo[language].color}66`,
                        }
                      }}
                    >
                      Next Card
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleReset}
                      startIcon={<RestartAlt />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        borderColor: languageInfo[language].color,
                        color: languageInfo[language].color,
                        "&:hover": {
                          borderColor: languageInfo[language].color,
                          bgcolor: `${languageInfo[language].color}11`,
                        }
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Paper>

                {/* Learning Tips */}
                <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Psychology sx={{ mr: 1, color: 'primary.main' }} />
                    Learning Tips
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                        <CheckCircle sx={{ color: "#4CAF50", mr: 1, fontSize: 18, mt: 0.3 }} />
                        <Typography variant="body2">
                          Practice daily to build your vocabulary
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                        <CheckCircle sx={{ color: "#4CAF50", mr: 1, fontSize: 18, mt: 0.3 }} />
                        <Typography variant="body2">
                          Say words out loud to improve pronunciation
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                        <CheckCircle sx={{ color: "#4CAF50", mr: 1, fontSize: 18, mt: 0.3 }} />
                        <Typography variant="body2">
                          Use new words in sentences for better retention
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                        <CheckCircle sx={{ color: "#4CAF50", mr: 1, fontSize: 18, mt: 0.3 }} />
                        <Typography variant="body2">
                          Review mastered words periodically
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} md={4}>
                {/* Progress Card */}
                <Paper elevation={2} sx={{ borderRadius: 2, p: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ mr: 1, color: '#FFD700' }} />
                    Your Progress
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Words Mastered
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {mastered.length}/{words.length} ({Math.round(masteredPercentage)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={masteredPercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(0,0,0,0.05)",
                        '& .MuiLinearProgress-bar': {
                          background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ borderRadius: 2, p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                          {score}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Score
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ borderRadius: 2, p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF4500' }}>
                          {streak}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Current Streak
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Language Stats */}
                <Paper elevation={2} sx={{ borderRadius: 2, p: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Language sx={{ mr: 1, color: languageInfo[language].color }} />
                    Language Stats
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: languageInfo[language].color,
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          mr: 1.5
                        }}
                      >
                        {languageInfo[language].flag}
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {languageInfo[language].name}
                      </Typography>
                    </Box>

                    <Box sx={{ pl: 4.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        • {mastered.length} words mastered
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        • {words.length - mastered.length} words remaining
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • {Math.round(masteredPercentage)}% complete
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Translate />}
                    sx={{
                      borderColor: languageInfo[language].color,
                      color: languageInfo[language].color,
                      "&:hover": {
                        borderColor: languageInfo[language].color,
                        bgcolor: `${languageInfo[language].color}11`,
                      }
                    }}
                  >
                    View All Languages
                  </Button>
                </Paper>

                {/* Achievement Card */}
                <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <EmojiEvents sx={{ mr: 1, color: '#FFD700' }} />
                    Achievements
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
                        mr: 2
                      }}
                    >
                      <FlashOn sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Quick Learner
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Master 10 words in a row
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      {streak >= 10 ? (
                        <CheckCircle sx={{ color: '#4CAF50' }} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {streak}/10
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #9C27B0, #673AB7)',
                        boxShadow: '0 2px 8px rgba(156, 39, 176, 0.5)',
                        mr: 2,
                        opacity: masteredPercentage >= 50 ? 1 : 0.5
                      }}
                    >
                      <School sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight="medium" sx={{ opacity: masteredPercentage >= 50 ? 1 : 0.7 }}>
                        Halfway There
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Master 50% of all words
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      {masteredPercentage >= 50 ? (
                        <CheckCircle sx={{ color: '#4CAF50' }} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(masteredPercentage)}%/50%
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Psychology sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                Practice Mode Coming Soon
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We're working on new ways to help you practice your vocabulary.
              </Typography>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <StarBorder sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                {mastered.length > 0 ? `You've mastered ${mastered.length} words!` : 'No mastered words yet'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {mastered.length > 0
                  ? 'Keep practicing to maintain your knowledge.'
                  : 'Flip cards to start mastering vocabulary.'}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default FlashcardGame;
