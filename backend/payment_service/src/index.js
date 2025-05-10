require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet  = require('helmet');
const rateLimit    = require('express-rate-limit');
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Payment service is up and healthy');
  
});
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                   // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc:  ["'none'"],
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Mount routes
app.use("/payments", paymentRoutes);

// Connect MongoDB first, then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(6000, () => {
      console.log("Server running at http://localhost:6000");
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
