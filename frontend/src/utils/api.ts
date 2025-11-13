import axios from 'axios';

// In production on Vercel, use relative URL if VITE_API_URL is not set
// This works when frontend and backend are on the same domain
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo reindirizza al login se è un errore 401 e non siamo già sulla pagina di login
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      // Non reindirizzare se siamo già sulla homepage o su una pagina pubblica
      if (!['/', '/tours', '/calendar', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

