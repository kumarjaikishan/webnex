import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/client.js";

const noteTypes = [
  { value: "welcome", label: "Welcome note" },
  { value: "thankyou", label: "Thank-you card" },
  { value: "issue", label: "Issue update" },
];

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);

  const [contractForm, setContractForm] = useState({ title: "", scope: "", amount: "" });
  const [maintForm, setMaintForm] = useState({ amount: "", cycle: "monthly", nextDueDate: "" });
  const [reminderForm, setReminderForm] = useState({ title: "", dueDate: "", type: "general" });
  const [noteForm, setNoteForm] = useState({ type: "welcome", message: "" });

  function load() {
    api.get(`/clients/${id}`).then((r) => setClient(r.data));
    api.get("/contracts").then((r) => setContracts(r.data.filter((c) => c.clientId === id)));
    api.get("/maintenance").then((r) => setMaintenance(r.data.filter((m) => m.clientId === id)));
    api.get("/reminders").then((r) => setReminders(r.data.filter((x) => x.clientId === id)));
    api.get("/notes").then((r) => setNotes(r.data.filter((n) => n.clientId === id)));
  }
  useEffect(load, [id]);

  async function issueContract(e) {
    e.preventDefault();
    await api.post("/contracts", { ...contractForm, clientId: id, status: "sent" });
    setContractForm({ title: "", scope: "", amount: "" });
    load();
  }
  async function setMaintenancePlan(e) {
    e.preventDefault();
    await api.post("/maintenance", { ...maintForm, clientId: id });
    setMaintForm({ amount: "", cycle: "monthly", nextDueDate: "" });
    load();
  }
  async function addReminder(e) {
    e.preventDefault();
    await api.post("/reminders", { ...reminderForm, clientId: id });
    setReminderForm({ title: "", dueDate: "", type: "general" });
    load();
  }
  async function toggleReminder(r) {
    await api.put(`/reminders/${r.id}`, { done: !r.done });
    load();
  }
  async function sendNote(e) {
    e.preventDefault();
    await api.post("/notes", { ...noteForm, clientId: id });
    setNoteForm({ type: "welcome", message: "" });
    load();
  }

  if (!client) return <p className="text-mist font-mono text-sm">Loading…</p>;

  const card = "rounded-2xl border border-edge bg-panel p-6";
  const input = "w-full rounded-lg bg-void border border-edge px-4 py-2.5 text-sm focus-ring outline-none";
  const btn = "px-5 py-2 rounded-full bg-grad-primary text-void text-sm font-medium hover:brightness-110 transition";

  return (
    <div>
      <p className="font-mono text-xs text-mist mb-2">CLIENT</p>
      <h1 className="font-display text-3xl mb-1">{client.name}</h1>
      <p className="text-mist mb-10">{client.email} {client.company && `· ${client.company}`}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contracts */}
        <div className={card}>
          <h2 className="font-display text-lg mb-4">Issue a contract</h2>
          <form onSubmit={issueContract} className="space-y-3 mb-5">
            <input required placeholder="Title" className={input} value={contractForm.title}
              onChange={(e) => setContractForm({ ...contractForm, title: e.target.value })} />
            <textarea placeholder="Scope of work" rows={2} className={input} value={contractForm.scope}
              onChange={(e) => setContractForm({ ...contractForm, scope: e.target.value })} />
            <input placeholder="Amount (₹)" type="number" className={input} value={contractForm.amount}
              onChange={(e) => setContractForm({ ...contractForm, amount: e.target.value })} />
            <button className={btn}>Send contract</button>
          </form>
          <div className="space-y-2">
            {contracts.map((c) => (
              <div key={c.id} className="flex justify-between text-sm border-t border-edge pt-2">
                <span>{c.title}</span>
                <span className="font-mono text-xs text-cyan">{c.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div className={card}>
          <h2 className="font-display text-lg mb-4">Maintenance plan</h2>
          <form onSubmit={setMaintenancePlan} className="space-y-3 mb-5">
            <input required placeholder="Amount (₹)" type="number" className={input} value={maintForm.amount}
              onChange={(e) => setMaintForm({ ...maintForm, amount: e.target.value })} />
            <select className={input} value={maintForm.cycle} onChange={(e) => setMaintForm({ ...maintForm, cycle: e.target.value })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input required type="date" className={input} value={maintForm.nextDueDate}
              onChange={(e) => setMaintForm({ ...maintForm, nextDueDate: e.target.value })} />
            <button className={btn}>Save plan</button>
          </form>
          <div className="space-y-2">
            {maintenance.map((m) => (
              <div key={m.id} className="flex justify-between text-sm border-t border-edge pt-2">
                <span>₹{m.amount} / {m.cycle}</span>
                <span className="font-mono text-xs text-mist">next: {m.nextDueDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders */}
        <div className={card}>
          <h2 className="font-display text-lg mb-4">Reminders</h2>
          <form onSubmit={addReminder} className="space-y-3 mb-5">
            <input required placeholder="What's due?" className={input} value={reminderForm.title}
              onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })} />
            <input required type="date" className={input} value={reminderForm.dueDate}
              onChange={(e) => setReminderForm({ ...reminderForm, dueDate: e.target.value })} />
            <button className={btn}>Add reminder</button>
          </form>
          <div className="space-y-2">
            {reminders.map((r) => (
              <label key={r.id} className="flex items-center gap-3 text-sm border-t border-edge pt-2 cursor-pointer">
                <input type="checkbox" checked={r.done} onChange={() => toggleReminder(r)} />
                <span className={r.done ? "line-through text-mist" : ""}>{r.title}</span>
                <span className="font-mono text-xs text-mist ml-auto">{r.dueDate}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes & cards */}
        <div className={card}>
          <h2 className="font-display text-lg mb-4">Welcome note / thank-you card</h2>
          <form onSubmit={sendNote} className="space-y-3 mb-5">
            <select className={input} value={noteForm.type} onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}>
              {noteTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <textarea required placeholder="Message" rows={3} className={input} value={noteForm.message}
              onChange={(e) => setNoteForm({ ...noteForm, message: e.target.value })} />
            <button className={btn}>Send</button>
          </form>
          <div className="space-y-2">
            {notes.map((n) => (
              <div key={n.id} className="text-sm border-t border-edge pt-2">
                <span className="font-mono text-xs text-cyan">{n.type}</span>
                <p className="text-paper/90">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
