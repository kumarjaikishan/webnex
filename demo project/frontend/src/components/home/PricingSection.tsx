import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import clsx from "clsx";
import { pricingPlans } from "@/data/pricing";

export default function PricingSection() {
  return (
    <section className="section-pad bg-white">
      <div className="container-lx">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-5 font-display text-3xl font-semibold text-ink md:text-[42px]">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 font-body text-ink/60">
            Every business is different — these starting prices give you a clear reference point.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-4">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={clsx(
                "flex flex-col rounded-xl2 border p-7",
                plan.highlighted
                  ? "border-primary/30 bg-brand-gradient-soft shadow-glow"
                  : "border-ink/[0.06] bg-white shadow-card"
              )}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-block w-fit rounded-full bg-brand-gradient px-3 py-1 font-ui text-[11px] font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-ink">{plan.name}</h3>
              <p className="mt-2 font-ui text-2xl font-semibold text-ink">{plan.startingPrice}</p>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink/55">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-body text-sm text-ink/70">
                    <Check size={16} className="mt-0.5 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={clsx("mt-7 text-center", plan.highlighted ? "btn-primary" : "btn-secondary")}
              >
                Get Free Quote
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
