import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Button,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Chip,
  LinearProgress,
  Badge,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Tooltip,
  Switch,
  FormControlLabel
} from "@mui/material";
import {
  ArrowBack,
  Notifications,
  Menu as MenuIcon,
  Dashboard,
  School,
  Leaderboard as LeaderboardIcon,
  Bookmark,
  Settings,
  Person,
  Search,
  FilterList,
  Sort,
  EmojiEvents,
  Translate,
  SportsEsports,
  Public,
  Group,
  AccessTime,
  Star,
  StarBorder,
  ArrowUpward,
  ArrowDownward,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  FilterAlt,
  ArrowDropDown,
  Language,
  Psychology,
  MenuBook
} from '@mui/icons-material';
import { motion } from "framer-motion";
import "./Leaderboard.css";

// Sample leaderboard data
const leaderboardData = {
  global: [
    { 
      id: 1, 
      name: "Kiran BN", 
      username: "kiru", 
      avatar: "/avatars/user1.jpg", 
      xp: 24850, 
      level: 42, 
      streak: 65, 
      rank: 1, 
      rankChange: 0,
      languages: ["Spanish", "French", "German"],
      country: "US",
      countryFlag: "🇺🇸"
    },
    { 
      id: 2, 
      name: "Maria Garcia", 
      username: "mariag", 
      avatar: "/avatars/user2.jpg", 
      xp: 23720, 
      level: 40, 
      streak: 120, 
      rank: 2, 
      rankChange: 1,
      languages: ["English", "Portuguese", "Italian"],
      country: "ES",
      countryFlag: "🇪🇸"
    },
    { 
      id: 3, 
      name: "Hiroshi Tanaka", 
      username: "hiroshi", 
      avatar: "/avatars/user3.jpg", 
      xp: 22150, 
      level: 38, 
      streak: 90, 
      rank: 3, 
      rankChange: -1,
      languages: ["English", "Korean", "Chinese"],
      country: "JP",
      countryFlag: "🇯🇵"
    },
    { 
      id: 4, 
      name: "Sophie Martin", 
      username: "sophiem", 
      avatar: "/avatars/user4.jpg", 
      xp: 21980, 
      level: 37, 
      streak: 45, 
      rank: 4, 
      rankChange: 2,
      languages: ["English", "Spanish", "German"],
      country: "FR",
      countryFlag: "🇫🇷"
    },
    { 
      id: 5, 
      name: "Mohammed Al-Farsi", 
      username: "mohammedf", 
      avatar: "/avatars/user5.jpg", 
      xp: 20750, 
      level: 36, 
      streak: 60, 
      rank: 5, 
      rankChange: 0,
      languages: ["English", "French", "Turkish"],
      country: "AE",
      countryFlag: "🇦🇪"
    },
    { 
      id: 6, 
      name: "Anna Kowalski", 
      username: "annak", 
      avatar: "/avatars/user6.jpg", 
      xp: 19500, 
      level: 34, 
      streak: 30, 
      rank: 6, 
      rankChange: 3,
      languages: ["English", "German", "Russian"],
      country: "PL",
      countryFlag: "🇵🇱"
    },
    { 
      id: 7, 
      name: "Carlos Mendoza", 
      username: "carlosm", 
      avatar: "/avatars/user7.jpg", 
      xp: 18900, 
      level: 33, 
      streak: 25, 
      rank: 7, 
      rankChange: -2,
      languages: ["English", "Portuguese", "Italian"],
      country: "MX",
      countryFlag: "🇲🇽"
    },
    { 
      id: 8, 
      name: "Priya Patel", 
      username: "priyap", 
      avatar: "/avatars/user8.jpg", 
      xp: 18200, 
      level: 32, 
      streak: 80, 
      rank: 8, 
      rankChange: 0,
      languages: ["English", "Hindi", "Spanish"],
      country: "IN",
      countryFlag: "🇮🇳"
    },
    { 
      id: 9, 
      name: "Lars Svensson", 
      username: "larss", 
      avatar: "/avatars/user9.jpg", 
      xp: 17500, 
      level: 31, 
      streak: 50, 
      rank: 9, 
      rankChange: -3,
      languages: ["English", "Norwegian", "German"],
      country: "SE",
      countryFlag: "🇸🇪"
    },
    { 
      id: 10, 
      name: "Yuki Tanaka", 
      username: "yukit", 
      avatar: "/avatars/user10.jpg", 
      xp: 16800, 
      level: 30, 
      streak: 40, 
      rank: 10, 
      rankChange: 1,
      languages: ["English", "Korean", "Chinese"],
      country: "JP",
      countryFlag: "🇯🇵"
    }
  ],
  friends: [
    { 
      id: 101, 
      name: "Emma Wilson", 
      username: "emmaw", 
      avatar: "/avatars/friend1.jpg", 
      xp: 15200, 
      level: 28, 
      streak: 35, 
      rank: 1, 
      rankChange: 0,
      languages: ["Spanish", "French"],
      country: "GB",
      countryFlag: "🇬🇧"
    },
    { 
      id: 102, 
      name: "John Smith", 
      username: "johns", 
      avatar: "/avatars/friend2.jpg", 
      xp: 14500, 
      level: 26, 
      streak: 20, 
      rank: 2, 
      rankChange: 1,
      languages: ["German", "Italian"],
      country: "US",
      countryFlag: "🇺🇸"
    },
    { 
      id: 103, 
      name: "Olivia Brown", 
      username: "oliviab", 
      avatar: "/avatars/friend3.jpg", 
      xp: 13800, 
      level: 25, 
      streak: 15, 
      rank: 3, 
      rankChange: -1,
      languages: ["Japanese", "Korean"],
      country: "CA",
      countryFlag: "🇨🇦"
    },
    { 
      id: 104, 
      name: "Michael Davis", 
      username: "michaeld", 
      avatar: "/avatars/friend4.jpg", 
      xp: 12200, 
      level: 23, 
      streak: 10, 
      rank: 4, 
      rankChange: 0,
      languages: ["Spanish", "Portuguese"],
      country: "AU",
      countryFlag: "🇦🇺"
    },
    { 
      id: 105, 
      name: "Sophia Martinez", 
      username: "sophiam", 
      avatar: "/avatars/friend5.jpg", 
      xp: 11500, 
      level: 22, 
      streak: 25, 
      rank: 5, 
      rankChange: 2,
      languages: ["French", "Italian"],
      country: "ES",
      countryFlag: "🇪🇸"
    }
  ],
  languages: {
    Spanish: [
      { 
        id: 201, 
        name: "Maria Garcia", 
        username: "mariag", 
        avatar: "/avatars/user2.jpg", 
        xp: 12500, 
        level: 28, 
        streak: 120, 
        rank: 1, 
        rankChange: 0,
        country: "ES",
        countryFlag: "🇪🇸"
      },
      { 
        id: 202, 
        name: "Carlos Mendoza", 
        username: "carlosm", 
        avatar: "/avatars/user7.jpg", 
        xp: 11800, 
        level: 26, 
        streak: 25, 
        rank: 2, 
        rankChange: 1,
        country: "MX",
        countryFlag: "🇲🇽"
      },
      { 
        id: 1, 
        name: "Kiran BN", 
        username: "kiru", 
        avatar: "/avatars/user1.jpg", 
        xp: 10500, 
        level: 24, 
        streak: 65, 
        rank: 3, 
        rankChange: -1,
        country: "US",
        countryFlag: "🇺🇸"
      },
      { 
        id: 203, 
        name: "Sophie Martin", 
        username: "sophiem", 
        avatar: "/avatars/user4.jpg", 
        xp: 9800, 
        level: 22, 
        streak: 45, 
        rank: 4, 
        rankChange: 0,
        country: "FR",
        countryFlag: "🇫🇷"
      },
      { 
        id: 204, 
        name: "Priya Patel", 
        username: "priyap", 
        avatar: "/avatars/user8.jpg", 
        xp: 8500, 
        level: 20, 
        streak: 80, 
        rank: 5, 
        rankChange: 2,
        country: "IN",
        countryFlag: "🇮🇳"
      }
    ],
    French: [
      { 
        id: 301, 
        name: "Sophie Martin", 
        username: "sophiem", 
        avatar: "/avatars/user4.jpg", 
        xp: 14200, 
        level: 30, 
        streak: 45, 
        rank: 1, 
        rankChange: 0,
        country: "FR",
        countryFlag: "🇫🇷"
      },
      { 
        id: 1, 
        name: "Kiran BN", 
        username: "kiru", 
        avatar: "/avatars/user1.jpg", 
        xp: 12800, 
        level: 28, 
        streak: 65, 
        rank: 2, 
        rankChange: 1,
        country: "US",
        countryFlag: "🇺🇸"
      },
      { 
        id: 302, 
        name: "Mohammed Al-Farsi", 
        username: "mohammedf", 
        avatar: "/avatars/user5.jpg", 
        xp: 11500, 
        level: 26, 
        streak: 60, 
        rank: 3, 
        rankChange: -1,
        country: "AE",
        countryFlag: "🇦🇪"
      },
      { 
        id: 303, 
        name: "Emma Wilson", 
        username: "emmaw", 
        avatar: "/avatars/friend1.jpg", 
        xp: 10200, 
        level: 24, 
        streak: 35, 
        rank: 4, 
        rankChange: 0,
        country: "GB",
        countryFlag: "🇬🇧"
      },
      { 
        id: 304, 
        name: "Sophia Martinez", 
        username: "sophiam", 
        avatar: "/avatars/friend5.jpg", 
        xp: 9500, 
        level: 22, 
        streak: 25, 
        rank: 5, 
        rankChange: 2,
        country: "ES",
        countryFlag: "🇪🇸"
      }
    ],
    German: [
      { 
        id: 401, 
        name: "Anna Kowalski", 
        username: "annak", 
        avatar: "/avatars/user6.jpg", 
        xp: 13500, 
        level: 29, 
        streak: 30, 
        rank: 1, 
        rankChange: 0,
        country: "PL",
        countryFlag: "🇵🇱"
      },
      { 
        id: 402, 
        name: "Lars Svensson", 
        username: "larss", 
        avatar: "/avatars/user9.jpg", 
        xp: 12800, 
        level: 27, 
        streak: 50, 
        rank: 2, 
        rankChange: 0,
        country: "SE",
        countryFlag: "🇸🇪"
      },
      { 
        id: 1, 
        name: "Alex Johnson", 
        username: "alexj", 
        avatar: "/avatars/user1.jpg", 
        xp: 11200, 
        level: 25, 
        streak: 65, 
        rank: 3, 
        rankChange: 2,
        country: "US",
        countryFlag: "🇺🇸"
      },
      { 
        id: 403, 
        name: "Sophie Martin", 
        username: "sophiem", 
        avatar: "/avatars/user4.jpg", 
        xp: 10500, 
        level: 24, 
        streak: 45, 
        rank: 4, 
        rankChange: -1,
        country: "FR",
        countryFlag: "🇫🇷"
      },
      { 
        id: 404, 
        name: "John Smith", 
        username: "johns", 
        avatar: "/avatars/friend2.jpg", 
        xp: 9800, 
        level: 22, 
        streak: 20, 
        rank: 5, 
        rankChange: -1,
        country: "US",
        countryFlag: "🇺🇸"
      }
    ]
  },
  games: {
    "Memory Match": [
      { 
        id: 501, 
        name: "Priya Patel", 
        username: "priyap", 
        avatar: "/avatars/user8.jpg", 
        score: 9850, 
        level: 32, 
        rank: 1, 
        rankChange: 1,
        country: "IN",
        countryFlag: "🇮🇳"
      },
      { 
        id: 502, 
        name: "Hiroshi Tanaka", 
        username: "hiroshi", 
        avatar: "/avatars/user3.jpg", 
        score: 9720, 
        level: 38, 
        rank: 2, 
        rankChange: -1,
        country: "JP",
        countryFlag: "🇯🇵"
      },
      { 
        id: 1, 
        name: "Alex Johnson", 
        username: "alexj", 
        avatar: "/avatars/user1.jpg", 
        score: 9500, 
        level: 42, 
        rank: 3, 
        rankChange: 0,
        country: "US",
        countryFlag: "🇺🇸"
      },
      { 
        id: 503, 
        name: "Maria Garcia", 
        username: "mariag", 
        avatar: "/avatars/user2.jpg", 
        score: 9350, 
        level: 40, 
        rank: 4, 
        rankChange: 0,
        country: "ES",
        countryFlag: "🇪🇸"
      },
      { 
        id: 504, 
        name: "Yuki Tanaka", 
        username: "yukit", 
        avatar: "/avatars/user10.jpg", 
        score: 9100, 
        level: 30, 
        rank: 5, 
        rankChange: 3,
        country: "JP",
        countryFlag: "🇯🇵"
      }
    ],
    "Word Quiz": [
      { 
        id: 601, 
        name: "Maria Garcia", 
        username: "mariag", 
        avatar: "/avatars/user2.jpg", 
        score: 8950, 
        level: 40, 
        rank: 1, 
        rankChange: 0,
        country: "ES",
        countryFlag: "🇪🇸"
      },
      { 
        id: 602, 
        name: "Sophie Martin", 
        username: "sophiem", 
        avatar: "/avatars/user4.jpg", 
        score: 8800, 
        level: 37, 
        rank: 2, 
        rankChange: 1,
        country: "FR",
        countryFlag: "🇫🇷"
      },
      { 
        id: 603, 
        name: "Lars Svensson", 
        username: "larss", 
        avatar: "/avatars/user9.jpg", 
        score: 8650, 
        level: 31, 
        rank: 3, 
        rankChange: -1,
        country: "SE",
        countryFlag: "🇸🇪"
      },
      { 
        id: 1, 
        name: "Alex Johnson", 
        username: "alexj", 
        avatar: "/avatars/user1.jpg", 
        score: 8500, 
        level: 42, 
        rank: 4, 
        rankChange: 2,
        country: "US",
        countryFlag: "🇺🇸"
      },
      { 
        id: 604, 
        name: "Carlos Mendoza", 
        username: "carlosm", 
        avatar: "/avatars/user7.jpg", 
        score: 8350, 
        level: 33, 
        rank: 5, 
        rankChange: -1,
        country: "MX",
        countryFlag: "🇲🇽"
      }
    ]
  }
};

