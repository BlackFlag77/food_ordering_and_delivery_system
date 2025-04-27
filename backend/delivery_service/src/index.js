require("dotenv").config();
const WebSocket = require('ws');
const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");

// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

const deliveryRoutes = require("./routes/DeliveryRoutes");

const app = express();
const server = require('http').createServer(app);
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
app.use("/api/delivery", deliveryRoutes);

// WebSocket Server
const wss = new WebSocket.Server({ server });
const activeConnections = new Map(); // Track connected clients by orderId

wss.on('connection', (ws, req) => {
  const orderId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('orderId');
  
  if (!orderId) {
    ws.close(4001, 'Missing orderId');
    return;
  }

  // Store connection
  const connections = activeConnections.get(orderId) || new Set();
  connections.add(ws);
  activeConnections.set(orderId, connections);

  // Cleanup on close
  ws.on('close', () => {
    connections.delete(ws);
    if (connections.size === 0) {
      activeConnections.delete(orderId);
    }
  });
});

(async () => {
  await connectDB();
  const port = process.env.PORT || 3003;
  app.listen(port, () => {
    console.log(`Delivery Service is running on port ${port} with WebSocket`);
  });
})();
