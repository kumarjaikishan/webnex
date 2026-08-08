import { useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { caseStudies } from "@/data/caseStudies";

const rows: { key: keyof (typeof caseStudies)[number]; label: string }[] = [
  { key: "clientProblem", label: "Client Problem" },
  { key: "ourSolution", label: "Our Solution" },
  { key: "challenges", label: "Challenges" },
  { key: "result", label: "Result" },
  { key: "businessGrowth", label: "Business Growth" },
];

export default function CaseStudies() {
  useEffect(() => {
    document.title = "Case Studies | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Case Studies"
        title="How We Solve Real Business Problems"
        subtitle="A deeper look at the challenges, decisions and outcomes behind our work."
      />
      <section className="section-pad bg-white">
        <div className="container-lx space-y-10">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-lx p-8 md:p-10"
            >
              <h2 className="font-display text-2xl font-semibold text-ink">{cs.client}</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {rows.map((row) => (
                  <div key={row.key}>
                    <p className="font-ui text-xs font-semibold uppercase tracking-wider text-primary">{row.label}</p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-ink/65">{cs[row.key] as string}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {cs.technologies.map((tech) => (
                  <span key={tech} className="rounded-full bg-ink/5 px-3 py-1 font-ui text-[11px] font-medium text-ink/70">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
