require('dotenv').config();
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const connectDB = require('./config/db');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();

// --- Global middleware ---
app.use(helmet());                   // secure HTTP headers
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
