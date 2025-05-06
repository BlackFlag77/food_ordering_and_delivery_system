const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/cartController');
const { permitCustomer } = require('../middleware/roles');

router.use(auth);
router.use(permitCustomer);

// Pass restaurantId as query param where needed
router.get('/', ctrl.viewCart); // /carts?restaurantId=...
router.post('/', ctrl.addOrUpdateItem); // in body: restaurantId, menuItemId, quantity
router.patch('/:menuItemId', ctrl.updateQuantity); // /carts/:menuItemId?restaurantId=...
router.delete('/:menuItemId', ctrl.removeItem);    // /carts/:menuItemId?restaurantId=...
router.delete('/', ctrl.clearCart);                // /carts?restaurantId=...

module.exports = router;

// const router = require('express').Router();
// const auth = require('../middleware/auth');
// const ctrl = require('../controllers/cartController');
// const { permitCustomer } = require('../middleware/roles');

// router.use(auth);
// router.use(permitCustomer);

// router.get('/', ctrl.viewCart);
// router.post('/', ctrl.addOrUpdateItem); // add or update quantity
// router.delete('/:menuItemId', ctrl.removeItem); // remove item
// router.delete('/', ctrl.clearCart); // clear all
// router.patch('/:menuItemId', ctrl.updateQuantity); // update quantity

// module.exports = router;