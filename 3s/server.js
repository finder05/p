const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/leave", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  availableLeaves: { casual: { type: Number, default: 10 }, medical: { type: Number, default: 5 } },
});

const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["casual", "medical"], required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Leave = mongoose.model("Leave", leaveSchema);

// Routes

// Get or create user by name
app.get("/api/users", async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    let user = await User.findOne({ name });
    if (!user) {
      user = new User({ name, availableLeaves: { casual: 10, medical: 5 } });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching/creating user", err });
  }
});

// Apply leave
app.post("/api/leave/apply", async (req, res) => {
  try {
    const { userId, type, from, to, reason } = req.body;
    if (!userId || !type || !from || !to || !reason)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.availableLeaves[type] <= 0)
      return res.status(400).json({ message: "No available leaves left" });

    const leave = new Leave({ userId, type, from, to, reason });
    await leave.save();

    user.availableLeaves[type] -= 1;
    await user.save();

    res.json({ message: "Leave applied successfully", leave });
  } catch (err) {
    res.status(500).json({ message: "Error applying leave", err });
  }
});

// Get leaves for a user
app.get("/api/leaves/:userId", async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaves", err });
  }
});

// Base route
app.get("/", (req, res) => res.send("Leave Management API Running ✅"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
