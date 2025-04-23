const Order = require('../models/Order');


exports.listIncoming = async (req, res) => {
  const orders = await Order.find({ restaurant: req.user._id });
  res.json(orders);
};

exports.updateStatus = async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id,
      { status: req.body.status }, { new: true });
    res.json(order);
  };
  