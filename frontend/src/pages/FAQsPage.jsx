import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import { faqsData } from "../data/faqsData.js";
import ScrollReveal from "../components/ScrollReveal.jsx";

export default function FAQsPage() {
  const categories = useMemo(() => ["All", ...Array.from(new Set(faqsData.map((f) => f.category)))], []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState("f01");

  const filteredFaqs = activeCategory === "All"
    ? faqsData
    : faqsData.filter((f) => f.category === activeCategory);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="pt-8 pb-24">
      {/* Page Header */}
      <section className="max-w-5xl mx-auto px-6 text-center pt-12 pb-14">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            HELP & KNOWLEDGE BASE
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight text-paper">
            Frequently Asked Questions
          </h1>
          <p className="text-mist text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about pricing, timeline, development process, SEO, and technical support.
          </p>
        </ScrollReveal>

        {/* Filter Badges */}
        <ScrollReveal direction="up" delay={150}>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wide transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-cyan/20 border-cyan text-cyan shadow-lg shadow-cyan/10"
                    : "bg-panel/50 border-edge text-mist hover:border-cyan/40 hover:text-paper"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Accordion Container */}
      <section className="max-w-4xl mx-auto px-6">
        <ScrollReveal direction="up" delay={200}>
          <div className="divide-y divide-edge rounded-2xl border border-edge bg-panel/70 backdrop-blur overflow-hidden shadow-2xl">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="transition-colors hover:bg-panel/90">
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-display text-base md:text-lg font-semibold transition-colors ${
                      isOpen ? "text-cyan" : "text-paper"
                    }`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-mist transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-cyan" : ""
                      }`}
                    />
                  </button>

                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 pb-5 px-6" : "grid-rows-[0fr] opacity-0 px-6"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-mist pt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <ScrollReveal direction="scale" delay={150}>
          <div className="rounded-3xl border border-edge bg-panel p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-aurora pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl mb-4 text-paper">Still have questions?</h2>
              <p className="text-mist mb-8 max-w-md mx-auto">
                We're here to help. Reach out to our engineering team and get answers within 24 hours.
              </p>
              <Link to="/contact" className="inline-block px-7 py-3.5 rounded-full bg-grad-primary text-void font-semibold hover:brightness-110 transition focus-ring shadow-lg">
                Contact Our Team <ArrowRight size={16} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
