const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId:     { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true },
  address:    { type: String },
  isVerified: { type: Boolean, default: false },
  availability: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', schema);