import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { getServiceIcon } from "@/lib/iconMap";

export default function ServicesGrid() {
  const featured = services.slice(0, 8);

  return (
    <section className="section-pad bg-white">
      <div className="container-lx">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">What We Build</span>
          <h2 className="mt-5 font-display text-3xl font-semibold text-ink md:text-[42px]">
            Websites &amp; Systems for Every Kind of Business
          </h2>
          <p className="mt-4 font-body text-ink/60">
            From a first business website to a complete internal system — we build what your
            business actually needs.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service, i) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="card-lx group p-6 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{service.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink/55">{service.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/services" className="btn-secondary">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
