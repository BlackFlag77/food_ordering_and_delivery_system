const Delivery = require("../models/Delivery");
const Driver = require("../models/Driver");

exports.getStatus = async (req, res) => {
  const { orderId } = req.params;
  const delivery = await Delivery.findOne({ orderId }).populate("driver");

  if (!delivery) return res.status(404).json({ error: "Delivery not found" });

  res.json({
    status: delivery.status,
    driverLocation: delivery.driver.location.coordinates,
  });
};

exports.updateStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const delivery = await Delivery.findOneAndUpdate(
    { orderId },
    { status, updatedAt: Date.now() },
    { new: true }
  ).populate("driver");

  if (!delivery) return res.status(404).json({ error: "Delivery not found" });

  // Validate status transition
  if (!validateTransition(delivery.status, status)) {
    return res.status(400).json({ error: "Invalid status transition" });
  }

  // Reset driver availability when delivery is completed
  if (status === "delivered") {
    await Driver.findByIdAndUpdate(delivery.driver._id, { available: true });
  }

  res.json({ message: "Status updated", delivery });
};

exports.updateLocation = async (req, res) => {
  const { driverId } = req.params;
  const { coords } = req.body; // [longitude, latitude]

  // 1. Update driver location
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { location: { type: "Point", coordinates: coords } },
    { new: true }
  );

  // 2. Find all deliveries for this driver
  const deliveries = await Delivery.find({
    driver: driverId,
    status: "en_route",
  });

  // 3. Broadcast to all connected clients
  deliveries.forEach((delivery) => {
    const connections =
      activeConnections.get(delivery.orderId.toString()) || [];
    connections.forEach((ws) => {
      ws.send(
        JSON.stringify({
          type: "LOCATION_UPDATE",
          data: {
            coordinates: coords,
            driverId,
            timestamp: Date.now(),
          },
        })
      );
    });
  });

  res.json({ message: "Location updated", driver });
};

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
