require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('✅ Payment service is up and healthy');
  
});
// Mount routes
app.use("/payments", paymentRoutes);

// Connect MongoDB first, then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(6000, () => {
      console.log("✅ Server running at http://localhost:6000");
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
