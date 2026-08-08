import { useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { projects } from "@/data/projects";

export default function Portfolio() {
  useEffect(() => {
    document.title = "Portfolio | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects We're Proud Of"
        subtitle="A look at the platforms and systems we've built for real businesses."
      />
      <section className="section-pad bg-white">
        <div className="container-lx grid gap-8 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-lx overflow-hidden"
            >
              <div className="h-44 bg-brand-gradient-soft" />
              <div className="p-6">
                <p className="font-ui text-xs font-semibold uppercase tracking-wider text-primary">{project.tagline}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{project.title}</h3>

                <div className="mt-4 space-y-3 font-body text-sm leading-relaxed text-ink/60">
                  <p><span className="font-semibold text-ink">Problem: </span>{project.problem}</p>
                  <p><span className="font-semibold text-ink">Solution: </span>{project.solution}</p>
                  <p><span className="font-semibold text-ink">Impact: </span>{project.businessImpact}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technology.map((tech) => (
                    <span key={tech} className="rounded-full bg-ink/5 px-3 py-1 font-ui text-[11px] font-medium text-ink/70">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
