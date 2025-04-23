const router = require('express').Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { createRestaurant, updateAvailability } = require('../controllers/restaurantController');


router.post('/', auth, roles('restaurant'), createRestaurant);
router.patch('/availability', auth, roles('restaurant'), updateAvailability);

module.exports = router;