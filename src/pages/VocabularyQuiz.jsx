import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  LinearProgress,
  Paper,
  Chip,
  Fade,
  Grow,
  Zoom,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
  AppBar,
  Toolbar,
  Fab
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  EmojiEvents,
  School,
  Psychology,
  SportsScore,
  CheckCircle,
  Cancel,
  ArrowForward,
  Refresh,
  Timer,
  MenuBook,
  Lightbulb,
  LocalLibrary,
  Translate,
  ArrowBack,
  Home,
  Info,
  Help
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./VocabularyQuiz.css";

// Enhanced quiz data with more questions and difficulty indicators
// Difficulty level metadata
const difficultyInfo = {
  easy: {
    color: "#4CAF50",
    icon: <School />,
    description: "Basic vocabulary suitable for beginners",
    points: 5
  },
  medium: {
    color: "#FF9800",
    icon: <MenuBook />,
    description: "Intermediate vocabulary for advancing learners",
    points: 10
  },
  hard: {
    color: "#F44336",
    icon: <Psychology />,
    description: "Advanced vocabulary for proficient speakers",
    points: 15
  }
};

// Styled components with enhanced design
const OptionButton = styled(Button)(({ theme, isSelected, isCorrect, isWrong, isRevealed }) => ({
  width: "100%",
  padding: "16px 20px",
  marginBottom: "12px",
  borderRadius: "12px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "1.1rem",
  textAlign: "left",
  justifyContent: "flex-start",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
  border: "2px solid",
  borderColor: isSelected
    ? theme.palette.primary.main
    : "rgba(0,0,0,0.12)",
  backgroundColor: isRevealed
    ? isCorrect
      ? "rgba(76, 175, 80, 0.12)"
      : isWrong
        ? "rgba(244, 67, 54, 0.12)"
        : "white"
    : isSelected
      ? "rgba(25, 118, 210, 0.08)"
      : "white",
  "&:hover": {
    backgroundColor: isRevealed
      ? isCorrect
        ? "rgba(76, 175, 80, 0.18)"
        : isWrong
          ? "rgba(244, 67, 54, 0.18)"
          : "rgba(0,0,0,0.06)"
      : "rgba(0,0,0,0.06)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
  }
}));

