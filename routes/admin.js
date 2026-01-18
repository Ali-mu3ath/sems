const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middleware/admin');


//  GET كل المستخدمين

router.get('/users', adminAuth, async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});


//  POST إنشاء مستخدم

router.post('/users', adminAuth, async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
    role: role || 'user'
  });

  res.status(201).json({ message: "User created", id: user._id });
});


//  PUT تعديل مستخدم

router.put('/users/:id', adminAuth, async (req, res) => {
  const { name, email, role } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    name,
    email,
    role
  });

  res.json({ message: "User updated" });
});


//  DELETE حذف مستخدم

router.delete('/users/:id', adminAuth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
