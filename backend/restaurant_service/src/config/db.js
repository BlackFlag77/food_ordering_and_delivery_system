const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not defined');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

module.exports = connectDB;