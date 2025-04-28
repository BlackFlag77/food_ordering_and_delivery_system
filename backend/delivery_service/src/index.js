require("dotenv").config();
const WebSocket = require('ws');
const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");

const deliveryRoutes = require("./routes/DeliveryRoutes");

const app = express();
const server = require('http').createServer(app);
app.use(cors());
app.use(express.json());


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
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Delivery Service is running on port ${port} with WebSocket`);
  });
})();
