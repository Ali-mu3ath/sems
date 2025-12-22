/*
Mock Data Seeder for Smart Energy (Node.js)

Usage:
1. Put this file in your project root (e.g. C:\Users\a-ali\Desktop\sems\mock-data-seeder.js)
2. Make sure your .env contains MONGO_URI, e.g.: MONGO_URI=mongodb://127.0.0.1:27017/sems
3. Install dependencies (if not already): npm install mongoose dotenv
4. Run: node mock-data-seeder.js

What it does:
- Connects to MongoDB using MONGO_URI
- Creates a sample user (or reuses existing by email)
- Creates N meters for that user
- For each meter, generates hourly readings for a given number of days
- Inserts readings into collection 'meterreadings' (schema-light)

Customize the SETTINGS block below.
*/

require('dotenv').config();
const mongoose = require('mongoose');
 
// ---------------- SETTINGS ----------------
const SETTINGS = {
  userEmail: 'ali@test.com',      // owner user email (will be created if missing)
  userName: 'Ali',
  numMeters: 2,                   // how many meters to create
  days: 7,                        // how many past days of data per meter
  hourly: true,                   // hourly readings (true) or daily (false)
  baseConsumption: 1.2,           // base kWh per interval (rough)
  variance: 0.8,                  // random variance added/subtracted
  startMeterId: 1,                // numbering for meterId like MTR-001
  wipeExistingReadings: false     // if true, deletes existing meterreadings for the user
};
// ------------------------------------------

const { userEmail, userName } = SETTINGS;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sems';

// light-weight schemas used only for seeding
const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true } }, { timestamps: true });
const readingSchema = new mongoose.Schema({
  meterId: String,
  timestamp: Date,
  consumptionKWh: Number,
  metadata: Object,
  userEmail: String
}, { timestamps: true });

const User = mongoose.model('SeederUser', userSchema);
const MeterReading = mongoose.model('MeterReading', readingSchema);

const random = (min, max) => Math.random() * (max - min) + min;

async function generate() {
  await mongoose.connect(MONGO_URI, { });
  console.log('Connected to MongoDB');

  // ensure user
  let user = await User.findOne({ email: userEmail });
  if (!user) {
    user = await User.create({ name: userName, email: userEmail });
    console.log('Created user:', userEmail);
  } else {
    console.log('Using existing user:', userEmail);
  }

  if (SETTINGS.wipeExistingReadings) {
    const del = await MeterReading.deleteMany({ userEmail });
    console.log('Deleted existing readings for user:', del.deletedCount);
  }

  const meters = [];
  for (let m = 0; m < SETTINGS.numMeters; m++) {
    const meterId = `MTR-${String(SETTINGS.startMeterId + m).padStart(3, '0')}`;
    meters.push(meterId);
  }

  const now = new Date();
  const totalIntervals = SETTINGS.days * (SETTINGS.hourly ? 24 : 1);
  const msStep = SETTINGS.hourly ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  const docs = [];
  for (const meterId of meters) {
    for (let i = 0; i < totalIntervals; i++) {
      const ts = new Date(now.getTime() - i * msStep);
      // simulate daily pattern: more consumption in evening
      const hour = ts.getHours();
      let factor = 1;
      if (hour >= 19 || hour <= 6) factor = 1.4; // peak evening/night
      else if (hour >= 7 && hour <= 9) factor = 1.1; // morning
      else factor = 0.9; // daytime

      const base = SETTINGS.baseConsumption * factor;
      const variance = (Math.random() - 0.5) * SETTINGS.variance;
      const consumption = Math.max(0, +(base + variance).toFixed(3));

      docs.push({
        meterId,
        timestamp: ts,
        consumptionKWh: consumption,
        metadata: { generated: true },
        userEmail
      });
    }
  }

  // bulk insert in chunks to avoid memory issues
  const chunkSize = 1000;
  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    await MeterReading.insertMany(chunk);
    console.log(`Inserted chunk ${i}..${i + chunk.length}`);
  }

  console.log('Seeding finished. Inserted readings:', docs.length);
  await mongoose.disconnect();
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
