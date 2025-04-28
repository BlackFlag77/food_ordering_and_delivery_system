const Driver = require("../models/Driver");
const Delivery = require("../models/Delivery");

exports.assignDriver = async (req, res) => {
  const { orderId, coords } = req.body; // coords = [lon, lat]

  // Find nearest available driver within 10km
  const driver = await Driver.findOne({
    available: true,
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: coords },
        $maxDistance: 10000,  // 10km radius
        // $minDistance: 0, // Optional: set to 0 if you want to include the exact location
      },
    },
  });

  if (!driver) return res.status(404).json({ error: "No drivers available" });

  // Mark driver unavailable and save
  driver.available = false;
  await driver.save();

  // await notifyDriver(driver, orderId);
  // Temporary (console log) notification
  console.log(
    `TEMPORARY NOTIFICATION: Driver ${driver.name} assigned to order ${orderId}`
  );

  // Create Delivery record
  // const delivery = await Delivery.create({ orderId, driver: driver._id });
  const delivery = await Delivery.create({
    orderId,
    driver: driver._id,
    deliveryLocation: {
      type: "Point",
      coordinates: coords,
    },
    pickupLocation: {
      type: "Point",
      coordinates: driver.location.coordinates,
    },
  });

  res.status(200).json({ deliveryId: delivery._id, driver });
};

// Create a new driver
exports.createDriver = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (
      !name ||
      !location ||
      location.type !== "Point" ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({ error: "Invalid driver data provided." });
    }

    const newDriver = new Driver({
      name,
      location,
    });

    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver); // 201 Created for successful resource creation
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({ error: "Failed to create driver." });
  }
};

// Example curl commands to test the API endpoints
// curl -X POST http://localhost:5503/api/delivery/assign   -H "Content-Type: application/json"   -d '{"orderId": "TEST123", "coords": [79.8612, 6.9271]}'
// curl -X POST http://localhost:5503/api/delivery/drivers   -H "Content-Type: application/json"   -d '{"name": "Test Driver 5", "location": { "type": "Point", "coordinates": [79.8650, 6.9290] }}'