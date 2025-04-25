const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('[Fatal] MONGO_URI is not defined.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[Success] MongoDB connected');
  } catch (err) {
    console.error('[Error] MongoDB connection failed:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('error', e =>
    console.error('[MongoDB] Error:', e.message)
  );

  // Do NOT auto‑reconnect during tests to allow clean shutdown
  if (process.env.NODE_ENV !== 'test') {
    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected. Reconnecting...');
      connectDB();
    });
  }
};

module.exports = connectDB;
