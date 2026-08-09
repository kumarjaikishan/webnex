import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PricingSection from "../components/PricingSection.jsx";
import FAQSection from "../components/FAQSection.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";

export default function PricingPage() {
  return (
    <div className="pt-8 pb-24">
      {/* Top Header */}
      <section className="max-w-5xl mx-auto px-6 text-center pt-12 pb-10">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            CLEAR & TRANSPARENT PRICING
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight text-paper">
            Plans Built for Every Stage of Business
          </h1>
          <p className="text-mist text-lg max-w-2xl mx-auto leading-relaxed">
            Transparent starting prices — your exact milestone quote depends on your specific project requirements.
          </p>
        </ScrollReveal>
      </section>

      {/* Grid of Pricing Cards */}
      <PricingSection showHeader={false} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-16 text-center">
        <ScrollReveal direction="scale" delay={150}>
          <div className="rounded-3xl border border-edge bg-panel p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-aurora pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl mb-4 text-paper">Need a custom scope or enterprise quote?</h2>
              <p className="text-mist mb-8 max-w-md mx-auto">
                Schedule a free 1-on-1 discovery call with our engineering team to outline your roadmap.
              </p>
              <Link to="/contact" className="inline-block px-7 py-3.5 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-lg">
                Book Free Consultation <ArrowRight size={16} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
