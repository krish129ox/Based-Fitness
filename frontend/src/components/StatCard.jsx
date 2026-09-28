"use client";

import TiltCard from "./TiltCard";
import AnimatedNumber from "./AnimatedNumber";

export default function StatCard({ label, value, unit, hint, accent = false, size = "default" }) {
  const labelColor = accent ? "text-accent/70" : "text-text-secondary";
  const hintColor = accent ? "text-accent/60" : "text-text-secondary/70";

  return (
    <TiltCard maxTilt={5} scale={1.015}>
      <p className={`text-sm font-medium ${labelColor}`}>{label}</p>
      <div className="mt-2">
        <AnimatedNumber value={value} unit={unit} accent={accent} size={size} />
      </div>
      {hint && <p className={`mt-1 text-xs ${hintColor}`}>{hint}</p>}
    </TiltCard>
  );
}