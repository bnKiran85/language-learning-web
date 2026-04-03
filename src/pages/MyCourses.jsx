import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseVideoPlayer from './CourseVideoPlayer';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Tooltip,
  AppBar,
  Toolbar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import {
  PlayCircleOutline,
  BookmarkBorder,
  Bookmark,
  Share,
  FilterList,
  Search,
  Sort,
  CheckCircle,
  AccessTime,
  MoreVert,
  NavigateNext,
  Home,
  Download,
  Star,
  StarBorder,
  Menu as MenuIcon,
  Dashboard,
  School,
  Leaderboard,
  Settings,
  Person,
  Notifications,
  ArrowBack,
  Language,
  SportsEsports,
  Translate,
  Flag,
  Public,
  EmojiEvents,
  Mic,
  Chat,
  MenuBook
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MyCourses.css';

const MyCourses = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State variables
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [savedCourses, setSavedCourses] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);


  // Mock language courses data
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Spanish for Beginners",
      description: "Learn essential Spanish vocabulary and grammar for everyday conversations.",
      level: "Beginner",
      language: "Spanish",
      thumbnail: "https://images.unsplash.com/photo-1551649001-7a2482d98d05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      progress: 65,
      instructor: "Maria Rodriguez",
      instructorAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
      duration: "8 weeks",
      lessonsCompleted: 2,
      totalLessons: 5,
      rating: 4.8,
      studentsEnrolled: 1245,
      tags: ["conversation", "grammar", "vocabulary"],
      flag: "🇪🇸",
      lessons: [
        {
          id: 1,
          title: "Basic Spanish Greetings",
          videoUrl: "https://www.youtube.com/embed/t7-nb1wlnyA?si=NuUrAqLgMwaVx7KT", 
          duration: "10:25",
          description: "Learn essential Spanish greetings and introductions for everyday conversations."
        },
        {
          id: 2,
          title: "Numbers and Counting",
          videoUrl: "https://www.youtube.com/embed/6FEyfy5N3Nc",
          duration: "8:30",
          description: "Master numbers 1-100 in Spanish with pronunciation practice."
        },
        {
          id: 3,
          title: "Common Phrases",
          videoUrl: "https://www.youtube.com/embed/hyLl_0d0EBw",
          duration: "12:15",
          description: "Essential everyday Spanish phrases for basic communication."
        },
        {
          id: 4,
          title: "Basic Grammar Rules",
          videoUrl: "https://www.youtube.com/embed/X_FL6Ta_3WM",
          duration: "15:20",
          description: "Understanding fundamental Spanish grammar concepts."
        },
        {
          id: 5,
          title: "Practice Conversation",
          videoUrl: "https://www.youtube.com/embed/NGLxvWmwwb0",
          duration: "11:45",
          description: "Practice what you've learned in real-world conversations."
        }
      ]
    },
    {
      id: 2,
      title: "French Conversation Mastery",
      description: "Improve your French speaking skills with practical conversation exercises.",
      level: "Intermediate",
      language: "French",
      thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      progress: 30,
      instructor: "Jean Dupont",
      instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      duration: "10 weeks",
      lessonsCompleted: 1,
      totalLessons: 6,
      rating: 4.6,
      studentsEnrolled: 987,
      tags: ["conversation", "pronunciation", "listening"],
      flag: "🇫🇷",
      lessons: [
        {
          id: 1,
          title: "French Pronunciation Basics",
          videoUrl: "https://www.youtube.com/embed/vvidJedEQgY?si=qINKCsQC3FufF2GR",
          duration: "15:20",
          description: "Master French pronunciation rules and sounds."
        },
        {
          id: 2,
          title: "Café Conversations",
          videoUrl: "https://www.youtube.com/embed/bFf7KRJKKjs?si=jqTIR1kXW8Pld9AC",
          duration: "11:45",
          description: "Learn how to order and converse in a French café."
        },
        {
          id: 3,
          title: "Shopping Vocabulary",
          videoUrl: "https://www.youtube.com/embed/g2hGwx0y7cI",
          duration: "13:30",
          description: "Essential vocabulary for shopping in French stores."
        },
        {
          id: 4,
          title: "Daily Routines",
          videoUrl: "https://www.youtube.com/embed/soKRa6D90WQ",
          duration: "12:15",
          description: "Describing your daily activities in French."
        },
        {
          id: 5,
          title: "Travel Phrases",
          videoUrl: "https://www.youtube.com/embed/2L2_0bB4B6Y",
          duration: "14:20",
          description: "Important phrases for traveling in French-speaking countries."
        },
        {
          id: 6,
          title: "Advanced Conversation Practice",
          videoUrl: "https://www.youtube.com/embed/kxb8EpyhKro",
          duration: "16:40",
          description: "Practice advanced conversation scenarios in French."
        }
      ]
    },
    {
      id: 3,
      title: "Japanese Kanji Fundamentals",
      description: "Master the essential kanji characters needed for basic Japanese literacy.",
      level: "Beginner",
      language: "Japanese",
      thumbnail: "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      progress: 15,
      instructor: "Yuki Tanaka",
      instructorAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
      duration: "12 weeks",
      lessonsCompleted: 1,
      totalLessons: 7,
      rating: 4.9,
      studentsEnrolled: 1532,
      tags: ["kanji", "reading", "writing"],
      flag: "🇯🇵",
      lessons: [
        {
          id: 1,
          title: "Introduction to Kanji",
          videoUrl: "https://www.youtube.com/embed/mPppVDX_GiY",
          duration: "14:30",
          description: "Understanding the basics of kanji characters and their importance."
        },
        {
          id: 2,
          title: "Basic Strokes and Radicals",
          videoUrl: "https://www.youtube.com/embed/rf2Zn8qJ2Hs",
          duration: "12:45",
          description: "Learn the fundamental strokes and radicals in kanji writing."
        },
        {
          id: 3,
          title: "Numbers and Counting",
          videoUrl: "https://www.youtube.com/embed/CcQUf_MH2-U",
          duration: "11:20",
          description: "Kanji characters for numbers and counting systems."
        },
        {
          id: 4,
          title: "Common Kanji in Daily Life",
          videoUrl: "https://www.youtube.com/embed/OF9YK7pbvfU",
          duration: "15:15",
          description: "Learn frequently used kanji in everyday situations."
        },
        {
          id: 5,
          title: "Reading Practice",
          videoUrl: "https://www.youtube.com/embed/3o8j_g4j2Yw",
          duration: "13:50",
          description: "Practice reading simple texts with basic kanji."
        },
        {
          id: 6,
          title: "Writing Practice",
          videoUrl: "https://www.youtube.com/embed/Yx4AGDXfwGE",
          duration: "16:25",
          description: "Guided practice for writing common kanji characters."
        },
        {
          id: 7,
          title: "Kanji Compounds",
          videoUrl: "https://www.youtube.com/embed/8WiBZuIV-yE",
          duration: "14:40",
          description: "Understanding and using compound kanji words."
        }
      ]
    },
    {
      id: 4,
      title: "German Business Communication",
      description: "Learn professional German vocabulary and communication skills for the workplace.",
      level: "Advanced",
      language: "German",
      thumbnail: "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      progress: 80,
      instructor: "Klaus Weber",
      instructorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
      duration: "8 weeks",
      lessonsCompleted: 3,
      totalLessons: 5,
      rating: 4.7,
      studentsEnrolled: 756,
      tags: ["business", "professional", "formal"],
      flag: "🇩🇪",
      lessons: [
        {
          id: 1,
          title: "Business Greetings and Introductions",
          videoUrl: "https://www.youtube.com/embed/J-POq9JfYuY",
          duration: "13:20",
          description: "Professional greetings and introductions in German business settings."
        },
        {
          id: 2,
          title: "Email Communication",
          videoUrl: "https://www.youtube.com/embed/RQhxF6VB5AA",
          duration: "15:45",
          description: "Writing professional emails in German."
        },
        {
          id: 3,
          title: "Phone Conversations",
          videoUrl: "https://www.youtube.com/embed/7ElA6vGY3Ng",
          duration: "14:30",
          description: "Handling business phone calls in German."
        },
        {
          id: 4,
          title: "Meeting Vocabulary",
          videoUrl: "https://www.youtube.com/embed/K5HYCPYyeQg",
          duration: "12:55",
          description: "Essential vocabulary for business meetings."
        },
        {
          id: 5,
          title: "Presentations and Reports",
          videoUrl: "https://www.youtube.com/embed/8pQAWOCofXo",
          duration: "16:15",
          description: "Giving professional presentations in German."
        }
      ]
    },
    {
      id: 5,
      title: "Mandarin Chinese Pronunciation",
      description: "Master the tones and sounds of Mandarin Chinese with guided audio exercises.",
      level: "Beginner",
      language: "Chinese",
      thumbnail: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      progress: 45,
      instructor: "Li Wei",
      instructorAvatar: "https://randomuser.me/api/portraits/men/78.jpg",
      duration: "6 weeks",
      lessonsCompleted: 2,
      totalLessons: 6,
      rating: 4.9,
      studentsEnrolled: 2134,
      tags: ["pronunciation", "speaking", "listening"],
      flag: "🇨🇳",
      lessons: [
        {
          id: 1,
          title: "Introduction to Tones",
          videoUrl: "https://www.youtube.com/embed/3wV8B4bx1lM",
          duration: "11:25",
          description: "Understanding the four tones in Mandarin Chinese."
        },
        {
          id: 2,
          title: "Basic Pronunciation Rules",
          videoUrl: "https://www.youtube.com/embed/aYsbjwqEhs8",
          duration: "13:40",
          description: "Learn the fundamental rules of Chinese pronunciation."
        },
        {
          id: 3,
          title: "Common Sounds Practice",
          videoUrl: "https://www.youtube.com/embed/b9Ayvjy-Dgs",
          duration: "12:35",
          description: "Practice frequently used sounds in Mandarin."
        },
        {
          id: 4,
          title: "Tone Pairs",
          videoUrl: "https://www.youtube.com/embed/JkQGN86qTag",
          duration: "14:50",
          description: "Master the pronunciation of tone combinations."
        },
        {
          id: 5,
          title: "Rhythm and Flow",
          videoUrl: "https://www.youtube.com/embed/UuX9F5emdk0",
          duration: "15:20",
          description: "Learn the natural rhythm of spoken Mandarin."
        },
        {
          id: 6,
          title: "Advanced Pronunciation",
          videoUrl: "https://www.youtube.com/embed/dJPYvE-vP3k",
          duration: "16:15",
          description: "Perfect your pronunciation with advanced exercises."
        }
      ]
    },
    {
      id: 6,
      title: "Italian Cooking Vocabulary",
      description: "Learn Italian through the language of food and cooking.",
      level: "Intermediate",
      language: "Italian",
      thumbnail: "https://images.unsplash.com/photo-1523905330026-b8bd1f5f320e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      progress: 10,
      instructor: "Sofia Rossi",
      instructorAvatar: "https://randomuser.me/api/portraits/women/23.jpg",
      duration: "4 weeks",
      lessonsCompleted: 1,
      totalLessons: 5,
      rating: 4.8,
      studentsEnrolled: 876,
      tags: ["cooking", "vocabulary", "culture"],
      flag: "🇮🇹",
      lessons: [
        {
          id: 1,
          title: "Kitchen Vocabulary",
          videoUrl: "https://www.youtube.com/embed/kxb8EpyhKro",
          duration: "12:30",
          description: "Learn essential kitchen and cooking vocabulary in Italian."
        },
        {
          id: 2,
          title: "Ingredients and Measurements",
          videoUrl: "https://www.youtube.com/embed/8WiBZuIV-yE",
          duration: "14:45",
          description: "Italian vocabulary for ingredients and measuring quantities."
        },
        {
          id: 3,
          title: "Cooking Verbs",
          videoUrl: "https://www.youtube.com/embed/OF9YK7pbvfU",
          duration: "13:20",
          description: "Common verbs used in Italian cooking."
        },
        {
          id: 4,
          title: "Recipe Instructions",
          videoUrl: "https://www.youtube.com/embed/3o8j_g4j2Yw",
          duration: "15:10",
          description: "Understanding and giving recipe instructions in Italian."
        },
        {
          id: 5,
          title: "Restaurant Dialogue",
          videoUrl: "https://www.youtube.com/embed/Yx4AGDXfwGE",
          duration: "11:55",
          description: "Practice ordering and discussing food in restaurants."
        }
      ]
    }
  ]);


  // Language filter options
  const languageOptions = [
    { value: 'all', label: 'All Languages' },
    { value: 'Spanish', label: 'Spanish 🇪🇸' },
    { value: 'French', label: 'French 🇫🇷' },
    { value: 'Japanese', label: 'Japanese 🇯🇵' },
    { value: 'German', label: 'German 🇩🇪' },
    { value: 'Chinese', label: 'Chinese 🇨🇳' },
    { value: 'Italian', label: 'Italian 🇮🇹' },
  ];

  // Level filter options
  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    handleFilterClose();
  };

  const handleBookmarkToggle = (courseId) => {
    setSavedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleContinueClick = (course) => {
    setSelectedCourse(course);
    setVideoPlayerOpen(true);
  };

  const handleContinueLearning = (course) => {
    setCurrentCourse(course);
    // Find the next incomplete lesson
    const nextLessonIndex = Math.min(course.lessonsCompleted, course.totalLessons - 1);
    setCurrentLesson(nextLessonIndex);
    setVideoModalOpen(true);
  };

  // Filter courses based on tab, search query, and selected language
  const getFilteredCourses = () => {
    let filtered = [...courses];

    // Filter by tab
    if (tabValue === 1) {
      filtered = filtered.filter(course => course.progress > 0 && course.progress < 100);
    } else if (tabValue === 2) {
      filtered = filtered.filter(course => course.progress === 100);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.language.toLowerCase().includes(query) ||
        course.level.toLowerCase().includes(query)
      );
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(course => course.language === selectedLanguage);
    }

    return filtered;
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Drawer content
  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Language sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          GameLang
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button selected>
          <ListItemIcon>
            <MenuBook color="primary" />
          </ListItemIcon>
          <ListItemText primary="My Courses" />
        </ListItem>
        <ListItem button onClick={() => navigate("/flashcard-game")}>
          <ListItemIcon>
            <SportsEsports />
          </ListItemIcon>
          <ListItemText primary="Language Games" />
        </ListItem>
        <ListItem button onClick={() => navigate("/Leaderboard")}>
          <ListItemIcon>
            <Leaderboard />
          </ListItemIcon>
          <ListItemText primary="Leaderboard" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="my-courses-page">
      <AppBar position="static" className="app-header">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Language sx={{ mr: 1 }} /> MyCourses
          </Typography>
          <IconButton
            color="inherit"
            aria-label="notifications"
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="user profile"
            onClick={() => navigate('/profile')}
          >
            <Avatar
              alt="User Name"
              src="https://randomuser.me/api/portraits/men/85.jpg"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>

      <Container className="my-courses-container" maxWidth="lg">
        {/* Hero Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0A2463 0%, #3E92CC 100%)',
            color: 'white',
            borderRadius: '0 0 20px 20px',
            mb: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />

          <Container maxWidth="lg">
            {/* Breadcrumbs */}
            <Box pt={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Breadcrumbs
                  separator={<NavigateNext fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <MuiLink
                    component="button"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      textDecoration: 'none',
                      '&:hover': { color: 'white' }
                    }}
                  >
                    <Home sx={{ mr: 0.5, fontSize: 16 }} />
                    Home
                  </MuiLink>
                  <Typography sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                    <MenuBook sx={{ mr: 0.5, fontSize: 16 }} />
                    My Courses
                  </Typography>
                </Breadcrumbs>
              </motion.div>
            </Box>

            {/* Header Content */}
            <Box py={5} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ flex: 1 }}
              >
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  My Language Journey
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, fontWeight: 'normal' }}>
                  Track your progress across {new Set(courses.map(course => course.language)).size} languages
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PlayCircleOutline />}
                    sx={{
                      borderRadius: 28,
                      px: 3,
                      py: 1,
                      fontWeight: 'bold',
                      boxShadow: '0 4px 14px rgba(255,255,255,0.2)',
                      background: 'white',
                      color: '#0A2463',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 6px 20px rgba(255,255,255,0.3)',
                      }
                    }}
                  >
                    Continue Learning
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<School />}
                    sx={{
                      borderRadius: 28,
                      px: 3,
                      py: 1,
                      fontWeight: 'bold',
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Explore New Courses
                  </Button>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ marginLeft: 'auto' }}
              >
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    position: 'relative',
                    width: 180,
                    height: 180,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ml: 4
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={180}
                    thickness={4}
                    sx={{ color: 'rgba(255,255,255,0.2)', position: 'absolute' }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={Math.floor(courses.reduce((total, course) => total + course.progress, 0) / courses.length)}
                    size={180}
                    thickness={4}
                    sx={{ color: 'white', position: 'absolute' }}
                  />
                  <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h3" component="div" fontWeight="bold">
                      {Math.floor(courses.reduce((total, course) => total + course.progress, 0) / courses.length)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Overall Progress
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Container>
        </Box>

        {/* Stats Dashboard Section */}
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                mb: 5
              }}
            >
              {/* Stats Header */}
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(90deg, #f5f7fa, #f9fafb)',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Learning Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your language learning activity and achievements
                </Typography>
              </Box>

              {/* Stats Cards */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Enrolled Courses */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height: '100%',
                        background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                        boxShadow: '5px 5px 15px #e6e9ec, -5px -5px 15px #ffffff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '8px 8px 20px #e6e9ec, -8px -8px 20px #ffffff'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            color: '#1976d2',
                            width: 48,
                            height: 48,
                            mr: 2
                          }}
                        >
                          <Public />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Enrolled Courses
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {courses.length}
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(25, 118, 210, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#1976d2'
                          }
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* Languages */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height: '100%',
                        background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                        boxShadow: '5px 5px 15px #e6e9ec, -5px -5px 15px #ffffff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '8px 8px 20px #e6e9ec, -8px -8px 20px #ffffff'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(46, 125, 50, 0.1)',
                            color: '#2e7d32',
                            width: 48,
                            height: 48,
                            mr: 2
                          }}
                        >
                          <Translate />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Languages
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {new Set(courses.map(course => course.language)).size}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {Array.from(new Set(courses.map(course => course.flag))).map((flag, index) => (
                          <Chip
                            key={index}
                            label={flag}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              fontSize: '1rem',
                              background: 'transparent',
                              border: '1px solid rgba(0,0,0,0.1)'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Lessons Completed */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height: '100%',
                        background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                        boxShadow: '5px 5px 15px #e6e9ec, -5px -5px 15px #ffffff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '8px 8px 20px #e6e9ec, -8px -8px 20px #ffffff'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(245, 124, 0, 0.1)',
                            color: '#f57c00',
                            width: 48,
                            height: 48,
                            mr: 2
                          }}
                        >
                          <AccessTime />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Lessons Completed
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {courses.reduce((total, course) => total + course.lessonsCompleted, 0)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Total lessons: {courses.reduce((total, course) => total + course.totalLessons, 0)}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" color="#f57c00">
                          {Math.floor((courses.reduce((total, course) => total + course.lessonsCompleted, 0) /
                            courses.reduce((total, course) => total + course.totalLessons, 0)) * 100)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(courses.reduce((total, course) => total + course.lessonsCompleted, 0) /
                          courses.reduce((total, course) => total + course.totalLessons, 0)) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          mt: 1,
                          bgcolor: 'rgba(245, 124, 0, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#f57c00'
                          }
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* Learning Streak */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height: '100%',
                        background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                        boxShadow: '5px 5px 15px #e6e9ec, -5px -5px 15px #ffffff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '8px 8px 20px #e6e9ec, -8px -8px 20px #ffffff'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(156, 39, 176, 0.1)',
                            color: '#9c27b0',
                            width: 48,
                            height: 48,
                            mr: 2
                          }}
                        >
                          <EmojiEvents />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Learning Streak
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            7 Days
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: index < 7 ? 'rgba(156, 39, 176, 0.8)' : 'rgba(0,0,0,0.1)',
                              color: index < 7 ? 'white' : 'rgba(0,0,0,0.3)',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {day}
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        Keep going! You're on fire 🔥
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Weekly Activity Chart */}
              <Box sx={{ p: 3, pt: 0 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Weekly Learning Activity
                  </Typography>
                  <Box sx={{ height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 3 }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const heights = [65, 40, 85, 35, 70, 55, 30];
                      const colors = [
                        '#1976d2', '#2196f3', '#64b5f6',
                        '#1976d2', '#2196f3', '#64b5f6', '#1976d2'
                      ];

                      return (
                        <Box key={day} sx={{ textAlign: 'center', width: '14%' }}>
                          <Box
                            sx={{
                              height: `${heights[index]}px`,
                              maxWidth: '40px',
                              minWidth: '20px',
                              width: '60%',
                              mx: 'auto',
                              borderRadius: '4px 4px 0 0',
                              background: colors[index],
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              '&:hover': {
                                filter: 'brightness(1.1)',
                                transform: 'scaleY(1.05)',
                                transformOrigin: 'bottom'
                              },
                              '&:hover::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-25px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap'
                              }
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {day}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              </Box>
            </Paper>
          </motion.div>
        </Container>


        {/* Search and filter section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Paper className="search-filter-container" elevation={0}>
            <TextField
              className="search-field"
              placeholder="Search your language courses..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <div className="filter-buttons">
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleFilterClick}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                startIcon={<Sort />}
                onClick={handleSortClick}
              >
                Sort
              </Button>
            </div>
          </Paper>
        </motion.div>

        {/* Filter menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
            Language
          </Typography>
          {languageOptions.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
              selected={selectedLanguage === option.value}
            >
              {option.label}
            </MenuItem>
          ))}
          <Divider />
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
            Level
          </Typography>
          {levelOptions.map((option) => (
            <MenuItem key={option.value} onClick={handleFilterClose}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Sort menu */}
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortClose}
        >
          <MenuItem onClick={handleSortClose}>Recently Added</MenuItem>
          <MenuItem onClick={handleSortClose}>Progress (High to Low)</MenuItem>
          <MenuItem onClick={handleSortClose}>Progress (Low to High)</MenuItem>
          <MenuItem onClick={handleSortClose}>Alphabetical (A-Z)</MenuItem>
        </Menu>

        {/* Tabs section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
            >
              <Tab label="All Courses" />
              <Tab label="In Progress" />
              <Tab label="Completed" />
              <Tab label="Saved" />
            </Tabs>
          </Box>
        </motion.div>

        {/* Course cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Grid container spacing={3}>
            {getFilteredCourses().length > 0 ? (
              getFilteredCourses().map((course, index) => (
                <Grid item xs={12} sm={6} lg={4} key={course.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="language-course-card">
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={course.thumbnail}
                          alt={course.title}
                          className="course-thumbnail"
                        />
                        <Box
                          className="course-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PlayCircleOutline />}
                            className="play-button"
                            onClick={() => handleContinueLearning(course)}
                          >
                            Continue
                          </Button>

                        </Box>
                        <Chip
                          label={course.level}
                          size="small"
                          color={
                            course.level === "Beginner" ? "success" :
                              course.level === "Intermediate" ? "primary" :
                                "secondary"
                          }
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            fontWeight: 'bold'
                          }}
                        />
                        <Chip
                          label={`${course.flag} ${course.language}`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            color: 'white',
                            background: 'rgba(0,0,0,0.3)',
                            '&:hover': { background: 'rgba(0,0,0,0.5)' }
                          }}
                          onClick={() => handleBookmarkToggle(course.id)}
                        >
                          {savedCourses[course.id] ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                      </Box>
                      <CardContent>
                        <Typography variant="h6" component="h2" gutterBottom noWrap>
                          {course.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar
                            src={course.instructorAvatar}
                            alt={course.instructor}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {course.instructor}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {course.description}
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="body2" fontWeight="medium">
                              Progress
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {course.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: 'linear-gradient(90deg, #2196f3, #64b5f6)'
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Chip
                            icon={<AccessTime fontSize="small" />}
                            label={course.duration}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="body2" color="text.secondary">
                            {course.lessonsCompleted}/{course.totalLessons} lessons
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No courses found matching your criteria
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLanguage('all');
                      setTabValue(0);
                    }}
                  >
                    Clear filters
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </motion.div>

        {/* Recommended courses section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Box mt={6} mb={3}>
            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
              Recommended for you
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Based on your learning history and preferences
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ display: 'flex', height: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140 }}
                  image="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Korean for Travelers"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip label="🇰🇷 Korean" size="small" sx={{ mb: 1 }} />
                    <Typography component="h5" variant="h6">
                      Korean for Travelers
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Essential phrases and vocabulary for your trip to Korea
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ color: '#FFD700', fontSize: 18 }} />
                      <Typography variant="body2" sx={{ ml: 0.5, mr: 1 }}>
                        4.9
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        (342 reviews)
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 0 }}>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      sx={{ ml: 'auto' }}
                    >
                      Enroll
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ display: 'flex', height: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140 }}
                  image="https://images.unsplash.com/photo-1589802829985-817e51171b92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Arabic Calligraphy"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip label="🇦🇪 Arabic" size="small" sx={{ mb: 1 }} />.

                    <Typography variant="body2" color="text.secondary" paragraph>
                      Learn the beautiful art of Arabic calligraphy while improving your language skills
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ color: '#FFD700', fontSize: 18 }} />
                      <Typography variant="body2" sx={{ ml: 0.5, mr: 1 }}>
                        4.7
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        (218 reviews)
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pt: 0 }}>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      sx={{ ml: 'auto' }}
                    >
                      Enroll
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
        {selectedCourse && (
          <CourseVideoPlayer
            open={videoPlayerOpen}
            onClose={() => {
              setVideoPlayerOpen(false);
              setSelectedCourse(null);
            }}
            course={selectedCourse}
            currentLessonIndex={selectedCourse.lessonsCompleted}
          />
        )}

        {/* Practice activities section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Box mt={6} mb={3}>
            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
              Daily Practice Activities
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Keep your language skills sharp with these quick exercises
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="activity-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mr: 2 }}>
                      <Mic />
                    </Avatar>
                    <Typography variant="h6">
                      Pronunciation Practice
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Record yourself speaking and get instant feedback on your pronunciation
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<PlayCircleOutline />}
                  >
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="activity-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', mr: 2 }}>
                      <Chat />
                    </Avatar>
                    <Typography variant="h6">
                      Conversation Challenge
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Practice real-life conversations with our AI language partner
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<PlayCircleOutline />}
                  >
                    Start Conversation
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="activity-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#fff8e1', color: '#f57c00', mr: 2 }}>
                      <SportsEsports />
                    </Avatar>
                    <Typography variant="h6">
                      Vocabulary Games
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Expand your vocabulary with fun, interactive language games
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<PlayCircleOutline />}
                  >
                    Play Games
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Learning streak section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Box mt={6} mb={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #2196f3, #64b5f6)',
                color: 'white'
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    You're on a 7-day learning streak!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                    Consistency is key to language mastery. Keep practicing daily to maintain your streak.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      bgcolor: 'white',
                      color: '#1976d2',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    Today's Challenge
                  </Button>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={120}
                      thickness={4}
                      sx={{ color: 'rgba(255,255,255,0.3)' }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={70}
                      size={120}
                      thickness={4}
                      sx={{
                        color: 'white',
                        position: 'absolute',
                        left: 0,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        7
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    days
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </motion.div>

        {/* Footer */}
        <Box mt={6} mb={3} pt={3} sx={{ borderTop: '1px solid #e0e0e0' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Language sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  LinguaLearn
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                The modern platform for language learning, offering interactive courses,
                conversation practice, and personalized learning paths.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Learn
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/courses" color="inherit" underline="hover">
                    All Courses
                  </MuiLink>
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/resources" color="inherit" underline="hover">
                    Resources
                  </MuiLink>
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/tutors" color="inherit" underline="hover">
                    Find Tutors
                  </MuiLink>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Company
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/about" color="inherit" underline="hover">
                    About Us
                  </MuiLink>
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/careers" color="inherit" underline="hover">
                    Careers
                  </MuiLink>
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/contact" color="inherit" underline="hover">
                    Contact
                  </MuiLink>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Support
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/help" color="inherit" underline="hover">
                    Help Center
                  </MuiLink>
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/faq" color="inherit" underline="hover">
                    FAQ
                  </MuiLink>
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/feedback" color="inherit" underline="hover">
                    Feedback
                  </MuiLink>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Legal
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/terms" color="inherit" underline="hover">
                    Terms
                  </MuiLink>
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/privacy" color="inherit" underline="hover">
                    Privacy
                  </MuiLink>
                </ListItem>
                <ListItem disableGutters disablePadding>
                  <MuiLink component={Link} to="/cookies" color="inherit" underline="hover">
                    Cookies
                  </MuiLink>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Box mt={3} pt={3} sx={{ borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} LinguaLearn. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
      <CourseVideoPlayer
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        course={currentCourse}
        currentLessonIndex={currentLesson}
      />

    </div>
  );
};

export default MyCourses;

