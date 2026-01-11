import axios from 'axios';

// In production on Vercel, use relative URL if VITE_API_URL is not set
// This works when frontend and backend are on the same domain
// In development, use empty string to leverage Vite proxy
const API_URL = import.meta.env.VITE_API_URL || '';

// Log for debugging - remove in production
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    PROD: import.meta.env.PROD,
    API_URL: API_URL || '(empty - using relative URLs)',
  });
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Force relative URLs when baseURL is empty to ensure Vite proxy works
  // This prevents axios from constructing absolute URLs
  if (!config.baseURL && config.url && !config.url.startsWith('http')) {
    // Ensure URL is relative (starts with /)
    if (!config.url.startsWith('/')) {
      config.url = '/' + config.url;
    }
  }
  
  // Log for debugging - remove in production
  if (import.meta.env.DEV) {
    const fullURL = config.baseURL 
      ? `${config.baseURL}${config.url}` 
      : config.url;
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL || '(empty - relative)',
      fullURL: fullURL,
      requestURL: config.url,
    });
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

