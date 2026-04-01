const mongoose = require("mongoose");

const WorkoutSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  notes: { type: String }
});

module.exports = mongoose.model("WorkoutSession", WorkoutSessionSchema);