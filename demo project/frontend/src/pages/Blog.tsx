import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { blogPosts } from "@/data/blog";

export default function Blog() {
  useEffect(() => {
    document.title = "Blog | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Insights on Websites, SEO & Growth"
        subtitle="Practical, no-fluff advice for businesses building their online presence."
      />
      <section className="section-pad bg-white">
        <div className="container-lx grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              className="card-lx overflow-hidden hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="h-40 bg-brand-gradient-soft" />
              <div className="p-6">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-ui text-[11px] font-semibold text-primary">
                  {post.category}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">{post.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink/55">{post.excerpt}</p>
                <div className="mt-5 flex items-center gap-4 font-body text-xs text-ink/45">
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
