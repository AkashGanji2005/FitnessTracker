import { useEffect, useState } from "react";
import axios from "axios";

export default function LogWorkout() {
  const [date, setDate] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [distance, setDistance] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/exercises", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(res.data);
    };

    fetchExercises();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/logs",
        {
          date,
          exerciseId: selectedExercise,
          sets,
          reps,
          distance,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCaloriesBurned(res.data.caloriesBurned);
      setDate("");
      setSelectedExercise("");
      setSets("");
      setReps("");
      setDistance("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Log Workout</h1>
      <form onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          <option value="">Select exercise</option>
          {exercises.map((exercise) => (
            <option key={exercise._id} value={exercise._id}>
              {exercise.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />

        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />

        <input
          type="number"
          placeholder="Distance (optional)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />

        <button type="submit">Save Workout</button>
      </form>

      {caloriesBurned !== null && (
        <p>Estimated calories burned: {caloriesBurned}</p>
      )}
    </div>
  );
}