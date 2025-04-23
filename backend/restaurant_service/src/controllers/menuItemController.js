const MenuItem = require('../models/MenuItem');


exports.add = async (req, res) => {
  const item = await MenuItem.create({ restaurant: req.user._id, ...req.body });
  res.status(201).json(item);
};


exports.update = async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  };

  exports.remove = async (req, res) => {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  };

  exports.list = async (req, res) => {
    const items = await MenuItem.find({ restaurant: req.user._id });
    res.json(items);
  };