const mongoose = require("mongoose");

const DailyLogSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutSession", required: true },
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reps: { type: Number },
  sets: { type: Number },
  distance_km: { type: Number },
  calories_burned: { type: Number }
});

module.exports = mongoose.model("DailyLog", DailyLogSchema);