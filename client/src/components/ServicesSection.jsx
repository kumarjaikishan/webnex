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
  Home,
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
import ScrollReveal from "./ScrollReveal.jsx";

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
  Home,
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

export default function ServicesSection({ limit = 8, showHeader = true, showViewAllBtn = true }) {
  const featuredServices = limit ? servicesData.slice(0, limit) : servicesData;

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-20">
      {showHeader && (
        <ScrollReveal direction="up" delay={50}>
          <div className="mx-auto max-w-3xl text-center mb-14">
            <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-3 inline-block">
              WHAT WE BUILD
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4 leading-tight">
              Websites & Systems for Every Kind of Business
            </h2>
            <p className="text-mist text-base md:text-md max-w-2xl mx-auto">
              From a first business website to a complete internal system — we build what your business actually needs.
            </p>
          </div>
        </ScrollReveal>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredServices.map((service, idx) => {
          const IconComponent = iconMap[service.icon] || Globe;
          return (
            <ScrollReveal key={service.id} direction="up" delay={50 * ((idx % 4) + 1)}>
              <div className="h-full flex flex-col justify-between rounded-2xl border border-edge bg-panel/70 p-6 backdrop-blur transition-all duration-300 hover:border-cyan/40 hover:bg-panel hover:-translate-y-1.5 shadow-lg group">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan transition-colors group-hover:border-cyan/50 group-hover:bg-cyan/20">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-paper group-hover:text-cyan transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    {service.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {showViewAllBtn && (
        <ScrollReveal direction="up" delay={250}>
          <div className="mt-14 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan hover:text-void font-semibold transition-all duration-300 shadow-lg group"
            >
              View All Services
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
