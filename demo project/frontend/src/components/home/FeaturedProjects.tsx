import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";

export default function FeaturedProjects() {
  return (
    <section className="section-pad bg-white">
      <div className="container-lx">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">Featured Work</span>
            <h2 className="mt-5 font-display text-3xl font-semibold text-ink md:text-[42px]">
              Real Projects, Real Business Impact
            </h2>
          </div>
          <Link to="/portfolio" className="btn-secondary shrink-0">
            View Full Portfolio <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="card-lx group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative h-44 bg-brand-gradient-soft">
                <div className="absolute inset-0 bg-accent-gradient opacity-10 transition-opacity group-hover:opacity-20" />
                <div className="absolute bottom-4 left-5 right-5 flex flex-wrap gap-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-white/80 px-3 py-1 font-ui text-[11px] font-semibold text-ink backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-ui text-xs font-semibold uppercase tracking-wider text-primary">{project.tagline}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{project.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/55">{project.problem}</p>
                <div className="mt-5 flex items-center gap-1.5 font-ui text-sm font-semibold text-ink">
                  View Case Study
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
