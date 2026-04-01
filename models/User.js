const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  weight_kg: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);