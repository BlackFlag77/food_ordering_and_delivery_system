const mongoose = require("mongoose");
const { Schema } = mongoose; // OBJECT DESTRUCTURING

// const deliverySchema = new mongoose.Schema({   // OLD METHOD

const deliverySchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  driver: { type: Schema.Types.ObjectId, ref: "Driver" },
  status: {
    type: String,
    enum: ["assigned", "en_route", "pending", "delivered"],
    default: "pending",
  },
  deliveryLocation: {
    // Customer address
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number],
  },
  pickupLocation: {
    // Restaurant location from order service
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number],
  },
  estimatedTime: Date,
  createdAt: { type: Date, default: Date.now },
});

deliverySchema.index({ deliveryLocation: '2dsphere' });

module.exports = mongoose.model("Delivery", deliverySchema);