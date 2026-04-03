import { useEffect, useState } from "react";
import axios from "axios";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    targetValue: "",
    currentValue: "",
    unit: "",
  });

  const token = localStorage.getItem("token");

  const fetchGoals = async () => {
    const res = await axios.get("http://localhost:5000/goals", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoals(res.data);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/goals", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ title: "", targetValue: "", currentValue: "", unit: "" });
    fetchGoals();
  };

  return (
    <div>
      <h1>Goals</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Goal title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Target"
          value={form.targetValue}
          onChange={(e) => setForm({ ...form, targetValue: e.target.value })}
        />
        <input
          placeholder="Current progress"
          value={form.currentValue}
          onChange={(e) => setForm({ ...form, currentValue: e.target.value })}
        />
        <input
          placeholder="Unit (km, lbs, sessions)"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />
        <button type="submit">Add Goal</button>
      </form>

      {goals.map((goal) => {
        const percent = Math.min(
          100,
          (goal.currentValue / goal.targetValue) * 100
        );

        return (
          <div key={goal._id}>
            <h3>{goal.title}</h3>
            <p>
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </p>
            <div style={{ width: "300px", background: "#ddd", height: "20px" }}>
              <div
                style={{
                  width: `${percent}%`,
                  background: "green",
                  height: "20px",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}