// Available languages
const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" }
];

// Available games
const games = [
  "Memory Match",
  "Word Quiz",
  "Sentence Builder",
  "Pronunciation Practice",
  "Vocabulary Challenge"
];

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Rank change indicator component
const RankChangeIndicator = ({ change }) => {
  if (change === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
        <TrendingFlat fontSize="small" />
        <Typography variant="body2" sx={{ ml: 0.5 }}>0</Typography>
      </Box>
    );
  } else if (change > 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
        <TrendingUp fontSize="small" />
        <Typography variant="body2" sx={{ ml: 0.5 }}>+{change}</Typography>
      </Box>
    );
  } else {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
        <TrendingDown fontSize="small" />
        <Typography variant="body2" sx={{ ml: 0.5 }}>{change}</Typography>
      </Box>
    );
  }
};

function Leaderboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    timeFrame: "weekly",
    country: "all"
  });
  const [sortOption, setSortOption] = useState("rank");
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [selectedGame, setSelectedGame] = useState("Memory Match");
  const [showOnlyFriends, setShowOnlyFriends] = useState(false);
  const [highlightUser, setHighlightUser] = useState(true);
  
  // Current user ID (for highlighting)
  const currentUserId = 1; // Alex Johnson

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle sort menu
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterOptions({
      ...filterOptions,
      [name]: value
    });
  };

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
    handleSortClose();
  };

  // Handle language change
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  // Handle game change
  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
  };

  // Filter and sort users
  const getFilteredUsers = (users) => {
    if (!users) return [];
    
    return users
      .filter(user => {
        // Search filter
        if (searchQuery && 
            !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !user.username.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Country filter
        if (filterOptions.country !== "all" && user.country !== filterOptions.country) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort options
        switch (sortOption) {
          case "name":
            return a.name.localeCompare(b.name);
          case "level":
            return b.level - a.level;
          case "xp":
          case "score":
            return (b.xp || b.score) - (a.xp || a.score);
          case "streak":
            return (b.streak || 0) - (a.streak || 0);
          case "rank":
          default:
            return a.rank - b.rank;
        }
      });
  };

  // Get current leaderboard data based on active tab
  const getCurrentLeaderboardData = () => {
    switch (activeTab) {
      case 0: // Global
        return getFilteredUsers(leaderboardData.global);
      case 1: // Friends
        return getFilteredUsers(leaderboardData.friends);
      case 2: // Languages
        return getFilteredUsers(leaderboardData.languages[selectedLanguage]);
      case 3: // Games
        return getFilteredUsers(leaderboardData.games[selectedGame]);
      default:
        return [];
    }
  };

  const filteredUsers = getCurrentLeaderboardData();

  // Find current user in the leaderboard
  const currentUserInLeaderboard = filteredUsers.find(user => user.id === currentUserId);

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
        <ListItem button onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate("/courses")}>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="My Courses" />
        </ListItem>
        <ListItem button selected>
          <ListItemIcon>
            <LeaderboardIcon color="primary" />
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

  return (
    <div className="leaderboard-page">
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🏆 Leaderboard
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
            onClick={() => navigate("/profile")}
          >
            <Avatar 
              alt="User Profile" 
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

      <Container className="leaderboard-container">
        <Box className="leaderboard-header">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton 
              sx={{ mr: 2 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBack />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
            >
              Leaderboard
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ ml: { xs: 0, sm: 7 } }}
          >
            See how you rank against other learners
          </Typography>
        </Box>

        {/* Search and Filter Bar */}
     <Box 
  component={motion.div}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="search-filter-bar"
  sx={{ 
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    mb: 4,
    alignItems: 'center',
    justifyContent: 'space-between'
  }}
>
  <TextField
    placeholder="Search users..."
    variant="outlined"
    value={searchQuery}
    onChange={handleSearchChange}
    sx={{ 
      flexGrow: 1,
      minWidth: { xs: '100%', sm: '300px' },
      maxWidth: { sm: '400px' }
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      ),
    }}
  />
  
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Button
      variant="outlined"
      startIcon={<FilterAlt />}
      endIcon={<ArrowDropDown />}
      onClick={handleFilterClick}
      sx={{ borderRadius: 2 }}
    >
      Filter
    </Button>
    
    <Button
      variant="outlined"
      startIcon={<Sort />}
      endIcon={<ArrowDropDown />}
      onClick={handleSortClick}
      sx={{ borderRadius: 2 }}
    >
      Sort
    </Button>
  </Box>
