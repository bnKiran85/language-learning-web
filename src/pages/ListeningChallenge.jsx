// src/pages/ListeningChallenge.jsx
import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    IconButton,
    Tooltip,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    LinearProgress,
    Chip,
    Fab,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Skeleton,
    Alert,
    Snackbar,
    ButtonGroup,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    ListItemIcon,
    useMediaQuery,
} from "@mui/material";
import {
    VolumeUp,
    Check,
    Close,
    Refresh,
    ArrowBack,
    Help,
    Language,
    Settings,
    Info,
    CloudDownload,
    Share as ShareIcon,
    Speed as SpeedIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { styled, useTheme } from "@mui/material/styles";
import "./ListeningChallenge.css";

// Styled components
const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
}));

const GlassCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    padding: theme.spacing(3),
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${LinearProgress.determinate}`]: {
        backgroundColor: theme.palette.grey[200],
    },
    "& .MuiLinearProgress-bar": {
        borderRadius: 5,
    },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    },
    "&:active": {
        transform: "translateY(-1px)",
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
    },
}));

const ListeningChallenge = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Voice options
    const voiceOptions = {
        es: { value: "es-ES", name: "Spanish", flag: "🇪🇸" },
        fr: { value: "fr-FR", name: "French", flag: "🇫🇷" },
        de: { value: "de-DE", name: "German", flag: "🇩🇪" },
        it: { value: "it-IT", name: "Italian", flag: "🇮🇹" },
    };

    // State variables
    const [selectedVoice, setSelectedVoice] = useState("es-ES");
    const [currentPhrase, setCurrentPhrase] = useState("");
    const [userInput, setUserInput] = useState("");
    const [result, setResult] = useState(null);
    const [score, setScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [helpOpen, setHelpOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [speechRate, setSpeechRate] = useState(0.8);
    const [difficulty, setDifficulty] = useState("medium");
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(
        localStorage.getItem("listeningBestStreak")
            ? parseInt(localStorage.getItem("listeningBestStreak"))
            : 0
    );
    const [anchorEl, setAnchorEl] = useState(null);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [phrases, setPhrases] = useState({});
    const [loading, setLoading] = useState(true);
    const { submitGameScore } = useAuth();
    
    // Support caps and game over state
    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                const res = await axios.get(`${API_URL}/games/data/ListeningChallenge`);
                setPhrases(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const MAX_PHRASES = 5;
    const [gameOver, setGameOver] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false);


    // References
    const inputRef = useRef(null);
    const synth = window.speechSynthesis;

    // Initialize with a random phrase
    useEffect(() => {
        loadNewPhrase();
    }, [selectedVoice, difficulty, phrases]);

    // Save best streak to localStorage
    useEffect(() => {
        if (streak > bestStreak) {
            setBestStreak(streak);
            localStorage.setItem("listeningBestStreak", streak.toString());
        }
    }, [streak, bestStreak]);

    // Handle game completion 
    useEffect(() => {
        if (gameOver && !scoreSubmitted && submitGameScore) {
            submitGameScore(score * 10, "Listening Challenge");
            setScoreSubmitted(true);
        }
    }, [gameOver, scoreSubmitted, submitGameScore, score]);

    const loadNewPhrase = () => {
        if (!phrases || Object.keys(phrases).length === 0) return;
        setLoading(true);
        const currentPhrases = phrases[difficulty];
        let newIndex = currentPhraseIndex;

        // Make sure we get a different phrase
        if (currentPhrases.length > 1) {
            while (newIndex === currentPhraseIndex) {
                newIndex = Math.floor(Math.random() * currentPhrases.length);
            }
        }

        setCurrentPhraseIndex(newIndex);
        setCurrentPhrase(currentPhrases[newIndex]);
        setUserInput("");
        setResult(null);

        setTimeout(() => {
            setLoading(false);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 500);
    };

    // Speak the current phrase
    const speakPhrase = () => {
        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(currentPhrase);
        utterance.lang = selectedVoice;
        utterance.rate = speechRate;

        synth.speak(utterance);
    };

    // Check user's answer
    const checkAnswer = () => {
        if (gameOver) return;
        
        const normalizedUserInput = userInput.trim().toLowerCase();
        const normalizedPhrase = currentPhrase.trim().toLowerCase();

        const isCorrect = normalizedUserInput === normalizedPhrase;

        setResult(isCorrect);
        const nextAttempts = totalAttempts + 1;
        setTotalAttempts(nextAttempts);

        if (isCorrect) {
            setScore(score + 1);
            setStreak(streak + 1);
            setSnackbarMessage("Correct! Great job!");
            setSnackbarSeverity("success");
        } else {
            setStreak(0);
            setSnackbarMessage(`The correct answer was: "${currentPhrase}"`);
            setSnackbarSeverity("error");
        }

        setSnackbarOpen(true);

        if (nextAttempts >= MAX_PHRASES) {
            setTimeout(() => {
                setGameOver(true);
            }, 1500);
        } else {
            // Load a new phrase after a delay
            setTimeout(() => {
                loadNewPhrase();
            }, 2000);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    // Handle key press (Enter to submit)
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && userInput.trim() !== "") {
            checkAnswer();
        }
    };

    // Calculate accuracy percentage
    const calculateAccuracy = () => {
        if (totalAttempts === 0) return 0;
        return Math.round((score / totalAttempts) * 100);
    };

    return (
        <Box className="listening-challenge-page" sx={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            pt: 8,
            pb: 5
        }}>
            {/* App Bar */}
            <AppBar position="fixed" sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
            }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="primary"
                        component={Link}
                        to="/dashboard"
                        sx={{ mr: 2 }}
                    >
                        <ArrowBack />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        color: theme.palette.primary.main
                    }}>
                        Listening Challenge
                    </Typography>

                    <Tooltip title="Change Language">
                        <IconButton color="primary" onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <Language />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Help">
                        <IconButton color="primary" onClick={() => setHelpOpen(true)}>
                            <Help />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Settings">
                        <IconButton color="primary" onClick={() => setSettingsOpen(true)}>
                            <Settings />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="lg">
                {/* Language Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            borderRadius: 2,
                            minWidth: 180,
                        }
                    }}
                >
                    {Object.entries(voiceOptions).map(([key, voice]) => (
                        <MenuItem
                            key={voice.value}
                            selected={selectedVoice === voice.value}
                            onClick={() => {
                                setSelectedVoice(voice.value);
                                setAnchorEl(null);
                                setSnackbarMessage(`Voice changed to ${voice.name}`);
                                setSnackbarSeverity("success");
                                setSnackbarOpen(true);
                            }}
                        >
                            <ListItemIcon>
                                <Typography>{voice.flag}</Typography>
                            </ListItemIcon>
                            <Typography>{voice.name}</Typography>
                        </MenuItem>
                    ))}
                </Menu>

                {/* Speed Dial for Quick Actions */}
                <StyledSpeedDial
                    ariaLabel="Quick Actions"
                    icon={<SpeedDialIcon />}
                    open={speedDialOpen}
                    onOpen={() => setSpeedDialOpen(true)}
                    onClose={() => setSpeedDialOpen(false)}
                    direction="up"
                >
                    <SpeedDialAction
                        icon={<ShareIcon />}
                        tooltipTitle="Share"
                        onClick={() => {
                            setSpeedDialOpen(false);
                            setSnackbarMessage("Sharing your progress!");
                            setSnackbarSeverity("info");
                            setSnackbarOpen(true);
                        }}
                    />
                    <SpeedDialAction
                        icon={<CloudDownload />}
                        tooltipTitle="Download Progress"
                        onClick={() => {
                            setSpeedDialOpen(false);
                            setSnackbarMessage("Progress downloaded!");
                            setSnackbarSeverity("success");
                            setSnackbarOpen(true);
                        }}
                    />
                    <SpeedDialAction
                        icon={<Info />}
                        tooltipTitle="Help"
                        onClick={() => {
                            setHelpOpen(true);
                            setSpeedDialOpen(false);
                        }}
                    />
                </StyledSpeedDial>

                {/* Snackbar for Notifications */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity={snackbarSeverity}
                        sx={{ width: "100%" }}
                        elevation={6}
                        variant="filled"
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                {/* Main Content Grid */}
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    {/* Stats Card */}
                    <Grid item xs={12} md={4}>
                        <GlassCard>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
                                Your Progress
                            </Typography>

                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Accuracy
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {calculateAccuracy()}%
                                    </Typography>
                                </Box>
                                <ProgressBar
                                    variant="determinate"
                                    value={calculateAccuracy()}
                                    color="success"
                                />
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Current Streak
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {streak}
                                    </Typography>
                                </Box>
                                <ProgressBar
                                    variant="determinate"
                                    value={(streak / 10) * 100}
                                    color="primary"
                                />
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Best Streak
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {bestStreak}
                                    </Typography>
                                </Box>
                                <ProgressBar
                                    variant="determinate"
                                    value={(bestStreak / 10) * 100}
                                    color="secondary"
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Current Voice
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {voiceOptions[selectedVoice.substring(0, 2)]?.flag || "🌐"}{" "}
                                        {voiceOptions[selectedVoice.substring(0, 2)]?.name || selectedVoice}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Difficulty
                                    </Typography>
                                    <Chip
                                        label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                        color={
                                            difficulty === "easy"
                                                ? "success"
                                                : difficulty === "medium"
                                                    ? "primary"
                                                    : "error"
                                        }
                                        size="small"
                                        sx={{ fontWeight: "bold" }}
                                    />
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>Total Phrases</Typography>
                                <Typography fontWeight="bold">{totalAttempts} / {MAX_PHRASES}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>Correct Answers</Typography>
                                <Typography fontWeight="bold">{score}</Typography>
                            </Box>
                        </GlassCard>
                    </Grid>

                    {/* Main Challenge Card */}
                    <Grid item xs={12} md={8}>
                        <GlassCard>
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                                    Listening Challenge
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Listen to the phrase and type what you hear
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    mb: 4,
                                }}
                            >
                                <AnimatedButton
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<VolumeUp />}
                                    onClick={speakPhrase}
                                    sx={{
                                        borderRadius: 8,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: "1.1rem",
                                        mb: 3,
                                    }}
                                >
                                    Listen
                                </AnimatedButton>

                                <ButtonGroup variant="outlined" size="small" sx={{ mb: 3 }}>
                                    <Button
                                        onClick={() => setSpeechRate(0.6)}
                                        variant={speechRate === 0.6 ? "contained" : "outlined"}
                                    >
                                        Slow
                                    </Button>
                                    <Button
                                        onClick={() => setSpeechRate(0.8)}
                                        variant={speechRate === 0.8 ? "contained" : "outlined"}
                                    >
                                        Normal
                                    </Button>
                                    <Button
                                        onClick={() => setSpeechRate(1.0)}
                                        variant={speechRate === 1.0 ? "contained" : "outlined"}
                                    >
                                        Fast
                                    </Button>
                                </ButtonGroup>

                                <Box sx={{ width: "100%", maxWidth: 500 }}>
                                    {loading ? (
                                        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                                    ) : (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label="Type what you hear"
                                            value={userInput}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            inputRef={inputRef}
                                            disabled={result !== null}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box sx={{ mt: 3, width: "100%", maxWidth: 500 }}>
                                    <AnimatedButton
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        onClick={checkAnswer}
                                        disabled={userInput.trim() === "" || result !== null || loading}
                                        sx={{ borderRadius: 2, py: 1.2 }}
                                    >
                                        Check Answer
                                    </AnimatedButton>
                                </Box>

                                <AnimatePresence>
                                    {result !== null && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ width: "100%", maxWidth: 500, marginTop: 16 }}
                                        >
                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    bgcolor: result ? "success.light" : "error.light",
                                                    color: "#fff",
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    {result ? (
                                                        <Check sx={{ mr: 1 }} />
                                                    ) : (
                                                        <Close sx={{ mr: 1 }} />
                                                    )}
                                                    <Typography>
                                                        {result
                                                            ? "Correct! Great job!"
                                                            : `The correct phrase was: "${currentPhrase}"`}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Difficulty Level
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                        <Chip
                                            label="Easy"
                                            onClick={() => setDifficulty("easy")}
                                            color={difficulty === "easy" ? "success" : "default"}
                                            variant={difficulty === "easy" ? "filled" : "outlined"}
                                        />
                                        <Chip
                                            label="Medium"
                                            onClick={() => setDifficulty("medium")}
                                            color={difficulty === "medium" ? "primary" : "default"}
                                            variant={difficulty === "medium" ? "filled" : "outlined"}
                                        />
                                        <Chip
                                            label="Hard"
                                            onClick={() => setDifficulty("hard")}
                                            color={difficulty === "hard" ? "error" : "default"}
                                            variant={difficulty === "hard" ? "filled" : "outlined"}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Refresh />}
                                        onClick={loadNewPhrase}
                                    >
                                        New Phrase
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Help />}
                                        onClick={() => setHelpOpen(true)}
                                    >
                                        Help
                                    </Button>
                                </Box>
                            </Box>
                        </GlassCard>
                    </Grid>
                </Grid>

                {/* Game Over Dialog */}
                <Dialog
                    open={gameOver}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                        },
                    }}
                >
                    <DialogTitle sx={{ bgcolor: "primary.main", color: "white", textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight="bold">Challenge Complete!</Typography>
                    </DialogTitle>
                    <DialogContent sx={{ p: 4, textAlign: 'center', mt: 2 }}>
                        <Typography variant="h3" color="primary" gutterBottom>
                            {score} / {MAX_PHRASES}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Great job!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Your listening skills are improving. You earned {score * 10} XP!
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                        <Button 
                            variant="contained" 
                            size="large"
                            component={Link}
                            to="/dashboard"
                            sx={{ borderRadius: 2, px: 4 }}
                        >
                            Return to Dashboard
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Help Dialog */}
                <Dialog
                    open={helpOpen}
                    onClose={() => setHelpOpen(false)}
                    maxWidth="md"
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                        },
                    }}
                >
                    <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Help sx={{ mr: 1 }} />
                            <Typography variant="h6">How to Use the Listening Challenge</Typography>
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Improve your listening skills in a foreign language
                        </Typography>

                        <Typography paragraph>
                            The Listening Challenge helps you practice your listening comprehension
                            skills by having you transcribe spoken phrases in your target language.
                        </Typography>

                        <Box component="ol" sx={{ pl: 2 }}>
                            <Typography component="li" sx={{ mb: 1 }}>
                                Click the <strong>Listen</strong> button to hear a phrase in your selected language.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                Type what you hear in the text field.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                Click <strong>Check Answer</strong> to see if you got it right.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                You can adjust the speech rate using the <strong>Slow</strong>, <strong>Normal</strong>,
                                and <strong>Fast</strong> buttons.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                Choose your difficulty level: <strong>Easy</strong>, <strong>Medium</strong>, or <strong>Hard</strong>.
                            </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                            Tips for Success
                        </Typography>

                        <Box component="ul" sx={{ pl: 2 }}>
                            <Typography component="li" sx={{ mb: 1 }}>
                                Listen to each phrase multiple times if needed.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                Start with slower speech rates and easier difficulty levels.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                Pay attention to accents and special characters.
                            </Typography>
                            <Typography component="li" sx={{ mb: 1 }}>
                                Practice regularly to improve your listening skills.
                            </Typography>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setHelpOpen(false)} variant="contained">
                            Got it!
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Settings Dialog */}
                <Dialog
                    open={settingsOpen}
                    onClose={() => setSettingsOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                        },
                    }}
                >
                    <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Settings sx={{ mr: 1 }} />
                            <Typography variant="h6">Settings</Typography>
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Voice Settings
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Select Language
                            </Typography>
                            <Grid container spacing={2}>
                                {Object.entries(voiceOptions).map(([key, voice]) => (
                                    <Grid item xs={6} sm={3} key={voice.value}>
                                        <Paper
                                            elevation={selectedVoice === voice.value ? 3 : 1}
                                            sx={{
                                                p: 2,
                                                textAlign: "center",
                                                cursor: "pointer",
                                                border: selectedVoice === voice.value ? `2px solid ${theme.palette.primary.main}` : "none",
                                                bgcolor: selectedVoice === voice.value ? "primary.light" : "background.paper",
                                                color: selectedVoice === voice.value ? "primary.contrastText" : "text.primary",
                                                "&:hover": {
                                                    bgcolor: "primary.light",
                                                    color: "primary.contrastText",
                                                },
                                            }}
                                            onClick={() => setSelectedVoice(voice.value)}
                                        >
                                            <Typography variant="h4" sx={{ mb: 1 }}>
                                                {voice.flag}
                                            </Typography>
                                            <Typography variant="body2">{voice.name}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>
                            Speech Rate
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Adjust the speaking speed
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { value: 0.6, label: "Slow" },
                                    { value: 0.8, label: "Normal" },
                                    { value: 1.0, label: "Fast" },
                                ].map((rate) => (
                                    <Grid item xs={4} key={rate.value}>
                                        <Paper
                                            elevation={speechRate === rate.value ? 3 : 1}
                                            sx={{
                                                p: 2,
                                                textAlign: "center",
                                                cursor: "pointer",
                                                border: speechRate === rate.value ? `2px solid ${theme.palette.primary.main}` : "none",
                                                bgcolor: speechRate === rate.value ? "primary.light" : "background.paper",
                                                color: speechRate === rate.value ? "primary.contrastText" : "text.primary",
                                                "&:hover": {
                                                    bgcolor: "primary.light",
                                                    color: "primary.contrastText",
                                                },
                                            }}
                                            onClick={() => setSpeechRate(rate.value)}
                                        >
                                            <SpeedIcon sx={{ mb: 1 }} />
                                            <Typography variant="body2">{rate.label}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setSettingsOpen(false)}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setSettingsOpen(false);
                                setSnackbarMessage("Settings saved successfully!");
                                setSnackbarSeverity("success");
                                setSnackbarOpen(true);
                            }}
                            variant="contained"
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ListeningChallenge;