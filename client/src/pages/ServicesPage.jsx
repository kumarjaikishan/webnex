import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Globe, 
  Building2, 
  GraduationCap, 
  HeartPulse, 
  Boxes, 
  Users, 
  LayoutDashboard, 
  CalendarCheck, 
  UtensilsCrossed, 
  Home as HomeIcon, 
  MousePointerClick, 
  Layers, 
  Newspaper, 
  Code2, 
  RefreshCcw, 
  ShieldCheck, 
  Gauge, 
  Search, 
  Server,
  ArrowRight
} from "lucide-react";
import { servicesData } from "../data/servicesData.js";
import ScrollReveal from "../components/ScrollReveal.jsx";

const iconMap = {
  Globe,
  Building2,
  GraduationCap,
  HeartPulse,
  Boxes,
  Users,
  LayoutDashboard,
  CalendarCheck,
  UtensilsCrossed,
  Home: HomeIcon,
  MousePointerClick,
  Layers,
  Newspaper,
  Code2,
  RefreshCcw,
  ShieldCheck,
  Gauge,
  Search,
  Server
};

const categories = [
  { key: "all", label: "All Services" },
  { key: "core", label: "Core Websites" },
  { key: "business-systems", label: "Business Systems & Software" },
  { key: "growth", label: "Growth & Optimization" }
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices = activeCategory === "all"
    ? servicesData
    : servicesData.filter(s => s.category === activeCategory);

  return (
    <div className="pt-8 pb-24">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 text-center pt-12 pb-16">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            FULL SERVICE CATALOG
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Websites & Systems Built for Your Business
          </h1>
          <p className="text-mist text-lg max-w-2xl mx-auto leading-relaxed">
            From landing pages to complex enterprise platforms, explore all digital solutions engineered by Webnex Labs.
          </p>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal direction="up" delay={150}>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wide transition-all duration-200 border ${
                  activeCategory === cat.key
                    ? "bg-cyan/20 border-cyan text-cyan shadow-lg shadow-cyan/10"
                    : "bg-panel/50 border-edge text-mist hover:border-cyan/40 hover:text-paper"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service, idx) => {
            const IconComponent = iconMap[service.icon] || Globe;
            return (
              <ScrollReveal key={service.id} direction="up" delay={40 * (idx % 6 + 1)}>
                <div className="h-full flex flex-col justify-between rounded-2xl border border-edge bg-panel/70 p-7 backdrop-blur transition-all duration-300 hover:border-cyan/40 hover:bg-panel hover:-translate-y-1.5 shadow-xl group">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan transition-colors group-hover:border-cyan/50 group-hover:bg-cyan/20">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-paper group-hover:text-cyan transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-mist">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-edge/60 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-cyan/70 uppercase tracking-wider">
                      {service.category.replace("-", " ")}
                    </span>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1 font-mono text-xs text-mist group-hover:text-cyan transition-colors"
                    >
                      Inquire <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-24 text-center">
        <ScrollReveal direction="scale" delay={100}>
          <div className="rounded-3xl border border-edge bg-panel p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-aurora pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl mb-4 text-paper">Need a custom solution not listed here?</h2>
              <p className="text-mist mb-8 max-w-md mx-auto">
                We engineer tailor-made applications tailored directly to your unique business requirements.
              </p>
              <Link to="/contact" className="inline-block px-7 py-3.5 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-lg">
                Discuss Your Requirements
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
