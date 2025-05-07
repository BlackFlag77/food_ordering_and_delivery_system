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

// router.use(auth);

// Only allow restaurent admins to assign drivers (auth(restaurantAdmin)_
router.post("/assign", assignDriver);
router.post("/drivers", createDriver);

router.get("/status/:orderId", getStatus);

// Customers can track drivers location and delivery status (auth(customer))
router.put("/status/:orderId", updateStatus);
router.put("/driver/:driverId/location", updateLocation);
router.put("/driver/:driverId/ping", driverPing);

module.exports = router;
