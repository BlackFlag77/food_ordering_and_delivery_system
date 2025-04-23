const router = require('express').Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { listIncoming, updateStatus } = require('../controllers/orderController');


router.get('/incoming', auth, roles('restaurant'), listIncoming);
router.patch('/:id/status', auth, roles('restaurant'), updateStatus);

module.exports = router;