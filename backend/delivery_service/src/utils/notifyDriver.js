const fetch = require("node-fetch");

async function notifyDriver(driver, orderId) {
  try {
    await fetch("http://localhost:PORT/notify", {
      // Change PORT to Notification Service
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: driver.name,      // ideally to: driver.phone,
        message: `New delivery assigned for order ${orderId}`,
      }),
    });
    console.log("Notification sent! Response status:", res.status);
  } catch (err) {
    console.error("Notification failed:", err);
  }
}

module.exports = notifyDriver;
