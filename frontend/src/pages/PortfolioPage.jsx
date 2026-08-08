import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Code2, CheckCircle2 } from "lucide-react";
import { projectsData } from "../data/projectsData.js";
import ScrollReveal from "../components/ScrollReveal.jsx";

const categories = ["All", "Full-Stack Web App", "Internal Software", "SaaS & Finance", "ERP & Systems", "Enterprise Systems"];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-8 pb-24">
      {/* Page Header */}
      <section className="max-w-5xl mx-auto px-6 text-center pt-12 pb-14">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            ENGINEERING PORTFOLIO
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight text-paper">
            Projects We're Proud Of
          </h1>
          <p className="text-mist text-lg max-w-2xl mx-auto leading-relaxed">
            A look at the custom platforms, ERPs, web apps, and management systems we've engineered for real business impact.
          </p>
        </ScrollReveal>

        {/* Filter Badges */}
        <ScrollReveal direction="up" delay={150}>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wide transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-cyan/20 border-cyan text-cyan shadow-lg shadow-cyan/10"
                    : "bg-panel/50 border-edge text-mist hover:border-cyan/40 hover:text-paper"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Grid of Portfolio Cards */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delay={40 * (idx % 6 + 1)}>
              <div className="h-full flex flex-col justify-between rounded-2xl border border-edge bg-panel/70 backdrop-blur overflow-hidden transition-all duration-300 hover:border-cyan/40 hover:bg-panel hover:-translate-y-1.5 shadow-2xl group">
                <div className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-cyan uppercase tracking-wider font-semibold">
                      {project.tagline}
                    </span>
                    <span className="font-mono text-[10px] text-paper/70 bg-void/60 px-2.5 py-1 rounded border border-edge">
                      {project.category}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-bold text-paper group-hover:text-cyan transition-colors mb-4">
                    {project.title}
                  </h2>

                  <div className="space-y-3 text-sm leading-relaxed text-mist">
                    <p><strong className="text-paper">Problem:</strong> {project.problem}</p>
                    <p><strong className="text-paper">Solution:</strong> {project.solution}</p>
                    <p className="text-cyan/90 font-medium"><strong className="text-paper">Impact:</strong> {project.businessImpact}</p>
                  </div>
                </div>

                <div className="p-7 pt-0 border-t border-edge/40 mt-4">
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technology.map((tech) => (
                      <span key={tech} className="font-mono text-[11px] text-mist/90 bg-void/50 px-2.5 py-1 rounded-full border border-edge/60">
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

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <ScrollReveal direction="scale" delay={150}>
          <div className="rounded-3xl border border-edge bg-panel p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-aurora pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl mb-4 text-paper">Ready to build your project?</h2>
              <p className="text-mist mb-8 max-w-md mx-auto">
                Tell us your vision — we'll reply with clear milestone schedules, fixed quotes, and architecture plans.
              </p>
              <Link to="/contact" className="inline-block px-7 py-3.5 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-lg">
                Get a Free Quote <ArrowRight size={16} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
