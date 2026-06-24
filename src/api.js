import axios from 'axios';

const api = axios.create({
  // Tu URL de producción en Render
  baseURL: 'https://back-e-commerce-h5xg.onrender.com/api/',
});

// ==============================================================================
// INTERCEPTOR DE PETICIONES (Agrega el Bearer Token automáticamente)
// ==============================================================================
api.interceptors.request.use(
  (config) => {
    // Buscamos el token que guardó la pantalla de Login en el navegador
    const token = localStorage.getItem('token');
    
    if (token) {
      //Cumple con el requisito estricto: Authorization: Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;