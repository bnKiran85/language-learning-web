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
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Grid,
  Slider,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  ArrowBack,
  Notifications,
  Person,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Dashboard,
  School,
  Leaderboard,
  Bookmark,
  VolumeUp,
  VolumeMute,
  Translate,
  Palette,
  Security,
  Notifications as NotificationsIcon,
  Language,
  SportsEsports,
  Save,
  Delete,
  DarkMode,
  LightMode,
  Psychology,
  MenuBook
} from '@mui/icons-material';
import { motion } from "framer-motion";
import "./Settings.css";

// Language options
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" }
];

// Theme options
const themes = [
  { id: "light", name: "Light", icon: <LightMode /> },
  { id: "dark", name: "Dark", icon: <DarkMode /> },
  { id: "system", name: "System Default", icon: <Palette /> }
];

// Difficulty levels
const difficultyLevels = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" }
];

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

// Settings Card component
function SettingsCard({ title, children }) {
  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 3, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {children}
      </CardContent>
    </Card>
  );
}

function Settings() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    language: "es",
    interfaceLanguage: "en",
    theme: "light",
    soundEffects: true,
    backgroundMusic: false,
    notifications: true,
    emailNotifications: false,
    difficulty: "medium",
    fontSize: 16,
    speechRecognition: true,
    autoSave: true,
    dataCollection: true,
    showHints: true,
    showTimer: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('gameLangSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error parsing saved settings:", error);
      }
    }
  }, []);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle settings change
  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };

  // Handle save settings
  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('gameLangSettings', JSON.stringify(settings));
    
    // Show success message
    setSnackbar({
      open: true,
      message: "Settings saved successfully!",
      severity: "success"
    });
  };

  // Handle reset settings
  const handleResetSettings = () => {
    const defaultSettings = {
      language: "es",
      interfaceLanguage: "en",
      theme: "light",
      soundEffects: true,
      backgroundMusic: false,
      notifications: true,
      emailNotifications: false,
      difficulty: "medium",
      fontSize: 16,
      speechRecognition: true,
      autoSave: true,
      dataCollection: true,
      showHints: true,
      showTimer: true
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('gameLangSettings', JSON.stringify(defaultSettings));
    
    setSnackbar({
      open: true,
      message: "Settings reset to defaults",
      severity: "info"
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
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
        <ListItem button selected>
          <ListItemIcon>
            <SettingsIcon color="primary" />
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

  return (
    <div className="settings-page">
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
            ⚙️ Settings
          </Typography>
          <IconButton
            color="inherit"
            aria-label="notifications"
          >
            <Notifications />
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="user profile"
          >
            <Avatar alt="User Profile" src="https://randomuser.me/api/portraits/men/85.jpg" />
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

      <Container className="settings-container">
        <Box className="settings-header">
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
              Settings
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ ml: { xs: 0, sm: 7 } }}
          >
            Customize your learning experience and application preferences
          </Typography>
        </Box>

        {/* Settings Tabs */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              aria-label="settings tabs"
            >
              <Tab 
                icon={<Translate />} 
                label={!isSmall && "Language"} 
                iconPosition="start"
              />
              <Tab 
                icon={<Palette />} 
                label={!isSmall && "Appearance"} 
                iconPosition="start"
              />
              <Tab 
                icon={<VolumeUp />} 
                label={!isSmall && "Sound"} 
                iconPosition="start"
              />
              <Tab 
                icon={<NotificationsIcon />} 
                label={!isSmall && "Notifications"} 
                iconPosition="start"
              />
              <Tab 
                icon={<SportsEsports />} 
                label={!isSmall && "Gameplay"} 
                iconPosition="start"
              />
              <Tab 
                icon={<Security />} 
                label={!isSmall && "Privacy"} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Language Settings */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <SettingsCard title="Learning Language">
                  <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                    <InputLabel id="language-select-label">Language you're learning</InputLabel>
                    <Select
                      labelId="language-select-label"
                      id="language-select"
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      label="Language you're learning"
                    >
                      {languages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>{lang.flag}</Typography>
                            {lang.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    This is the language you want to learn. All exercises and games will focus on this language.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ width: '100%', mb: 1 }}>
                      Popular languages:
                    </Typography>
                    {languages.map((lang) => (
                      <Chip 
                        key={lang.code}
                        label={`${lang.flag} ${lang.name}`}
                        onClick={() => handleSettingChange('language', lang.code)}
                        variant={settings.language === lang.code ? "filled" : "outlined"}
                        color={settings.language === lang.code ? "primary" : "default"}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </SettingsCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <SettingsCard title="Interface Language">
                  <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                    <InputLabel id="interface-language-select-label">App interface language</InputLabel>
                    <Select
                      labelId="interface-language-select-label"
                      id="interface-language-select"
                      value={settings.interfaceLanguage}
                      onChange={(e) => handleSettingChange('interfaceLanguage', e.target.value)}
                      label="App interface language"
                    >
                      {languages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>{lang.flag}</Typography>
                            {lang.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body2" color="text.secondary">
                    This controls the language used throughout the app interface, including menus, buttons, and instructions.
                  </Typography>
                </SettingsCard>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Appearance Settings */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <SettingsCard title="Theme">
                  <Box sx={{ mb: 3 }}>
                    {themes.map((themeOption) => (
                      <FormControlLabel
                        key={themeOption.id}
                        control={
                          <Switch
                            checked={settings.theme === themeOption.id}
                            onChange={() => handleSettingChange('theme', themeOption.id)}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {themeOption.icon}
                            <Typography sx={{ ml: 1 }}>{themeOption.name}</Typography>
                          </Box>
                        }
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    Choose between light and dark themes, or let the app follow your system settings.
                  </Typography>
                </SettingsCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <SettingsCard title="Text Size">
                  <Typography id="font-size-slider" gutterBottom>
                    Font Size: {settings.fontSize}px
                  </Typography>
                  <Slider
                    value={settings.fontSize}
                    onChange={(e, newValue) => handleSettingChange('fontSize', newValue)}
                    aria-labelledby="font-size-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={12}
                    max={24}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary">
                    Adjust the text size throughout the application for better readability.
                  </Typography>
                  
                  <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ fontSize: `${settings.fontSize}px` }}>
                      Sample text at {settings.fontSize}px
                    </Typography>
                  </Box>
                </SettingsCard>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Sound Settings */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <SettingsCard title="Sound Effects">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.soundEffects}
                        onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable sound effects"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Sound effects provide audio feedback for actions like correct answers, mistakes, and achievements.
                  </Typography>
                  
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                    <Typography id="volume-slider" gutterBottom sx={{ mr: 2 }}>
                      Volume:
                    </Typography>
                    <Slider
                      disabled={!settings.soundEffects}
                      defaultValue={70}
                      aria-labelledby="volume-slider"
                      valueLabelDisplay="auto"
                      sx={{ maxWidth: 200 }}
                    />
                  </Box>
                </SettingsCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <SettingsCard title="Background Music">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.backgroundMusic}
                        onChange={(e) => handleSettingChange('backgroundMusic', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable background music"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Play ambient background music while using the app to enhance focus and create a pleasant learning environment.
                  </Typography>
                  
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                    <Typography id="music-volume-slider" gutterBottom sx={{ mr: 2 }}>
                      Music Volume:
                    </Typography>
                    <Slider
                      disabled={!settings.backgroundMusic}
                      defaultValue={50}
                      aria-labelledby="music-volume-slider"
                      valueLabelDisplay="auto"
                      sx={{ maxWidth: 200 }}
                    />
                  </Box>
                </SettingsCard>
              </Grid>
              
              <Grid item xs={12}>
                <SettingsCard title="Speech Recognition">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.speechRecognition}
                        onChange={(e) => handleSettingChange('speechRecognition', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable speech recognition for pronunciation exercises"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Allow the app to listen to your pronunciation and provide feedback during speaking exercises.
                  </Typography>
                  
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Speech recognition requires microphone access permission. Make sure to allow microphone access in your browser settings.
                  </Alert>
                </SettingsCard>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Settings */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <SettingsCard title="In-App Notifications">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable in-app notifications"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                    Receive notifications about achievements, friend activities, and learning reminders while using the app.
                  </Typography>
                </SettingsCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <SettingsCard title="Email Notifications">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable email notifications"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                    Receive email updates about your progress, new features, and learning reminders.
                  </Typography>
                </SettingsCard>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Gameplay Settings */}
          <TabPanel value={activeTab} index={4}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <SettingsCard title="Difficulty Level">
                  <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                    <InputLabel id="difficulty-select-label">Default difficulty level</InputLabel>
                    <Select
                      labelId="difficulty-select-label"
                      id="difficulty-select"
                      value={settings.difficulty}
                      onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                      label="Default difficulty level"
                    >
                      {difficultyLevels.map((level) => (
                        <MenuItem key={level.value} value={level.value}>
                          {level.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body2" color="text.secondary">
                    Set your default difficulty level for games and exercises. This can be overridden in individual activities.
                  </Typography>
                </SettingsCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <SettingsCard title="Game Features">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showHints}
                        onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show hints during games"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Display helpful hints when you're stuck on a challenge.
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showTimer}
                        onChange={(e) => handleSettingChange('showTimer', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show timer during timed exercises"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Display countdown timer during timed challenges and exercises.
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Auto-save game progress"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Automatically save your progress in games and exercises.
                  </Typography>
                </SettingsCard>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Privacy Settings */}
          <TabPanel value={activeTab} index={5}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <SettingsCard title="Data Collection">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dataCollection}
                        onChange={(e) => handleSettingChange('dataCollection', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Allow anonymous usage data collection"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Help us improve the app by allowing collection of anonymous usage data. This includes information about which features you use and how you interact with the app.
                  </Typography>
                  
                  <Alert severity="info" sx={{ mt: 3 }}>
                    We never collect personal information or share your data with third parties. Your privacy is important to us.
                  </Alert>
                </SettingsCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <SettingsCard title="Account Data">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Save />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Export My Learning Data
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    fullWidth
                  >
                    Delete My Account
                  </Button>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    You can export all your learning data or delete your account completely. Account deletion is permanent and cannot be undone.
                  </Typography>
                </SettingsCard>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>

        {/* Action Buttons */}
        <Box className="settings-actions">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              color: 'white',
              padding: '12px 30px',
              fontSize: '1.1rem',
              borderRadius: '30px',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.5)'
              }
            }}
          >
            Save Settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<Delete />}
            onClick={handleResetSettings}
            sx={{
              borderColor: 'rgba(244, 67, 54, 0.5)',
              color: '#f44336',
              padding: '12px 30px',
              fontSize: '1.1rem',
              borderRadius: '30px',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.04)'
              }
            }}
          >
            Reset to Defaults
          </Button>
        </Box>

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

export default Settings;
