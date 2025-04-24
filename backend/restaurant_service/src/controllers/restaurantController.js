const Restaurant = require('../models/Restaurant');

// Only 'restaurant_admin' users may create restaurants
exports.create = async (req, res, next) => {
  try {
    if (req.user.role !== 'restaurant_admin') {
      return res.status(403).json({ error: 'Only restaurant_admin may register restaurants' });
    }
    const data = { ...req.body, userId: req.user.id };
    const restaurant = await Restaurant.create(data);
    res.status(201).json(restaurant);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const all = await Restaurant.find();
    res.json(all);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const r = await Restaurant.findById(req.params.id);
    if (!r) return res.status(404).end();
    res.json(r);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const r = await Restaurant.findById(req.params.id);
    if (!r) return res.status(404).end();
    if (r.userId.toString() !== req.user.id) return res.status(403).end();
    Object.assign(r, req.body);
    await r.save();
    res.json(r);
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).end();
    const r = await Restaurant.findById(req.params.id);
    if (!r) return res.status(404).end();
    r.isVerified = true;
    await r.save();
    res.json(r);
  } catch (err) { next(err); }
};

exports.setAvailability = async (req, res, next) => {
  try {
    const r = await Restaurant.findById(req.params.id);
    if (!r) return res.status(404).end();
    if (r.userId.toString() !== req.user.id) return res.status(403).end();
    r.availability = !!req.body.availability;
    await r.save();
    res.json(r);
  } catch (err) { next(err); }
};