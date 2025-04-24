const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:       { type: String, required: true },
  address:    { type: String },
  owner:      { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  isVerified: { type: Boolean, default: false },
  availability: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', schema);