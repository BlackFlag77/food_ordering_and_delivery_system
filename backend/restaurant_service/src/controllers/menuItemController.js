const MenuItem = require('../models/MenuItem');


exports.add = async (req, res) => {
  const item = await MenuItem.create({ restaurant: req.user._id, ...req.body });
  res.status(201).json(item);
};


exports.update = async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  };