// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ Import GoogleAuthProvider

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbhxPTYqLVWFvpIqJENSirZL2rXytrhIE",
  authDomain: "game-lang-app.firebaseapp.com",
  projectId: "game-lang-app",
  storageBucket: "game-lang-app.firebasestorage.app",
  messagingSenderId: "820705028878",
  appId: "1:820705028878:web:aae5bd9ab761ca88f6455f",
  measurementId: "G-5LCX4SX6S5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider(); // ✅ Add this line to export Google provider
