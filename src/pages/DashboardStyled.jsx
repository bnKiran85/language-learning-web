import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Container,
  Fade,
  Chip,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import {
  SportsEsports,
  School,
  Translate,
  VolumeUp,
  Dashboard as DashboardIcon,
  Leaderboard,
  Settings,
  Notifications,
  Person,
  Menu as MenuIcon,
  Search,
  ArrowForward,
  Bookmark,
  TrendingUp,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";


// Game data with enhanced details
const games = [
  {
    name: "Flashcard Game",
    image: "/FlashcardGame.jpg",
    path: "/flashcard-game",
    description: "Master vocabulary with interactive flashcards. Perfect for beginners and advanced learners.",
    icon: <School sx={{ fontSize: 20 }} />,
    category: "vocabulary",
    difficulty: "Beginner",
    completionRate: 65,
    popular: true
  },
  {
    name: "Word Puzzle Game",
    image: "/WordPuzzleGame.jpg",
    path: "/word-puzzle-game",
    description: "Solve challenging word puzzles to improve your language skills and expand your vocabulary.",
    icon: <SportsEsports sx={{ fontSize: 20 }} />,
    category: "games",
    difficulty: "Intermediate",
    completionRate: 42,
    popular: true
  },
  {
    name: "Listening Challenge",
    image: "/ListeningChallenge.jpg",
    path: "/ListeningChallenge",
    description: "Enhance your listening comprehension skills with audio exercises and interactive challenges.",
    icon: <VolumeUp sx={{ fontSize: 20 }} />,
    category: "listening",
    difficulty: "Advanced",
    completionRate: 28,
    new: true
  },
  {
    name: "Vocabulary Quiz",
    image: "/VocabularyQuiz.jpg",
    path: "/VocabularyQuiz",
    description: "Test your vocabulary knowledge with fun quizzes designed to reinforce language learning.",
    icon: <Translate sx={{ fontSize: 20 }} />,
    category: "vocabulary",
    difficulty: "All Levels",
    completionRate: 75,
    new: true
  },
  
  {
    name: "Memory Match",
    image: "/MemoryMatch.jpg",
    path: "/memorymatch",
    description: "Classic memory game with words and images to reinforce vocabulary retention in a fun way.",
    icon: <SportsEsports sx={{ fontSize: 20 }} />,
    category: "games",
    difficulty: "Beginner",
    completionRate: 78,
    popular: true
  },
  // New games added below
  
  // { 
  //   name: "Sentence Builder", 
  //   image: "/SentenceBuilder.jpg", 
  //   path: "/sentence-builder",
  //   description: "Arrange words to form grammatically correct sentences. Master syntax and word order in your target language.",
  //   icon: <School sx={{ fontSize: 20 }} />,
  //   category: "grammar",
  //   difficulty: "Intermediate",
  //   completionRate: 38,
  //   new: true
  // },
  // { 
  //   name: "Word Association", 
  //   image: "/WordAssociation.jpg", 
  //   path: "/word-association",
  //   description: "Connect related words to build your vocabulary and understand semantic relationships between concepts.",
  //   icon: <Translate sx={{ fontSize: 20 }} />,
  //   category: "vocabulary",
  //   difficulty: "All Levels",
  //   completionRate: 52,
  //   popular: true
  // },
  // { 
  //   name: "Pronunciation Practice", 
  //   image: "/PronunciationPractice.jpg", 
  //   path: "/pronunciation-practice",
  //   description: "Record yourself speaking and get instant feedback on your pronunciation accuracy and fluency.",
  //   icon: <VolumeUp sx={{ fontSize: 20 }} />,
  //   category: "speaking",
  //   difficulty: "All Levels",
  //   completionRate: 31,
  //   new: true
  // },
  // { 
  //   name: "Translation Challenge", 
  //   image: "/TranslationChallenge.jpg", 
  //   path: "/translation-challenge",
  //   description: "Test your translation skills with timed challenges across different difficulty levels and language pairs.",
  //   icon: <Translate sx={{ fontSize: 20 }} />,
  //   category: "translation",
  //   difficulty: "Advanced",
  //   completionRate: 25,
  //   new: true
  // },
  // { 
  //   name: "Conversation Simulator", 
  //   image: "/ConversationSimulator.jpg", 
  //   path: "/conversation-simulator",
  //   description: "Practice real-life conversations with AI characters in common scenarios like ordering food or asking for directions.",
  //   icon: <VolumeUp sx={{ fontSize: 20 }} />,
  //   category: "speaking",
  //   difficulty: "Intermediate",
  //   completionRate: 45,
  //   popular: true
  // },
  // { 
  //   name: "Language Crossword", 
  //   image: "/LanguageCrossword.jpg", 
  //   path: "/language-crossword",
  //   description: "Solve crossword puzzles using vocabulary from your target language. Great for spelling practice and word recall.",
  //   icon: <School sx={{ fontSize: 20 }} />,
  //   category: "vocabulary",
  //   difficulty: "Intermediate",
  //   completionRate: 33,
  //   new: true
  // },
  // { 
  //   name: "Speed Challenge", 
  //   image: "/SpeedChallenge.jpg", 
  //   path: "/speed-challenge",
  //   description: "Race against the clock to translate as many words as possible. Improves quick thinking and vocabulary recall.",
  //   icon: <SportsEsports sx={{ fontSize: 20 }} />,
  //   category: "games",
  //   difficulty: "All Levels",
  //   completionRate: 62,
  //   popular: true
  // }
];

// Featured game of the week
const featuredGame = {
  name: "Language Battle",
  image: "/LanguageBattle.jpg",
  path: "/language-battle",
  description: "Challenge other learners in real-time language competitions. Test your skills, earn points, and climb the leaderboard!",
  category: "multiplayer"
};

// User progress mapped dynamically inside component

function Dashboard() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [visibleItems, setVisibleItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // User progress mapped from backend context
  const userProgress = {
    streak: user?.streak || 0,
    totalPoints: user?.stats?.totalXP || 0,
    rank: "Language Explorer", 
    completedGames: user?.stats?.gamesPlayed || 0
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filterGamesByCategory = (category) => {
    setActiveCategory(category);
  };

  // Staggered animation for cards
  useEffect(() => {
    const timeouts = [];
    games.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, 150 * index);
      timeouts.push(timeout);
    });

    // Cleanup timeouts on unmount
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const filteredGames = activeCategory === "all"
    ? games
    : games.filter(game => game.category === activeCategory);

  const menuId = 'primary-search-account-menu';
  // Also update the profile menu to navigate to Settings
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate("/Profile");
      }}>Profile </MenuItem>
      <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate("/settings");
      }}>Settings</MenuItem>
      <Divider />
      <MenuItem onClick={() => {
        handleMenuClose();
        handleLogout();
      }}>Logout</MenuItem>

    </Menu>
  );

  const handleLogout = async () => {
    try {
      logoutUser();
      // After successful logout, redirect to the login page
      navigate("/");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };



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
        <ListItem button selected>
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate("/MyCourses")}>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="My Courses" />
        </ListItem>
        <ListItem button onClick={() => navigate("/Leaderboard")}>
          <ListItemIcon>
            <Leaderboard />
          </ListItemIcon>
          <ListItemText primary="Leaderboard" />
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
        {/* Update this ListItem to navigate to the Settings page */}
        <ListItem button onClick={() => navigate("/Settings")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={() => navigate("/Profile")}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: 'background.default',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
    }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SportsEsports sx={{ mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              GameLang
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="large" aria-label="search" color="inherit">
              <Search />
            </IconButton>
            <IconButton
              size="large"
              aria-label="show new notifications"
              color="inherit"
            >
              <Notifications />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                alt="User Profile"
                src="https://randomuser.me/api/portraits/men/85.jpg"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 250px)` },
          mt: '64px',
          overflow: 'auto'
        }}
      >
        <Container maxWidth="xxl" sx={{ py: 4 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{ mb: 1 }}
            >
              Welcome back, {user?.displayName || "Guest"}!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"

              sx={{ mb: 3 }}
            >
              Continue your language learning journey. You're on a {userProgress.streak}-day streak!
            </Typography>

            {/* Progress Stats */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        bgcolor: 'primary.light',
                        p: 0.5,
                        borderRadius: 1,
                        mr: 1
                      }}
                    >
                      <TrendingUp fontSize="small" color="primary" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Daily Streak
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {userProgress.streak} days
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        bgcolor: 'success.light',
                        p: 0.5,
                        borderRadius: 1,
                        mr: 1
                      }}
                    >
                      <EmojiEvents fontSize="small" color="success" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Points
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {userProgress.totalPoints}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        bgcolor: 'info.light',
                        p: 0.5,
                        borderRadius: 1,
                        mr: 1
                      }}
                    >
                      <School fontSize="small" color="info" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {userProgress.completedGames} games
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        bgcolor: 'warning.light',
                        p: 0.5,
                        borderRadius: 1,
                        mr: 1
                      }}
                    >
                      <Person fontSize="small" color="warning" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Rank
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" noWrap>
                    {userProgress.rank}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Featured Game */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              mb: 6,
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: { xs: 200, sm: 300, md: 400 },
                backgroundImage: `url(${featuredGame.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'
                }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  p: { xs: 3, md: 4 },
                  width: '100%'
                }}
              >
                <Chip
                  label="Featured Game"
                  color="primary"
                  size="small"
                  sx={{ mb: 2, fontWeight: 'bold' }}
                />
                <Typography
                  variant="h3"
                  component="h2"
                  fontWeight="bold"
                  color="white"
                  sx={{ mb: 1 }}
                >
                  {featuredGame.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="white"
                  sx={{
                    mb: 3,
                    maxWidth: { sm: '80%', md: '60%' },
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {featuredGame.description}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(featuredGame.path)}
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: 'linear-gradient(90deg, #4A00E0 0%, #8E2DE2 100%)',
                    boxShadow: '0 4px 15px rgba(74, 0, 224, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(74, 0, 224, 0.4)',
                    }
                  }}
                >
                  Play Now
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Category Filter */}
          <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant={activeCategory === 'all' ? 'contained' : 'outlined'}
              onClick={() => filterGamesByCategory('all')}
              sx={{
                borderRadius: 4,
                px: 2,
                py: 1
              }}
            >
              All Games
            </Button>
            <Button
              variant={activeCategory === 'vocabulary' ? 'contained' : 'outlined'}
              startIcon={<School />}
              onClick={() => filterGamesByCategory('vocabulary')}
              sx={{
                borderRadius: 4,
                px: 2,
                py: 1
              }}
            >
              Vocabulary
            </Button>
            <Button
              variant={activeCategory === 'games' ? 'contained' : 'outlined'}
              startIcon={<SportsEsports />}
              onClick={() => filterGamesByCategory('games')}
              sx={{
                borderRadius: 4,
                px: 2,
                py: 1
              }}
            >
              Games
            </Button>
            <Button
              variant={activeCategory === 'listening' ? 'contained' : 'outlined'}
              startIcon={<VolumeUp />}
              onClick={() => filterGamesByCategory('listening')}
              sx={{
                borderRadius: 4,
                px: 2,
                py: 1
              }}
            >
              Listening
            </Button>
          </Box>

          {/* Games Grid */}
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            {activeCategory === 'all' ? 'Available Games' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Games`}
          </Typography>

          <Grid container spacing={3}>
            {filteredGames.map((game, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: visibleItems.includes(index) ? 1 : 0,
                  y: visibleItems.includes(index) ? 0 : 20
                }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <CardActionArea onClick={() => navigate(game.path)}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={game.image}
                        alt={game.name}
                        sx={{
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          display: 'flex',
                          gap: 1
                        }}
                      >
                        <Chip
                          label={game.category}
                          size="small"
                          icon={game.icon}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            fontWeight: 'medium',
                            backdropFilter: 'blur(4px)'
                          }}
                        />
                        {game.popular && (
                          <Chip
                            label="Populars"
                            size="small"
                            color="error"
                            sx={{ fontWeight: 'medium' }}
                          />
                        )}
                        {game.new && (
                          <Chip
                            label="New"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 'medium' }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: 4,
                          bgcolor: 'grey.300'
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${game.completionRate}%`,
                            bgcolor: 'primary.main'
                          }}
                        />
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          fontWeight="bold"
                        >
                          {game.name}
                        </Typography>
                        <Chip
                          label={game.difficulty}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 24
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, minHeight: '40px' }}
                      >
                        {game.description.length > 80
                          ? `${game.description.substring(0, 80)}...`
                          : game.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {game.completionRate}% completed
                        </Typography>
                        <Typography
                          variant="button"
                          color="primary"
                          fontWeight="bold"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Play <ArrowForward fontSize="small" sx={{ ml: 0.5 }} />
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              mt: 8,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              GameLang © {new Date().getFullYear()} | Make learning fun and effective
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
