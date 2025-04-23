require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

// connect to MongoDB
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);


connectDB().then(() => {
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  });
  