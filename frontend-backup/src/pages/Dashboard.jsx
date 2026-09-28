import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import StepChart from "../components/StepChart";
import { fetchSteps, saveStepsRequest } from "../api/steps";
import { fetchWorkouts } from "../api/workouts";
import { useAuth } from "../context/AuthContext";

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function Dashboard() {
  const { user } = useAuth();
  const [todaySteps, setTodaySteps] = useState(0);
  const [week, setWeek] = useState({ days: [], total: 0, average: 0 });
  const [workouts, setWorkouts] = useState([]);
  const [quickSteps, setQuickSteps] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const [today, weekData, workoutData] = await Promise.all([
        fetchSteps(),
        fetchSteps("week"),
        fetchWorkouts(),
      ]);
      setTodaySteps(today.total);
      setWeek(weekData);
      setWorkouts(workoutData);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuickAdd = async (event) => {
    event.preventDefault();
    const value = Number(quickSteps);
    if (!Number.isFinite(value) || value < 0) {
      setError("Enter a valid step count.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await saveStepsRequest({ date: todayKey(), stepCount: value });
      setQuickSteps("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save steps.");
    } finally {
      setSaving(false);
    }
  };

  const lastWorkout = workouts[0];
  const weekDuration = workouts
    .filter((w) => new Date(w.date) >= new Date(Date.now() - 6 * 86400000))
    .reduce((sum, w) => sum + (w.duration || 0), 0);

  const goalMet = todaySteps >= 10000;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div>
        <h1 className="font-scoreboard font-bold text-2xl text-text-primary">
          Hey {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Here is how your fitness is tracking today.</p>
      </div>

      {error && (
        <div className="card border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <StatCard
          label="Today's steps"
          value={loading ? "—" : todaySteps.toLocaleString()}
          accent={goalMet}
          size="huge"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="7-day total"
            value={loading ? "—" : week.total.toLocaleString()}
            unit="steps"
            hint={`Avg ${week.average.toLocaleString()} per day`}
          />
          <StatCard
            label="Workout minutes"
            value={loading ? "—" : weekDuration}
            unit="min"
            hint="Last 7 days"
          />
        </div>
      </div>

      <section className="card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-scoreboard font-semibold text-lg text-text-primary">Weekly steps</h2>
          <Link to="/steps" className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
            Log steps
          </Link>
        </div>
        <StepChart data={week.days} />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card">
          <h2 className="font-scoreboard font-semibold text-lg text-text-primary">Last workout</h2>
          {lastWorkout ? (
            <div className="mt-3 space-y-1 text-sm text-text-secondary">
              <p className="text-base font-semibold text-text-primary">{lastWorkout.type}</p>
              <p>{lastWorkout.duration} min · {lastWorkout.caloriesBurned} kcal</p>
              <p className="text-text-secondary/70">
                {new Date(lastWorkout.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {lastWorkout.notes && <p className="text-text-secondary/60">{lastWorkout.notes}</p>}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-secondary">No workouts logged yet.</p>
          )}
          <Link to="/workouts" className="mt-4 inline-block btn-primary">
            Log a workout
          </Link>
        </section>

        <section className="card">
          <h2 className="font-scoreboard font-semibold text-lg text-text-primary">Quick add steps</h2>
          <p className="mt-1 text-sm text-text-secondary">Set today's total in one tap.</p>
          <form onSubmit={handleQuickAdd} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="number"
              min="0"
              value={quickSteps}
              onChange={(e) => setQuickSteps(e.target.value)}
              placeholder="e.g. 8500"
              className="flex-1 input-field"
            />
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Add steps"}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {[2000, 5000, 10000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setQuickSteps(String(preset))}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                +{preset.toLocaleString()}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}