import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import ProjectCard from "../components/ProjectCard.jsx";
import Marquee from "../components/Marquee.jsx";
import Testimonials from "../components/Testimonials.jsx";
import StatCounter from "../components/StatCounter.jsx";
import ParticleBackground from "../components/ParticleBackground.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import ServicesSection from "../components/ServicesSection.jsx";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import ProcessTimeline from "../components/ProcessTimeline.jsx";
import FAQSection from "../components/FAQSection.jsx";
import FeaturedWorkSection from "../components/FeaturedWorkSection.jsx";

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
            <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-8 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              WEBNEX LABS — FULL-STACK ENGINEERING STUDIO
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-7xl leading-[1.05] mb-8 font-bold tracking-tight">
              You Have the Vision.{" "}
              <span className="bg-grad-primary bg-clip-text text-transparent block mt-2">Let's Build Real Software.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-mist text-xl md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
              We turn complex business ideas into high-converting websites, custom ERPs, and scalable SaaS applications engineered to perform in the real world.
            </p>
          </ScrollReveal>



          <ScrollReveal direction="up" delay={350}>
            <div className="flex items-center justify-center gap-4">
              <Link to="/contact" className="px-6 py-3 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-lg">
                Talk to Us
              </Link>
              <Link to="/work" className="px-6 py-3 rounded-full border border-edge bg-panel/50 hover:border-mist/50 transition focus-ring">
                See Our Projects
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Marquee />

      {/* About / features, mirroring image + copy blocks */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left" delay={100}>
          <div>
            <p className="font-mono text-xs text-cyan tracking-widest mb-4 uppercase font-semibold">ABOUT WEBNEX LABS</p>
            <h2 className="font-display text-3xl md:text-4xl mb-8">
              We build websites that stay fast and trouble-free for years
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg mb-1 text-paper">Solid Work That Lasts</h3>
                <p className="text-mist text-sm">Clean, high-quality coding so your website works smoothly on every mobile phone and never slows down.</p>
              </div>
              <div>
                <h3 className="font-display text-lg mb-1 text-paper">Complete Support After Launch</h3>
                <p className="text-mist text-sm">We don't leave you after making the site. Every client gets regular maintenance, updates, and quick WhatsApp/call support whenever needed.</p>
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
              <span className="ml-3 font-mono text-xs text-mist">live-projects-status.log</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-3">
              <p className="text-cyan">$ check-client-status --all</p>
              <p className="text-paper/90">✓ Royal Sweets &amp; Bakery — Website Live &amp; Maintenance Active</p>
              <p className="text-paper/90">✓ Apex Classes &amp; Academy — School ERP Deployed</p>
              <p className="text-violet">! Sharma Logistics &amp; Transport — Renewal due in 5 days</p>
              <p className="text-paper/90">✓ Lifecare Clinic &amp; Hospital — Contract Signed</p>
              <p className="text-mist">$ _</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Services Section from demo project */}
      <ServicesSection limit={8} showHeader={true} showViewAllBtn={true} />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Process Timeline Section */}
      <ProcessTimeline />

      {/* Featured Work Section */}
      <FeaturedWorkSection limit={3} showHeader={true} showViewAllBtn={true} />

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-16">
        <ScrollReveal direction="up" delay={100}>
          <p className="font-mono text-xs text-cyan tracking-widest mb-4 text-center uppercase font-semibold">TESTIMONIALS</p>
          <h2 className="font-display text-3xl md:text-4xl text-center mb-12">
            What founders & clients say
          </h2>
          <Testimonials />
        </ScrollReveal>
      </section>

      {/* Stats with Staggered Scroll Reveal */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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

      {/* FAQ Section */}
      <FAQSection />

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
