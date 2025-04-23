const Restaurant = require('../models/Restaurant');


exports.createRestaurant = async (req, res) => {
  const rest = await Restaurant.create({ owner: req.user._id, ...req.body });
  res.status(201).json(rest);
};

exports.updateAvailability = async (req, res) => {
    const { isAvailable } = req.body;
    const rest = await Restaurant.findOneAndUpdate(
      { owner: req.user._id }, { isAvailable }, { new: true }
    );
    res.json(rest);
  };