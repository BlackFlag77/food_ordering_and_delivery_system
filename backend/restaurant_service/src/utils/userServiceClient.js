// order_service/src/utils/userServiceClient.js
const axios = require('axios');

// Docker Compose will set USER_SERVICE_URL via .env;
// Kubernetes will inject via env var from the Service name.
const USER_API = process.env.USER_SERVICE_URL || 'http://user_service:5000';

module.exports = async function getUserInfo(token) {
  const res = await axios.get(`${USER_API}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
