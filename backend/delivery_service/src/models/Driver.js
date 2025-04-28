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