</Box>
{/* // Filter menus */}
<Menu
  anchorEl={filterAnchorEl}
  open={Boolean(filterAnchorEl)}
  onClose={handleFilterClose}
>
  <MenuItem>
    <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="time-frame-label">Time Frame</InputLabel>
      <Select
        labelId="time-frame-label"
        name="timeFrame"
        value={filterOptions.timeFrame}
        label="Time Frame"
        onChange={handleFilterChange}
      >
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
        <MenuItem value="allTime">All Time</MenuItem>
      </Select>
    </FormControl>
  </MenuItem>
  <MenuItem>
    <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="country-label">Country</InputLabel>
      <Select
        labelId="country-label"
        name="country"
        value={filterOptions.country}
        label="Country"
        onChange={handleFilterChange}
      >
        <MenuItem value="all">All Countries</MenuItem>
        <MenuItem value="US">United States 🇺🇸</MenuItem>
        <MenuItem value="ES">Spain 🇪🇸</MenuItem>
        <MenuItem value="JP">Japan 🇯🇵</MenuItem>
        <MenuItem value="FR">France 🇫🇷</MenuItem>
        <MenuItem value="DE">Germany 🇩🇪</MenuItem>
      </Select>
    </FormControl>
  </MenuItem>
  <MenuItem>
    <FormControlLabel
      control={
        <Switch
          checked={showOnlyFriends}
          onChange={(e) => setShowOnlyFriends(e.target.checked)}
        />
      }
      label="Show only friends"
    />
  </MenuItem>
  <MenuItem>
    <FormControlLabel
      control={
        <Switch
          checked={highlightUser}
          onChange={(e) => setHighlightUser(e.target.checked)}
        />
      }
      label="Highlight me"
    />
  </MenuItem>
