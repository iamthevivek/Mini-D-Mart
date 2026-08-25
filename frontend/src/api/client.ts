import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('onemart_token') || localStorage.getItem('minidmart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      const token = localStorage.getItem('onemart_token') || localStorage.getItem('minidmart_token');
      if (token && window.location.pathname !== '/login') {
        localStorage.removeItem('onemart_token');
        localStorage.removeItem('onemart_user');
        localStorage.removeItem('minidmart_token');
        localStorage.removeItem('minidmart_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
