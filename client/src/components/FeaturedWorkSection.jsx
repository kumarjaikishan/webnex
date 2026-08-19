import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Code, CheckCircle } from "lucide-react";
import { projectsData } from "../data/projectsData.js";
import ScrollReveal from "./ScrollReveal.jsx";

export default function FeaturedWorkSection({ limit = 3, showHeader = true, showViewAllBtn = true }) {
  const featured = limit ? projectsData.slice(0, limit) : projectsData;

  return (
    <section id="featured-work" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      {showHeader && (
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-14">
            <div>
              <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-3 inline-block px-3 py-1 rounded-full border border-cyan/30 bg-cyan/10">
                FEATURED WORK
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
        {featured.map((project, idx) => (
          <ScrollReveal key={project.id} direction="up" delay={50 * ((idx % 3) + 1)}>
            <div className="h-full flex flex-col justify-between rounded-2xl border border-edge bg-panel/70 backdrop-blur overflow-hidden transition-all duration-300 hover:border-cyan/40 hover:bg-panel hover:-translate-y-1.5 shadow-xl group">
              {/* Card Banner */}
              <div className="relative h-44 bg-gradient-to-br from-cyan/10 via-panel to-void border-b border-edge/60 p-5 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 rounded-full blur-2xl group-hover:bg-cyan/20 transition-all" />
                <div className="flex items-center justify-between z-10">
                  <span className="font-mono text-[11px] text-cyan uppercase tracking-widest px-2.5 py-1 rounded-md bg-cyan/10 border border-cyan/20">
                    {project.category}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-void/50 border border-edge flex items-center justify-center text-mist group-hover:text-cyan group-hover:border-cyan/40 transition-colors">
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 z-10">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="font-mono text-[10px] text-paper/80 bg-void/60 backdrop-blur px-2.5 py-0.5 rounded-full border border-edge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Body */}
              <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan">{project.tagline}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-paper group-hover:text-cyan transition-colors">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist line-clamp-3">
                  {project.problem}
                </p>

                {/* Tech Badges */}
                <div className="mt-5 pt-4 border-t border-edge/60 flex flex-wrap gap-1.5">
                  {project.technology.map((tech) => (
                    <span key={tech} className="font-mono text-[11px] text-mist/90 bg-void/40 px-2 py-0.5 rounded border border-edge/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
