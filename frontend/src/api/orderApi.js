// src/api/orderApi.js
import axios from 'axios';

const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVICE_URL
});

// Attach JWT token if present
orderApi.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default orderApi;
