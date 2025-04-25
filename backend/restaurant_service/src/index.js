require('dotenv').config();
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
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/restaurants', rRoutes);
app.use('/api/restaurants/:restaurantId/menu', mRoutes);

app.use(errHandler);

connectDB().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Restaurant service up on ${PORT}`));
});