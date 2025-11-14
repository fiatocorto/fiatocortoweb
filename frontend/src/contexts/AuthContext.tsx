import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getIdToken
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const firebaseToken = await getIdToken(firebaseUser);
          setToken(firebaseToken);
          await syncUserWithBackend(firebaseToken, firebaseUser);
        } catch (error) {
          console.error('Error getting Firebase token:', error);
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const syncUserWithBackend = async (firebaseToken: string, firebaseUser: FirebaseUser) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/firebase`, {
        token: firebaseToken,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
      const { user: backendUser, token: backendToken } = response.data;
      setUser(backendUser);
      setToken(backendToken);
      localStorage.setItem('token', backendToken);
    } catch (error: any) {
      console.error('Error syncing with backend:', error);
      // If backend sync fails, we still have Firebase auth
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email || '',
        email: firebaseUser.email || '',
        role: 'CUSTOMER',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (email: string, password: string) => {
    try {
      // Use Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await getIdToken(userCredential.user);
      
      // Sync with backend
      await syncUserWithBackend(firebaseToken, userCredential.user);
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Errore nel login';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Credenziali non valide';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email non valida';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Troppi tentativi. Riprova più tardi.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await userCredential.user.updateProfile({
        displayName: `${firstName} ${lastName}`.trim(),
      });

      const firebaseToken = await getIdToken(userCredential.user);
      
      // Sync with backend
      await syncUserWithBackend(firebaseToken, userCredential.user);
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = 'Errore nella registrazione';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email già registrata';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email non valida';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password troppo debole';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await getIdToken(result.user);
      
      // Sync with backend
      await syncUserWithBackend(firebaseToken, result.user);
    } catch (error: any) {
      console.error('Google login error:', error);
      let errorMessage = 'Errore durante l\'autenticazione Google';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Popup chiuso. Riprova.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Richiesta annullata. Riprova.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, loginWithGoogle, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

