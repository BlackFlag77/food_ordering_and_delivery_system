const MenuItem = require('../models/MenuItem');

exports.create = async (req, res, next) => {
  try {
    const item = await MenuItem.create({ ...req.body, restaurant: req.params.restaurantId });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(items);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).end();
    if (item.restaurant.toString() !== req.params.restaurantId) return res.status(403).end();
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).end();
    if (item.restaurant.toString() !== req.params.restaurantId) return res.status(403).end();
    await item.delete();
    res.status(204).end();
  } catch (err) { next(err); }
};