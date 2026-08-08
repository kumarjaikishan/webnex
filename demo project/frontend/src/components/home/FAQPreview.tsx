import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";
import { faqs } from "@/data/faqs";

export default function FAQPreview() {
  return (
    <section className="section-pad bg-white">
      <div className="container-lx grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="eyebrow">FAQs</span>
          <h2 className="mt-5 font-display text-3xl font-semibold text-ink md:text-[38px]">
            Common Questions, Answered
          </h2>
          <p className="mt-4 font-body text-ink/60">
            Can't find what you're looking for?
          </p>
          <Link to="/faqs" className="btn-secondary mt-6 w-fit">
            View All FAQs <ArrowRight size={16} />
          </Link>
        </div>
        <FAQAccordion items={faqs.slice(0, 5)} />
      </div>
    </section>
  );
}
