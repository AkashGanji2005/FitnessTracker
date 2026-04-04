const express = require("express");
const router = express.Router();
const DailyLog = require("../../models/DailyLog");
const Exercise = require("../../models/Exercise");
const WorkoutSession = require("../../models/WorkoutSession");
const User = require("../../models/User");
const verifyToken = require("../middleware/verifyToken");

// POST /logs — create a log with auto-calculated calories
// calories = MET × weight_kg × duration_minutes / 60
router.post("/", verifyToken, async (req, res) => {
  try {
    const { sessionId, exerciseId, reps, sets, distance_km } = req.body;
    const userId = req.user.id;

    const [session, exercise, user] = await Promise.all([
      WorkoutSession.findById(sessionId),
      Exercise.findById(exerciseId),
      User.findById(userId),
    ]);

    if (!session) return res.status(404).json({ error: "Session not found" });
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    const calories_burned = exercise.MET * user.weight_kg * session.duration / 60;

    const log = new DailyLog({ sessionId, exerciseId, userId, reps, sets, distance_km, calories_burned });
    const saved = await log.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /logs/:sessionId — all logs for a session
router.get("/:sessionId", verifyToken, async (req, res) => {
  try {
    const logs = await DailyLog.find({ sessionId: req.params.sessionId })
      .populate("exerciseId");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
