const sendEmail    = require('../utils/sendTestEmail');
const sendWhatsApp = require('../utils/sendWhatsApp');

exports.sendEmail = async (req, res, next) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing to, subject or text.' });
  }
  try {
    const info = await sendEmail(to, subject, text);
    res.json({ success: true, info });
  } catch (err) {
    next(err);
  }
};

exports.sendWhatsApp = async (req, res, next) => {
  const { to, body } = req.body;
  if (!to || !body) {
    return res.status(400).json({ error: 'Missing to or body.' });
  }
  try {
    const msg = await sendWhatsApp(to, body);
    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    next(err);
  }
};
