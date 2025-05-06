// src/utils/sendWhatsApp.js
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID,
                      process.env.TWILIO_AUTH_TOKEN);

module.exports = async function sendWhatsApp(to, body) {
  // ensure “to” is prefixed with whatsapp:
  const toNumber = to.startsWith('whatsapp:')
    ? to
    : `whatsapp:${to}`;

  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to:   toNumber,
    body
  });
};
