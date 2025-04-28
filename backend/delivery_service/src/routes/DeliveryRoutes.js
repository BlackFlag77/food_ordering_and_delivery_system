const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// const { authenticate } = require('../middleware/auth');
const { assignDriver, createDriver } = require("../controllers/AssignController");
const {
  getStatus,
  updateStatus,
  updateLocation,
  driverPing,
} = require("../controllers/TrackingController");
// const DeliveryController = require("../controllers/DeliveryController.js");

// // Delivery routes
// router.get("/orders", (req, res) => {
//   res.send("Get all delivery orders");
// });

// router.post("/new", (req, res) => {
//   res.send("Create a new delivery order");
// });

// router.use(auth);

// Only allow restaurent admins to assign drivers
router.post("/assign", assignDriver);
router.post("/drivers", createDriver);
// router.post("/assign", createDelivery);

router.get("/status/:orderId", getStatus);

// Drivers can update their location and status (auth(driver))
router.put("/status/:orderId", updateStatus);
router.put("/driver/:driverId/location", updateLocation);
router.put("/driver/:driverId/ping", driverPing);

// Export the router
module.exports = router;
