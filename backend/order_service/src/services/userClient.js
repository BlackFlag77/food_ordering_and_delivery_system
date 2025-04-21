// For fetching extra user details if needed
const axios = require('axios');
const base = process.env.USER_SERVICE_URL;

async function getUserById(id, authHeader) {
  const resp = await axios.get(`${base}/api/users/${id}`, {
    headers: { Authorization: authHeader }
  });
  return resp.data;
}

module.exports = { getUserById };
