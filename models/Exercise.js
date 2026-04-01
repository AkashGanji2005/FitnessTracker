const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["cardio", "strength"], required: true },
  MET: { type: Number, required: true },
  muscleGroups: { type: [String], required: true }
});

module.exports = mongoose.model("Exercise", ExerciseSchema);