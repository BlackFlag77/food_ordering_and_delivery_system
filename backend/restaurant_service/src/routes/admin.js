const router = require('express').Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const {
  listUsers,
  verifyRestaurant,
  listTransactions,
  completeTransaction
} = require('../controllers/adminController');


router.get('/users', auth, roles('admin'), listUsers);
router.patch('/users/:id/verify', auth, roles('admin'), verifyRestaurant);
router.get('/transactions', auth, roles('admin'), listTransactions);
router.patch('/transactions/:id/complete', auth, roles('admin'), completeTransaction);


module.exports = router;