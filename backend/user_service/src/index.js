require('dotenv').config();
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const connectDB = require('./config/db');
console.log('→ MONGO_URI is', process.env.MONGO_URI);

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

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
app.use(cors());                     // enable CORS
app.use(express.json());             // parse JSON bodies
app.use(morgan('dev'));              // request logging

// --- Database connection ---
connectDB();

// --- Routes ---
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`User service up on ${PORT}`));

module.exports = app; // for testing
