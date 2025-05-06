const Cart = require('../models/Cart');
const axios = require('axios');

exports.viewCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) { next(err); }
};

exports.addOrUpdateItem = async (req, res, next) => {
  try {
    const { restaurantId, menuItemId, quantity } = req.body;

    if (quantity <= 0) return res.status(400).json({ message: "Quantity must be positive" });

    const menuResp = await axios.get(
      `${process.env.RESTAURANT_SERVICE_URL}/restaurants/${restaurantId}/menu`,
      { headers: { Authorization: req.headers.authorization } }
    );

    const menuItem = menuResp.data.find(i => i._id === menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
      return res.status(400).json({ message: "Invalid or unavailable item" });
    }

    let cart = await Cart.findOne({ customerId: req.user.id });

    // If no cart exists, create one
    if (!cart) {
      cart = await Cart.create({
        customerId: req.user.id,
        restaurantId,
        items: [{
          menuItemId,
          name: menuItem.name,
          quantity,
          price: menuItem.price
        }]
      });
    } else {
      // If cart exists but from another restaurant, reject
      if (cart.restaurantId.toString() !== restaurantId) {
        return res.status(400).json({ message: "You can't mix restaurants in one cart" });
      }

      const existing = cart.items.find(i => i.menuItemId.toString() === menuItemId);
      if (existing) {
        existing.quantity = quantity;
      } else {
        cart.items.push({
          menuItemId,
          name: menuItem.name,
          quantity,
          price: menuItem.price
        });
      }

      await cart.save();
    }

    res.json(cart);
  } catch (err) { next(err); }
};

exports.updateQuantity = async (req, res, next) => {
    try {

      const cart = await Cart.findOne({ customerId: req.user.id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
        
      const { quantity } = req.body;
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => i.menuItemId.toString() !== req.params.menuItemId);
        await cart.save();
        return res.json(cart); //  Quantity 0 means remove item
      }
      
  
      const item = cart.items.find(i => i.menuItemId.toString() === req.params.menuItemId);
      if (!item) return res.status(404).json({ message: 'Item not in cart' });
  
      item.quantity = quantity;
      await cart.save();
  
      res.json(cart);
    } catch (err) { next(err); }
  };
  

exports.removeItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.menuItemId.toString() !== req.params.menuItemId);
    await cart.save();

    res.json(cart);
  } catch (err) { next(err); }
};

exports.clearCart = async (req, res, next) => {
  try {
    await Cart.deleteOne({ customerId: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (err) { next(err); }
};
