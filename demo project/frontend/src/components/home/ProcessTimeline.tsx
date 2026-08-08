import { motion } from "framer-motion";
import { processSteps } from "@/data/process";

export default function ProcessTimeline() {
  return (
    <section className="section-pad bg-white">
      <div className="container-lx">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Our Process</span>
          <h2 className="mt-5 font-display text-3xl font-semibold text-ink md:text-[42px]">
            From Idea to a Live Website
          </h2>
          <p className="mt-4 font-body text-ink/60">
            A clear, structured process so you always know what happens next.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-ink/10 lg:block" />
          <div className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="relative"
              >
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient font-ui text-sm font-semibold text-white shadow-card">
                  {i + 1}
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink/55">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
