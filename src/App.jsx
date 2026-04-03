import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashboardStyled";
import FlashcardGame from "./pages/FlashcardGame";
import WordPuzzleGame from "./pages/WordPuzzleGame";
import ListeningChallenge from "./pages/ListeningChallenge";
import VocabularyQuiz from './pages/VocabularyQuiz'; 
import MemoryMatch from "./pages/MemoryMatch";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import Leaderboard from "./pages/Leaderboard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/flashcard-game" element={<ProtectedRoute><FlashcardGame /></ProtectedRoute>} />
          <Route path="/word-puzzle-game" element={<ProtectedRoute><WordPuzzleGame /></ProtectedRoute>} />
          <Route path="/ListeningChallenge" element={<ProtectedRoute><ListeningChallenge /></ProtectedRoute>} />
          <Route path="/VocabularyQuiz" element={<ProtectedRoute><VocabularyQuiz /></ProtectedRoute>} />
          <Route path="/MemoryMatch" element={<ProtectedRoute><MemoryMatch /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> 
          <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> 
          <Route path="/MyCourses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} /> 
          <Route path="/Leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
