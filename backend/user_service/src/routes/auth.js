const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { selfRegisterValidation, loginValidation } = require('../middleware/validation');

// Public self‑registration (customers, restaurant_admin, delivery_personnel)
router.post('/register', selfRegisterValidation, registerUser);

// Public login
router.post('/login',    loginValidation, loginUser);

module.exports = router;

