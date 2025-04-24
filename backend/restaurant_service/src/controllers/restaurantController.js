const Restaurant = require('../models/Restaurant');

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, owner: req.user.id };
    const r = await Restaurant.create(data);
    res.status(201).json(r);
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
    if (r.owner.toString() !== req.user.id) return res.status(403).end();
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
    if (r.owner.toString() !== req.user.id) return res.status(403).end();
    r.availability = !!req.body.availability;
    await r.save();
    res.json(r);
  } catch (err) { next(err); }
};