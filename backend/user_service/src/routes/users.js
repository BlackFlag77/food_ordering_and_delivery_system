const router            = require('express').Router();
const authMiddleware    = require('../middleware/auth');
const { permit, permitSelfOr } = require('../middleware/authorize');
const validation        = require('../middleware/validation');
const userController    = require('../controllers/userController');

// Admin creates any user, incl. new admins
router.post(
  '/',
  authMiddleware,
  permit('admin'),
  validation.adminCreateValidation,
  userController.createUser
);

// Admin lists all users
router.get(
  '/',
  authMiddleware,
  permit('admin'),
  userController.getAllUsers
);

// Admin or self reads a user
router.get(
  '/:id',
  authMiddleware,
  permitSelfOr('admin'),
  userController.getUserById
);

// Admin or self updates a user
router.patch(
  '/:id',
  authMiddleware,
  permitSelfOr('admin'),
  validation.updateSchema, // re‑use payload validation for name/password; role only applied if admin
  userController.updateUser
);

// Admin or self deletes a user
router.delete(
  '/:id',
  authMiddleware,
  permitSelfOr('admin'),
  userController.deleteUser
);

// Delivery Personnel (or admin) views assigned deliveries
router.get(
  '/:id/deliveries',
  authMiddleware,
  permit('delivery_personnel','admin'),
  userController.viewAssignedDeliveries
);

module.exports = router;
