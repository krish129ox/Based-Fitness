import { useCallback, useEffect, useState } from "react";
import WorkoutForm from "../components/WorkoutForm";
import { createWorkoutRequest, deleteWorkoutRequest, fetchWorkouts } from "../api/workouts";

const typeColors = {
  Run: "text-accent-secondary border-accent-secondary/30 bg-accent-secondary/10",
  Gym: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  Yoga: "text-sky-400 border-sky-400/30 bg-sky-400/10",
  Cycling: "text-violet-400 border-violet-400/30 bg-violet-400/10",
  Other: "text-text-secondary border-border bg-surface",
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await fetchWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load workouts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await createWorkoutRequest(payload);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteWorkoutRequest(id);
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete workout.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div>
        <h1 className="font-scoreboard font-bold text-2xl text-text-primary">Workouts</h1>
        <p className="mt-1 text-sm text-text-secondary">Every session, newest first.</p>
      </div>

      {error && (
        <div className="card border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <WorkoutForm onSubmit={handleCreate} submitting={submitting} />

      <section className="space-y-3">
        {loading ? (
          <p className="text-sm text-text-secondary">Loading workouts...</p>
        ) : workouts.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-sm text-text-secondary">No workouts yet. Log your first session above.</p>
          </div>
        ) : (
          workouts.map((workout) => {
            const colors = typeColors[workout.type] || typeColors.Other;
            return (
              <article key={workout._id} className="card flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-text-primary">{workout.type}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors}`}>
                      {workout.type}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {workout.duration} min · {workout.caloriesBurned} kcal
                  </p>
                  <p className="text-xs text-text-secondary/70">
                    {new Date(workout.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {workout.notes && <p className="text-sm text-text-secondary/60">{workout.notes}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(workout._id)}
                  className="btn-secondary text-sm py-1.5 px-3 text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                >
                  Delete
                </button>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}