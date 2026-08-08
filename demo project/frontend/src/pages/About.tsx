import { useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import StatsBar from "@/components/home/StatsBar";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function About() {
  useEffect(() => {
    document.title = "About Us | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="About Lumix Digital"
        title="Helping Bihar Businesses Go Digital"
        subtitle="Founded by Jai Kishan Kumar, Lumix Digital is a website development company based in Bihar Sharif, Nalanda."
      />

      <section className="section-pad bg-white">
        <div className="container-lx grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-3xl font-semibold text-ink">Our Story</h2>
            <p className="mt-4 font-body leading-relaxed text-ink/60">
              Lumix Digital was started with a simple belief — that businesses in Bihar Sharif,
              Nalanda, Patna and across Bihar deserve the same quality of web development
              available to businesses anywhere else in the country.
            </p>
            <p className="mt-4 font-body leading-relaxed text-ink/60">
              Since then, we've worked with shop owners, clinics, schools, restaurants and
              growing startups to build websites and systems that actually move their business
              forward — not just look good.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-lx aspect-square bg-brand-gradient-soft"
          />
        </div>
      </section>

      <StatsBar />
      <WhyChooseUs />
    </>
  );
}
