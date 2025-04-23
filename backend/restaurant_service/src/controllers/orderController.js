const Order = require('../models/Order');


exports.listIncoming = async (req, res) => {
  const orders = await Order.find({ restaurant: req.user._id });
  res.json(orders);
};