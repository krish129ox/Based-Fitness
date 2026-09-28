"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import TiltCard from "../components/TiltCard";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-5xl space-y-6 px-4 py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="font-scoreboard font-bold text-2xl text-text-primary">Workouts</h1>
        <p className="mt-1 text-sm text-text-secondary">Every session, newest first.</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <WorkoutForm onSubmit={handleCreate} submitting={submitting} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {loading ? (
          <p className="text-sm text-text-secondary">Loading workouts...</p>
        ) : workouts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-12"
          >
            <p className="text-sm text-text-secondary">No workouts yet. Log your first session above.</p>
          </motion.div>
        ) : (
          workouts.map((workout, index) => {
            const colors = typeColors[workout.type] || typeColors.Other;
            return (
              <motion.div
                key={workout._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ delay: 0.25 + index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard maxTilt={4} scale={1.01} className="flex flex-wrap items-start justify-between gap-3">
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

                  <motion.button
                    type="button"
                    onClick={() => handleDelete(workout._id)}
                    className="btn-secondary text-sm py-1.5 px-3 text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    Delete
                  </motion.button>
                </TiltCard>
              </motion.div>
            );
          })
        )}
      </motion.section>
    </motion.div>
  );
}