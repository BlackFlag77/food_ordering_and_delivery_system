const express = require('express');         
const router  = express.Router();          
const auth = require('../middleware/auth');
console.log('auth middleware:', auth); 
const { permitCustomer } = require('../middleware/roles');
const ctrl    = require('../controllers/orderController');

// Protect every /api/orders route
router.use(auth);

router.post('/',          permitCustomer, ctrl.createOrder);
router.get('/',            ctrl.listOrders);
router.get('/mine',       permitCustomer, ctrl.getMyOrders);
router.get('/:id',         ctrl.getOrder);
router.patch('/:id',         ctrl.updateOrder);
router.patch('/:id/status',ctrl.patchStatus);
router.delete('/:id', ctrl.deleteOrder);


module.exports = router;
