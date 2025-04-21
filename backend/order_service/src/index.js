require('dotenv').config();
console.log('→ RABBITMQ_URL is', process.env.RABBITMQ_URL);
console.log('→ USER_SERVICE_URL is', process.env.USER_SERVICE_URL);
console.log('→ MONGO_URI is', process.env.MONGO_URI);
// then your other imports...
const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const connectDB    = require('./config/db');
const { init }     = require('./services/eventPublisher');
const ordersRouter = require('./routes/orders');


const app = express();

// --- Global middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- Database & Event Bus ---
console.log('[Init] Connecting to MongoDB…');
connectDB()
  .then(() => {
    console.log('[Success] MongoDB connected');
    return init();
  })
  .then(() => {
    console.log('[Success] RabbitMQ connected');
    // Only start listening AFTER both DB and MQ are up:
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Order service up on ${PORT}`);
    });
  })
  .catch(err => {
    console.error('[Fatal] DB or RabbitMQ connection failed:', err);
    process.exit(1);
  });

// --- Routes ---
app.use('/api/orders', ordersRouter);

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;  // for testing
