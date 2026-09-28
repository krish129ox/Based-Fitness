"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import TiltCard from "../components/TiltCard";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-3xl space-y-6 px-4 py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="font-scoreboard font-bold text-2xl text-text-primary">Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Your account and lifetime totals.</p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-border text-xl font-bold font-scoreboard text-accent"
          >
            {userInitial}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="font-scoreboard font-semibold text-lg text-text-primary">{user.name}</h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
            <p className="text-sm text-text-secondary">{user.phone}</p>
          </motion.div>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2"
        >
          <TiltCard maxTilt={3} scale={1.01} className="py-3">
            <dt className="text-xs font-medium text-text-secondary">Member since</dt>
            <dd className="mt-1 font-scoreboard font-semibold text-text-primary">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </dd>
          </TiltCard>
          <TiltCard maxTilt={3} scale={1.01} className="py-3">
            <dt className="text-xs font-medium text-text-secondary">Sign-in method</dt>
            <dd className="mt-1 font-scoreboard font-semibold text-text-primary">Email or phone + password</dd>
          </TiltCard>
        </motion.dl>

        <motion.button
          type="button"
          onClick={handleLogout}
          className="mt-6 w-full btn-secondary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          Log out
        </motion.button>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard label="Workouts logged" value={stats.workouts} />
        <StatCard label="Total minutes" value={stats.totalMinutes} unit="min" />
        <StatCard label="Steps this week" value={stats.weeklySteps.toLocaleString()} accent />
      </motion.div>
    </motion.div>
  );
}