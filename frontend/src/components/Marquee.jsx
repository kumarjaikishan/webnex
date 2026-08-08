const names = [
  "Aster Bakery", "Northline Logistics", "Fable & Co", "Harborline Studio",
  "Cedar & Finch", "Loop Analytics", "Marrow Coffee", "Vantage Realty",
];

export default function Marquee() {
  const row = [...names, ...names];
  return (
    <div className="border-y border-edge py-6 overflow-hidden marquee-wrap">
      <p className="text-center font-mono text-xs text-mist tracking-widest mb-5">
        TRUSTED BY FOUNDERS & SMALL TEAMS
      </p>
      <div className="flex w-max marquee-track">
        {row.map((n, i) => (
          <span key={i} className="mx-8 font-display text-lg text-mist/60 whitespace-nowrap">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
