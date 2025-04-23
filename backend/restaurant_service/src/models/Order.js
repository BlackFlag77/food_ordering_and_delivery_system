const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: Number
  }],
  status: { type: String, enum: ['pending','accepted','preparing','ready','completed','rejected'], default: 'pending' }
}, { timestamps: true });
module.exports = mongoose.model('Order', OrderSchema);