const Order = require('../models/Order');
const axios = require('axios');
const { publish } = require('../services/eventPublisher');

exports.createOrder = async (req, res, next) => {
  try {
    // 1) validate items & prices with restaurant_service
    const menuResp = await axios.post(
      `${process.env.RESTAURANT_SERVICE_URL}/api/menus/validate`,
      { restaurantId: req.body.restaurantId, items: req.body.items },
      { headers: { Authorization: req.headers.authorization } }
    );
    if (!menuResp.data.valid) 
      return res.status(400).json({ error: 'Invalid items or unavailable' });

    // 2) compute total
    const validatedItems = menuResp.data.items;
    const total = validatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // 3) save order
    const order = await Order.create({
      customerId: req.user.id,
      restaurantId: req.body.restaurantId,
      items: validatedItems,
      total
    });

    // 4) publish event
    publish('order.created', { orderId: order._id, customerId: req.user.id });

    res.status(201).json(order);
  } catch (err) { next(err); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).end();
    if (req.user.role === 'customer' && o.customerId.toString() !== req.user.id)
      return res.status(403).end();
    res.json(o);
  } catch (err) { next(err); }
};

exports.listOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'customer') filter.customerId = req.user.id;
    if (req.user.role === 'restaurant_admin' && req.query.restaurantId)
      filter.restaurantId = req.query.restaurantId;
    const orders = await Order.find(filter).sort('-createdAt');
    res.json(orders);
  } catch (err) { next(err); }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o || o.status !== 'PENDING') return res.status(400).end();
    if (o.customerId.toString() !== req.user.id) return res.status(403).end();

    o.items = req.body.items;
    o.total = o.items.reduce((s,i) => s + i.price * i.quantity, 0);
    await o.save();

    publish('order.updated', { orderId: o._id });
    res.json(o);
  } catch (err) { next(err); }
};

exports.patchStatus = async (req, res, next) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).end();

    const s = req.body.status;
    if (['CONFIRMED','PREPARING','READY'].includes(s) && req.user.role !== 'restaurant_admin')
      return res.status(403).end();
    if (['PICKED_UP','DELIVERED'].includes(s) && req.user.role !== 'delivery_personnel')
      return res.status(403).end();

    o.status = s;
    await o.save();
    publish(`order.${s.toLowerCase()}`, { orderId: o._id });
    res.json(o);
  } catch (err) { next(err); }
};
