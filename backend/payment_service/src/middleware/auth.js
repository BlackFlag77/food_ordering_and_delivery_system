// src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token  = header.replace(/^Bearer\s+/, '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;  // { id, role, ... }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
