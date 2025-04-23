const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Transaction = require('../models/Transaction');


exports.listUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.verifyRestaurant = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id,
      { isVerified: true }, { new: true });
    res.json(user);
  };

  exports.listTransactions = async (req, res) => {
    const txs = await Transaction.find();
    res.json(txs);
  };

  
  exports.completeTransaction = async (req, res) => {
    const tx = await Transaction.findByIdAndUpdate(req.params.id,
      { status: 'completed' }, { new: true });
    res.json(tx);
  };