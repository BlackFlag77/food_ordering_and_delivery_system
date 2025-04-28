require('dotenv').config();
const fetch = require("node-fetch");

const NOTIFICATION_SERVICE_PORT = process.env.NOTIFICATION_SERVICE_PORT || 3001;

async function notifyDriver(driver, orderId) {
  try {
    const res = await fetch(`http://localhost:${NOTIFICATION_SERVICE_PORT}/notify`, { // Remember to replace PORT
    // await fetch("http://localhost:PORT/notify", {
      // Change PORT to Notification Service
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: driver.name, // ideally to: driver.phone,
        message: `New delivery assigned for order ${orderId}`,
      }),
    });
    // console.log("Notification sent! Response status:", res.status);
    if (res.ok) {
      console.log("Notification sent! Response status:", res.status);
      const responseData = await res.json(); // Optionally parse response body
      console.log("Notification response:", responseData);
    } else {
      console.error("Notification failed! Response status:", res.status);
      const errorData = await res.text(); // Or res.json() if the service sends JSON errors
      console.error("Notification error body:", errorData);
    }
  } catch (err) {
    console.error("Notification failed (network error):", err);
  }
}

module.exports = notifyDriver;
