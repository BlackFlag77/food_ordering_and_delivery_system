require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");

// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

const deliveryRoutes = require("./routes/DeliveryRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// app.use(helmet());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

app.get("/health", (req, res) => res.send("OK"));
app.use("/delivery", deliveryRoutes);

(async () => {
  await connectDB();
  const port = process.env.PORT || 3003;
  app.listen(port, () => {
    console.log(`Delivery Service is running on port ${port}`);
  });
})();
