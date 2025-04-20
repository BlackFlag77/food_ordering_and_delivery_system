const authService = require('../services/authService');

exports.registerUser = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// controllers/authController.js
exports.loginUser = async (req, res, next) => {
  try {
    const { nameOrEmail, password } = req.body;
    const result = await authService.login({ nameOrEmail, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// exports.loginUser = async (req, res, next) => {
//   try {
//     const result = await authService.login(req.body);
//     res.json(result);
//   } catch (err) {
//     next(err);
//   }
// };