</Menu>

<Menu
  anchorEl={sortAnchorEl}
  open={Boolean(sortAnchorEl)}
  onClose={handleSortClose}
>
  <MenuItem onClick={() => handleSortChange("rank")}>
    Rank
    {sortOption === "rank" && <ArrowUpward fontSize="small" sx={{ ml: 1 }} />}
  </MenuItem>
  <MenuItem onClick={() => handleSortChange("xp")}>
    XP/Score
    {sortOption === "xp" && <ArrowDownward fontSize="small" sx={{ ml: 1 }} />}
  </MenuItem>
  <MenuItem onClick={() => handleSortChange("level")}>
    Level
    {sortOption === "level" && <ArrowDownward fontSize="small" sx={{ ml: 1 }} />}
  </MenuItem>
  <MenuItem onClick={() => handleSortChange("streak")}>
    Streak
    {sortOption === "streak" && <ArrowDownward fontSize="small" sx={{ ml: 1 }} />}
  </MenuItem>
  <MenuItem onClick={() => handleSortChange("name")}>
    Name
    {sortOption === "name" && <ArrowUpward fontSize="small" sx={{ ml: 1 }} />}
  </MenuItem>
</Menu>

{/* Tabs */}
<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
  <Tabs 
    value={activeTab} 
    onChange={handleTabChange}
    variant={isMobile ? "scrollable" : "fullWidth"}
    scrollButtons={isMobile ? "auto" : false}
    allowScrollButtonsMobile
  >
    <Tab 
      icon={<Public />} 
      label={!isSmall && "Global"} 
      iconPosition="start"
    />
    <Tab 
      icon={<Group />} 
      label={!isSmall && "Friends"} 
      iconPosition="start"
    />
    <Tab 
      icon={<Language />} 
      label={!isSmall && "Languages"} 
      iconPosition="start"
    />
    <Tab 
      icon={<SportsEsports />} 
      label={!isSmall && "Games"} 
      iconPosition="start"
    />
  </Tabs>
