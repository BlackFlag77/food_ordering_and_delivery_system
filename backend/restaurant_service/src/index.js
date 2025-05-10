require('dotenv').config();
const rateLimit = require('express-rate-limit');
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const connectDB = require('./config/db');
const errHandler = require('./errorHandler');

const rRoutes = require('./routes/restaurantRoutes');
const mRoutes = require('./routes/menuRoutes');

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);


const app = express();
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.use('/api/restaurants', rRoutes);
app.use('/api/restaurants/:restaurantId/menu', mRoutes);

app.use(errHandler);

connectDB().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Restaurant service up on ${PORT}`));
});