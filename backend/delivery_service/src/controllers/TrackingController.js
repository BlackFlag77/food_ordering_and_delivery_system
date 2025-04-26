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

  res.json({ message: "Status updated", delivery });
};
