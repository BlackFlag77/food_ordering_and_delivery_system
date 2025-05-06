const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Types.ObjectId, required: true, unique: true },
  restaurantId: { type: mongoose.Types.ObjectId, required: true },
  items: [
    {
      menuItemId: mongoose.Types.ObjectId,
      name: String,
      quantity: { type: Number, default: 1 },
      price: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);