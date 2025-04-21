// src/routes/orders.js
const express = require('express');         // ← load express
const router  = express.Router();          // ← get Express's Router
const auth = require('../middleware/auth');
console.log('auth middleware:', auth); 
const ctrl    = require('../controllers/orderController');

// Protect every /api/orders route
router.use(auth);

router.post('/',           ctrl.createOrder);
router.get('/',            ctrl.listOrders);
router.get('/:id',         ctrl.getOrder);
router.patch('/:id',         ctrl.updateOrder);
router.patch('/:id/status',ctrl.patchStatus);

module.exports = router;
