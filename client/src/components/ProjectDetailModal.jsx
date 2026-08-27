import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  ArrowRight
} from "lucide-react";

export default function ProjectDetailModal({ project, isOpen, onClose }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const isFreelance = project.projectType === "freelance";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-void/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-edge bg-panel/95 backdrop-blur-xl shadow-2xl overflow-hidden z-10 my-auto animate-scale-up">
        {/* Header Ribbon / Banner */}
        <div
          className="relative px-6 sm:px-8 py-6 border-b border-edge/80 flex items-start justify-between gap-4"
          style={{
            background: project.coverColor
              ? `linear-gradient(135deg, ${project.coverColor}25, rgba(13, 13, 20, 0.95))`
              : "rgba(13, 13, 20, 0.95)"
          }}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {isFreelance ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-3 py-1 font-mono text-xs font-semibold text-emerald-400">
                  <ShieldCheck size={14} />
                  Real Freelance Work (100% Handover)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/15 border border-cyan/40 px-3 py-1 font-mono text-xs font-semibold text-cyan">
                  <Sparkles size={14} />
                  Own Product / SaaS
                </span>
              )}
              <span className="font-mono text-xs text-mist bg-void/60 px-2.5 py-1 rounded border border-edge">
                {project.category}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper">
              {project.title}
            </h2>
            <p className="font-mono text-xs text-cyan tracking-wide font-medium">
              {project.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-mist hover:text-paper hover:bg-void/60 border border-transparent hover:border-edge transition shrink-0"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 max-h-[calc(90vh-140px)]">
          {/* Client Handover Notice (If Freelance) */}
          {isFreelance && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 flex items-start gap-3.5">
              <Building2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-semibold text-emerald-300">
                  Client Project: {project.clientName || "Enterprise Client"}
                </p>
                <p className="text-mist leading-relaxed">
                  Delivered as a custom commissioned freelance software system. Full commercial code ownership, database schemas, and administrative runbooks were handed over to the client for continuous daily business operations.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: What the Client Asked / Project Objectives */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan font-mono text-xs uppercase tracking-wider font-semibold">
              <Lightbulb size={16} />
              <span>1. What Was Asked & Business Requirements</span>
            </div>
            <div className="rounded-2xl border border-edge bg-void/50 p-5 space-y-3">
              <p className="text-sm sm:text-base text-paper leading-relaxed">
                {project.caseStudy?.clientObjective || project.problem}
              </p>

              {project.caseStudy?.deliverables && (
                <div className="mt-4 pt-4 border-t border-edge/60">
                  <h4 className="font-mono text-xs text-mist uppercase font-semibold mb-3">Key Deliverables Engineered:</h4>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {project.caseStudy.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-mist/90">
                        <CheckCircle2 size={15} className="text-cyan shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Technical Challenges & How We Overcame Them */}
          {project.caseStudy?.challenges && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <AlertTriangle size={16} />
                <span>2. Engineering Challenges & How We Overcame Them</span>
              </div>

              <div className="space-y-4">
                {project.caseStudy.challenges.map((ch, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-edge bg-void/50 p-5 space-y-3 hover:border-amber-400/30 transition-colors"
                  >
                    <h4 className="font-display font-semibold text-paper text-sm sm:text-base flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold">
                        {idx + 1}
                      </span>
                      {ch.title}
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 space-y-1">
                        <span className="font-mono text-[11px] font-semibold text-red-400 uppercase">The Challenge:</span>
                        <p className="text-mist leading-relaxed">{ch.problem}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                        <span className="font-mono text-[11px] font-semibold text-emerald-400 uppercase">Engineering Solution:</span>
                        <p className="text-mist leading-relaxed">{ch.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Tech Stack Rationale */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-violet-400 font-mono text-xs uppercase tracking-wider font-semibold">
              <Cpu size={16} />
              <span>3. Technology Stack & Architectural Decisions</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {(project.caseStudy?.techRationale || project.technology.map(t => ({ tech: t, reason: "Chosen for performance, modularity, and rapid enterprise reliability." }))).map((tr, idx) => (
                <div key={idx} className="rounded-xl border border-edge bg-void/40 p-4 space-y-1.5">
                  <div className="font-mono text-xs font-bold text-cyan flex items-center gap-1.5">
                    <Layers size={14} />
                    {tr.tech}
                  </div>
                  <p className="text-xs text-mist leading-relaxed">
                    {tr.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Business Impact & Real Outcomes */}
          <div className="rounded-2xl border border-cyan/30 bg-cyan-950/20 p-5 space-y-2">
            <div className="font-mono text-xs text-cyan uppercase font-semibold">Commercial Business Impact:</div>
            <p className="text-sm sm:text-base text-paper leading-relaxed">
              {project.businessImpact}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-edge/80 bg-void/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-grad-primary text-void font-bold text-xs hover:brightness-110 transition shadow-md"
              >
                Launch Live App <ExternalLink size={13} />
              </a>
            ) : (
              <span className="font-mono text-xs text-mist/70 italic">
                🔒 Enterprise internal system (Proprietary client deployment)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/work/${project.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-edge bg-panel text-paper hover:border-cyan/50 hover:text-cyan font-mono text-xs transition"
            >
              Full Case Study Page <ArrowRight size={13} />
            </Link>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-edge bg-void text-mist hover:text-paper font-mono text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
