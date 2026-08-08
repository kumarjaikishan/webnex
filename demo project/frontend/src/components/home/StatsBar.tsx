import { useCounter } from "@/hooks/useCounter";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { label: "Client Satisfaction", value: 100, suffix: "%" },
  { label: "Projects Delivered", value: 50, suffix: "+" },
  { label: "Years Experience", value: 5, suffix: "+" },
  { label: "Support", value: 24, suffix: "x7" },
];

function Stat({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCounter(value, 1600, active);
  return (
    <div className="text-center">
      <p className="font-display text-4xl font-semibold text-ink md:text-5xl">
        {count}
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="mt-2 font-ui text-sm font-medium text-ink/50">{label}</p>
    </div>
  );
}

export default function StatsBar() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.3);
  return (
    <section className="border-y border-ink/[0.06] bg-white">
      <div ref={ref} className="container-lx grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
        {stats.map((s) => (
          <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} active={isVisible} />
        ))}
      </div>
    </section>
  );
}
