const mongoose = require('mongoose');
const { Schema } = mongoose;    // OBJECT DESTRUCTURING

// const deliverySchema = new mongoose.Schema({   // OLD METHOD

const deliverySchema = new Schema({
  orderId:    { type: String, required: true, unique: true },
  driver:     { type: Schema.Types.ObjectId, ref: 'Driver' },
  status:     { type: String, enum: ['assigned','en_route', 'pending', 'delivered'], default: 'assigned'},
  // deliveryLocation: {
  //   type: { type: String, default: 'Point' },
  //   coordinates: [Number],
  // },
  // estimatedTime: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Delivery', deliverySchema);

// This model represents a delivery in the delivery service system. It includes fields for the order ID, driver ID (referencing the Driver model), delivery status, and the last updated timestamp. The model is exported for use in other parts of the application.
// The deliverySchema is defined using Mongoose, a popular ODM (Object Data Modeling) library for MongoDB and Node.js. The schema defines the structure of the delivery documents in the MongoDB collection, including the fields and their types, as well as any 
// validation rules or default values.
// The driver field is defined as a reference to the Driver model, allowing for easy population of driver information when querying deliveries. The status field indicates the current status of the delivery, with possible values including 'assigned', 'en route', 
// and 'delivered'. The updatedAt field is automatically set to the current date and time whenever the document is updated.
// The deliverySchema is then compiled into a Mongoose model named 'Delivery', which can be used to interact with the corresponding MongoDB collection. The model is exported for use in other parts of the application, allowing for CRUD operations and other interactions with the delivery data.



// const mongoose = require("mongoose");

// const deliverySchema = new mongoose.Schema({
//   orderId: { type: String, required: true },
// //   customerId: { type: ObjectId, required: true },
//   deliveryAddress: { type: String, required: true },
//   deliveryStatus: {
//     type: String,
//     enum: ["pending", "in-progress", "completed", "canceled"],
//     default: "pending",
//   },
// //   deliveryDate: { type: Date, default: Date.now },
// //   deliveryTimeSlot: { type: String, required: true },
// //   deliveryPersonId: { type: ObjectId, required: false },
// //   trackingNumber: { type: String, required: false },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now },
// });

// const DeliveryModel = mongoose.model("Delivery", deliverySchema);
// module.exports = DeliveryModel;