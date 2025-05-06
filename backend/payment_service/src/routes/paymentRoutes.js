const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { processPayment, getAllPayments,patchPaymentStatus } = require('../controllers/paymentController');

router.use(auth);
router.post('/:orderId', processPayment);
router.get('/', getAllPayments);
router.patch('/:piId/status',  patchPaymentStatus);
module.exports = router;
