const Joi = require('joi');

// Strong password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

const selfRegisterSchema = Joi.object({
  name:     Joi.string().min(2).max(50).required(),
  email:    Joi.string().email().required(),
  password: Joi.string()
                .pattern(passwordPattern)
                .message('Password must be 8+ chars, include upper, lower, number & special')
                .required(),
  role:     Joi.string()
                .valid('customer')
                .default('customer')
});

const updateSchema = Joi.object({
  name:     Joi.string().min(2).max(50),
  email:    Joi.string().email(),
  password: Joi.string()
                .pattern(passwordPattern)
                .message('Password must be 8+ chars, include upper, lower, number & special')
                ,
  role:     Joi.string()
                .valid('customer')
                .default('customer')
});


const adminCreateSchema = Joi.object({
  name:     selfRegisterSchema.extract('name'),
  email:    selfRegisterSchema.extract('email'),
  password: selfRegisterSchema.extract('password'),
  role:     Joi.string()
                .valid('customer','restaurant_admin','delivery_personnel','admin')
                .required()
});

const loginSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  password: Joi.string().required()
});

// Validate payload for public registration (no admin)
exports.selfRegisterValidation = (req, res, next) => {
  const { error } = selfRegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Validate updates
exports.updateSchema = (req, res, next) => {
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Validate payload when admin creates a user (can create admins too)
exports.adminCreateValidation = (req, res, next) => {
  const { error } = adminCreateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.loginValidation = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
