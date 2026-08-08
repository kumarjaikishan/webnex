import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import FAQAccordion from "@/components/FAQAccordion";
import { faqs } from "@/data/faqs";

export default function FAQs() {
  useEffect(() => {
    document.title = "FAQs | Lumix Digital";
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(faqs.map((f) => f.category)))], []);
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? faqs : faqs.filter((f) => f.category === active);

  return (
    <>
      <PageHeader eyebrow="FAQs" title="Frequently Asked Questions" subtitle="Everything you need to know before getting started." />
      <section className="section-pad bg-white">
        <div className="container-lx max-w-3xl">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-2 font-ui text-sm font-medium transition-colors ${
                  active === cat
                    ? "border-primary bg-primary text-white"
                    : "border-ink/10 bg-white text-ink/60 hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <FAQAccordion items={filtered} />
        </div>
      </section>
    </>
  );
}
