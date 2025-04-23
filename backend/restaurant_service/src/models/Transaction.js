const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  amount: Number,
  status: { type: String, enum: ['pending','completed','failed'], default: 'pending' }
}, { timestamps: true });
module.exports = mongoose.model('Transaction', TransactionSchema);
