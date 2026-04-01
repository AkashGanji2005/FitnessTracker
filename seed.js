const mongoose = require("mongoose");
const User = require("./models/User");
const Exercise = require("./models/Exercise");

mongoose.connect("mongodb://127.0.0.1:27017/fittrack")
  .then(async () => {
    console.log("Connected to MongoDB");

    // 🔥 CLEAR OLD DATA (optional but useful during testing)
    await User.deleteMany({});
    await Exercise.deleteMany({});

    // 🔐 CREATE ADMIN USER (grader requirement)
    const admin = new User({
      username: "admin",
      password: "admin123", // backend will hash later
      role: "admin",
      weight_kg: 75
    });

    await admin.save();
    console.log("Admin user created");

    // 🏋️ EXERCISES (10–15 required)
    const exercises = [
      { name: "Running", type: "cardio", MET: 9.8, muscleGroups: ["legs"] },
      { name: "Cycling", type: "cardio", MET: 7.5, muscleGroups: ["legs"] },
      { name: "Walking", type: "cardio", MET: 3.5, muscleGroups: ["legs"] },
      { name: "Pushups", type: "strength", MET: 3.8, muscleGroups: ["chest", "arms"] },
      { name: "Bench Press", type: "strength", MET: 3.5, muscleGroups: ["chest"] },
      { name: "Squats", type: "strength", MET: 5.0, muscleGroups: ["legs"] },
      { name: "Deadlift", type: "strength", MET: 6.0, muscleGroups: ["back", "legs"] },
      { name: "Pull-ups", type: "strength", MET: 5.5, muscleGroups: ["back", "arms"] },
      { name: "Jump Rope", type: "cardio", MET: 10.0, muscleGroups: ["full body"] },
      { name: "Plank", type: "strength", MET: 3.0, muscleGroups: ["core"] }
    ];

    await Exercise.insertMany(exercises);
    console.log("Exercises inserted");

    mongoose.connection.close();
  })
  .catch(err => console.log(err));