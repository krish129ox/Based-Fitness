export default function StatCard({ label, value, unit, hint, accent = false, size = "default" }) {
  const numberClass = size === "huge" ? "stat-number-huge" : size === "large" ? "stat-number-large" : "stat-number-medium";
  const valueColor = accent ? "text-accent" : "text-text-primary";
  const labelColor = accent ? "text-accent/70" : "text-text-secondary";
  const hintColor = accent ? "text-accent/60" : "text-text-secondary/70";

  return (
    <div className="card">
      <p className={`text-sm font-medium ${labelColor}`}>{label}</p>
      <p className="mt-2 font-scoreboard font-bold">
        <span className={`${numberClass} ${valueColor}`}>{value}</span>
        {unit && <span className="ml-1 text-base font-medium opacity-70 text-text-secondary">{unit}</span>}
      </p>
      {hint && <p className={`mt-1 text-xs ${hintColor}`}>{hint}</p>}
    </div>
  );
}