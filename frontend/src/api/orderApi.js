// src/api/orderApi.js
import axios from 'axios';

const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:5001/api'
});

// Attach JWT token if present
orderApi.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Add response interceptor for better error handling
orderApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Order API Error:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch orders');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Order API Error: No response received');
      throw new Error('Could not connect to the order service');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Order API Error:', error.message);
      throw error;
    }
  }
);

export default orderApi;
