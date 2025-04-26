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
        $maxDistance: 5000,
      },
    },
  });

  if (!driver) return res.status(404).json({ error: "No drivers available" });

  // 2. Mark driver unavailable and save
  driver.available = false;
  await driver.save();
  await notifyDriver(driver, orderId);

  // 3. Create Delivery record
  const delivery = await Delivery.create({ orderId, driver: driver._id });
  res.status(200).json({ deliveryId: delivery._id, driver });
};
