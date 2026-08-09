import { useEffect, useState } from "react";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";

const noteLabel = { welcome: "Welcome note", thankyou: "Thank-you card", issue: "Issue update" };

export default function ClientOverview() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get("/contracts").then((r) => setContracts(r.data));
    api.get("/maintenance").then((r) => setMaintenance(r.data));
    api.get("/reminders").then((r) => setReminders(r.data));
    api.get("/notes").then((r) => setNotes(r.data));
  }, []);

  const card = "rounded-2xl border border-edge bg-panel p-6";

  return (
    <div className="space-y-6">
      <div className={card}>
        <h2 className="font-display text-lg mb-4">Your contracts</h2>
        {contracts.map((c) => (
          <div key={c.id} className="flex justify-between text-sm border-t border-edge pt-2 mt-2 first:border-0 first:mt-0 first:pt-0">
            <span>{c.title}</span>
            <span className="font-mono text-xs text-cyan">{c.status}</span>
          </div>
        ))}
        {contracts.length === 0 && <p className="text-sm text-mist">No contracts yet.</p>}
      </div>

      <div className={card}>
        <h2 className="font-display text-lg mb-4">Maintenance plan</h2>
        {maintenance.map((m) => (
          <p key={m.id} className="text-sm">${m.amount} / {m.cycle} — next due <span className="text-cyan font-mono">{m.nextDueDate}</span></p>
        ))}
        {maintenance.length === 0 && <p className="text-sm text-mist">No active plan.</p>}
      </div>

      <div className={card}>
        <h2 className="font-display text-lg mb-4">Reminders</h2>
        {reminders.map((r) => (
          <div key={r.id} className="flex justify-between text-sm border-t border-edge pt-2 mt-2 first:border-0 first:mt-0 first:pt-0">
            <span className={r.done ? "line-through text-mist" : ""}>{r.title}</span>
            <span className="font-mono text-xs text-mist">{r.dueDate}</span>
          </div>
        ))}
        {reminders.length === 0 && <p className="text-sm text-mist">Nothing pending.</p>}
      </div>

      <div className={card}>
        <h2 className="font-display text-lg mb-4">Notes from your developer</h2>
        {notes.map((n) => (
          <div key={n.id} className="text-sm border-t border-edge pt-2 mt-2 first:border-0 first:mt-0 first:pt-0">
            <span className="font-mono text-xs text-cyan">{noteLabel[n.type] || n.type}</span>
            <p className="text-paper/90">{n.message}</p>
          </div>
        ))}
        {notes.length === 0 && <p className="text-sm text-mist">Nothing here yet.</p>}
      </div>
    </div>
  );
}
