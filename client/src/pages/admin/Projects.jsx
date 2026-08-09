import { useEffect, useState } from "react";
import api from "../../api/client.js";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", summary: "", tags: "", coverColor: "#3A6B63", featured: false });

  function load() {
    api.get("/projects").then((r) => setProjects(r.data));
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    await api.post("/projects", { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) });
    setForm({ title: "", summary: "", tags: "", coverColor: "#3A6B63", featured: false });
    load();
  }

  async function remove(id) {
    await api.delete(`/projects/${id}`);
    load();
  }

  const input = "w-full rounded-lg bg-void border border-edge px-4 py-2.5 text-sm focus-ring outline-none";

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Portfolio</h1>
      <form onSubmit={handleAdd} className="rounded-2xl border border-edge bg-panel p-6 mb-10 grid sm:grid-cols-2 gap-4">
        <input required placeholder="Project title" className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Tags (comma separated)" className={input} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <textarea required placeholder="Summary" rows={2} className={`${input} sm:col-span-2`} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-mist">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Feature on homepage
        </label>
        <button className="sm:col-span-2 px-6 py-2.5 rounded-full bg-grad-primary text-void font-medium hover:brightness-110 transition w-fit">
          Add project
        </button>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-edge bg-panel p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display text-lg">{p.title}</h3>
              <button onClick={() => remove(p.id)} className="text-mist hover:text-red-400 text-xs font-mono">remove</button>
            </div>
            <p className="text-sm text-mist">{p.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
