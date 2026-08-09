export default function ProjectCard({ project }) {
  return (
    <article className="group rounded-2xl border border-edge bg-panel overflow-hidden hover:border-violet/50 transition-colors">
      <div
        className="h-44 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${project.coverColor}, #06060B)` }}
      >
        <div className="absolute inset-0 bg-aurora opacity-70" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl mb-2">{project.title}</h3>
        <p className="text-sm text-mist mb-4">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {(project.tags || []).map((t) => (
            <span key={t} className="font-mono text-[11px] px-2 py-1 rounded-full bg-white/5 text-mist border border-edge">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
