import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden bg-brand-gradient-soft pt-36 pb-16 md:pt-44 md:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-glow-radial" />
      <div className="container-lx relative text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold text-ink md:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="mx-auto mt-4 max-w-xl font-body text-ink/60">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
}
