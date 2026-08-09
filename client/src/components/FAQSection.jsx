import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal.jsx";

const faqsList = [
  { 
    id: "f01", 
    question: "Which areas does Webnex Labs serve?", 
    answer: "We work with businesses locally across India as well as remote clients worldwide through structured online communication and milestone tracking." 
  },
  { 
    id: "f02", 
    question: "Is Webnex Labs a full-stack digital software & website company?", 
    answer: "Yes. Webnex Labs specializes in professional website development, custom ERPs, CRMs, inventory tools, and custom SaaS web applications." 
  },
  { 
    id: "f03", 
    question: "How much does a business website or custom system cost?", 
    answer: "Pricing depends on project scope and features. We provide transparent estimates with zero hidden fees — contact us for a detailed project breakdown." 
  },
  { 
    id: "f04", 
    question: "Do you offer fixed pricing?", 
    answer: "We provide structured milestone pricing for each project stage. You'll receive a clear contract and quote before development begins." 
  },
  { 
    id: "f05", 
    question: "How long does it take to build a website or system?", 
    answer: "A standard business website typically takes 2–4 weeks. Complex systems like ERPs or CRMs take 4–8 weeks depending on scope." 
  }
];

export default function FAQSection() {
  const [openId, setOpenId] = useState("f03");

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start">
        {/* Left Column: Heading + Tag + Subtext + CTA */}
        <ScrollReveal direction="left" delay={50}>
          <div>
            <span className="font-mono text-xs text-cyan tracking-widest uppercase font-semibold mb-3 inline-block px-3 py-1 rounded-full border border-cyan/30 bg-cyan/10">
              FAQs
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight text-paper">
              Common Questions, Answered
            </h2>
            <p className="text-mist text-base md:text-md mb-8">
              Can't find what you're looking for?
            </p>
            <Link
              to="/faqs"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-edge bg-panel/80 text-paper hover:border-cyan/50 hover:text-cyan font-semibold transition-all duration-300 shadow-lg group"
            >
              View All FAQs
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Right Column: Stacked Accordion List */}
        <ScrollReveal direction="right" delay={150}>
          <div className="divide-y divide-edge rounded-2xl border border-edge bg-panel/70 backdrop-blur overflow-hidden shadow-2xl">
            {faqsList.map((faq) => {
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
      </div>
    </section>
  );
}
