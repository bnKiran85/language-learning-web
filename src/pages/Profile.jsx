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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import {
  ArrowBack,
  Notifications,
  Menu as MenuIcon,
  Dashboard,
  School,
  Leaderboard,
  Bookmark,
  Settings,
  Person,
  Edit,
  EmojiEvents,
  Timeline,
  Language,
  SportsEsports,
  Favorite,
  Star,
  StarBorder,
  CheckCircle,
  PhotoCamera,
  Save,
  Cancel,
  Translate,
  Psychology,
  MenuBook
} from '@mui/icons-material';
import { motion } from "framer-motion";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";

// Removed mock userData

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, updateUserProfile } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.displayName || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || ""
  });
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setEditMode(true);
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        displayName: editedProfile.name,
        username: editedProfile.username,
        email: editedProfile.email,
        bio: editedProfile.bio
      });
      setEditMode(false);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success"
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to update profile.",
        severity: "error"
      });
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditedProfile({
      name: user?.displayName || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || ""
    });
    setEditMode(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  // Handle avatar dialog
  const handleAvatarDialogOpen = () => {
    setAvatarDialogOpen(true);
  };

  const handleAvatarDialogClose = () => {
    setAvatarDialogOpen(false);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Calculate XP progress percentage
  const xp = user?.xp || 0;
  const xpToNextLevel = user?.xpToNextLevel || 500;
  const xpProgressPercentage = (xp / xpToNextLevel) * 100;

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
        <ListItem button>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="My Courses" />
        </ListItem>
        <ListItem button>
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
        <ListItem button onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button selected>
          <ListItemIcon>
            <Person color="primary" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="profile-page">
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
            👤 Profile
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
          >
            <Avatar 
              alt={user?.displayName || "User"} 
              src={user?.profilePicture}
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

      <Container className="profile-container">
        <Box className="profile-header">
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
              My Profile
            </Typography>
          </Box>
        </Box>

        {/* User Profile Card */}
        <Card 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="profile-card"
          elevation={3}
          sx={{ mb: 4, borderRadius: 3, overflow: 'visible' }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box className="profile-cover-photo" />
            
            <Box className="profile-info-container">
              <Box className="profile-avatar-container">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton 
                      className="avatar-edit-button"
                      onClick={handleAvatarDialogOpen}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    alt={user?.displayName || "User"}
                    src={user?.profilePicture}
                    className="profile-avatar"
                    sx={{ width: 120, height: 120, border: '4px solid white' }}
                  />
                </Badge>
              </Box>
              
              <Box className="profile-details" sx={{ px: 3, pb: 3 }}>
                {!editMode ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                          {user?.displayName || "User"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          @{user?.username || "student"} • Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEditProfile}
                        sx={{ borderRadius: 2 }}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                    
                    <Typography variant="body1" paragraph>
                      {user?.bio || "No biography provided."}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                      <Chip 
                        icon={<EmojiEvents />} 
                        label={`Level ${user?.level || 1}`} 
                        color="success" 
                        variant="outlined"
                      />
                      <Chip 
                        icon={<Timeline />} 
                        label={`${user?.xp || 0} XP`} 
                        color="success" 
                        variant="outlined"
                      />
                      <Chip 
                        icon={<Favorite />} 
                        label={`${user?.streak || 0} Day Streak`} 
                        color="error" 
                        variant="outlined"
                      />
                      <Chip 
                        icon={<Language />} 
                        label={`${(user?.languages || []).length} Languages`} 
                        color="success" 
                        variant="outlined"
                      />
                    </Box>
                  </>
                ) : (
                  <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={editedProfile.name}
                          onChange={handleInputChange}
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={editedProfile.username}
                          onChange={handleInputChange}
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={handleInputChange}
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          name="bio"
                          value={editedProfile.bio}
                          onChange={handleInputChange}
                          variant="outlined"
                          margin="normal"
                          multiline
                          rows={3}
                        />
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveProfile}
                        color="primary"
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Level Progress */}
        <Card 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          elevation={2}
          sx={{ mb: 4, borderRadius: 2, p: 3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Level Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.xp || 0} / {user?.xpToNextLevel || 500} XP
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={xpProgressPercentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              mb: 1,
              background: 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #4CAF50, #8BC34A)'
              }
            }} 
          />
          
          <Typography variant="body2" color="text.secondary">
            {Math.round((user?.xpToNextLevel || 500) - (user?.xp || 0))} XP needed for Level {(user?.level || 1) + 1}
          </Typography>
        </Card>

        {/* Profile Tabs */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              aria-label="profile tabs"
            >
              <Tab 
                icon={<Language />} 
                label={!isSmall && "Languages"} 
                iconPosition="start"
              />
              <Tab 
                icon={<EmojiEvents />} 
                label={!isSmall && "Achievements"} 
                iconPosition="start"
              />
              <Tab 
                icon={<Timeline />} 
                label={!isSmall && "Stats"} 
                iconPosition="start"
              />
              <Tab 
                icon={<Psychology />} 
                label={!isSmall && "Activity"} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Languages Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {(user?.languages || []).map((language) => (
                <Grid item xs={12} sm={6} md={4} key={language.code}>
                  <Card 
                    className="language-card"
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h2" sx={{ mr: 2 }}>
                          {language.flag}
                        </Typography>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {language.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Level {language.level}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2">{language.progress}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={language.progress} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            background: 'rgba(0,0,0,0.05)'
                          }} 
                        />
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        fullWidth
                        sx={{ 
                          mt: 'auto',
                          borderRadius: 2,
                          textTransform: 'none'
                        }}
                      >
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  className="add-language-card"
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    p: 3
                  }}
                >
                  <Language sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" align="center" gutterBottom>
                    Add New Language
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    Expand your language learning journey
                  </Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Browse Languages
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Achievements Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {(user?.achievements || []).map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card 
                    className={`achievement-card ${achievement.completed ? 'completed' : ''}`}
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'visible'
                    }}
                  >
                    {achievement.completed && (
                      <Box 
                        className="achievement-badge"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          zIndex: 1
                        }}
                      >
                        <CheckCircle color="success" sx={{ fontSize: 28 }} />
                      </Box>
                    )}
                    
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h2" sx={{ mb: 1 }}>
                          {achievement.icon}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" align="center">
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          {achievement.description}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2">{achievement.progress}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={achievement.progress} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            background: 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                              background: achievement.completed 
                                ? 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                                : 'linear-gradient(90deg, #2196F3, #03A9F4)'
                            }
                          }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Stats Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Learning Statistics
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box className="stat-box">
                          <Typography variant="body2" color="text.secondary">
                            Total XP Earned
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {(user?.stats?.totalXP || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className="stat-box">
                          <Typography variant="body2" color="text.secondary">
                            Words Learned
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {(user?.stats?.wordsLearned || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className="stat-box">
                          <Typography variant="body2" color="text.secondary">
                            Lessons Completed
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {user?.stats?.lessonsCompleted || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className="stat-box">
                          <Typography variant="body2" color="text.secondary">
                            Quizzes Taken
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {user?.stats?.quizzesTaken || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className="stat-box">
                          <Typography variant="body2" color="text.secondary">
                            Games Played
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {user?.stats?.gamesPlayed || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className="stat-box">
                          <Typography variant="body2" color="text.secondary">
                            Days Active
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {user?.stats?.daysActive || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Learning Streak
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" fontWeight="bold" color="error.main">
                          {user?.streak || 0}
                        </Typography>
                        <Typography variant="body1">
                          Day Streak 🔥
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                      {[...Array(7)].map((_, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            textAlign: 'center',
                            opacity: index < 5 ? 1 : 0.5
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                          </Typography>
                          <Box 
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              borderRadius: '50%', 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: index < 5 ? 'error.main' : 'background.paper',
                              border: index < 5 ? 'none' : '1px dashed',
                              borderColor: 'divider',
                              color: index < 5 ? 'white' : 'text.secondary',
                              mt: 1
                            }}
                          >
                            {index < 5 ? <CheckCircle fontSize="small" /> : ''}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Language Proficiency
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    {(user?.languages || []).map((language) => (
                      <Box key={language.code} sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ mr: 1 }}>
                              {language.flag}
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {language.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                              Level {language.level}
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                             {/* // Continuing from line 893 where the code was cut off: */}
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  sx={{ 
                                    fontSize: 16, 
                                    color: i < Math.floor(language.level / 5) ? 'warning.main' : 'text.disabled'
                                  }} 
                                />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">Proficiency</Typography>
                            <Typography variant="body2">{language.progress}%</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={language.progress} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              background: 'rgba(0,0,0,0.05)'
                            }} 
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          <Chip size="small" label="Vocabulary" />
                          <Chip size="small" label="Grammar" />
                          <Chip size="small" label="Listening" />
                          <Chip size="small" label="Speaking" />
                        </Box>
                      </Box>
                    ))}
                    
                    <Button 
                      variant="outlined" 
                      fullWidth
                      sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                    >
                      View Detailed Progress
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Activity Tab */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 2, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Recent Activity
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List>
                      {(user?.recentActivity || []).map((activity, index) => (
                        <React.Fragment key={index}>
                          <ListItem 
                            sx={{ 
                              px: 0,
                              py: 1.5
                            }}
                          >
                            <Box sx={{ display: 'flex', width: '100%' }}>
                              <Box 
                                sx={{ 
                                  mr: 2,
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: 
                                    activity.type === 'lesson' ? 'primary.light' :
                                    activity.type === 'game' ? 'success.light' :
                                    activity.type === 'quiz' ? 'warning.light' : 'error.light',
                                  color: 
                                    activity.type === 'lesson' ? 'primary.dark' :
                                    activity.type === 'game' ? 'success.dark' :
                                    activity.type === 'quiz' ? 'warning.dark' : 'error.dark',
                                }}
                              >
                                {activity.type === 'lesson' && <MenuBook />}
                                {activity.type === 'game' && <SportsEsports />}
                                {activity.type === 'quiz' && <Psychology />}
                                {activity.type === 'achievement' && <EmojiEvents />}
                              </Box>
                              
                              <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body1" fontWeight="medium">
                                    {activity.title}
                                  </Typography>
                                  <Chip 
                                    size="small" 
                                    label={`+${activity.xp} XP`}
                                    sx={{ 
                                      bgcolor: 'success.light',
                                      color: 'success.dark',
                                      fontWeight: 'bold'
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {activity.date}
                                </Typography>
                              </Box>
                            </Box>
                          </ListItem>
                          {index < (user?.recentActivity || []).length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                    
                    <Button 
                      variant="text" 
                      fullWidth
                      sx={{ mt: 2, textTransform: 'none' }}
                    >
                      View All Activity
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 2, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Friends
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List>
                      {(user?.friends || []).map((friend, index) => (
                        <React.Fragment key={friend.id}>
                          <ListItem 
                            sx={{ 
                              px: 0,
                              py: 1
                            }}
                          >
                            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                              <Avatar 
                                src={friend.avatar} 
                                alt={friend.name}
                                sx={{ mr: 2 }}
                              />
                              
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body1">
                                  {friend.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Level {friend.level}
                                </Typography>
                              </Box>
                              
                              <Button 
                                variant="outlined" 
                                size="small"
                                sx={{ 
                                  minWidth: 0, 
                                  borderRadius: 2,
                                  px: 2
                                }}
                              >
                                View
                              </Button>
                            </Box>
                          </ListItem>
                          {index < (user?.friends || []).length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                    
                    <Button 
                      variant="text" 
                      fullWidth
                      sx={{ mt: 2, textTransform: 'none' }}
                    >
                      Find Friends
                    </Button>
                  </CardContent>
                </Card>
                
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Suggested Courses
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ mr: 1 }}>
                            🇪🇸
                          </Typography>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              Spanish Conversation
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Intermediate • 12 lessons
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                      
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ mr: 1 }}>
                            🇫🇷
                          </Typography>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              French Grammar Mastery
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Beginner • 8 lessons
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                    
                    <Button 
                      variant="text" 
                      fullWidth
                      sx={{ textTransform: 'none' }}
                    >
                      Browse All Courses
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>

        {/* Avatar Change Dialog */}
        <Dialog
          open={avatarDialogOpen}
          onClose={handleAvatarDialogClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Avatar
                alt={user?.displayName || "User"}
                src={user?.profilePicture}
                sx={{ width: 100, height: 100, mb: 3 }}
              />
              
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                />
              </Button>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Recommended: Square image, at least 200x200 pixels
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAvatarDialogClose}>Cancel</Button>
            <Button onClick={handleAvatarDialogClose} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default Profile;

