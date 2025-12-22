const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  res.json(await User.create({ ...req.body, password: hash }));
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ message: 'Wrong password' });

  res.json({
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  });
};
