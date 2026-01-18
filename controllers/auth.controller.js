const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, lclid, role } = req.body; 

    // تحقق إذا المستخدم موجود
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    
    const existingLclid = await User.findOne({ lclid });
    if (existingLclid) {
      return res.status(409).json({ message: 'This LCLID is already linked to another account' });
    }

    // تشفير كلمة المرور
    const hash = await bcrypt.hash(password, 10);

    // إنشاء المستخدم مع lclid
    const user = await User.create({
      name,
      email,
      password: hash,
      phone: phone || null,
      lclid, 
      role: role || 'user'
    });

    res.status(201).json({
      message: 'User registered successfully',
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      lclid: user.lclid, 
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, lclid: user.lclid },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        lclid: user.lclid, 
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};