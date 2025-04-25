const amqplib = require('amqplib');
let ch;

module.exports.init = async () => {
  const conn = await amqplib.connect(process.env.RABBITMQ_URL);
  ch = await conn.createChannel();
};

module.exports.publish = (event, payload) => {
  ch.assertExchange('orders', 'topic', { durable: true });
  ch.publish('orders', event, Buffer.from(JSON.stringify(payload)));
};
