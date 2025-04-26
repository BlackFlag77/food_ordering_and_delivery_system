const mongoose = require('mongoose');
const { Schema } = mongoose;

const driverSchema = new Schema({
  name:       { type: String, required: true },
  available:  { type: Boolean, default: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
});

// Create a 2dsphere index on location for geospatial queries:
driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
// This model represents a driver in the delivery service system. It includes fields for the driver's name, availability status, and location (with geospatial indexing for location-based queries). The model is exported for use in other parts of the application.
// The location field is defined as a GeoJSON point, which allows for efficient querying of drivers based on their geographical coordinates. The available field indicates whether the driver is currently available for assignments.
// The driverSchema is then compiled into a Mongoose model named 'Driver', which can be used to interact with the corresponding MongoDB collection. The model is exported for use in other parts of the application, allowing for CRUD operations and other interactions with the driver data.
// The driverSchema is defined using Mongoose, a popular ODM (Object Data Modeling) library for MongoDB and Node.js. The schema defines the structure of the driver documents in the MongoDB collection, including the fields and their types, as well as any validation rules or default values.
