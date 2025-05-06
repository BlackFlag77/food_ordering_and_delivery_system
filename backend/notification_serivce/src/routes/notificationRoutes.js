const router = require('express').Router();
const ctrl   = require('../controllers/notificationController');

// POST /notifications/email
router.post('/email', ctrl.sendEmail);

// POST /notifications/whatsapp
router.post('/whatsapp', ctrl.sendWhatsApp);

module.exports = router;
