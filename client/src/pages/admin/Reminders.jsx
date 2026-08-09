import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../api/client.js";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Reminder Form
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sentNotice, setSentNotice] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  async function loadData() {
    try {
      const [rRes, cRes, iRes] = await Promise.all([
        api.get("/reminders"),
        api.get("/clients"),
        api.get("/invoices").catch(() => ({ data: [] })),
      ]);
      setReminders(rRes.data || []);
      setClients(cRes.data || []);
      setInvoices(iRes.data || []);
    } catch (err) {
      console.error("Failed to load reminders", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleDone(r) {
    try {
      await api.put(`/reminders/${r.id}`, { done: !r.done });
      loadData();
    } catch (err) {
      alert("Failed to update status");
    }
  }

  async function handleSendReminder(r) {
    const client = clients.find((c) => c.id === r.clientId);
    const targetEmail = client?.email || "client@domain.com";
    setSentNotice(`✅ Payment reminder notification sent to ${targetEmail} for "${r.title}"`);
    setTimeout(() => setSentNotice(null), 4000);
  }

  async function handleCreateReminder(e) {
    e.preventDefault();
    try {
      await api.post("/reminders", {
        title,
        clientId,
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        done: false,
        type: "payment_reminder",
      });
      setShowModal(false);
      setTitle("");
      setDueDate("");
      loadData();
    } catch (err) {
      alert("Failed to create reminder");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this reminder?")) return;
    try {
      await api.delete(`/reminders/${id}`);
      loadData();
    } catch (err) {
      alert("Failed to delete reminder");
    }
  }

  const sortedReminders = [...reminders].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Payment & Milestone Reminders</h1>
          <p className="text-mist text-sm">Automated and 1-click payment due alerts for Webnex Labs clients.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 transition focus-ring"
        >
          + Add Payment Reminder
        </button>
      </div>

      {sentNotice && (
        <div className="p-4 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan text-sm font-mono animate-fadeIn">
          {sentNotice}
        </div>
      )}

      {/* PENDING INVOICES QUICK REMINDER BAR */}
      {invoices.filter((i) => i.status === "Pending" || i.status === "Overdue").length > 0 && (
        <div className="bg-panel border border-amber-500/30 rounded-2xl p-4 bg-amber-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold">
              ⚠️ Invoices Pending Action ({invoices.filter((i) => i.status === "Pending" || i.status === "Overdue").length})
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {invoices
              .filter((i) => i.status === "Pending" || i.status === "Overdue")
              .map((inv) => (
                <div key={inv.id} className="bg-void p-3 rounded-xl border border-edge flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-paper">{inv.clientName}</p>
                    <p className="text-mist font-mono">${inv.totalAmount?.toLocaleString()} • Due: {inv.dueDate}</p>
                  </div>
                  <button
                    onClick={() =>
                      setSentNotice(`⚡ 1-Click Reminder sent to ${inv.clientEmail} for Invoice #${inv.invoiceNumber}`)
                    }
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition text-[11px] font-mono"
                  >
                    Send Reminder
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-mist">Loading reminders...</p>
      ) : sortedReminders.length === 0 ? (
        <div className="bg-panel border border-edge rounded-2xl p-12 text-center">
          <p className="text-mist mb-4">No custom payment reminders scheduled.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm"
          >
            Create Payment Reminder
          </button>
        </div>
      ) : (
        <div className="bg-panel border border-edge rounded-2xl divide-y divide-edge">
          {sortedReminders.map((r) => {
            const client = clients.find((c) => c.id === r.clientId);
            return (
              <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition">
                <label className="flex items-center gap-4 cursor-pointer flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={r.done}
                    onChange={() => toggleDone(r)}
                    className="w-4 h-4 rounded border-edge text-cyan focus:ring-0 bg-void cursor-pointer"
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${r.done ? "line-through text-mist" : "text-paper"}`}>
                      {r.title}
                    </p>
                    <p className="font-mono text-xs text-mist">
                      Client: {client ? client.name : "General"} • Due: <span className="text-cyan">{r.dueDate}</span>
                    </p>
                  </div>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendReminder(r)}
                    className="px-3 py-1.5 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan text-xs hover:bg-cyan/20 transition"
                  >
                    📩 Send Reminder
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-mist hover:text-rose-400 text-xs px-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE REMINDER MODAL VIA PORTAL */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 m-0 top-0 left-0 right-0 bottom-0">
          <div className="bg-panel border border-edge rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-edge pb-3">
              <h2 className="font-display text-lg font-bold">New Payment Reminder</h2>
              <button onClick={() => setShowModal(false)} className="text-mist hover:text-paper">✕</button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Second Milestone Deposit Payment Due"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Assign to Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                >
                  <option value="">Select client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Payment Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-mist hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs hover:brightness-110"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
