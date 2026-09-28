import { useEffect, useState } from "react";

export default function StepChart({ data }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    requestAnimationFrame(() => setAnimate(true));
  }, [data]);

  const rows = (data || []).map((entry) => ({
    day: new Date(`${entry.date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
    }),
    steps: entry.stepCount,
    date: entry.date,
  }));

  if (rows.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-text-secondary text-sm">No step data yet — log your first day.</p>
      </div>
    );
  }

  const maxSteps = Math.max(...rows.map((r) => r.steps), 1);
  const chartHeight = 200;
  const barWidth = 24;
  const gap = 16;
  const totalWidth = rows.length * (barWidth + gap) - gap;

  return (
    <div className="w-full" style={{ height: "280px" }}>
      <svg
        width="100%"
        height={chartHeight + 40}
        viewBox={`0 0 ${Math.max(totalWidth, 600)} ${chartHeight + 40}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        role="img"
        aria-label="Weekly step count chart"
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5A1F" />
            <stop offset="100%" stopColor="#cc4818" />
          </linearGradient>
        </defs>
        <g transform={`translate(${(Math.max(totalWidth, 600) - totalWidth) / 2}, 0)`}>
          {rows.map((row, index) => {
            const barHeight = (row.steps / maxSteps) * chartHeight;
            const x = index * (barWidth + gap);
            const y = chartHeight - barHeight;

            return (
              <g key={row.date} transform={`translate(${x}, 0)`}>
                <rect
                  x={0}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx={2}
                  ry={2}
                  style={{
                    transform: animate ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "bottom",
                    transition: `transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 60}ms`,
                  }}
                />
                <text
                  x={barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="font-scoreboard text-xs fill-text-secondary"
                  dominantBaseline="hanging"
                >
                  {row.day}
                </text>
                <text
                  x={barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="font-scoreboard text-xs fill-text-primary"
                  dominantBaseline="baseline"
                  style={{ opacity: barHeight > 30 ? 1 : 0, transition: "opacity 200ms" }}
                >
                  {row.steps >= 1000 ? `${(row.steps / 1000).toFixed(1)}k` : row.steps}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}