const express = require("express");
const router = express.Router();
const { assignDriver } = require("../controllers/AssignController");
const { getStatus, updateStatus } = require("../controllers/TrackingController");
// const DeliveryController = require("../controllers/DeliveryController.js");

// // Delivery routes
// router.get("/orders", (req, res) => {
//   res.send("Get all delivery orders");
// });

// router.post("/new", (req, res) => {
//   res.send("Create a new delivery order");
// });

router.post("/assign", assignDriver);
router.get("/status/:orderId", getStatus);
router.put("/status/:orderId", updateStatus);

// Export the router
module.exports = router;
