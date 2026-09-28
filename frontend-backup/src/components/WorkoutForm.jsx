import { useState } from "react";

const WORKOUT_TYPES = ["Run", "Gym", "Yoga", "Cycling", "Other"];

const emptyForm = () => ({
  type: "Run",
  duration: "",
  caloriesBurned: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
});

export default function WorkoutForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const duration = Number(form.duration);
    const caloriesBurned = Number(form.caloriesBurned);

    if (!form.duration || duration <= 0) {
      setError("Duration must be greater than 0 minutes.");
      return;
    }
    if (!form.caloriesBurned || caloriesBurned < 0) {
      setError("Calories burned must be 0 or more.");
      return;
    }

    try {
      await onSubmit({
        type: form.type,
        duration,
        caloriesBurned,
        date: new Date(`${form.date}T12:00:00`).toISOString(),
        notes: form.notes.trim() || undefined,
      });
      setForm(emptyForm());
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Could not save workout.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="type" className="label-field">
          Type
        </label>
        <select id="type" value={form.type} onChange={handleChange("type")} className="input-field">
          {WORKOUT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="duration" className="label-field">
          Duration (min)
        </label>
        <input
          id="duration"
          type="number"
          min="1"
          value={form.duration}
          onChange={handleChange("duration")}
          className="input-field"
          placeholder="45"
        />
      </div>

      <div>
        <label htmlFor="calories" className="label-field">
          Calories burned
        </label>
        <input
          id="calories"
          type="number"
          min="0"
          value={form.caloriesBurned}
          onChange={handleChange("caloriesBurned")}
          className="input-field"
          placeholder="400"
        />
      </div>

      <div>
        <label htmlFor="date" className="label-field">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={form.date}
          onChange={handleChange("date")}
          className="input-field"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="notes" className="label-field">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows="2"
          value={form.notes}
          onChange={handleChange("notes")}
          className="input-field"
          placeholder="Felt strong, 5K pace"
        />
      </div>

      {error && <p className="sm:col-span-2 text-sm text-rose-400">{error}</p>}

      <div className="sm:col-span-2">
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Saving..." : "Log workout"}
        </button>
      </div>
    </form>
  );
}