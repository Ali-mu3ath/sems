require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const meterRoutes = require("./routes/meter.routes");
const aiRoutes = require("./routes/ai.routes");
const adminRoutes = require("./routes/admin");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/meters", meterRoutes);
app.use("/api/ai", aiRoutes);
app.use("/admin", adminRoutes);
app.use("/api/chat", chatRoutes);



// Test
app.get("/", (req, res) => {
  res.send("SEMS Backend Running");
});

module.exports = app;
