import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDJ8guKGzgRtDI617qlfYFbjzDjta3eSR8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fiato-corto-ba53e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fiato-corto-ba53e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fiato-corto-ba53e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "228446771390",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:228446771390:web:771252806d4ce92b40e6ef",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7Y29B6W5RH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export { analytics };
export default app;

