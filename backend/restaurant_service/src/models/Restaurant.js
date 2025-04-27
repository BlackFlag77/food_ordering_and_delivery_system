const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId:     { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true, unique: true},
  description: { type: String },
  cuisine:    { type: String },
  address:    { type: String },
  phone:      { type: String },
  email:      { type: String },
  logoUrl:    { type: String },
  coverImageUrl: { type: String },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  deliveryRadius: { type: Number, default: 5 },
  minimumOrderAmount: { type: Number, default: 10 },
  deliveryFee: { type: Number, default: 2 },
  taxRate: { type: Number, default: 8.5 },
  isVerified: { type: Boolean, default: false },
  availability: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', schema);