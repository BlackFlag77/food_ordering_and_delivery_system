// src/index.js
require('dotenv').config();

console.log('→ USER_SERVICE_URL is', process.env.USER_SERVICE_URL);
console.log('→ RESTAURANT_SERVICE_URL is', process.env.RESTAURANT_SERVICE_URL);
console.log('→ MONGO_URI is', process.env.MONGO_URI);

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const connectDB    = require('./config/db');
const ordersRouter = require('./routes/orders');
const cartRouter = require('./routes/carts');

const app = express();

// --- Global middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:3000", "https://localhost:3000"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000", "https://localhost:3000"],
      connectSrc: ["'self'", "http://localhost:3000", "https://localhost:3000"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "http://localhost:3000", "https://localhost:3000"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"],
      formAction: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- Routes ---
app.use('/api/orders', ordersRouter);
app.use('/api/carts', cartRouter);

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  // use statusCode if set, otherwise fall back to status, otherwise 500
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error'
  });
});

// --- Start server after DB connection ---
console.log('[Init] Connecting to MongoDB…');
connectDB()
  .then(() => {
    console.log('[Success] MongoDB connected');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Order service up on ${PORT}`);
    });
  })
  .catch(err => {
    console.error('[Fatal] DB connection failed:', err);
    process.exit(1);
  });

// Export for testing
module.exports = app;
