import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPostsData } from "../data/blogPostsData.js";
import ScrollReveal from "../components/ScrollReveal.jsx";

export default function BlogPage() {
  return (
    <div className="pt-8 pb-24">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 text-center pt-12 pb-14">
        <ScrollReveal direction="up" delay={50}>
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-panel/90 backdrop-blur px-4 py-1.5 font-mono text-xs text-cyan mb-6 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            INSIGHTS & ARTICLES
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight text-paper">
            Insights on Web, Engineering & Growth
          </h1>
          <p className="text-mist text-lg max-w-2xl mx-auto leading-relaxed">
            Practical, technical, and strategic advice for founders building scalable digital platforms.
          </p>
        </ScrollReveal>
      </section>

      {/* Grid of Articles */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPostsData.map((post, idx) => (
            <ScrollReveal key={post.id} direction="up" delay={40 * ((idx % 3) + 1)}>
              <article className="h-full flex flex-col justify-between rounded-2xl border border-edge bg-panel/70 backdrop-blur overflow-hidden transition-all duration-300 hover:border-cyan/40 hover:bg-panel hover:-translate-y-1.5 shadow-2xl group">
                <div className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-cyan uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-cyan/10 border border-cyan/20">
                      {post.category}
                    </span>
                    <span className="font-mono text-[11px] text-mist flex items-center gap-1">
                      <Clock size={12} className="text-cyan" /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-bold text-paper group-hover:text-cyan transition-colors mb-3 leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-sm leading-relaxed text-mist mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="p-7 pt-0 border-t border-edge/40 mt-auto flex items-center justify-between text-xs text-mist">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Calendar size={13} className="text-cyan/70" />
                    {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-1 text-cyan font-mono hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    Read <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
