const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/restaurantController');

router.use(auth);
router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.patch('/:id', ctrl.update);
router.patch('/:id/verify', ctrl.verify);
router.patch('/:id/availability', ctrl.setAvailability);

module.exports = router;