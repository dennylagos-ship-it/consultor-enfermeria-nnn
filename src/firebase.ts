/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using Vite environment variables (falling back to real project credentials)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA6rS0QGp6Rt1lQaT75wRMPcg0RGelhbe8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "consultor-enfermeria-nnn.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "consultor-enfermeria-nnn",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "consultor-enfermeria-nnn.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "775098132987",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:775098132987:web:ae24c09eff72c48298c35e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check if running in mock mode (only when explicitly set to 'mock_api_key')
const isFirebaseMock = import.meta.env.VITE_FIREBASE_API_KEY === "mock_api_key";

export { auth, db, isFirebaseMock };
