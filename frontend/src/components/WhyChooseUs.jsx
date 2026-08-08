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
    <section className="max-w-7xl mx-auto px-6 py-20">
      <ScrollReveal direction="up" delay={50}>
        <div className="mx-auto max-w-3xl text-center mb-14">
          <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-3 inline-block">
            WHY CHOOSE WEBNEX LABS
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-4 leading-tight">
            A Digital Partner Businesses Trust
          </h2>
          <p className="text-mist text-base md:text-md max-w-xl mx-auto">
            Everything we build is engineered with modern standards, high performance, and long-term reliability in mind.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-4 shadow-2xl">
        {items.map((item, i) => {
          const IconComponent = item.icon;
          return (
            <ScrollReveal key={item.title} direction="up" delay={30 * ((i % 4) + 1)}>
              <div className="h-full bg-panel/90 p-7 backdrop-blur transition-all duration-300 hover:bg-panel hover:border-cyan/30 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan group-hover:border-cyan/50 group-hover:bg-cyan/20 transition-colors">
                  <IconComponent size={22} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-paper group-hover:text-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
