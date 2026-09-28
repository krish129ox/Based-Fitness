import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const CHART_HEIGHT = 200;

const formatSteps = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export default function StepChart({ data }) {
  const reduce = useReducedMotion();

  // All hooks stay above any early return.
  const rows = useMemo(
    () =>
      (data || []).map((entry) => ({
        date: entry.date,
        day: new Date(`${entry.date}T00:00:00`).toLocaleDateString(undefined, {
          weekday: "short",
        }),
        steps: Number(entry.stepCount) || 0,
      })),
    [data]
  );

  if (rows.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-text-secondary">
          No step data yet — log your first day.
        </p>
      </div>
    );
  }

  const maxSteps = Math.max(...rows.map((r) => r.steps), 1);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      className="flex w-full items-end justify-between gap-2 sm:gap-4"
      role="img"
      aria-label="Weekly step count chart"
    >
      {rows.map((row, index) => {
        const isToday = row.date === today;
        const barHeight = Math.max(
          (row.steps / maxSteps) * CHART_HEIGHT,
          row.steps > 0 ? 6 : 2
        );
        const delay = index * 0.08;

        return (
          <div key={row.date} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="flex w-full flex-col items-center justify-end gap-1"
              style={{ height: CHART_HEIGHT + 24 }}
            >
              <motion.span
                className="font-scoreboard text-xs text-text-primary"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.35, duration: 0.2 }}
              >
                {formatSteps(row.steps)}
              </motion.span>

              {/* scaleY is animated number -> number only. Height is static. */}
              <motion.div
                className="w-full max-w-[36px] rounded-t"
                style={{
                  height: barHeight,
                  transformOrigin: "bottom",
                  background: isToday
                    ? "#FF5A1F"
                    : "linear-gradient(180deg, #FF5A1F, #cc4818)",
                  boxShadow: isToday ? "0 0 18px rgba(255,90,31,0.55)" : "none",
                  opacity: isToday ? 1 : 0.75,
                }}
                initial={reduce ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ type: "spring", stiffness: 170, damping: 20, delay }}
              />
            </div>

            <span
              className={`font-scoreboard text-xs ${
                isToday ? "text-accent" : "text-text-secondary"
              }`}
            >
              {row.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
