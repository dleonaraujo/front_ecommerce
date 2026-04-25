// src/api.js
import axios from 'axios';

const api = axios.create({
  // Tu URL de Render (asegúrate de incluir el /api/ al final)
  baseURL: 'https://back-e-commerce-h5xg.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;