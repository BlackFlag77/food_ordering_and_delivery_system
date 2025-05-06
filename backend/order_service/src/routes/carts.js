const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/cartController');
const { permitCustomer } = require('../middleware/roles');

router.use(auth);
router.use(permitCustomer);

router.get('/', ctrl.viewCart);
router.post('/', ctrl.addOrUpdateItem); // add or update quantity
router.delete('/:menuItemId', ctrl.removeItem); // remove item
router.delete('/', ctrl.clearCart); // clear all
router.patch('/:menuItemId', ctrl.updateQuantity); // update quantity

module.exports = router;