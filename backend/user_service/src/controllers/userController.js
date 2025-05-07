const User = require('../models/User');
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
/**
 * Create a new user.
 * - Only 'admin' can hit this route.
 * - Only admin may create another admin.
 */
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phoneNumber  } = req.body;

    if (role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only an admin may create another admin' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const customer = await stripe.customers.create({ name, email });
    const createdUser = await new User({ name, email, password: hashedPassword,stripeCustomerId: customer.id , role,phoneNumber}).save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        stripeCustomerId: customer.id,
        role: createdUser.role,
        phoneNumber: createdUser.phoneNumber
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all users.
 * - Only 'admin' may call.
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * Get one user by ID.
 * - 'admin' or owner (self).
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a user.
 * - 'admin' or owner (self).
 * - Only 'admin' may change roles.
 */
exports.updateUser = async (req, res, next) => {
  try {
    //const updates = { name: req.body.name};
    const updates = { name: req.body.name,email: req.body.email,password: req.body.password };

    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 12); // hash before saving
    }

    if (req.user.role === 'admin' && req.body.role) {
      updates.role = req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a user.
 * - 'admin' or owner (self).
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /users/me
 * Returns the currently‑logged‑in user.
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // req.user.id was set by authMiddleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
exports.viewAssignedDeliveries = (req, res) => {
  res.json({ message: `Viewing deliveries assigned to user ${req.user.id}` });
};


/**
 * Delivery personnel → view assigned deliveries.
 * - stub: in real life, query Orders by req.user.id
 */
