export default function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-edge bg-panel p-6">
      <p className="font-mono text-xs text-mist mb-2">{label}</p>
      <p className={`font-display text-3xl ${accent || "text-paper"}`}>{value}</p>
    </div>
  );
}
