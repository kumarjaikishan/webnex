import {
  Sparkles,
  Zap,
  Search,
  Smartphone,
  ShieldCheck,
  IndianRupee,
  Headphones,
  Layers3
} from "lucide-react";
import ScrollReveal from "./ScrollReveal.jsx";

const items = [
  { icon: Sparkles, title: "Modern UI", desc: "Clean, premium design that builds instant trust with your visitors." },
  { icon: Zap, title: "Fast Performance", desc: "Optimized for speed on every device and network connection." },
  { icon: Search, title: "SEO Optimized", desc: "Engineered to rank higher and be found by active searchers." },
  { icon: Smartphone, title: "Mobile First", desc: "Responsive layout designed for the screens most people use." },
  { icon: ShieldCheck, title: "Bank-Grade Security", desc: "Following industry best practices and encryption from day one." },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Transparent quotes with zero hidden charges or surprises." },
  { icon: Headphones, title: "Ongoing Support", desc: "We stay with you well past launch day with active maintenance." },
  { icon: Layers3, title: "Scalable Architecture", desc: "Modular codebase built to grow as your business scales." },
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      <ScrollReveal direction="up" delay={50}>
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-14">
          <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-2 sm:mb-3 inline-block">
            WHY CHOOSE WEBNEX LABS
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            A Digital Partner Businesses Trust
          </h2>
          <p className="text-mist text-xs sm:text-base max-w-xl mx-auto">
            Everything we build is engineered with modern standards, high performance, and long-term reliability in mind.
          </p>
        </div>
      </ScrollReveal>

      {/* Grid of Why Choose Us Cards matching ProcessTimeline aesthetic */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const IconComponent = item.icon;
          return (
            <ScrollReveal key={item.title} direction="up" delay={40 * ((i % 4) + 1)}>
              <div className="relative h-full flex flex-col justify-between rounded-2xl border border-edge bg-panel/70 p-6 sm:p-7 backdrop-blur transition-all duration-300 hover:border-cyan/40 hover:bg-panel hover:-translate-y-1 shadow-lg group">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan group-hover:border-cyan/50 group-hover:bg-cyan/20 group-hover:scale-105 transition-all mb-5">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-paper group-hover:text-cyan transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mist">
                    {item.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
