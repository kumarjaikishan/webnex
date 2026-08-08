import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });
  const [error, setError] = useState("");

  function load() {
    api.get("/clients").then((r) => setClients(r.data));
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/clients", form);
      setForm({ name: "", email: "", company: "", password: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add client.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Clients</h1>

      <form onSubmit={handleAdd} className="rounded-2xl border border-edge bg-panel p-6 mb-10 grid sm:grid-cols-2 gap-4">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg bg-void border border-edge px-4 py-2.5 text-sm focus-ring outline-none" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg bg-void border border-edge px-4 py-2.5 text-sm focus-ring outline-none" />
        <input placeholder="Company (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="rounded-lg bg-void border border-edge px-4 py-2.5 text-sm focus-ring outline-none" />
        <input required type="password" placeholder="Portal password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-lg bg-void border border-edge px-4 py-2.5 text-sm focus-ring outline-none" />
        {error && <p className="text-red-400 text-sm sm:col-span-2">{error}</p>}
        <button className="sm:col-span-2 px-6 py-2.5 rounded-full bg-grad-primary text-void font-medium hover:brightness-110 transition w-fit">
          Add client
        </button>
      </form>

      <div className="rounded-2xl border border-edge bg-panel divide-y divide-white/10">
        {clients.map((c) => (
          <Link key={c.id} to={`/admin/clients/${c.id}`} className="px-5 py-4 flex items-center justify-between hover:bg-white/5 transition">
            <div>
              <p className="text-sm">{c.name} {c.company && <span className="text-mist">· {c.company}</span>}</p>
              <p className="font-mono text-xs text-mist">{c.email}</p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              {c.openReminders > 0 && <span className="text-cyan">{c.openReminders} due</span>}
              <span className="text-mist">{c.maintenancePlan ? `$${c.maintenancePlan.amount}/${c.maintenancePlan.cycle}` : "no plan"}</span>
            </div>
          </Link>
        ))}
        {clients.length === 0 && <p className="px-5 py-6 text-sm text-mist">No clients yet — add your first above.</p>}
      </div>
    </div>
  );
}
