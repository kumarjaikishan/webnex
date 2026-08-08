import { useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  useEffect(() => {
    document.title = "Testimonials | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader eyebrow="Testimonials" title="What Our Clients Say" />
      <section className="section-pad bg-white">
        <div className="container-lx grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="card-lx p-7"
            >
              <Quote className="text-primary/30" size={26} />
              <div className="mt-3 flex gap-1">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">{t.review}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient font-ui text-sm font-semibold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-ui text-sm font-semibold text-ink">{t.name}</p>
                  <p className="font-body text-xs text-ink/50">{t.role}, {t.business} · {t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
