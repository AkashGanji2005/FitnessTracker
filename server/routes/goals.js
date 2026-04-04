const express = require("express");
const router = express.Router();
const Goal = require("../../models/Goal");
const verifyToken = require("../middleware/verifyToken");
const isOwner = require("../middleware/isOwner");

// GET /goals — logged-in user's goals
router.get("/", verifyToken, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /goals
router.post("/", verifyToken, async (req, res) => {
  try {
    const goal = new Goal({ ...req.body, userId: req.user.id });
    const saved = await goal.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /goals/:id
router.get("/:id", verifyToken, isOwner(Goal), async (req, res) => {
  res.json(req.doc);
});

// PUT /goals/:id
router.put("/:id", verifyToken, isOwner(Goal), async (req, res) => {
  try {
    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /goals/:id
router.delete("/:id", verifyToken, isOwner(Goal), async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
