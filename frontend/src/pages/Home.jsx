import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import ProjectCard from "../components/ProjectCard.jsx";
import Marquee from "../components/Marquee.jsx";
import Testimonials from "../components/Testimonials.jsx";
import StatCounter from "../components/StatCounter.jsx";
import ParticleBackground from "../components/ParticleBackground.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data));
  }, []);

  return (
    <div>
      {/* Hero Section with Ambient Particles & Translucent Floating Glass Navbar */}
      <section className="relative overflow-hidden min-h-[580px] flex items-center justify-center -mt-16 pt-24 pb-20">
        <div className="absolute inset-0 bg-aurora pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <ScrollReveal direction="up" delay={50}>
            <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-mist mb-8 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              Webnex Labs — Digital Studio & Software Engineering
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6">
              Turn your idea into a{" "}
              <span className="bg-grad-primary bg-clip-text text-transparent">site that ships</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            <p className="text-mist text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              We design, build, and maintain fast, modern websites for growing
              businesses and founders — with clear contracts and reliable ongoing engineering support.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={350}>
            <div className="flex items-center justify-center gap-4">
              <Link to="/contact" className="px-6 py-3 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-lg">
                Let's Talk
              </Link>
              <Link to="/work" className="px-6 py-3 rounded-full border border-edge bg-panel/50 hover:border-mist/50 transition focus-ring">
                View Our Work
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Marquee />

      {/* About / features, mirroring image + copy blocks */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left" delay={100}>
          <div>
            <p className="font-mono text-xs text-cyan tracking-widest mb-4 uppercase font-semibold">ABOUT WEBNEX LABS</p>
            <h2 className="font-display text-3xl md:text-4xl mb-8">
              Built for the long haul, not just launch day
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg mb-1 text-paper">Engineering that holds up</h3>
                <p className="text-mist text-sm">Clean, documented code and sensible architecture — so your website is easy to scale and extend anytime.</p>
              </div>
              <div>
                <h3 className="font-display text-lg mb-1 text-paper">A relationship, not a handoff</h3>
                <p className="text-mist text-sm">Every client gets a maintenance plan, scheduled check-ins, and dedicated engineering support when you need it.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={200}>
          <div className="rounded-2xl border border-edge bg-panel overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-edge bg-void/50">
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-cyan/70" />
              <span className="ml-3 font-mono text-xs text-mist">client-status.log</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-3">
              <p className="text-cyan">$ status --clients</p>
              <p className="text-paper/90">✓ Aster Bakery — maintenance up to date</p>
              <p className="text-violet">! Northline Logistics — renewal due in 6 days</p>
              <p className="text-paper/90">✓ Fable & Co — contract signed</p>
              <p className="text-mist">$ _</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Portfolio Section with Staggered Scroll Reveal */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-16">
        <ScrollReveal direction="up" delay={50}>
          <p className="font-mono text-xs text-cyan tracking-widest mb-4 text-center uppercase font-semibold">PORTFOLIO</p>
          <h2 className="font-display text-3xl md:text-4xl text-center mb-12">
            Recent Projects & Engineering Work
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, idx) => (
            <ScrollReveal key={p.id} direction="scale" delay={100 * (idx + 1)}>
              <ProjectCard project={p} />
            </ScrollReveal>
          ))}
        </div>

        {projects.length > 0 && (
          <ScrollReveal direction="up" delay={300}>
            <div className="text-center mt-10">
              <Link to="/work" className="font-mono text-sm text-cyan hover:underline">view all work →</Link>
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-16">
        <ScrollReveal direction="up" delay={100}>
          <p className="font-mono text-xs text-cyan tracking-widest mb-4 text-center uppercase font-semibold">TESTIMONIALS</p>
          <h2 className="font-display text-3xl md:text-4xl text-center mb-12">
            What founders & clients say
          </h2>
          <Testimonials />
        </ScrollReveal>
      </section>

      {/* Stats with Staggered Scroll Reveal */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <ScrollReveal direction="scale" delay={150}>
          <div className="rounded-3xl border border-edge bg-panel p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-aurora pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl mb-4">Have a project in mind?</h2>
              <p className="text-mist mb-8 max-w-md mx-auto">
                Tell us what you're building — we'll reply within 24 hours with next steps and a quote.
              </p>
              <Link to="/contact" className="inline-block px-6 py-3 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-lg">
                Get a Free Quote
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
