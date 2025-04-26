const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  restaurant: { type: mongoose.Types.ObjectId, ref: 'Restaurant', required: true },
  name:       { type: String, required: true },
  description:{ type: String },
  price:      { type: Number, required: true },
  isAvailable:{ type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', schema);