import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { services } from "@/data/services";
import { getServiceIcon } from "@/lib/iconMap";

export default function Services() {
  useEffect(() => {
    document.title = "Our Services | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Websites & Software Built Around Your Business"
        subtitle="From your first business website to a complete internal system — explore everything we build."
      />
      <section className="section-pad bg-white">
        <div className="container-lx grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
                className="card-lx p-6 hover:-translate-y-1 hover:shadow-card-hover"
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
        <div className="container-lx mt-14 text-center">
          <Link to="/contact" className="btn-primary">
            Get Free Quote <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
