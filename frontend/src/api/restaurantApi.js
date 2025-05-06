// src/api/restaurantApi.js
import axios from 'axios';
import orderApi from './orderApi';

// Create an axios instance with a base URL
const restaurantApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the auth token
restaurantApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 404 errors with mock data
restaurantApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If the error is a 404 and we're in development mode, return mock data
    if (error.response && error.response.status === 404 && process.env.NODE_ENV === 'development') {
      console.log('Backend unavailable (404). Using mock data for:', error.config.url);
      
      // Mock data for different endpoints
      const mockData = getMockDataForEndpoint(error.config.url, error.config.method);
      
      if (mockData) {
        // Return a fake response with the mock data
        return Promise.resolve({
          data: mockData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config,
        });
      }
    }
    
    // If we can't provide mock data, reject the promise with the original error
    return Promise.reject(error);
  }
);

// Helper function to get mock data based on the endpoint
function getMockDataForEndpoint(url, method) {
  // Extract the endpoint path from the URL
  const path = url.replace(process.env.REACT_APP_API_URL || 'http://localhost:4000/api', '');
  
  // Mock data for different endpoints
  if (path.startsWith('/restaurants/') && path.endsWith('/stats')) {
    // Mock stats data
    return {
      totalOrders: 42,
      todayOrders: 5,
      totalRevenue: 1250.75,
      averageRating: 4.5,
      popularItems: [
        { _id: '1', name: 'Margherita Pizza', price: 12.99, orderCount: 15, imageUrl: '' },
        { _id: '2', name: 'Chicken Alfredo', price: 14.99, orderCount: 12, imageUrl: '' },
        { _id: '3', name: 'Caesar Salad', price: 8.99, orderCount: 10, imageUrl: '' }
      ]
    };
  }
  
  if (path.startsWith('/restaurants/') && path.endsWith('/orders')) {
    // Mock orders data
    return [
      {
        _id: '1',
        userId: 'user1',
        items: [
          { _id: '1', name: 'Margherita Pizza', price: 12.99, quantity: 2 },
          { _id: '2', name: 'Caesar Salad', price: 8.99, quantity: 1 }
        ],
        total: 34.97,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        userId: 'user2',
        items: [
          { _id: '3', name: 'Chicken Alfredo', price: 14.99, quantity: 1 }
        ],
        total: 14.99,
        status: 'delivered',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
  }
  
  if (path.startsWith('/restaurants/') && path.endsWith('/menu')) {
    // Mock menu data
    return [
      {
        _id: '1',
        name: 'Margherita Pizza',
        description: 'Classic tomato sauce, mozzarella, and basil',
        price: 12.99,
        category: 'Pizza',
        imageUrl: ''
      },
      {
        _id: '2',
        name: 'Chicken Alfredo',
        description: 'Fettuccine pasta with creamy alfredo sauce and grilled chicken',
        price: 14.99,
        category: 'Pasta',
        imageUrl: ''
      },
      {
        _id: '3',
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons, and caesar dressing',
        price: 8.99,
        category: 'Salad',
        imageUrl: ''
      }
    ];
  }
  
  // For PUT requests to update a restaurant, return the updated data
  if (path.startsWith('/restaurants/') && method === 'put') {
    // Extract the restaurant ID from the URL
    const restaurantId = path.split('/')[2];
    
    // Get the request data
    const requestData = JSON.parse(error.config.data);
    
    // Return a mock response with the updated data
    return {
      _id: restaurantId,
      ...requestData,
      updatedAt: new Date().toISOString()
    };
  }
  
  // For other endpoints, return null (no mock data available)
  return null;
}

// Add a new method to fetch orders from the order service
restaurantApi.getOrders = async (restaurantId) => {
  try {
    const response = await orderApi.get(`/orders?restaurantId=${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Return mock data if the API fails
    return getMockDataForEndpoint(`/restaurants/${restaurantId}/orders`, 'GET');
  }
};

export default restaurantApi;