const DifficultyCard = styled(Paper)(({ theme, difficulty }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  cursor: "pointer",
  height: "100%",
  transition: "all 0.3s ease",
  border: `2px solid ${difficultyInfo[difficulty].color}22`,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 8px 20px ${difficultyInfo[difficulty].color}33`,
    borderColor: difficultyInfo[difficulty].color
  }
}));

// New styled components for enhanced design
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(90deg, #1a237e, #283593)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
  color: "white",
  padding: theme.spacing(8, 0),
  position: "relative",
  overflow: "hidden",
  borderRadius: "0 0 20px 20px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  marginBottom: theme.spacing(6),
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  }
}));

function VocabularyQuiz() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(null);
  const [quizData, setQuizData] = useState({});
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_URL}/games/data/VocabularyQuiz`);
        setQuizData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState("");
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const { submitGameScore } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Function to navigate back to dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    if (difficulty && quizData && Object.keys(quizData).length > 0) {
      setQuestions(quizData[difficulty] || []);
      setCurrentQuestion(0);
      setScore(0);
      setMessage("");
      setIsAnswerRevealed(false);
      setQuizCompleted(false);
      setTimer(0);
      setTimerActive(true);
      setCorrectAnswers(0);
      setWrongAnswers(0);
    }
  }, [difficulty, quizData]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (quizCompleted && score > 0) {
      if (!scoreSubmitted && submitGameScore) {
        submitGameScore(score, "Vocabulary Quiz");
        setScoreSubmitted(true);
      }
    }
  }, [quizCompleted, score, scoreSubmitted, submitGameScore]);

  const checkAnswer = () => {
    setIsAnswerRevealed(true);

    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + difficultyInfo[difficulty].points);
      setMessage("Correct!");
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setMessage("Wrong!");
      setWrongAnswers(wrongAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setMessage("");
        setIsAnswerRevealed(false);
        setShowHint(false);
      } else {
        setQuizCompleted(true);
    setTimerActive(false);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setDifficulty(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setMessage("");
    setIsAnswerRevealed(false);
    setQuizCompleted(false);
    setTimer(0);
    setTimerActive(false);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setShowHint(false);
    setScoreSubmitted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Generate a simple hint
  const generateHint = () => {
    if (!questions.length || !questions[currentQuestion]) {
      return "Hint not available";
    }
    const answer = questions[currentQuestion].answer;
    return `Hint: The answer starts with "${answer[0]}" and has ${answer.length} letters`;
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><LinearProgress sx={{ width: "80%" }} /></Box>;

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Navigation Bar */}
      <StyledAppBar position="static">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back to dashboard"
              onClick={goToDashboard}
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
            <LocalLibrary sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              WordMaster
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" startIcon={<Home />} onClick={goToDashboard}>Dashboard</Button>
            <Button color="inherit" startIcon={<MenuBook />}>Lessons</Button>
            <Button color="inherit" startIcon={<Psychology />}>Practice</Button>
            <Button color="inherit" startIcon={<Info />}>About</Button>
            <Button color="inherit" startIcon={<Help />}>Help</Button>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit">
              <MenuBook />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {!difficulty && (
        <HeroSection>
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  Enhance Your Vocabulary
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                  Test and improve your word knowledge with our interactive vocabulary challenges
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#4CAF50",
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#388E3C" }
                  }}
                  onClick={() => document.getElementById("quiz-section").scrollIntoView({ behavior: "smooth" })}
                >
                  Start Learning
                </Button>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                <img
                  src="https://img.freepik.com/free-vector/english-teacher-concept-illustration_114360-7477.jpg"
                  alt="Vocabulary Learning"
                  style={{ maxWidth: "100%", height: "auto", maxHeight: "300px" }}
                />
              </Grid>
            </Grid>
          </Container>
        </HeroSection>
      )}

      <Container maxWidth="lg" id="quiz-section" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4, md: 5 } }}>
        {!difficulty && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" fontWeight="bold" textAlign="center" gutterBottom>
              Why Improve Your Vocabulary?
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4, maxWidth: 800, mx: "auto" }}>
              A rich vocabulary enhances your communication skills, boosts confidence, and opens doors to better academic and professional opportunities.
            </Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard elevation={2}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Avatar sx={{ bgcolor: "#3f51b5", width: 60, height: 60, mb: 2 }}>
                      <School sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Learn New Words
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expand your vocabulary with carefully selected words across different difficulty levels
                    </Typography>
                  </Box>
                </FeatureCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard elevation={2}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Avatar sx={{ bgcolor: "#f44336", width: 60, height: 60, mb: 2 }}>
                      <Psychology sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Test Your Knowledge
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Challenge yourself with quizzes that adapt to your skill level
                    </Typography>
                  </Box>
                </FeatureCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard elevation={2}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Avatar sx={{ bgcolor: "#ff9800", width: 60, height: 60, mb: 2 }}>
                      <Translate sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Improve Communication
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Express yourself more clearly and effectively in both speaking and writing
                    </Typography>
                  </Box>
                </FeatureCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FeatureCard elevation={2}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Avatar sx={{ bgcolor: "#4caf50", width: 60, height: 60, mb: 2 }}>
                      <EmojiEvents sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Track Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      See your improvement over time with detailed performance metrics
                    </Typography>
                  </Box>
                </FeatureCard>
              </Grid>
            </Grid>
          </Box>
        )}

        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            mb: 6
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              background: "linear-gradient(90deg, #3f51b5, #2196f3)",
              color: "white",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
                top: "-100px",
                right: "-50px"
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
                bottom: "-70px",
                left: "20%"
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocalLibrary sx={{ fontSize: 32, mr: 1.5 }} />
                <Typography variant={isMobile ? "h5" : "h4"} component="h1" fontWeight="bold">
                  Vocabulary Quiz
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: "600px" }}>
                Test your word knowledge with our interactive vocabulary challenges
              </Typography>

              {difficulty && !quizCompleted && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip
                    icon={difficultyInfo[difficulty].icon}
                    label={`${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`}
                    sx={{
                      bgcolor: `${difficultyInfo[difficulty].color}22`,
                      color: "white",
                      borderColor: "white",
                      border: "1px solid"
                    }}
                  />

                  <Chip
                    icon={<SportsScore />}
                    label={`Score: ${score}`}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      borderColor: "white",
                      border: "1px solid"
                    }}
                  />

                  <Chip
                    icon={<Timer />}
                    label={`Time: ${formatTime(timer)}`}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      borderColor: "white",
                      border: "1px solid"
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {!difficulty ? (
              <Fade in={true} timeout={800}>
                <Box>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}>
                    Select Difficulty Level
                  </Typography>

                  <Grid container spacing={3} justifyContent="center">
                    {Object.keys(difficultyInfo).map((level) => (
                      <Grid item xs={12} sm={4} key={level}>
                        <Zoom in={true} style={{ transitionDelay: `${Object.keys(difficultyInfo).indexOf(level) * 100}ms` }}>
                          <DifficultyCard
                            elevation={2}
                            difficulty={level}
                            onClick={() => setDifficulty(level)}
                          >
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                              <Avatar
                                sx={{
                                  bgcolor: difficultyInfo[level].color,
                                  width: 60,
                                  height: 60,
                                  mb: 2
                                }}
                              >
                                {React.cloneElement(difficultyInfo[level].icon, { sx: { fontSize: 30 } })}
                              </Avatar>

                              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </Typography>

                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {difficultyInfo[level].description}
                              </Typography>

                              <Chip
                                label={`${difficultyInfo[level].points} points per correct answer`}
                                size="small"
                                sx={{ bgcolor: `${difficultyInfo[level].color}22`, color: difficultyInfo[level].color }}
                              />
                            </Box>
                          </DifficultyCard>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            ) : quizCompleted ? (
              <Fade in={true} timeout={800}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <EmojiEvents sx={{ fontSize: 80, color: "#FFD700", mb: 2 }} />
                  </motion.div>

                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                    Quiz Completed!
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    You've completed the {difficulty} level quiz. Here's your performance:
                  </Typography>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                      { label: "Total Score", value: score, color: "primary.main", icon: <SportsScore /> },
                      { label: "Correct", value: correctAnswers, color: "#4CAF50", icon: <CheckCircle /> },
                      { label: "Wrong", value: wrongAnswers, color: "#F44336", icon: <Cancel /> },
                      { label: "Time", value: formatTime(timer), color: "#FF9800", icon: <Timer /> }
                    ].map((stat, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 2,
                            height: "100%",
                            borderRadius: 3,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: `2px solid ${stat.color}22`
                          }}
                        >
                          {React.cloneElement(stat.icon, {
                            sx: { fontSize: 32, color: stat.color, mb: 1 }
                          })}
                          <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ mt: 3, mb: 4 }}>
                    <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
                      Accuracy Rate
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(correctAnswers / questions.length) * 100}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: "rgba(0,0,0,0.05)",
                            '& .MuiLinearProgress-bar': {
                              background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
                              borderRadius: 5
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round((correctAnswers / questions.length) * 100)}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Refresh />}
                      onClick={() => {
                        setQuizCompleted(false);
                        setCurrentQuestion(0);
                        setScore(0);
                        setSelectedOption(null);
                        setMessage("");
                        setIsAnswerRevealed(false);
                        setTimer(0);
                        setTimerActive(true);
                        setCorrectAnswers(0);
                        setWrongAnswers(0);
                      }}
                      sx={{
                        py: 1.2,
                        px: 3,
                        borderRadius: 2
                      }}
                    >
                      Retry Quiz
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={resetQuiz}
                      sx={{
                        py: 1.2,
                        px: 3,
                        borderRadius: 2
                      }}
                    >
                      Choose Another Level
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Home />}
                      onClick={goToDashboard}
                      sx={{
                        py: 1.2,
                        px: 3,
                        borderRadius: 2
                      }}
                    >
                      Return to Dashboard
                    </Button>
                  </Box>
                </Box>
              </Fade>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Box>
                    {/* Progress bar */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                        alignItems: "center"
                      }}>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color="text.secondary"
                        >
                          Question {currentQuestion + 1} of {questions.length}
                        </Typography>
                        <Chip
                          label={`${Math.round(progress)}% Complete`}
                          size="small"
                          sx={{
                            bgcolor: `${difficultyInfo[difficulty].color}22`,
                            color: difficultyInfo[difficulty].color,
                            fontWeight: "medium"
                          }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, 
                              ${difficultyInfo[difficulty].color}88, 
                              ${difficultyInfo[difficulty].color})`,
                            borderRadius: 5,
                            transition: 'transform 0.4s ease'
                          }
                        }}
                      />
                    </Box>

                    {/* Question and Options Section */}
                    {questions.length > 0 && questions[currentQuestion] ? (
                      <>
                        {/* Question */}
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          sx={{ mb: 3 }}
                        >
                          {questions[currentQuestion].question}
                        </Typography>

                        {/* Options - ONLY ONE INSTANCE */}
                        <Box sx={{ mb: 4 }}>
                          {questions[currentQuestion].options.map((option, index) => (
                            <OptionButton
                              key={index}
                              onClick={() => setSelectedOption(option)}
                              isSelected={selectedOption === option}
                              isCorrect={option === questions[currentQuestion].answer}
                              isWrong={selectedOption === option && option !== questions[currentQuestion].answer}
                              isRevealed={isAnswerRevealed}
                              disabled={isAnswerRevealed}
                              startIcon={
                                isAnswerRevealed && option === questions[currentQuestion].answer ? (
                                  <CheckCircle sx={{ color: "#4CAF50" }} />
                                ) : isAnswerRevealed && selectedOption === option ? (
                                  <Cancel sx={{ color: "#F44336" }} />
                                ) : null
                              }
                            >
                              {option}
                            </OptionButton>
                          ))}
                        </Box>

                        {/* Message and Hint Section */}
                        {message && (
                          <Fade in={!!message}>
                            <Box sx={{
                              mb: 3,
                              p: 2,
                              borderRadius: 2,
                              bgcolor: message === "Correct!" ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                              border: `1px solid ${message === "Correct!" ? "#4CAF50" : "#F44336"}22`
                            }}>
                              <Typography
                                variant="body1"
                                fontWeight="medium"
                                color={message === "Correct!" ? "#4CAF50" : "#F44336"}
                              >
                                {message === "Correct!" ? (
                                  <CheckCircle sx={{ verticalAlign: "middle", mr: 1, fontSize: 20 }} />
                                ) : (
                                  <Cancel sx={{ verticalAlign: "middle", mr: 1, fontSize: 20 }} />
                                )}
                                {message}
                                {message === "Wrong!" && (
                                  <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                                    The correct answer is: <strong>{questions[currentQuestion].answer}</strong>
                                  </Typography>
                                )}
                              </Typography>
                            </Box>
                          </Fade>
                        )}

                        {/* Show hint section */}
                        {!isAnswerRevealed && (
                          <Box sx={{ mb: 3 }}>
                            {showHint ? (
                              <Fade in={showHint}>
                                <Paper
                                  elevation={1}
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "rgba(255, 193, 7, 0.1)",
                                    border: "1px solid rgba(255, 193, 7, 0.3)"
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ display: "flex", alignItems: "center" }}
                                  >
                                    <Lightbulb sx={{ color: "#FFC107", mr: 1, fontSize: 20 }} />
                                    {generateHint()}
                                  </Typography>
                                </Paper>
                              </Fade>
                            ) : (
                              <Button
                                variant="text"
                                color="warning"
                                size="small"
                                startIcon={<Lightbulb />}
                                onClick={() => setShowHint(true)}
                                sx={{ textTransform: "none" }}
                              >
                                Need a hint?
                              </Button>
                            )}
                          </Box>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                          <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={resetQuiz}
                            sx={{ borderRadius: 2 }}
                          >
                            Exit Quiz
                          </Button>

                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForward />}
                            onClick={checkAnswer}
                            disabled={!selectedOption || isAnswerRevealed}
                            sx={{
                              px: 4,
                              borderRadius: 2,
                              background: isAnswerRevealed ?
                                "linear-gradient(90deg, #9C27B0, #673AB7)" :
                                "linear-gradient(90deg, #1976d2, #42a5f5)"
                            }}
                          >
                            {isAnswerRevealed ? "Next" : "Check Answer"}
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="body1">Loading questions...</Typography>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </AnimatePresence>
            )}
          </Box>
        </Paper>

        {/* Footer Section */}
        <Box sx={{ textAlign: "center", mt: 6, color: "text.secondary" }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            © 2025 WordMaster Vocabulary Quiz | All Rights Reserved
          </Typography>
          <Typography variant="caption">
            Designed to help you expand your vocabulary and improve language skills
          </Typography>
        </Box>
      </Container>

      {/* Floating back button for mobile accessibility */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000,
          display: { xs: 'block', md: 'none' } // Only show on mobile
        }}
      >
        <Tooltip title="Back to Dashboard">
          <Fab
            color="primary"
            aria-label="back to dashboard"
            onClick={goToDashboard}
            sx={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)'
            }}
          >
            <ArrowBack />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default VocabularyQuiz;

