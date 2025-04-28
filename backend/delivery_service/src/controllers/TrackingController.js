const Delivery = require("../models/Delivery");
const Driver = require("../models/Driver");
const { validateTransition } = require("../utils/statusMachine");

// Get delivery status
exports.getStatus = async (req, res) => {
  const { orderId } = req.params;
  const delivery = await Delivery.findOne({ orderId }).populate("driver");

  if (!delivery) return res.status(404).json({ error: "Delivery not found" });

  res.json({
    status: delivery.status,
    driverLocation: delivery.driver.location.coordinates,
  });
};

// Update delivery status
exports.updateStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Fetch the existing delivery document to get the current status
  const delivery = await Delivery.findOne({ orderId }).populate("driver");

  if (!delivery) {
    return res.status(404).json({ error: "Delivery not found" });
  }

  // Validate status transition
  if (!validateTransition(delivery.status, status)) {
    return res.status(400).json({ error: "Invalid status transition" });
  }

  const updatedDelivery = await Delivery.findOneAndUpdate(
    { orderId },
    { status, updatedAt: Date.now() },
    { new: true }
  ).populate("driver");

  if (!updatedDelivery) {
    return res.status(500).json({ error: "Failed to update delivery status" });
  }

  // Reset driver availability when delivery is completed
  if (status === "delivered") {
    await Driver.findByIdAndUpdate(delivery.driver._id, { available: true });
  }

  // After updating status
  const connections = activeConnections.get(orderId.toString()) || [];
  connections.forEach((ws) => {
    ws.send(
      JSON.stringify({
        type: "STATUS_UPDATE",
        status: status,
      })
    );
  });

  res.json({ message: "Status updated", delivery });
};

// Update driver location
exports.updateLocation = async (req, res) => {
  const { driverId } = req.params;
  const { coords } = req.body; // [longitude, latitude]

  // Update driver location
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { location: { type: "Point", coordinates: coords } },
    { new: true }
  );

  // Find all deliveries for this driver
  const deliveries = await Delivery.find({
    driver: driverId,
    status: "en_route",
  });

  // Broadcast to all connected clients
  deliveries.forEach((delivery) => {
    const connections =
      activeConnections.get(delivery.orderId.toString()) || [];
    connections.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "LOCATION_UPDATE",
          coordinates: driver.location.coordinates,
          status: delivery.status,
          // data: {
          //   coordinates: coords,
          //   driverId,
          //   timestamp: Date.now(),
          // },
        })
      );
    });
  });

  res.json({ message: "Location updated", driver });
};

// Get driver location (Ping)
exports.driverPing = async (req, res) => {
  const { driverId } = req.params;
  const { coords } = req.body;

  // Update driver location
  await Driver.findByIdAndUpdate(driverId, {
    location: {
      type: "Point",
      coordinates: coords,
    },
    lastPing: Date.now(),
  });

  res.json({ message: "Location ping received" });
};
