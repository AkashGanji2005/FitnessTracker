require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const WorkoutSession = require("./models/WorkoutSession");
const Exercise = require("./models/Exercise");
const DailyLog = require("./models/DailyLog");
const Goal = require("./models/Goal");

const authRoutes = require("./server/routes/auth");
const workoutRoutes = require("./server/routes/workouts");
const logRoutes = require("./server/routes/logs");
const goalRoutes = require("./server/routes/goals");
const adminRoutes = require("./server/routes/admin");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);
app.use("/logs", logRoutes);
app.use("/goals", goalRoutes);
app.use("/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("FitTrack backend is running");
});

// get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all exercises
app.get("/exercises", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all workout sessions
app.get("/workoutsessions", async (req, res) => {
  try {
    const sessions = await WorkoutSession.find();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all daily logs
app.get("/dailylogs", async (req, res) => {
  try {
    const logs = await DailyLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all goals
app.get("/goals", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create a user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// create a workout session
app.post("/workoutsessions", async (req, res) => {
  try {
    const newSession = new WorkoutSession(req.body);
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// create a daily log
app.post("/dailylogs", async (req, res) => {
  try {
    const newLog = new DailyLog(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// create a goal
app.post("/goals", async (req, res) => {
  try {
    const newGoal = new Goal(req.body);
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});