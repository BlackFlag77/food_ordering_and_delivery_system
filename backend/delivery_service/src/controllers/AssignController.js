const Driver = require("../models/Driver");
const Delivery = require("../models/Delivery");

exports.assignDriver = async (req, res) => {
  const { orderId, coords } = req.body; // coords = [lon, lat]

  // 1. Find nearest available driver within 5km
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

  // 2. Mark driver unavailable and save
  driver.available = false;
  await driver.save();

  // await notifyDriver(driver, orderId);
  // Temporary (console log) notification
  console.log(
    `TEMPORARY NOTIFICATION: Driver ${driver.name} assigned to order ${orderId}`
  );

  // 3. Create Delivery record
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

  // console.log("deliveryLocation: ", delivery.deliveryLocation.coordinates);
  // console.log("pickupLocation: ", delivery.pickupLocation.coordinates);

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

// exports.createDelivery = async (req, res) => {
//   try {
//     const {
//       orderId,
//       driverId,
//       status,
//       deliveryLocation,
//       pickupLocation,
//       estimatedTime,
//     } = req.body;

//     if (!orderId) {
//       return res.status(400).json({ error: "Order ID is required." });
//     }

//     const newDelivery = new Delivery({
//       orderId,
//       // driver: driverId, // Optional: usually dont assign a driver at creation
//       status,
//       deliveryLocation: deliveryLocation
//         ? { type: "Point", coordinates: deliveryLocation }
//         : undefined,
//       pickupLocation: pickupLocation
//         ? { type: "Point", coordinates: pickupLocation }
//         : undefined,
//       estimatedTime,
//     });

//     const savedDelivery = await newDelivery.save();
//     res.status(201).json(savedDelivery);
//   } catch (error) {
//     console.error("Error creating delivery:", error);
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.orderId) {
//       return res
//         .status(409)
//         .json({ error: "Delivery with this Order ID already exists." });
//     }
//     res.status(500).json({ error: "Failed to create delivery." });
//   }
// };
