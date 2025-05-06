// src/controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const axios = require('axios');


exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort('-createdAt');

    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      let restaurant = { name: 'Unknown' };

      try {
        const resp = await axios.get(
          `${process.env.RESTAURANT_SERVICE_URL}/restaurants/${order.restaurantId}`,
          { headers: { Authorization: req.headers.authorization } }
        );
        restaurant = resp.data;
      } catch (err) {
        console.warn(`Failed to fetch restaurant ${order.restaurantId}:`, err.message);
      }

      return {
        ...order.toObject(),
        restaurant, // embed the full restaurant object
      };
    }));

    res.json(enrichedOrders);
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { restaurantId } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ message: 'restaurantId is required' });
    }
    
    // 1) Fetch user's cart
    const cart = await Cart.findOne({ customerId: req.user.id, restaurantId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty for this restaurant' });
    }

    const {items: requestedItems } = cart;

    // 2) Fetch restaurant details & check availability
    const restaurantResp = await axios.get(
      `${process.env.RESTAURANT_SERVICE_URL}/restaurants/${restaurantId}`,
      { headers: { Authorization: req.headers.authorization } }
    );
    const restaurant = restaurantResp.data;
    if (!restaurant.availability) {
      return res.status(400).json({ message: 'Restaurant is currently not accepting orders' });
    }
    // 3) Fetch restaurant's menu for validation

    const menuResp = await axios.get(
      `${process.env.RESTAURANT_SERVICE_URL}/restaurants/${restaurantId}/menu`,
      { headers: { Authorization: req.headers.authorization } }
    );

    const menuItems = menuResp.data;


    // 3) Validate items in the cart
    const validatedItems = requestedItems.map(({ menuItemId, quantity }) => {
      const menuItem = menuItems.find(m => m._id === menuItemId.toString());
      if (!menuItem) {
        throw { status: 400, message: `Menu item ${menuItemId} not found` };
      }
      if (!menuItem.isAvailable) {
        throw { status: 400, message: `Menu item ${menuItemId} is not available` };
      }
      return {
        menuItemId,
        name: menuItem.name,
        quantity,
        price: menuItem.price
      };
    });

    // 4) Compute total
    const total = validatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const { data: user } = await axios.get(
      `${process.env.USER_SERVICE_URL}/users/${req.user.id}`,
      { headers :{ Authorization: req.headers.authorization }}
    );

    // 6) Create and save the order
    console.log(user); // optional debug
    const order = await Order.create({
      customerId: req.user.id,
      restaurantId,
      items: validatedItems,
      stripeCustomerId: user.stripeCustomerId,
      total
    });


    // 6) Clear the cart after successful order
    await Cart.deleteOne({ customerId: req.user.id, restaurantId });

    // 7) Return created order
    res.status(201).json(order);

  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};

// exports.createOrder = async (req, res, next) => {
//   try {
//     const { restaurantId, items: requestedItems } = req.body;

//     // 1) Fetch the restaurant's menu
//     const menuResp = await axios.get(
//       ${process.env.RESTAURANT_SERVICE_URL}/restaurants/${restaurantId}/menu,
//       { headers: { Authorization: req.headers.authorization } }
//     );
//     const menuItems = menuResp.data;  // array of MenuItem objects

//     // 2) Validate & build the order items list
//     const validatedItems = requestedItems.map(({ menuItemId, quantity }) => {
//       const menuItem = menuItems.find(m => m._id === menuItemId);
//       if (!menuItem) {
//         throw { status: 400, message: Menu item ${menuItemId} not found };
//       }
//       if (!menuItem.isAvailable) {
//         throw { status: 400, message: Menu item ${menuItemId} is not available };
//       }
//       return {
//         menuItemId,
//         name:       menuItem.name,
//         quantity,
//         price:      menuItem.price
//       };
//     });

//     // 3) Compute total
//     const total = validatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

//     // 4) Persist the order
//     const order = await Order.create({
//       customerId:   req.user.id,
//       restaurantId,
//       items:        validatedItems,
//       total
//     });

//     // 5) Respond
//     res.status(201).json(order);

//   } catch (err) {
//     // Normalize thrown errors
//     if (err.status && err.message) {
//       return res.status(err.status).json({ error: err.message });
//     }
//     next(err);
//   }
// };

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
    
    // For customers, only show their own orders
    if (req.user.role === 'customer') {
      filter.customerId = req.user.id;
    } 
    // For restaurant admins, show all orders for their restaurant
    else if (req.user.role === 'restaurant_admin') {
      // Get the restaurant ID from the query parameter
      const restaurantId = req.query.restaurantId;
      if (!restaurantId) {
        return res.status(400).json({ error: 'Restaurant ID is required' });
      }
      filter.restaurantId = restaurantId;
    }
    
    // Get orders sorted by creation date (newest first)
    const orders = await Order.find(filter)
      .sort('-createdAt')
      .populate('customerId', 'name email'); // Populate customer details
    
    res.json(orders);
  } catch (err) { 
    next(err); 
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o || o.status !== 'PENDING') return res.status(400).end();
    if (o.customerId.toString() !== req.user.id) return res.status(403).end();


    const menuResp = await axios.get(
      `${process.env.RESTAURANT_SERVICE_URL}/restaurants/${o.restaurantId}/menu`,
      { headers: { Authorization: req.headers.authorization } }
    );
    const menuItems = menuResp.data;
    
    // Validate each updated item
    const validatedItems = req.body.items.map(({ menuItemId, quantity }) => {
      const menuItem = menuItems.find(m => m._id === menuItemId.toString());
      if (!menuItem || !menuItem.isAvailable) {
        throw { status: 400, message: `Item ${menuItemId} is invalid or unavailable `};
      }
      return {
        menuItemId,
        name: menuItem.name,
        quantity,
        price: menuItem.price
      };
    });
    
    const total = validatedItems.reduce((s, i) => s + i.price * i.quantity, 0);
    o.items = validatedItems;
    o.total = total;

    await o.save();
    return res.status(200).json(o);

  } catch (err) { next(err); }
};

exports.patchStatus = async (req, res, next) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).end();

    const s = req.body.status;
    // role-based guards
    const adminStatuses = ['CONFIRMED','PREPARING','READY'];
    const deliveryStatuses = ['PICKED_UP','DELIVERED'];

    if (adminStatuses.includes(s) && !['restaurant_admin','customer'].includes(req.user.role))
      return res.status(403).end();
    if (deliveryStatuses.includes(s) && req.user.role !== 'delivery_personnel')
      return res.status(403).end();

    o.status = s;
    await o.save();

    res.json(o);
  } catch (err) { next(err); }
};
