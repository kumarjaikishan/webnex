import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { pricingPlansData } from "../data/pricingPlansData.js";
import ScrollReveal from "../components/ScrollReveal.jsx";

export default function PricingSection({ showHeader = true }) {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
      {showHeader && (
        <ScrollReveal direction="up" delay={50}>
          <div className="mx-auto max-w-3xl text-center mb-14">
            <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-3 inline-block">
              TRANSPARENT PRICING
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4 leading-tight">
              Simple, Transparent Starting Prices
            </h2>
            <p className="text-mist text-base md:text-md max-w-2xl mx-auto">
              Every business is unique — these baseline starting plans give you a clear reference point before your custom quote.
            </p>
          </div>
        </ScrollReveal>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pricingPlansData.map((plan, idx) => (
          <ScrollReveal key={plan.id} direction="up" delay={40 * (idx + 1)}>
            <div
              className={`h-full flex flex-col justify-between rounded-2xl border p-7 backdrop-blur transition-all duration-300 relative shadow-xl ${
                plan.highlighted
                  ? "border-cyan bg-panel/90 shadow-cyan/10 hover:-translate-y-2"
                  : "border-edge bg-panel/70 hover:border-cyan/40 hover:bg-panel hover:-translate-y-1.5"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-block rounded-full bg-grad-primary px-3 py-1 font-mono text-[11px] font-bold text-void uppercase tracking-wider shadow-md">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-display text-xl font-semibold text-paper mt-1">{plan.name}</h3>
                <p className="mt-3 font-mono text-2xl font-bold text-cyan">{plan.startingPrice}</p>
                <p className="mt-3 text-xs leading-relaxed text-mist">{plan.description}</p>

                <ul className="mt-6 space-y-3 pt-4 border-t border-edge/60">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-paper/90">
                      <Check size={15} className="mt-0.5 shrink-0 text-cyan" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  to="/contact"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-xs transition-all duration-300 shadow-md ${
                    plan.highlighted
                      ? "bg-grad-primary text-void hover:brightness-110"
                      : "border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan hover:text-void"
                  }`}
                >
                  Get Free Quote <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
