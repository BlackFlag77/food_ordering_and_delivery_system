require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/notifications', notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Notification service listening on port ${PORT}`));
