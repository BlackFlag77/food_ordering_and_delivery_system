require('dotenv').config();
const rateLimit = require('express-rate-limit');
const express = require('express');
const cors    = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use(cors());
app.use(express.json());

app.use('/notifications', notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Notification service listening on port ${PORT}`));
