import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", password: "", weight_kg: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("/auth/register", { ...form, weight_kg: Number(form.weight_kg) });
      setMessage("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch {
      setError("Signup failed. Username may already exist.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="weight_kg" type="number" placeholder="Weight (kg)" value={form.weight_kg} onChange={handleChange} required />
          <button type="submit">Sign Up</button>
        </form>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-error">{error}</p>}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
