import { motion } from "framer-motion";
import { Sparkles, Zap, Search, Smartphone, ShieldCheck, IndianRupee, Headphones, Layers3 } from "lucide-react";

const items = [
  { icon: Sparkles, title: "Modern UI", desc: "Clean, premium design that builds instant trust." },
  { icon: Zap, title: "Fast Performance", desc: "Optimized for speed on every device and network." },
  { icon: Search, title: "SEO Optimized", desc: "Built to be found by the customers searching for you." },
  { icon: Smartphone, title: "Mobile First", desc: "Designed for the screen most of your visitors use." },
  { icon: ShieldCheck, title: "Secure", desc: "Following security best practices from day one." },
  { icon: IndianRupee, title: "Affordable", desc: "Transparent pricing with no hidden charges." },
  { icon: Headphones, title: "Ongoing Support", desc: "We stay with you well past launch day." },
  { icon: Layers3, title: "Scalable Architecture", desc: "Built to grow as your business grows." },
];

export default function WhyChooseUs() {
  return (
    <section className="section-pad bg-night text-white">
      <div className="container-lx">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-ui text-[13px] font-semibold text-white/80">
            Why Choose Lumix Digital
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold md:text-[42px]">
            A Digital Partner Businesses Trust
          </h2>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl3 border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="bg-night p-7 transition-colors hover:bg-night-700"
            >
              <item.icon size={22} className="text-accent" />
              <h3 className="mt-4 font-display text-base font-semibold">{item.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-white/50">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