</Box>

{/* Tab Panels */}
<TabPanel value={activeTab} index={0}>
  {loading ? (
    <LeaderboardSkeleton />
  ) : (
    <LeaderboardTable 
      users={filteredUsers} 
      currentUserId={currentUserId}
      highlightUser={highlightUser}
      sortOption={sortOption}
    />
  )}
</TabPanel>

<TabPanel value={activeTab} index={1}>
  {loading ? (
    <LeaderboardSkeleton />
  ) : (
    <LeaderboardTable 
      users={filteredUsers} 
      currentUserId={currentUserId}
      highlightUser={highlightUser}
      sortOption={sortOption}
    />
  )}
</TabPanel>

<TabPanel value={activeTab} index={2}>
  <Box sx={{ mb: 3 }}>
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel id="language-select-label">Select Language</InputLabel>
      <Select
        labelId="language-select-label"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        label="Select Language"
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.name}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1 }}>{lang.flag}</Typography>
              {lang.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
  
  {loading ? (
    <LeaderboardSkeleton />
  ) : (
    <LeaderboardTable 
      users={filteredUsers} 
      currentUserId={currentUserId}
      highlightUser={highlightUser}
      sortOption={sortOption}
    />
  )}
</TabPanel>

<TabPanel value={activeTab} index={3}>
  <Box sx={{ mb: 3 }}>
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel id="game-select-label">Select Game</InputLabel>
      <Select
        labelId="game-select-label"
        value={selectedGame}
        onChange={handleGameChange}
        label="Select Game"
      >
        {games.map((game) => (
          <MenuItem key={game} value={game}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SportsEsports sx={{ mr: 1 }} />
              {game}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
  
  {loading ? (
    <LeaderboardSkeleton />
  ) : (
    <LeaderboardTable 
      users={filteredUsers} 
      currentUserId={currentUserId}
      highlightUser={highlightUser}
      sortOption={sortOption}
    />
  )}
</TabPanel>

{/* Current User Card */}
{currentUserInLeaderboard && (
  <Box 
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    sx={{ mt: 4 }}
  >
    <Typography variant="h6" gutterBottom>
      Your Position
    </Typography>
    <Card 
      elevation={3}
      sx={{ 
        borderRadius: 2,
        background: 'linear-gradient(to right, rgba(63, 81, 181, 0.1), rgba(63, 81, 181, 0.05))',
        border: '1px solid rgba(63, 81, 181, 0.2)'
      }}
    >
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={1}>
            <Typography variant="h6" fontWeight="bold">
              #{currentUserInLeaderboard.rank}
            </Typography>
          </Grid>
          <Grid item xs={2} sm={1}>
            <Avatar 
              src={currentUserInLeaderboard.avatar || "/default-avatar.jpg"} 
              alt={currentUserInLeaderboard.name}
              sx={{ width: 40, height: 40 }}
            />
          </Grid>
          <Grid item xs={5} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentUserInLeaderboard.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{currentUserInLeaderboard.username}
            </Typography>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Chip 
              icon={<Star fontSize="small" />} 
              label={`Level ${currentUserInLeaderboard.level}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">
              XP: {currentUserInLeaderboard.xp || currentUserInLeaderboard.score || 0}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={70} 
              sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <RankChangeIndicator change={currentUserInLeaderboard.rankChange} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Box>
)}

{/* Back to Top Button */}
<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
  <Button
    variant="contained"
    color="primary"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    startIcon={<ArrowUpward />}
  >
    Back to Top
  </Button>
</Box>
      </Container>
    </div>
  );
}

// Leaderboard Table Component
const LeaderboardTable = ({ users, currentUserId, highlightUser, sortOption }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="10%">Rank</TableCell>
            <TableCell width="40%">User</TableCell>
            <TableCell width="20%" align="center">
              {sortOption === "xp" || sortOption === "score" ? "XP/Score" : "Level"}
            </TableCell>
            <TableCell width="15%" align="center">Streak</TableCell>
            <TableCell width="15%" align="center">Change</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id}
              sx={{ 
                backgroundColor: highlightUser && user.id === currentUserId 
                  ? 'rgba(63, 81, 181, 0.08)' 
                  : 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <TableCell>
                <Typography variant="body1" fontWeight="medium">
                  #{user.rank}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={user.avatar || "/default-avatar.jpg"} 
                    alt={user.name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {user.name}
                      {user.id === currentUserId && (
                        <Typography 
                          component="span" 
                          sx={{ 
                            ml: 1, 
                            fontSize: '0.75rem', 
                            color: 'primary.main',
                            bgcolor: 'primary.lighter',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          YOU
                        </Typography>
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        @{user.username}
                      </Typography>
                      {user.countryFlag && (
                        <Tooltip title={user.country}>
                          <Typography variant="body2">{user.countryFlag}</Typography>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="center">
                {sortOption === "xp" || sortOption === "score" ? (
                  <Typography variant="body1" fontWeight="medium">
                    {user.xp || user.score || 0}
                  </Typography>
                ) : (
                  <Chip 
                    icon={<Star fontSize="small" />} 
                    label={`Level ${user.level}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {user.streak ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AccessTime fontSize="small" sx={{ mr: 0.5, color: 'warning.main' }} />
                    <Typography variant="body2">{user.streak} days</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">-</Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <RankChangeIndicator change={user.rankChange} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Skeleton loader for leaderboard
const LeaderboardSkeleton = () => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="10%">Rank</TableCell>
            <TableCell width="40%">User</TableCell>
            <TableCell width="20%" align="center">Level</TableCell>
            <TableCell width="15%" align="center">Streak</TableCell>
            <TableCell width="15%" align="center">Change</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="text" width={30} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box>
                    <Skeleton variant="text" width={120} />
                    <Skeleton variant="text" width={80} />
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="rounded" width={80} height={24} sx={{ mx: 'auto' }} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={60} sx={{ mx: 'auto' }} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={40} sx={{ mx: 'auto' }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Leaderboard;
