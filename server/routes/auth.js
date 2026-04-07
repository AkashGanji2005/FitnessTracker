const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const SALT_ROUNDS = 10;

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, weight_kg, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: "Username already taken" });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, password: hashedPassword, weight_kg, role });
    const saved = await user.save();
    res.status(201).json({ id: saved._id, username: saved.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
