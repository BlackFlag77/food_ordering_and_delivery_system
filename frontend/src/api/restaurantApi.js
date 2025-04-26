// src/api/restaurantApi.js
import axios from 'axios';

const restaurantApi = axios.create({
  baseURL: import.meta.env.VITE_RESTAURANT_SERVICE_URL
});

// Attach same auth token
restaurantApi.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default restaurantApi;
