import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ type: "", target_value: "", current_value: "", deadline: "" });
  const [editing, setEditing] = useState({}); // { [goalId]: newValue }
  const token = localStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchGoals = async () => {
    const res = await axios.get("/goals", { headers: authHeader });
    setGoals(res.data);
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "/goals",
      { ...form, target_value: Number(form.target_value), current_value: Number(form.current_value) },
      { headers: authHeader }
    );
    setForm({ type: "", target_value: "", current_value: "", deadline: "" });
    fetchGoals();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/goals/${id}`, { headers: authHeader });
    fetchGoals();
  };

  const handleUpdateProgress = async (goal) => {
    const newValue = Number(editing[goal._id]);
    const status = newValue >= goal.target_value ? "complete" : "active";
    await axios.put(
      `/goals/${goal._id}`,
      { current_value: newValue, status },
      { headers: authHeader }
    );
    setEditing({ ...editing, [goal._id]: undefined });
    fetchGoals();
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h1>Goals</h1>

        <div className="card">
          <h2>Add New Goal</h2>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Goal type (e.g. weight_loss, run_5km)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
            <input
              type="number" placeholder="Target value"
              value={form.target_value}
              onChange={(e) => setForm({ ...form, target_value: e.target.value })}
              required
            />
            <input
              type="number" placeholder="Starting progress (optional)"
              value={form.current_value}
              onChange={(e) => setForm({ ...form, current_value: e.target.value })}
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
            />
            <button type="submit">Add Goal</button>
          </form>
        </div>

        {goals.map((goal) => {
          const percent = Math.min(100, (goal.current_value / goal.target_value) * 100);
          const isEditing = editing[goal._id] !== undefined;
          return (
            <div className="goal-item" key={goal._id}>
              <div className="goal-header">
                <span className="goal-title">{goal.type}</span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span className={`badge badge-${goal.status}`}>{goal.status}</span>
                  <button className="btn btn-danger" onClick={() => handleDelete(goal._id)}>Delete</button>
                </div>
              </div>
              <div className="goal-meta">
                {goal.current_value} / {goal.target_value} &nbsp;·&nbsp; Due {new Date(goal.deadline).toLocaleDateString()}
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
              <div className="goal-update">
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      value={editing[goal._id]}
                      onChange={(e) => setEditing({ ...editing, [goal._id]: e.target.value })}
                      placeholder="New value"
                      style={{ width: "120px" }}
                    />
                    <button className="btn btn-primary" style={{ padding: "0.35rem 0.9rem", fontSize: "0.85rem" }}
                      onClick={() => handleUpdateProgress(goal)}>Save</button>
                    <button className="btn" style={{ padding: "0.35rem 0.9rem", fontSize: "0.85rem", background: "#f1f5f9", color: "#64748b" }}
                      onClick={() => setEditing({ ...editing, [goal._id]: undefined })}>Cancel</button>
                  </>
                ) : (
                  <button className="btn" style={{ padding: "0.35rem 0.9rem", fontSize: "0.85rem", background: "#f1f5f9", color: "#475569" }}
                    onClick={() => setEditing({ ...editing, [goal._id]: goal.current_value })}>
                    Update Progress
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
