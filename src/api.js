import axios from 'axios';

const api = axios.create({
  // DEBE ser la URL de Render, terminada en /api/
  baseURL: 'https://back-e-commerce-h5xg.onrender.com/api/', 
});

export default api;