// src/api.js
import axios from 'axios';

const api = axios.create({
  // Importante: import.meta.env.VITE_API_URL lee la "Key" de Vercel
  // Si no la encuentra (como en local), usa la de Render directamente
  baseURL: import.meta.env.VITE_API_URL || 'https://back-e-commerce-h5xg.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;