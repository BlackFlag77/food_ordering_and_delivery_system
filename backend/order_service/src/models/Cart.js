const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Types.ObjectId, required: true },
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

cartSchema.index({ customerId: 1, restaurantId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
// module.exports = mongoose.model('Cart', cartSchema);