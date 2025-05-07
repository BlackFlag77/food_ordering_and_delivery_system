const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const stripe    = require('stripe')(process.env.STRIPE_SECRET);
/**
 * Registers a new user, returns { token }
 * Throws 400 if email in use.
 */
exports.register = async ({ name, email, password, role,phoneNumber  }) => {

  if (await User.findOne({ name })) {
    const err = new Error('Name already in use');
    err.statusCode = 400;
    throw err;
  }

  if (await User.findOne({ email })) {
    const err = new Error('Email already in use');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const customer = await stripe.customers.create({
    name,
    email
  });
  const newUser = await new User({
    name, email, password: hashedPassword,stripeCustomerId: customer.id, role,phoneNumber        
  }).save();

  const token = jwt.sign(
    { user: { id: newUser.id, role: newUser.role,phoneNumber:  newUser.phoneNumber } },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  //return { message: 'Registration successful'};
  return { message: 'Registration successful', token };

};

exports.login = async ({ nameOrEmail, password }) => {
  // look up by name OR email
  const existingUser = await User.findOne({
    $or: [
      { name: nameOrEmail },
      { email: nameOrEmail }
    ]
  });

  if (!existingUser) {
    const err = new Error('User not found');
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) {
    const err = new Error('Password is incorrect');
    err.statusCode = 400;
    throw err;
  }

  const token = jwt.sign(
    { user: { id: existingUser.id, role: existingUser.role } },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    message: 'Login successful',
    token,
    user: { id: existingUser.id, role: existingUser.role,phoneNumber:  existingUser.phoneNumber }
  };
};
