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
  firstName?: string | null;
  lastName?: string | null;
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
  updateUser: (firstName?: string, lastName?: string, email?: string) => Promise<void>;
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

      const firebaseToken = await getIdToken(userCredential.user);
      
      // Sync with backend - pass firstName and lastName explicitly
      try {
        const response = await axios.post(`${API_URL}/api/auth/firebase`, {
          token: firebaseToken,
          email: userCredential.user.email,
          displayName: `${firstName} ${lastName}`.trim(),
          photoURL: userCredential.user.photoURL,
          firstName: firstName,
          lastName: lastName,
        });
        const { user: backendUser, token: backendToken } = response.data;
        setUser(backendUser);
        setToken(backendToken);
        localStorage.setItem('token', backendToken);
      } catch (backendError: any) {
        console.error('Backend sync error:', backendError);
        // If backend fails, we still have Firebase auth, but show a warning
        if (backendError.code === 'ECONNREFUSED' || backendError.message?.includes('Network Error')) {
          throw new Error('Impossibile connettersi al server. Verifica che il backend sia in esecuzione su http://localhost:3001');
        }
        throw backendError;
      }
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

  const updateUser = async (firstName?: string, lastName?: string, email?: string) => {
    try {
      const response = await axios.put(`${API_URL}/api/auth/me`, {
        firstName,
        lastName,
        email,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedUser = response.data.user;
      setUser(updatedUser);
    } catch (error: any) {
      console.error('Update user error:', error);
      if (error.response) {
        throw new Error(error.response.data?.error || 'Errore nell\'aggiornamento profilo');
      } else if (error.request) {
        throw new Error('Impossibile connettersi al server. Verifica che il backend sia in esecuzione.');
      } else {
        throw new Error('Errore nella configurazione della richiesta');
      }
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
      value={{ user, token, login, register, loginWithGoogle, updateUser, logout, isLoading }}
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

