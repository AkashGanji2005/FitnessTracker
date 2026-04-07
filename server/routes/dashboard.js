const express = require("express");
const router = express.Router();
const WorkoutSession = require("../../models/WorkoutSession");
const DailyLog = require("../../models/DailyLog");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Use UTC boundaries so they match dates stored from "YYYY-MM-DD" inputs
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const startOfTomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const weekAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6));

    // Today's sessions and logs
    const todaySessions = await WorkoutSession.find({
      userId,
      date: { $gte: startOfToday, $lt: startOfTomorrow },
    });
    const todayLogs = await DailyLog.find({
      sessionId: { $in: todaySessions.map((s) => s._id) },
    });

    const caloriesToday = todayLogs.reduce((sum, log) => sum + (log.calories_burned || 0), 0);
    const todayLogCount = todayLogs.length;

    // This week's sessions and logs
    const weekSessions = await WorkoutSession.find({
      userId,
      date: { $gte: weekAgo },
    });
    const weekLogs = await DailyLog.find({
      sessionId: { $in: weekSessions.map((s) => s._id) },
    });

    const weeklyCalories = weekLogs.reduce((sum, log) => sum + (log.calories_burned || 0), 0);
    const activeDays = new Set(weekSessions.map((s) => new Date(s.date).toDateString()));

    res.json({
      caloriesToday: Math.round(caloriesToday),
      weeklyCalories: Math.round(weeklyCalories),
      weeklyStreak: activeDays.size,
      todayLogCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
