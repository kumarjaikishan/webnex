import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal.jsx";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import StatCounter from "../components/StatCounter.jsx";

export default function About() {
  return (
    <div className="pt-8 pb-24">
      {/* Top Header */}
      <section className="max-w-5xl mx-auto px-6 text-center pt-12 pb-14">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            ABOUT WEBNEX LABS
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight text-paper">
            Helping Growing Businesses Build Scalable Digital Platforms
          </h1>
          <p className="text-mist text-lg max-w-2xl mx-auto leading-relaxed">
            Webnex Labs is an independent web development and software engineering studio built to turn ideas into fast, production-ready sites that hold up long past launch.
          </p>
        </ScrollReveal>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <ScrollReveal direction="left" delay={100}>
            <div className="space-y-6">
              <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold">
                OUR STORY & MISSION
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-paper leading-tight">
                Built for the Long Haul, Not Just Launch Day
              </h2>
              <p className="text-mist text-base leading-relaxed">
                Webnex Labs was founded with a simple belief — that ambitious founders, growing businesses, schools, clinics, and enterprises deserve clean software engineering, transparent contracts, and reliable long-term support without the fluff.
              </p>
              <p className="text-mist text-base leading-relaxed">
                We partner with business owners to build high-performance marketing websites, ERPs, CRMs, inventory managers, and custom SaaS web applications that actually move business operations forward — not just look good.
              </p>
              
              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-edge bg-panel/50 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-cyan shrink-0" />
                  <span className="text-xs font-semibold text-paper">100% Custom Code</span>
                </div>
                <div className="p-4 rounded-xl border border-edge bg-panel/50 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-cyan shrink-0" />
                  <span className="text-xs font-semibold text-paper">Zero Hidden Costs</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive Code Console Graphic */}
          <ScrollReveal direction="right" delay={150}>
            <div className="rounded-2xl border border-edge bg-panel overflow-hidden shadow-2xl relative">
              <div className="flex items-center justify-between px-4 py-3 border-b border-edge bg-void/70">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <span className="w-3 h-3 rounded-full bg-cyan/70" />
                </div>
                <span className="font-mono text-xs text-mist">engineering-philosophy.ts</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-4 text-paper/90">
                <p className="text-cyan">$ cat webnex-standards.config.ts</p>
                <div className="pl-4 border-l-2 border-cyan/30 space-y-2 text-xs md:text-sm">
                  <p><span className="text-purple-400">const</span> stack = [<span className="text-amber-300">"React"</span>, <span className="text-amber-300">"Node.js"</span>, <span className="text-amber-300">"TailwindCSS"</span>];</p>
                  <p><span className="text-purple-400">const</span> qualityCheck = () =&gt; &#123;</p>
                  <p className="pl-4 text-mist"><span className="text-cyan">return</span> performance &gt; 95 &amp;&amp; cleanArchitecture === <span className="text-amber-300">true</span>;</p>
                  <p>&#125;;</p>
                </div>
                <p className="text-emerald-400">✓ 40+ Production Applications Shipped</p>
                <p className="text-mist">$ _</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center rounded-3xl border border-edge bg-panel/60 p-8 backdrop-blur shadow-2xl">
          <ScrollReveal direction="up" delay={100}>
            <StatCounter target={40} suffix="+" label="Projects shipped" />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <StatCounter target={98} suffix="%" label="Client retention" />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <StatCounter target={72} suffix="h" label="Avg. response time" />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <StatCounter target={6} suffix="yr" label="Engineering Excellence" />
          </ScrollReveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <ScrollReveal direction="scale" delay={150}>
          <div className="rounded-3xl border border-edge bg-panel p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-aurora pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl mb-4 text-paper">Let's build something together</h2>
              <p className="text-mist mb-8 max-w-md mx-auto">
                Have a project idea or need custom software engineered? We're ready when you are.
              </p>
              <Link to="/contact" className="inline-block px-7 py-3.5 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-lg">
                Start a Conversation <ArrowRight size={16} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
