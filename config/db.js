const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed');
    process.exit(1);
  }
};

module.exports = connectDB;





/* 

git add .
git commit -m "اخر تعديل مع api شغال"
git push

 */