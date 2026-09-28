"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import StepChart from "../components/StepChart";
import StatCard from "../components/StatCard";
import { fetchSteps, saveStepsRequest } from "../api/steps";

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function Steps() {
  const [week, setWeek] = useState({ days: [], total: 0, average: 0 });
  const [todaySteps, setTodaySteps] = useState(0);
  const [form, setForm] = useState({ date: todayKey(), stepCount: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [weekData, todayData] = await Promise.all([fetchSteps("week"), fetchSteps()]);
      setWeek(weekData);
      setTodaySteps(todayData.total);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load steps.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = Number(form.stepCount);

    if (!form.stepCount || !Number.isFinite(value) || value < 0) {
      setError("Enter a valid step count of 0 or more.");
      return;
    }

    setError("");
    setMessage("");
    setSaving(true);
    try {
      await saveStepsRequest({ date: form.date, stepCount: value });
      setForm((prev) => ({ ...prev, stepCount: "" }));
      setMessage("Steps saved.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save steps.");
    } finally {
      setSaving(false);
    }
  };

  const bestDay = week.days.reduce(
    (best, day) => (day.stepCount > (best?.stepCount ?? -1) ? day : best),
    null
  );

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
        <h1 className="font-scoreboard font-bold text-2xl text-text-primary">Steps</h1>
        <p className="mt-1 text-sm text-text-secondary">Log a daily total and watch the week fill in.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard label="Today" value={loading ? "—" : todaySteps.toLocaleString()} accent />
        <StatCard label="7-day total" value={loading ? "—" : week.total.toLocaleString()} />
        <StatCard
          label="Best day"
          value={loading || !bestDay ? "—" : bestDay.stepCount.toLocaleString()}
          hint={bestDay ? bestDay.date : "No data yet"}
        />
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="card grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <div>
          <label htmlFor="step-date" className="label-field">
            Date
          </label>
          <input
            id="step-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="step-count" className="label-field">
            Step count
          </label>
          <input
            id="step-count"
            type="number"
            min="0"
            value={form.stepCount}
            onChange={(e) => setForm((prev) => ({ ...prev, stepCount: e.target.value }))}
            placeholder="8500"
            className="input-field"
          />
        </div>
        <motion.button
          type="submit"
          disabled={saving}
          className="btn-primary"
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
        >
          {saving ? "Saving..." : "Save steps"}
        </motion.button>
      </motion.form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm"
        >
          {error}
        </motion.div>
      )}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary text-sm"
        >
          {message}
        </motion.div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card"
      >
        <h2 className="font-scoreboard font-semibold text-lg text-text-primary mb-4">Last 7 days</h2>
        <StepChart data={week.days} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden"
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-text-secondary">
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-right">Steps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {week.days.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-5 py-8 text-center text-text-secondary">
                  No step data yet. Log your first entry above.
                </td>
              </tr>
            ) : (
              [...week.days]
                .reverse()
                .map((day, index) => (
                  <motion.tr
                    key={day.date}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.03 }}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-text-secondary">
                      {new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-right font-scoreboard font-bold text-text-primary">
                      {day.stepCount.toLocaleString()}
                    </td>
                  </motion.tr>
                ))
            )}
          </tbody>
        </table>
      </motion.section>
    </motion.div>
  );
}