const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phoneNumber: {
        type: String,
        required: false,      // you can make this required once everyone has added it
        trim: true
      },
  password: { type: String, required: true },
  stripeCustomerId: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer','restaurant_admin','delivery_personnel','admin'],
    default: 'customer'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);