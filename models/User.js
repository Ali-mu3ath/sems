  const mongoose = require('mongoose');

  const schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    lclid: { type: String, required: false }, 
    role: { type: String, default: 'user' }
  });

  module.exports = mongoose.model('User', schema);