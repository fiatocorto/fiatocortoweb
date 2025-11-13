import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

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
  register: (name: string, email: string, password: string) => Promise<void>;
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
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 5000, // 5 secondi timeout
      });
      setUser(response.data.user);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      // Rimuovi token solo se è un errore 401 (non autorizzato)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
      }
      // Se è un errore di rete, mantieni il token ma non bloccare l'app
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
    } catch (error: any) {
      console.error('Login error:', error);
      // Propaga l'errore con un messaggio più chiaro
      if (error.response) {
        // Errore dal server
        throw new Error(error.response.data?.error || 'Errore nel login');
      } else if (error.request) {
        // Richiesta fatta ma nessuna risposta
        throw new Error('Impossibile connettersi al server. Verifica che il backend sia in esecuzione.');
      } else {
        // Errore nella configurazione della richiesta
        throw new Error('Errore nella configurazione della richiesta');
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.response) {
        throw new Error(error.response.data?.error || 'Errore nella registrazione');
      } else if (error.request) {
        throw new Error('Impossibile connettersi al server. Verifica che il backend sia in esecuzione.');
      } else {
        throw new Error('Errore nella configurazione della richiesta');
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
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

