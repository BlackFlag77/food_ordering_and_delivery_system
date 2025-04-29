const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Order' 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    required: true 
  },
  stripeId: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ["succeeded", "requires_payment_method", "processing", "requires_confirmation", "requires_action", "canceled"],
    required: true,
    default: "succeeded"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
