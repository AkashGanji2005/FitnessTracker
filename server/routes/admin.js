const express = require("express");
const router = express.Router();
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
