import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  ArrowRight,
  Zap,
  Clock,
  Briefcase,
  TrendingUp,
  Share2
} from "lucide-react";
import { projectsData } from "../data/projectsData.js";
import ScrollReveal from "../components/ScrollReveal.jsx";

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const project = projectsData.find((p) => p.slug === slug || p.id === slug);

  // Dynamic SEO Title & Meta Description injection
  useEffect(() => {
    if (project) {
      const pageTitle = project.seo?.title || `${project.title} | Webnex Labs Case Study`;
      const metaDesc = project.seo?.description || project.solution || project.problem;

      document.title = pageTitle;

      let metaElement = document.querySelector('meta[name="description"]');
      if (!metaElement) {
        metaElement = document.createElement("meta");
        metaElement.setAttribute("name", "description");
        document.head.appendChild(metaElement);
      }
      metaElement.setAttribute("content", metaDesc);

      // Add structured data (JSON-LD) for Google Rich Results
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": project.title,
        "description": metaDesc,
        "author": {
          "@type": "Organization",
          "name": "Webnex Labs",
          "url": "https://webnexlabs.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Webnex Labs"
        },
        "keywords": project.seo?.keywords || project.tags?.join(", "),
        "about": {
          "@type": "SoftwareApplication",
          "name": project.title,
          "applicationCategory": project.category,
          "operatingSystem": "Web, Cloud"
        }
      };

      let scriptTag = document.getElementById("json-ld-casestudy");
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "json-ld-casestudy";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold mb-4 text-paper">Project Case Study Not Found</h1>
        <p className="text-mist mb-8">The requested enterprise case study could not be located.</p>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-grad-primary text-void font-semibold text-sm"
        >
          <ArrowLeft size={16} /> Back to All Systems
        </Link>
      </div>
    );
  }

  const isCommercial = project.projectType === "commercial_client" || project.projectType === "freelance";

  return (
    <article className="pt-8 pb-24">
      {/* Top Breadcrumb & Share */}
      <div className="max-w-5xl mx-auto px-6 mb-8 flex items-center justify-between">
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-xs font-mono text-mist hover:text-cyan transition"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </Link>
        <span className="font-mono text-[11px] text-cyan/80 bg-void/70 px-3 py-1 rounded-full border border-edge">
          CASE STUDY #{project.id.toUpperCase()}
        </span>
      </div>

      {/* Hero Header */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            {isCommercial ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-3.5 py-1 font-mono text-xs font-semibold text-emerald-400">
                <ShieldCheck size={14} />
                Commercial Client Software (100% Handover Complete)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/15 border border-cyan/40 px-3.5 py-1 font-mono text-xs font-semibold text-cyan">
                <Sparkles size={14} />
                Proprietary SaaS Product
              </span>
            )}
            <span className="font-mono text-xs text-mist bg-void/60 px-3 py-1 rounded border border-edge">
              {project.category}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.12] text-paper">
            {project.title}
          </h1>
          <p className="font-mono text-sm sm:text-base text-cyan tracking-wide font-medium max-w-3xl mb-8 leading-relaxed">
            {project.tagline}
          </p>

          {/* Quick Meta Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-5 rounded-3xl border border-edge bg-panel/80 backdrop-blur shadow-xl">
            <div className="space-y-0.5">
              <span className="font-mono text-[11px] text-mist uppercase flex items-center gap-1">
                <Briefcase size={12} className="text-cyan" /> Project Type
              </span>
              <span className="font-semibold text-paper text-sm block">
                {isCommercial ? "Custom Client Software" : "Proprietary SaaS Product"}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="font-mono text-[11px] text-mist uppercase flex items-center gap-1">
                <Building2 size={12} className="text-cyan" /> {isCommercial ? "Client Organization" : "Product Creator"}
              </span>
              <span className="font-semibold text-paper text-sm block">
                {isCommercial ? (project.clientName || "Enterprise Client") : "Own SaaS Product (Webnex Labs)"}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="font-mono text-[11px] text-mist uppercase flex items-center gap-1">
                <Clock size={12} className="text-cyan" /> Role & Engineering
              </span>
              <span className="font-semibold text-cyan text-sm block">
                {project.role || "Creator & Lead Architect"}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="font-mono text-[11px] text-mist uppercase flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-400" /> Operational Status
              </span>
              <span className="font-semibold text-emerald-400 text-sm block">
                {project.handoverStatus || "Active Live in Production"}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Key Architectural Impact Metrics */}
      {project.keyMetrics && (
        <section className="max-w-5xl mx-auto px-6 pb-12">
          <ScrollReveal direction="up" delay={80}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {project.keyMetrics.map((km, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-edge bg-void/60 backdrop-blur p-4 text-center hover:border-cyan/40 transition-colors"
                >
                  <div className="font-display text-2xl sm:text-3xl font-bold bg-grad-primary bg-clip-text text-transparent mb-1">
                    {km.value}
                  </div>
                  <div className="font-mono text-xs font-semibold text-paper">{km.label}</div>
                  <div className="font-mono text-[10px] text-mist/70 mt-0.5">{km.sub}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Main Content Body */}
      <section className="max-w-5xl mx-auto px-6 space-y-12">
        {/* Client Handover Highlight (Only for Commercial Client Projects) */}
        {isCommercial ? (
          <ScrollReveal direction="up" delay={100}>
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-panel to-void p-6 sm:p-8 flex items-start gap-4">
              <Building2 className="text-emerald-400 shrink-0 mt-1" size={26} />
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold text-emerald-300">
                  Full Production Delivery & Client Handover
                </h3>
                <p className="text-sm text-mist leading-relaxed">
                  Engineered end-to-end for <strong>{project.clientName}</strong> ({project.clientIndustry || "Commercial Enterprise"}). Following rigorous staging testing, data migrations, and staff onboarding, 100% of the production codebase, database schemas, and administrative runbooks were handed over for daily commercial operations.
                </p>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal direction="up" delay={100}>
            <div className="rounded-3xl border border-cyan/30 bg-gradient-to-r from-cyan-950/30 via-panel to-void p-6 sm:p-8 flex items-start gap-4">
              <Sparkles className="text-cyan shrink-0 mt-1" size={26} />
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold text-cyan">
                  Proprietary SaaS Product — 100% Free & Open Access
                </h3>
                <p className="text-sm text-mist leading-relaxed">
                  Designed, built, and launched as an independent SaaS product. Developed to solve real-world user pain points with zero subscription paywalls, no advertisements, and a privacy-conscious, lightning-fast architecture.
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 1. Problem / Purpose Section */}
        <ScrollReveal direction="up" delay={140}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-cyan font-mono text-xs uppercase tracking-wider font-semibold">
              <Lightbulb size={18} />
              <span>
                {isCommercial ? "1. The Business Bottleneck & Client Mandate" : "1. The Problem & Product Vision"}
              </span>
            </div>
            <div className="rounded-3xl border border-edge bg-panel/80 backdrop-blur p-6 sm:p-8 space-y-4">
              <p className="text-base sm:text-lg text-paper leading-relaxed">
                {project.caseStudy?.clientObjective || project.problem}
              </p>

              {project.caseStudy?.deliverables && (
                <div className="mt-6 pt-6 border-t border-edge/60">
                  <h4 className="font-mono text-xs text-mist uppercase font-semibold mb-4">
                    {isCommercial ? "Core Systems & Modules Engineered:" : "Key Features & Platform Capabilities:"}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.caseStudy.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-mist">
                        <CheckCircle2 size={16} className="text-cyan shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* 2. Technical Challenges & How We Overcame Them */}
        {project.caseStudy?.challenges && (
          <ScrollReveal direction="up" delay={180}>
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <AlertTriangle size={18} />
                <span>2. Complex Technical Challenges & Engineering Solutions</span>
              </div>

              <div className="space-y-5">
                {project.caseStudy.challenges.map((ch, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl border border-edge bg-panel/80 backdrop-blur p-6 sm:p-8 space-y-4 hover:border-amber-400/30 transition-colors"
                  >
                    <h3 className="font-display font-bold text-paper text-lg sm:text-xl flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/20 text-amber-300 font-mono text-sm font-bold">
                        {idx + 1}
                      </span>
                      {ch.title}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-5 text-sm">
                      <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/25 space-y-2">
                        <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wide">The Technical Obstacle:</span>
                        <p className="text-mist leading-relaxed">{ch.problem}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-2">
                        <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wide">How We Overcame It:</span>
                        <p className="text-mist leading-relaxed">{ch.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* 3. Tech Stack & Architectural Decisions */}
        <ScrollReveal direction="up" delay={220}>
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-violet-400 font-mono text-xs uppercase tracking-wider font-semibold">
              <Cpu size={18} />
              <span>3. Technology Stack & Architectural Decisions</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {(project.caseStudy?.techRationale || project.technology.map(t => ({ tech: t, reason: "Engineered for optimal latency, security, and developer productivity." }))).map((tr, idx) => (
                <div key={idx} className="rounded-2xl border border-edge bg-panel/80 p-5 space-y-2 hover:border-cyan/40 transition-colors">
                  <div className="font-mono text-sm font-bold text-cyan flex items-center gap-2">
                    <Layers size={16} />
                    {tr.tech}
                  </div>
                  <p className="text-xs sm:text-sm text-mist leading-relaxed">
                    {tr.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 4. Business Impact & Real Outcomes */}
        <ScrollReveal direction="up" delay={260}>
          <section className="rounded-3xl border border-cyan/40 bg-gradient-to-br from-cyan-950/30 via-panel to-void p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan uppercase font-semibold tracking-wider">
              <TrendingUp size={16} />
              <span>4. Measurable Commercial Business Impact</span>
            </div>
            <p className="text-base sm:text-lg text-paper leading-relaxed">
              {project.businessImpact}
            </p>
          </section>
        </ScrollReveal>

        {/* 5. Production Handover Checklist (For Commercial Projects) */}
        {project.caseStudy?.handoverDeliverables && (
          <ScrollReveal direction="up" delay={290}>
            <section className="rounded-3xl border border-edge bg-panel/70 p-6 sm:p-8 space-y-4">
              <div className="font-mono text-xs text-mist uppercase font-semibold">Verified Client Deliverables & Artifacts Handed Over:</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.caseStudy.handoverDeliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-paper">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Bottom Call-To-Action */}
        <ScrollReveal direction="scale" delay={320}>
          <section className="rounded-3xl border border-edge bg-panel p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-aurora pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold">COMMISSION YOUR SYSTEM</span>
              <h3 className="font-display text-2xl sm:text-4xl text-paper font-bold">
                Have a Complex System or Platform to Build?
              </h3>
              <p className="text-mist text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                We design and build production-grade web applications, custom ERPs, and high-performance SaaS tools with complete architecture documentation and milestone delivery.
              </p>
              <div className="pt-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-grad-primary text-void font-bold text-sm hover:brightness-110 transition shadow-xl"
                >
                  Schedule an Architecture Consultation <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </section>
    </article>
  );
}

