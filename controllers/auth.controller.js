const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    //  تحقق إذا المستخدم موجود
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists'
      });
    }

    //  تشفير كلمة المرور
    const hash = await bcrypt.hash(req.body.password, 10);

    //  إنشاء المستخدم
    const user = await User.create({
      ...req.body,
      password: hash
    });

    res.status(201).json({
      message: 'User registered successfully',
      id: user._id,
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
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
