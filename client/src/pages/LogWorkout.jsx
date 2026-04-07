import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function LogWorkout() {
  const [tab, setTab] = useState("cardio");
  const [exercises, setExercises] = useState([]);

  const [cardioForm, setCardioForm] = useState({ date: "", duration: "", exerciseId: "", distance_km: "" });
  const [strengthForm, setStrengthForm] = useState({ date: "", exerciseId: "", sets: "", reps: "" });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/exercises", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(res.data);
    };
    fetchExercises();
  }, []);

  const cardioExercises = exercises.filter((e) => e.type === "cardio");
  const strengthExercises = exercises.filter((e) => e.type === "strength");

  const submit = async (e, type) => {
    e.preventDefault();
    setError("");
    setResult(null);
    const token = localStorage.getItem("token");
    const authHeader = { Authorization: `Bearer ${token}` };

    try {
      const form = type === "cardio" ? cardioForm : strengthForm;

      const sessionRes = await axios.post(
        "/workouts",
        { date: form.date, duration: type === "cardio" ? Number(form.duration) : 0 },
        { headers: authHeader }
      );

      const logRes = await axios.post(
        "/logs",
        {
          sessionId: sessionRes.data._id,
          exerciseId: form.exerciseId,
          sets: type === "strength" ? Number(form.sets) : undefined,
          reps: type === "strength" ? Number(form.reps) : undefined,
          distance_km: type === "cardio" && form.distance_km ? Number(form.distance_km) : undefined,
        },
        { headers: authHeader }
      );

      setResult(Math.round(logRes.data.calories_burned));

      if (type === "cardio") {
        setCardioForm({ date: "", duration: "", exerciseId: "", distance_km: "" });
      } else {
        setStrengthForm({ date: "", exerciseId: "", sets: "", reps: "" });
      }
    } catch {
      setError("Failed to save workout. Please check all fields.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h1>Log Workout</h1>

        <div className="tab-bar">
          <button
            className={`tab-btn${tab === "cardio" ? " active" : ""}`}
            onClick={() => { setTab("cardio"); setResult(null); setError(""); }}
          >
            Cardio
          </button>
          <button
            className={`tab-btn${tab === "strength" ? " active" : ""}`}
            onClick={() => { setTab("strength"); setResult(null); setError(""); }}
          >
            Strength
          </button>
        </div>

        <div className="card">
          {tab === "cardio" ? (
            <>
              <h2>Log Cardio</h2>
              <form onSubmit={(e) => submit(e, "cardio")}>
                <input type="date" value={cardioForm.date}
                  onChange={(e) => setCardioForm({ ...cardioForm, date: e.target.value })} required />
                <input type="number" placeholder="Duration (minutes)" value={cardioForm.duration}
                  onChange={(e) => setCardioForm({ ...cardioForm, duration: e.target.value })} required />
                <select value={cardioForm.exerciseId}
                  onChange={(e) => setCardioForm({ ...cardioForm, exerciseId: e.target.value })} required>
                  <option value="">Select cardio exercise</option>
                  {cardioExercises.map((ex) => (
                    <option key={ex._id} value={ex._id}>{ex.name}</option>
                  ))}
                </select>
                <input type="number" placeholder="Distance km (optional)" value={cardioForm.distance_km}
                  onChange={(e) => setCardioForm({ ...cardioForm, distance_km: e.target.value })} />
                <button type="submit">Save</button>
              </form>
            </>
          ) : (
            <>
              <h2>Log Strength</h2>
              <form onSubmit={(e) => submit(e, "strength")}>
                <input type="date" value={strengthForm.date}
                  onChange={(e) => setStrengthForm({ ...strengthForm, date: e.target.value })} required />
                <select value={strengthForm.exerciseId}
                  onChange={(e) => setStrengthForm({ ...strengthForm, exerciseId: e.target.value })} required>
                  <option value="">Select strength exercise</option>
                  {strengthExercises.map((ex) => (
                    <option key={ex._id} value={ex._id}>{ex.name}</option>
                  ))}
                </select>
                <input type="number" placeholder="Sets" value={strengthForm.sets}
                  onChange={(e) => setStrengthForm({ ...strengthForm, sets: e.target.value })} required />
                <input type="number" placeholder="Reps" value={strengthForm.reps}
                  onChange={(e) => setStrengthForm({ ...strengthForm, reps: e.target.value })} required />
                <button type="submit">Save</button>
              </form>
            </>
          )}

          {error && <p className="text-error">{error}</p>}
          {result !== null && (
            <div className="calories-result">
              Estimated calories burned: <strong>{result} kcal</strong>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
