const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const mongoose = require('mongoose');

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

exports.getStats = async (req, res, next) => {
  try {
    const restaurantId = req.params.id;
    
    // Get total orders for this restaurant
    const totalOrders = await Order.countDocuments({ restaurantId });
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      restaurantId,
      createdAt: { $gte: today }
    });
    
    // Get total revenue
    const orders = await Order.find({ restaurantId });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Get popular items
    const popularItems = await Order.aggregate([
      { $match: { restaurantId: mongoose.Types.ObjectId(restaurantId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItemId',
          name: { $first: '$items.name' },
          price: { $first: '$items.price' },
          orderCount: { $sum: '$items.quantity' }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 }
    ]);
    
    // Get average rating (if ratings are implemented)
    const averageRating = 4.5; // Placeholder until ratings are implemented
    
    res.json({
      totalOrders,
      todayOrders,
      totalRevenue,
      averageRating,
      popularItems
    });
  } catch (err) {
    next(err);
  }
};