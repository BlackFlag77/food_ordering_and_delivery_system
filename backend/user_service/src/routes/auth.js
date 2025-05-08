console.log(" [AUTH.JS] Loaded from", __filename);

const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { selfRegisterValidation, loginValidation } = require('../middleware/validation');

console.log(" /api/auth route file loaded");

// Public self‑registration (customers, restaurant_admin, delivery_personnel)
router.post('/register', selfRegisterValidation, registerUser);

router.get('/test', (req, res) => {
    res.send('Auth route is working');
  });
  
// Public login
router.post('/login',    loginValidation, loginUser);

module.exports = router;

