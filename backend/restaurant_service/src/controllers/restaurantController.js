const Restaurant = require('../models/Restaurant');


exports.createRestaurant = async (req, res) => {
  const rest = await Restaurant.create({ owner: req.user._id, ...req.body });
  res.status(201).json(rest);
};