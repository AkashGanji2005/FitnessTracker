import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    category: "",
    caloriesPerUnit: "",
  });

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchData = async () => {
    const [usersRes, logsRes, exercisesRes] = await Promise.all([
      axios.get("http://localhost:5000/admin/users", authHeader),
      axios.get("http://localhost:5000/admin/logs", authHeader),
      axios.get("http://localhost:5000/exercises", authHeader),
    ]);

    setUsers(usersRes.data);
    setLogs(logsRes.data);
    setExercises(exercisesRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/exercises", exerciseForm, authHeader);
    setExerciseForm({ name: "", category: "", caloriesPerUnit: "" });
    fetchData();
  };

  const handleDeleteExercise = async (id) => {
    await axios.delete(`http://localhost:5000/exercises/${id}`, authHeader);
    fetchData();
  };

  return (
    <div>
      <h1>Admin Panel</h1>

      <section>
        <h2>All Users</h2>
        {users.map((user) => (
          <div key={user._id}>
            {user.username} - {user.role}
          </div>
        ))}
      </section>

      <section>
        <h2>All Logs</h2>
        {logs.map((log) => (
          <div key={log._id}>
            {log.user?.username} - {log.date} - {log.caloriesBurned} calories
          </div>
        ))}
      </section>

      <section>
        <h2>Manage Exercises</h2>
        <form onSubmit={handleCreateExercise}>
          <input
            placeholder="Exercise name"
            value={exerciseForm.name}
            onChange={(e) =>
              setExerciseForm({ ...exerciseForm, name: e.target.value })
            }
          />
          <input
            placeholder="Category"
            value={exerciseForm.category}
            onChange={(e) =>
              setExerciseForm({ ...exerciseForm, category: e.target.value })
            }
          />
          <input
            placeholder="Calories per unit"
            value={exerciseForm.caloriesPerUnit}
            onChange={(e) =>
              setExerciseForm({
                ...exerciseForm,
                caloriesPerUnit: e.target.value,
              })
            }
          />
          <button type="submit">Add Exercise</button>
        </form>

        {exercises.map((exercise) => (
          <div key={exercise._id}>
            {exercise.name} ({exercise.category})
            <button onClick={() => handleDeleteExercise(exercise._id)}>
              Delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}