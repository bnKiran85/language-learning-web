import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Fade,
  Slide,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Visibility,
  VisibilityOff,
  Language,
  LockOutlined,
  EmailOutlined,
  SportsEsports
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { loginUser } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isNewUser) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const res = await axios.post(`${API_URL}/users/login`, {
        firebaseUid: userCredential.user.uid,
        displayName: userCredential.user.displayName || email.split('@')[0],
        email: userCredential.user.email
      });

      loginUser(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth Error:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      const res = await axios.post(`${API_URL}/users/login`, {
        firebaseUid: userCredential.user.uid,
        displayName: userCredential.user.displayName,
        email: userCredential.user.email
      });
      
      loginUser(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, new FacebookAuthProvider());
      const res = await axios.post(`${API_URL}/users/login`, {
        firebaseUid: userCredential.user.uid,
        displayName: userCredential.user.displayName,
        email: userCredential.user.email
      });
      
      loginUser(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Facebook Login Error:", error.message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "10%",
          left: "5%",
          animation: "float 8s infinite ease-in-out"
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          bottom: "10%",
          right: "15%",
          animation: "float 6s infinite ease-in-out"
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "40%",
          right: "5%",
          animation: "float 10s infinite ease-in-out"
        }}
      />

      <Fade in={true} timeout={1000}>
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            width: "100%",
            maxWidth: "1000px",
            background: "#ffffff",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
          }}
        >
          <Grid container>
            {/* Left Section - Branding */}
            {!isMobile && (
              <Slide direction="right" in={true} timeout={800}>
                <Grid
                  item
                  md={6}
                  sx={{
                    background: "linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)",
                    padding: 6,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Decorative elements */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "300px",
                      height: "300px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.05)",
                      top: "-100px",
                      left: "-100px"
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.05)",
                      bottom: "-50px",
                      right: "-50px"
                    }}
                  />

                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      <SportsEsports sx={{ fontSize: 40, color: "#ffffff", mr: 2 }} />
                      <Typography variant="h4" fontWeight="bold" color="#ffffff">
                        GameLang
                      </Typography>
                    </Box>

                    <Typography
                      variant="h3"
                      fontWeight="800"
                      color="#ffffff"
                      sx={{ mb: 3, textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                    >
                      Learn Language Through Play
                    </Typography>

                    <Typography
                      variant="body1"
                      color="rgba(255, 255, 255, 0.9)"
                      sx={{ mb: 4, fontSize: "1.1rem", lineHeight: 1.6 }}
                    >
                      Boost your vocabulary and language skills with our interactive games.
                      Make learning fun and effective!
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                      <Box
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.15)",
                          borderRadius: 2,
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          width: "45%"
                        }}
                      >
                        <Language sx={{ color: "#ffffff", mr: 1 }} />
                        <Typography color="#ffffff" fontWeight="medium">
                          Multiple Languages
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.15)",
                          borderRadius: 2,
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          width: "45%"
                        }}
                      >
                        <SportsEsports sx={{ color: "#ffffff", mr: 1 }} />
                        <Typography color="#ffffff" fontWeight="medium">
                          Fun Games
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Slide>
            )}

            {/* Right Section - Auth Form */}
            <Slide direction="left" in={true} timeout={800}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  p: { xs: 3, sm: 6 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Box sx={{ mb: 4, textAlign: "center" }}>
                  {isMobile && (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                      <SportsEsports sx={{ fontSize: 30, color: "#4A00E0", mr: 1 }} />
                      <Typography variant="h5" fontWeight="bold" color="#4A00E0">
                        GameLang
                      </Typography>
                    </Box>
                  )}
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="#333"
                    sx={{ mb: 1 }}
                  >
                    {isNewUser ? "Create Account" : "Welcome Back!"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {isNewUser
                      ? "Sign up to start your language learning journey"
                      : "Sign in to continue your progress"}
                  </Typography>
                </Box>

                <form onSubmit={handleAuth} style={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 1,
                      mb: 3,
                      py: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(90deg, #4A00E0 0%, #8E2DE2 100%)",
                      boxShadow: "0 4px 15px rgba(74, 0, 224, 0.3)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(74, 0, 224, 0.4)",
                      }
                    }}
                  >
                    {isNewUser ? "Sign Up" : "Sign In"}
                  </Button>
                </form>

                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                    OR CONTINUE WITH
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Button
                    onClick={handleGoogleLogin}
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      borderColor: "#1877F2",
                      color: "#1877F2",
                      "&:hover": {
                        borderColor: "#ccc",
                        bgcolor: "rgba(61, 106, 240, 0.01)"
                      }
                    }}
                  >
                    Google
                  </Button>
                  <Button
                    onClick={handleFacebookLogin}
                    variant="outlined"
                    fullWidth
                    startIcon={<FacebookIcon />}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      borderColor: "#1877F2",
                      color: "#1877F2",
                      "&:hover": {
                        borderColor: "#1865F2",
                        bgcolor: "rgba(24,119,242,0.04)"
                      }
                    }}
                  >
                    Facebook
                  </Button>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      color: "#4A00E0",
                      fontWeight: 500,
                      "&:hover": { textDecoration: "underline" }
                    }}
                    onClick={() => setIsNewUser(!isNewUser)}
                  >
                    {isNewUser
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </Typography>
                </Box>
              </Grid>
            </Slide>
          </Grid>
        </Paper>
      </Fade>

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </Box>
  );
};

export default Login;
