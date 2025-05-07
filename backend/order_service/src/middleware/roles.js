// src/middleware/roles.js
exports.permitCustomer = (req, res, next) => {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Customers only' });
    }
    next();
  };