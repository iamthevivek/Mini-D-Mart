import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('minidmart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      const token = localStorage.getItem('minidmart_token');
      if (token && window.location.pathname !== '/login') {
        localStorage.removeItem('minidmart_token');
        localStorage.removeItem('minidmart_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
