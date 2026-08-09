import { useEffect, useState } from "react";
import api from "../api/client.js";
import ProjectCard from "../components/ProjectCard.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";

export default function Work() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <ScrollReveal direction="up" delay={50}>
        <p className="font-mono text-xs text-cyan tracking-widest mb-4 uppercase font-semibold">WORK</p>
        <h1 className="font-display text-4xl mb-10">Featured Projects & Client Engineering</h1>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, idx) => (
          <ScrollReveal key={p.id} direction="scale" delay={100 * (idx % 3 + 1)}>
            <ProjectCard project={p} />
          </ScrollReveal>
        ))}
      </div>
      {projects.length === 0 && (
        <p className="text-mist font-mono text-sm">No projects yet — add some from the dashboard.</p>
      )}
    </div>
  );
}
