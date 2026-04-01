const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  target_value: { type: Number, required: true },
  current_value: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ["active", "complete"], default: "active" }
});

module.exports = mongoose.model("Goal", GoalSchema);