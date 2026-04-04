const express = require("express");
const router = express.Router();
const WorkoutSession = require("../../models/WorkoutSession");
const verifyToken = require("../middleware/verifyToken");
const isOwner = require("../middleware/isOwner");

// GET /workouts — logged-in user's sessions
router.get("/", verifyToken, async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.user.id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /workouts
router.post("/", verifyToken, async (req, res) => {
  try {
    const session = new WorkoutSession({ ...req.body, userId: req.user.id });
    const saved = await session.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /workouts/:id
router.put("/:id", verifyToken, isOwner(WorkoutSession), async (req, res) => {
  try {
    const updated = await WorkoutSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /workouts/:id
router.delete("/:id", verifyToken, isOwner(WorkoutSession), async (req, res) => {
  try {
    await WorkoutSession.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
