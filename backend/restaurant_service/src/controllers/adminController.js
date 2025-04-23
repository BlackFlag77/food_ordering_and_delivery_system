const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Transaction = require('../models/Transaction');


exports.listUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};