const mongoose = require('mongoose');
const RestaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: String,
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Restaurant', RestaurantSchema);
