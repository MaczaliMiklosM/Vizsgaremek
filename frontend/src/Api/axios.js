import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy fogja átirányítani
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatikus token beállítás minden kéréshez
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
