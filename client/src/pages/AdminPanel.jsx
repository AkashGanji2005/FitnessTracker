import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", weight_kg: "", role: "user" });
  const [editing, setEditing] = useState({}); // { [userId]: { role, weight_kg } }
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    const [usersRes, logsRes] = await Promise.all([
      axios.get("/admin/users", authHeader),
      axios.get("/admin/logs", authHeader),
    ]);
    setUsers(usersRes.data);
    setLogs(logsRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  // CREATE
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await axios.post("/admin/users", {
        ...newUser,
        weight_kg: Number(newUser.weight_kg),
      }, authHeader);
      setNewUser({ username: "", password: "", weight_kg: "", role: "user" });
      setSuccess("User created.");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user.");
    }
  };

  // UPDATE
  const handleUpdateUser = async (id) => {
    setError(""); setSuccess("");
    try {
      await axios.put(`/admin/users/${id}`, {
        role: editing[id].role,
        weight_kg: Number(editing[id].weight_kg),
      }, authHeader);
      setEditing({ ...editing, [id]: undefined });
      setSuccess("User updated.");
      fetchData();
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  // DELETE
  const handleDeleteUser = async (id) => {
    setError(""); setSuccess("");
    try {
      await axios.delete(`/admin/users/${id}`, authHeader);
      setSuccess("User deleted.");
      fetchData();
    } catch {
      setError("Failed to delete user.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h1>Admin Panel</h1>

        {error && <p className="text-error" style={{ marginBottom: "1rem" }}>{error}</p>}
        {success && <p className="text-success" style={{ marginBottom: "1rem" }}>{success}</p>}

        {/* CREATE */}
        <div className="card">
          <h2>Create User</h2>
          <form onSubmit={handleCreateUser}>
            <input placeholder="Username" value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
            <input type="password" placeholder="Password" value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
            <input type="number" placeholder="Weight (kg)" value={newUser.weight_kg}
              onChange={(e) => setNewUser({ ...newUser, weight_kg: e.target.value })} required />
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">Standard User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Create User</button>
          </form>
        </div>

        {/* READ + UPDATE + DELETE */}
        <div className="card">
          <h2>All Users</h2>
          <ul className="data-list">
            {users.map((user) => {
              const isEditing = editing[user._id] !== undefined;
              return (
                <li key={user._id} style={{ flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                  {isEditing ? (
                    <>
                      <strong>{user.username}</strong>
                      <select
                        value={editing[user._id].role}
                        onChange={(e) => setEditing({ ...editing, [user._id]: { ...editing[user._id], role: e.target.value } })}
                        style={{ width: "130px" }}
                      >
                        <option value="user">Standard User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <input
                        type="number"
                        value={editing[user._id].weight_kg}
                        onChange={(e) => setEditing({ ...editing, [user._id]: { ...editing[user._id], weight_kg: e.target.value } })}
                        style={{ width: "90px" }}
                        placeholder="kg"
                      />
                      <button className="btn btn-primary" style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}
                        onClick={() => handleUpdateUser(user._id)}>Save</button>
                      <button className="btn" style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem", background: "#f1f5f9", color: "#64748b" }}
                        onClick={() => setEditing({ ...editing, [user._id]: undefined })}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <strong>{user.username}</strong>
                      <span className={`badge badge-${user.role}`}>{user.role}</span>
                      <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{user.weight_kg} kg</span>
                      <div style={{ marginLeft: "auto", display: "flex", gap: "0.4rem" }}>
                        <button className="btn" style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem", background: "#f1f5f9", color: "#475569" }}
                          onClick={() => setEditing({ ...editing, [user._id]: { role: user.role, weight_kg: user.weight_kg } })}>
                          Edit
                        </button>
                        <button className="btn btn-danger"
                          onClick={() => handleDeleteUser(user._id)}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* READ logs */}
        <div className="card">
          <h2>All Workout Logs</h2>
          <ul className="data-list">
            {logs.length === 0 && <li style={{ color: "#94a3b8" }}>No logs yet.</li>}
            {logs.map((log) => (
              <li key={log._id}>
                <strong>{log.userId?.username}</strong>
                <span style={{ color: "#64748b" }}>— {log.exerciseId?.name}</span>
                <span style={{ marginLeft: "auto", color: "#3b82f6", fontWeight: 600, fontSize: "0.85rem" }}>
                  {Math.round(log.calories_burned || 0)} kcal
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
