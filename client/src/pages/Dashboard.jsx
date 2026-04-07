import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <h1>Welcome back{username ? `, ${username}` : ""}</h1>
        {data ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{data.caloriesToday}</div>
              <div className="stat-label">Calories Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{data.weeklyCalories}</div>
              <div className="stat-label">Calories This Week</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{data.weeklyStreak}</div>
              <div className="stat-label">Active Days This Week</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{data.todayLogCount}</div>
              <div className="stat-label">Exercises Logged Today</div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <button className="btn btn-primary" onClick={() => navigate("/log")}>
          Start New Session
        </button>
      </div>
    </>
  );
}
