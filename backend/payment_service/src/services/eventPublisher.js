exports.publish = (event, data) => {
    console.log(`Event published: ${event}`, data);
    // In real system: send to message queue (RabbitMQ/Kafka)
  };
  