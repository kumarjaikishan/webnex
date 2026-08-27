import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, BookOpen } from "lucide-react";
import { projectsData } from "../data/projectsData.js";
import ScrollReveal from "./ScrollReveal.jsx";
import ProjectDetailModal from "./ProjectDetailModal.jsx";

export default function FeaturedWorkSection({ limit = 3, showHeader = true, showViewAllBtn = true }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const featured = limit ? projectsData.slice(0, limit) : projectsData;

  return (
    <section id="featured-work" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      {/* Detail Case Study Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {showHeader && (
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-14">
            <div>
              <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-3 inline-block px-3 py-1 rounded-full border border-cyan/30 bg-cyan/10">
                FEATURED CLIENT WORK & PRODUCTS
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-paper leading-tight">
                Real Projects, Real Business Impact
              </h2>
            </div>
            {showViewAllBtn && (
              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-edge bg-panel/80 text-paper hover:border-cyan/50 hover:text-cyan font-semibold transition-all duration-300 shadow-lg shrink-0 group"
              >
                View Full Portfolio
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </ScrollReveal>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, idx) => {
          const isFreelance = project.projectType === "freelance";

          return (
            <ScrollReveal key={project.id} direction="up" delay={50 * ((idx % 3) + 1)}>
              <div className="h-full flex flex-col justify-between rounded-3xl border border-edge bg-panel/75 backdrop-blur overflow-hidden transition-all duration-300 hover:border-cyan/50 hover:bg-panel hover:-translate-y-1.5 shadow-xl group">
                {/* Card Banner */}
                <div
                  className="relative h-44 border-b border-edge/60 p-5 flex flex-col justify-between overflow-hidden"
                  style={{
                    background: project.coverColor
                      ? `linear-gradient(135deg, ${project.coverColor}30, #06060B)`
                      : "linear-gradient(135deg, #0284C720, #06060B)"
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 rounded-full blur-2xl group-hover:bg-cyan/25 transition-all" />
                  <div className="flex items-center justify-between z-10">
                    <span className="font-mono text-[11px] text-cyan uppercase tracking-widest px-2.5 py-1 rounded-md bg-cyan/10 border border-cyan/20">
                      {project.category}
                    </span>
                    <Link
                      to={`/work/${project.slug}`}
                      className="h-8 w-8 rounded-full bg-void/60 border border-edge flex items-center justify-center text-mist group-hover:text-cyan group-hover:border-cyan/40 transition-colors"
                      title="View Full Case Study"
                    >
                      <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>

                  {/* Badge */}
                  <div className="z-10 flex flex-wrap items-center gap-1.5">
                    {isFreelance ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 font-semibold shadow">
                        <ShieldCheck size={12} /> Real Client Work
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-cyan bg-void/80 px-2.5 py-1 rounded-full border border-cyan/40 font-semibold shadow">
                        <Sparkles size={12} /> Own Product
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan">{project.tagline}</p>
                  <Link to={`/work/${project.slug}`}>
                    <h3 className="mt-2 font-display text-xl font-semibold text-paper hover:text-cyan transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="mt-3 text-sm leading-relaxed text-mist line-clamp-3">
                    {project.problem}
                  </p>

                  {/* Tech Badges */}
                  <div className="mt-5 pt-4 border-t border-edge/60 flex flex-wrap gap-1.5">
                    {project.technology.slice(0, 4).map((tech) => (
                      <span key={tech} className="font-mono text-[11px] text-mist/90 bg-void/40 px-2 py-0.5 rounded border border-edge/50">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Card Button */}
                  <div className="mt-5 pt-2">
                    <Link
                      to={`/work/${project.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-full border border-edge bg-void hover:border-cyan/40 hover:text-cyan font-mono text-xs font-semibold text-paper transition shadow-sm"
                    >
                      <BookOpen size={13} />
                      View Full Case Study
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

