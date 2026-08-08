import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../api/client.js";

export default function Maintenance() {
  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [notice, setNotice] = useState(null);

  // Form State
  const [clientId, setClientId] = useState("");
  const [planTitle, setPlanTitle] = useState("Monthly Web Care & Support Plan");
  const [amount, setAmount] = useState(150);
  const [cycle, setCycle] = useState("monthly");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("Includes monthly security updates, automated backups, and 2 hours of feature support.");

  useEffect(() => {
    loadAllData();
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

  async function loadAllData() {
    try {
      const [pRes, cRes, iRes] = await Promise.all([
        api.get("/maintenance"),
        api.get("/clients"),
        api.get("/invoices").catch(() => ({ data: [] })),
      ]);
      setPlans(pRes.data || []);
      setClients(cRes.data || []);
      // Filter invoices related to maintenance
      setInvoices((iRes.data || []).filter((inv) => inv.projectTitle?.toLowerCase().includes("maintenance") || inv.invoiceNumber?.includes("MNT")));
    } catch (err) {
      console.error("Failed to load maintenance data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateMonthlyInvoices() {
    if (!confirm("Generate monthly maintenance invoices for all active clients now?")) return;
    setGenerating(true);
    try {
      const res = await api.post("/maintenance/generate-invoices");
      setNotice(`✅ ${res.data.message}`);
      loadAllData();
      setTimeout(() => setNotice(null), 5000);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to generate monthly invoices.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCreatePlan(e) {
    e.preventDefault();
    try {
      await api.post("/maintenance", {
        clientId,
        planTitle,
        amount: Number(amount),
        cycle,
        nextDueDate: nextDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        notes,
      });
      setShowModal(false);
      resetForm();
      loadAllData();
    } catch (err) {
      alert("Failed to create maintenance plan");
    }
  }

  async function handleStatusToggle(plan) {
    const newStatus = plan.status === "active" ? "paused" : "active";
    try {
      await api.put(`/maintenance/${plan.id}`, { status: newStatus });
      loadAllData();
    } catch (err) {
      alert("Failed to update plan status");
    }
  }

  async function handleDeletePlan(id) {
    if (!confirm("Are you sure you want to delete this maintenance plan?")) return;
    try {
      await api.delete(`/maintenance/${id}`);
      loadAllData();
    } catch (err) {
      alert("Failed to delete plan");
    }
  }

  function resetForm() {
    setClientId("");
    setPlanTitle("Monthly Web Care & Support Plan");
    setAmount(150);
    setCycle("monthly");
    setNextDueDate("");
  }

  const sortedPlans = [...plans].sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Client Maintenance & Recurring Invoices</h1>
          <p className="text-mist text-sm">Manage monthly retainer plans, auto-generate monthly invoices, and track payment history.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerateMonthlyInvoices}
            disabled={generating}
            className="px-4 py-2 rounded-xl bg-cyan/15 text-cyan border border-cyan/30 text-xs font-semibold hover:bg-cyan/25 transition focus-ring disabled:opacity-50"
          >
            {generating ? "Generating..." : "⚡ Generate Monthly Invoices Now"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs hover:brightness-110 transition focus-ring"
          >
            + Create Maintenance Plan
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan text-sm font-mono animate-fadeIn">
          {notice}
        </div>
      )}

      {/* ACTIVE MAINTENANCE PLANS SECTION */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-paper">Active Retainer Plans ({plans.length})</h2>
        {loading ? (
          <p className="text-mist text-sm">Loading plans...</p>
        ) : sortedPlans.length === 0 ? (
          <div className="bg-panel border border-edge rounded-2xl p-8 text-center space-y-3">
            <p className="text-mist text-sm">No maintenance plans set up yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs"
            >
              Set Up First Client Plan
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedPlans.map((m) => {
              const client = clients.find((c) => c.id === m.clientId);
              const dueSoon = new Date(m.nextDueDate) - new Date() < 7 * 86400000;
              return (
                <div
                  key={m.id}
                  className="bg-panel border border-edge rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-edge/80 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-paper text-base">{m.planTitle || "Website Maintenance"}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${m.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-mist">
                      Client: <span className="text-paper">{client ? `${client.name} (${client.company || client.email})` : m.clientName || "Client"}</span> • Fee: <span className="font-mono text-cyan">₹{m.amount} / {m.cycle}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-mono text-xs ${dueSoon ? "text-amber-400 font-bold" : "text-mist"}`}>
                        Next Due: {m.nextDueDate}
                      </p>
                      {m.lastInvoicedDate && (
                        <p className="text-[11px] text-mist/70">Last Invoiced: {m.lastInvoicedDate}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusToggle(m)}
                        className="px-3 py-1.5 rounded-lg border border-edge text-xs hover:bg-white/5 transition"
                      >
                        {m.status === "active" ? "Pause" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeletePlan(m.id)}
                        className="text-mist hover:text-rose-400 text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MAINTENANCE INVOICE PAYMENT HISTORY */}
      <div className="space-y-4 pt-4 border-t border-edge">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-paper">Maintenance Invoice Payment History</h2>
          <span className="text-xs text-mist font-mono">{invoices.length} invoice records</span>
        </div>

        {invoices.length === 0 ? (
          <p className="text-mist text-xs">No maintenance invoices generated yet. Click "⚡ Generate Monthly Invoices Now" to issue initial invoices.</p>
        ) : (
          <div className="bg-panel border border-edge rounded-2xl divide-y divide-edge">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-cyan">{inv.invoiceNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${inv.status === "Paid" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-mist mt-1">{inv.clientName} ({inv.clientEmail}) • Issued: {inv.issueDate} • Due: {inv.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-paper">₹{inv.totalAmount?.toLocaleString()}</span>
                  <span className="text-mist text-[11px] font-mono">
                    {inv.status === "Paid" ? "✅ Paid" : "⏳ Pending Payment"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE PLAN MODAL VIA PORTAL */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 m-0 top-0 left-0 right-0 bottom-0">
          <div className="bg-panel border border-edge rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-edge pb-3">
              <h2 className="font-display text-lg font-bold">New Maintenance Plan</h2>
              <button onClick={() => setShowModal(false)} className="text-mist hover:text-paper">✕</button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Select Client</label>
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                >
                  <option value="">Choose client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="Monthly Web Care & Support Plan"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Fee Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Billing Cycle</label>
                  <select
                    value={cycle}
                    onChange={(e) => setCycle(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">First Due Date</label>
                <input
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Scope & Notes</label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none"
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
                  Save Maintenance Plan
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
