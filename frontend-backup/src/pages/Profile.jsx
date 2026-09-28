import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import { fetchMe } from "../api/auth";
import { fetchWorkouts } from "../api/workouts";
import { fetchSteps } from "../api/steps";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ workouts: 0, totalMinutes: 0, weeklySteps: 0 });
  const userInitial = (user?.name || "?").trim().charAt(0).toUpperCase();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [workouts, week] = await Promise.all([fetchWorkouts(), fetchSteps("week")]);
        if (cancelled) return;
        setStats({
          workouts: workouts.length,
          totalMinutes: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
          weeklySteps: week.total,
        });
      } catch {
        // Profile remains usable with cached context data if the request fails.
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <div>
        <h1 className="font-scoreboard font-bold text-2xl text-text-primary">Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Your account and lifetime totals.</p>
      </div>

      <section className="card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-border text-xl font-bold font-scoreboard text-accent">
            {userInitial}
          </div>
          <div>
            <h2 className="font-scoreboard font-semibold text-lg text-text-primary">{user.name}</h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
            <p className="text-sm text-text-secondary">{user.phone}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="card py-3">
            <dt className="text-xs font-medium text-text-secondary">Member since</dt>
            <dd className="mt-1 font-scoreboard font-semibold text-text-primary">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </dd>
          </div>
          <div className="card py-3">
            <dt className="text-xs font-medium text-text-secondary">Sign-in method</dt>
            <dd className="mt-1 font-scoreboard font-semibold text-text-primary">Email or phone + password</dd>
          </div>
        </dl>

        <button type="button" onClick={handleLogout} className="mt-6 w-full btn-secondary">
          Log out
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Workouts logged" value={stats.workouts} />
        <StatCard label="Total minutes" value={stats.totalMinutes} unit="min" />
        <StatCard label="Steps this week" value={stats.weeklySteps.toLocaleString()} accent />
      </div>
    </div>
  );
}