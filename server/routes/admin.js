const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const DailyLog = require("../../models/DailyLog");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

// GET /admin/users
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/users — create a user with any role
router.post("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const { username, password, weight_kg, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: "Username already taken" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, weight_kg, role });
    const saved = await user.save();
    res.status(201).json({ id: saved._id, username: saved.username, role: saved.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /admin/users/:id — update role and/or weight
router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { role, weight_kg } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role, weight_kg },
      { new: true }
    ).select("-password");
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /admin/users/:id
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /admin/logs
router.get("/logs", verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await DailyLog.find()
      .populate("userId", "username")
      .populate("exerciseId");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
