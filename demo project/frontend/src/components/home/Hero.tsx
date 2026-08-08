import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-glow-radial" />
      <div className="container-lx relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="eyebrow">
            <Sparkles size={14} /> Bihar Sharif's Trusted Web Development Company
          </span>

          <h1 className="mt-6 max-w-xl font-display text-[40px] font-semibold leading-[1.1] text-ink md:text-[56px]">
            We Build Websites That{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">Grow Your Business</span>
          </h1>

          <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-ink/60">
            Professional website development for businesses in Bihar Sharif, Nalanda, Patna and
            across India — fast, secure and built to convert visitors into customers.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/contact" className="btn-primary">
              Get Free Quote <ArrowRight size={16} />
            </Link>
            <Link to="/portfolio" className="btn-secondary">
              View Portfolio
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            {["No hidden charges", "Free consultation", "Ongoing support"].map((item) => (
              <span key={item} className="flex items-center gap-2 font-ui text-sm text-ink/60">
                <CheckCircle2 size={16} className="text-primary" /> {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          {/* Laptop mockup */}
          <div className="relative mx-auto max-w-md rounded-xl3 border border-ink/[0.06] bg-night p-3 shadow-glow">
            <div className="flex items-center gap-1.5 px-2 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="overflow-hidden rounded-xl bg-white">
              <div className="space-y-3 p-5">
                <div className="h-3 w-2/3 rounded-full bg-brand-gradient opacity-90" />
                <div className="h-2 w-1/2 rounded-full bg-ink/10" />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-16 rounded-lg bg-brand-gradient-soft"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-2 w-full rounded-full bg-ink/10" />
                  <div className="h-2 w-5/6 rounded-full bg-ink/10" />
                  <div className="h-2 w-2/3 rounded-full bg-ink/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating project cards */}
          <motion.div
            className="absolute -left-6 top-6 hidden w-44 rounded-xl2 border border-ink/[0.06] bg-white p-4 shadow-card md:block"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mb-2 h-2 w-2/3 rounded-full bg-accent" />
            <p className="font-ui text-xs font-semibold text-ink">Live Site Deployed</p>
            <p className="font-body text-[11px] text-ink/50">Performance 98/100</p>
          </motion.div>

          <motion.div
            className="absolute -right-4 bottom-8 hidden w-48 rounded-xl2 border border-ink/[0.06] bg-white p-4 shadow-card md:block"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <div className="mb-2 h-2 w-1/2 rounded-full bg-secondary" />
            <p className="font-ui text-xs font-semibold text-ink">New Lead Received</p>
            <p className="font-body text-[11px] text-ink/50">via Website Contact Form</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
