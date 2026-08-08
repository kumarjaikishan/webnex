import { useEffect, useState } from "react";
import api from "../../api/client.js";
import StatCard from "../../components/StatCard.jsx";

export default function Overview() {
  const [clients, setClients] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    api.get("/clients").then((r) => setClients(r.data));
    api.get("/reminders").then((r) => setReminders(r.data));
    api.get("/maintenance").then((r) => setMaintenance(r.data));
  }, []);

  const openReminders = reminders.filter((r) => !r.done);
  const mrr = maintenance.reduce((sum, m) => sum + Number(m.amount || 0), 0);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Overview</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Active clients" value={clients.length} />
        <StatCard label="Open reminders" value={openReminders.length} accent="text-cyan" />
        <StatCard label="Maintenance revenue" value={`₹${mrr.toLocaleString()}`} accent="text-cyan" />
      </div>

      <h2 className="font-display text-xl mb-4">Upcoming reminders</h2>
      <div className="rounded-2xl border border-edge bg-panel divide-y divide-white/10">
        {openReminders.slice(0, 6).map((r) => {
          const client = clients.find((c) => c.id === r.clientId);
          return (
            <div key={r.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm">{r.title}</p>
                <p className="font-mono text-xs text-mist">{client?.name || "Unknown client"}</p>
              </div>
              <span className="font-mono text-xs text-cyan">{r.dueDate}</span>
            </div>
          );
        })}
        {openReminders.length === 0 && (
          <p className="px-5 py-6 text-sm text-mist">Nothing due — you're all caught up.</p>
        )}
      </div>
    </div>
  );
}
