import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { useConfirm } from "../../context/ConfirmContext.jsx";
import { toast } from "sonner";
import { Edit2, Trash2, X, ArrowLeft, Send, Check, Play, Pause, Zap, ArrowUpRight } from "lucide-react";

const noteTypes = [
  { value: "welcome", label: "Welcome note" },
  { value: "thankyou", label: "Thank-you card" },
  { value: "issue", label: "Issue update" },
];

export default function ClientDetail() {
  const { id } = useParams();
  const confirm = useConfirm();

  const [client, setClient] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);

  // Forms
  const [contractForm, setContractForm] = useState({ title: "", scope: "", amount: "" });
  const [maintForm, setMaintForm] = useState({
    amount: "",
    cycle: "monthly",
    nextDueDate: "",
    status: "active",
    billingMode: "auto",
    planTitle: "Monthly Website Care & Maintenance",
    notes: "",
  });
  const [editingMaint, setEditingMaint] = useState(null);
  const [generatingMaintId, setGeneratingMaintId] = useState(null);

  const [reminderForm, setReminderForm] = useState({ title: "", dueDate: "", type: "general" });
  const [noteForm, setNoteForm] = useState({ type: "welcome", message: "" });

  function load() {
    api.get(`/clients/${id}`).then((r) => setClient(r.data)).catch(() => {});
    api.get("/contracts").then((r) => setContracts(r.data.filter((c) => c.clientId === id))).catch(() => {});
    api.get("/maintenance").then((r) => setMaintenance(r.data.filter((m) => m.clientId === id))).catch(() => {});
    api.get("/reminders").then((r) => setReminders(r.data.filter((x) => x.clientId === id))).catch(() => {});
    api.get("/notes").then((r) => setNotes(r.data.filter((n) => n.clientId === id))).catch(() => {});
  }

  useEffect(() => {
    load();
  }, [id]);

  // CONTRACT HANDLERS
  async function issueContract(e) {
    e.preventDefault();
    try {
      await api.post("/contracts", { ...contractForm, clientId: id, status: "sent" });
      setContractForm({ title: "", scope: "", amount: "" });
      toast.success("Contract issued successfully.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to issue contract.");
    }
  }

  async function handleDeleteContract(cId) {
    const ok = await confirm({
      title: "Delete Contract",
      message: "Are you sure you want to delete this contract record?",
      confirmText: "Delete Contract",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await api.delete(`/contracts/${cId}`);
      toast.success("Contract deleted.");
      load();
    } catch (err) {
      toast.error("Failed to delete contract.");
    }
  }

  // MAINTENANCE HANDLERS
  function startEditMaint(m) {
    setEditingMaint(m);
    setMaintForm({
      amount: m.amount || "",
      cycle: m.cycle || "monthly",
      nextDueDate: m.nextDueDate || "",
      status: m.status || "active",
      billingMode: m.billingMode || "auto",
      planTitle: m.planTitle || "Monthly Website Care & Maintenance",
      notes: m.notes || "",
    });
  }

  function cancelEditMaint() {
    setEditingMaint(null);
    setMaintForm({
      amount: "",
      cycle: "monthly",
      nextDueDate: "",
      status: "active",
      billingMode: "auto",
      planTitle: "Monthly Website Care & Maintenance",
      notes: "",
    });
  }

  async function toggleMaintenanceStatus(m) {
    const nextStatus = m.status === "active" ? "paused" : "active";
    try {
      await api.put(`/maintenance/${m.id}`, { status: nextStatus });
      toast.success(
        nextStatus === "active"
          ? "Maintenance plan started / activated!"
          : "Maintenance plan paused."
      );
      if (editingMaint?.id === m.id) {
        setMaintForm((prev) => ({ ...prev, status: nextStatus }));
      }
      load();
    } catch (err) {
      toast.error("Failed to update maintenance plan status.");
    }
  }

  async function handleToggleBillingMode(m) {
    const nextMode = m.billingMode === "manual" ? "auto" : "manual";
    try {
      await api.put(`/maintenance/${m.id}`, { billingMode: nextMode });
      toast.success(
        nextMode === "auto"
          ? "Switched to Auto-Billing (Auto-generates on due date)"
          : "Switched to Manual Billing (Click to generate)"
      );
      if (editingMaint?.id === m.id) {
        setMaintForm((prev) => ({ ...prev, billingMode: nextMode }));
      }
      load();
    } catch (err) {
      toast.error("Failed to update billing mode.");
    }
  }

  async function handleGenerateSingleInvoice(m) {
    setGeneratingMaintId(m.id);
    try {
      const res = await api.post(`/maintenance/${m.id}/generate-invoice`);
      toast.success(res.data.message || "Invoice generated with status Pending!");
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to generate invoice.");
    } finally {
      setGeneratingMaintId(null);
    }
  }

  async function handleMaintenanceSubmit(e) {
    e.preventDefault();
    try {
      if (editingMaint) {
        await api.put(`/maintenance/${editingMaint.id}`, {
          amount: Number(maintForm.amount),
          cycle: maintForm.cycle,
          nextDueDate: maintForm.nextDueDate,
          status: maintForm.status || "active",
          billingMode: maintForm.billingMode || "auto",
          planTitle: maintForm.planTitle,
          notes: maintForm.notes,
        });
        toast.success("Maintenance plan updated successfully!");
        setEditingMaint(null);
      } else {
        await api.post("/maintenance", {
          ...maintForm,
          amount: Number(maintForm.amount),
          status: maintForm.status || "active",
          billingMode: maintForm.billingMode || "auto",
          clientId: id,
        });
        toast.success("Maintenance plan created successfully!");
      }
      setMaintForm({
        amount: "",
        cycle: "monthly",
        nextDueDate: "",
        status: "active",
        billingMode: "auto",
        planTitle: "Monthly Website Care & Maintenance",
        notes: "",
      });
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save maintenance plan.");
    }
  }

  async function handleDeleteMaintenance(mId) {
    const ok = await confirm({
      title: "Delete Maintenance Plan",
      message: "Are you sure you want to delete this maintenance plan? This action cannot be undone.",
      confirmText: "Delete Plan",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await api.delete(`/maintenance/${mId}`);
      toast.success("Maintenance plan deleted.");
      if (editingMaint?.id === mId) {
        cancelEditMaint();
      }
      load();
    } catch (err) {
      toast.error("Failed to delete maintenance plan.");
    }
  }

  // REMINDER HANDLERS
  async function addReminder(e) {
    e.preventDefault();
    try {
      await api.post("/reminders", { ...reminderForm, clientId: id });
      setReminderForm({ title: "", dueDate: "", type: "general" });
      toast.success("Reminder added.");
      load();
    } catch (err) {
      toast.error("Failed to add reminder.");
    }
  }

  async function toggleReminder(r) {
    try {
      await api.put(`/reminders/${r.id}`, { done: !r.done });
      load();
    } catch (err) {
      toast.error("Failed to update reminder.");
    }
  }

  async function handleDeleteReminder(rId) {
    try {
      await api.delete(`/reminders/${rId}`);
      toast.success("Reminder deleted.");
      load();
    } catch (err) {
      toast.error("Failed to delete reminder.");
    }
  }

  // NOTE HANDLERS
  async function sendNote(e) {
    e.preventDefault();
    try {
      await api.post("/notes", {
        ...noteForm,
        clientId: id,
        clientName: client?.name,
        clientEmail: client?.email,
      });
      setNoteForm({ type: "welcome", message: "" });
      toast.success("Note sent successfully.");
      load();
    } catch (err) {
      toast.error("Failed to send note.");
    }
  }

  async function handleDeleteNote(nId) {
    try {
      await api.delete(`/notes/${nId}`);
      toast.success("Note removed.");
      load();
    } catch (err) {
      toast.error("Failed to remove note.");
    }
  }

  if (!client) return <GearboxLoader label="Loading client details..." />;

  const card = "rounded-2xl border border-edge bg-panel/80 backdrop-blur-xl p-6 shadow-lg";
  const input = "w-full rounded-xl bg-void border border-edge px-4 py-2.5 text-sm text-paper focus-ring outline-none transition";
  const btn = "px-5 py-2.5 rounded-xl bg-grad-primary text-void text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition shadow-md";

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Client Header */}
      <div>
        <Link
          to="/admin/clients"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-mist hover:text-cyan transition mb-3"
        >
          <ArrowLeft size={13} /> Back to Clients directory
        </Link>
        <p className="font-mono text-xs text-mist uppercase tracking-wider mb-1">CLIENT CRM PROFILE</p>
        <h1 className="font-display text-3xl font-bold text-paper mb-1">{client.name}</h1>
        <p className="text-mist text-sm">
          {client.email} {client.company && `· ${client.company}`}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CONTRACTS CARD */}
        <div className={card}>
          <h2 className="font-display text-lg font-bold text-paper mb-4">Issue a contract</h2>
          <form onSubmit={issueContract} className="space-y-3 mb-5">
            <input
              required
              placeholder="Title"
              className={input}
              value={contractForm.title}
              onChange={(e) => setContractForm({ ...contractForm, title: e.target.value })}
            />
            <textarea
              placeholder="Scope of work"
              rows={2}
              className={input}
              value={contractForm.scope}
              onChange={(e) => setContractForm({ ...contractForm, scope: e.target.value })}
            />
            <input
              placeholder="Amount (₹)"
              type="number"
              min="0"
              className={input}
              value={contractForm.amount}
              onChange={(e) => setContractForm({ ...contractForm, amount: e.target.value })}
            />
            <button className={btn}>Send contract</button>
          </form>

          <div className="space-y-2 border-t border-edge/60 pt-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-mist mb-2">
              Issued Contracts ({contracts.length})
            </p>
            {contracts.length === 0 ? (
              <p className="text-xs text-mist/60 italic py-1">No contracts issued yet.</p>
            ) : (
              contracts.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl border border-edge/60 bg-void/40 text-sm">
                  <div>
                    <span className="font-semibold text-paper text-sm block">{c.title}</span>
                    <span className="font-mono text-xs text-mist">
                      {c.amount ? `₹${c.amount}` : "No amount"} · <span className="text-cyan">{c.status}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteContract(c.id)}
                    title="Delete contract"
                    className="p-1.5 rounded-lg border border-edge bg-panel hover:bg-red-500/10 hover:border-red-500/30 text-mist hover:text-red-400 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MAINTENANCE PLAN CARD */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-paper">
              {editingMaint ? "Edit Maintenance Plan" : "Maintenance Plan"}
            </h2>
            {editingMaint && (
              <button
                type="button"
                onClick={cancelEditMaint}
                className="text-xs text-mist hover:text-paper font-mono flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-edge hover:bg-white/10 transition"
              >
                <X size={12} /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleMaintenanceSubmit} className="space-y-3 mb-5">
            <div>
              <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                Amount (₹) *
              </label>
              <input
                required
                placeholder="Amount (₹)"
                type="number"
                min="0"
                className={input}
                value={maintForm.amount}
                onChange={(e) => setMaintForm({ ...maintForm, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                Billing Cycle
              </label>
              <select
                className={input}
                value={maintForm.cycle}
                onChange={(e) => setMaintForm({ ...maintForm, cycle: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                Next Due Date *
              </label>
              <input
                required
                type="date"
                className={input}
                value={maintForm.nextDueDate}
                onChange={(e) => setMaintForm({ ...maintForm, nextDueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                Plan Status
              </label>
              <select
                className={input}
                value={maintForm.status}
                onChange={(e) => setMaintForm({ ...maintForm, status: e.target.value })}
              >
                <option value="active">Active (Started / Running)</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                Invoice Generation Mode
              </label>
              <select
                className={input}
                value={maintForm.billingMode || "auto"}
                onChange={(e) => setMaintForm({ ...maintForm, billingMode: e.target.value })}
              >
                <option value="auto">Auto-Generate (Auto on due date / 1st of month)</option>
                <option value="manual">Manual Billing (Click to generate on demand)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button className={btn}>
                {editingMaint ? "Update Plan" : "Save Plan"}
              </button>
              {editingMaint && (
                <button
                  type="button"
                  onClick={cancelEditMaint}
                  className="px-4 py-2.5 rounded-xl border border-edge text-mist hover:text-paper text-sm transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List of existing maintenance plans with Edit & Delete actions */}
          <div className="space-y-2 border-t border-edge/60 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist">
                Client Plans ({maintenance.length})
              </span>
              <span className="text-[10px] text-mist/60 font-mono">Click Edit or Delete</span>
            </div>

            {maintenance.length === 0 ? (
              <p className="text-xs text-mist/60 italic py-2">No maintenance plans assigned to this client yet.</p>
            ) : (
              maintenance.map((m) => {
                const isBeingEdited = editingMaint?.id === m.id;
                return (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isBeingEdited
                        ? "border-cyan/50 bg-cyan/10 ring-1 ring-cyan/40"
                        : "border-edge/70 bg-void/50 hover:border-edge hover:bg-void/80"
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-paper font-mono">
                          ₹{m.amount} / {m.cycle}
                        </span>
                        {/* Interactive Clickable Status Pill */}
                        <button
                          type="button"
                          onClick={() => toggleMaintenanceStatus(m)}
                          title={`Click to switch status to ${m.status === "active" ? "Paused" : "Active"}`}
                          className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                            m.status === "active"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              m.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                            }`}
                          />
                          <span>{m.status || "active"}</span>
                        </button>

                        {/* Interactive Mode Pill */}
                        <button
                          type="button"
                          onClick={() => handleToggleBillingMode(m)}
                          title="Click to toggle between Auto and Manual billing mode"
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold transition flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 ${
                            m.billingMode !== "manual"
                              ? "bg-cyan/15 text-cyan border border-cyan/30"
                              : "bg-void/80 text-mist border border-edge hover:text-paper"
                          }`}
                        >
                          {m.billingMode !== "manual" ? "⚡ Auto" : "✋ Manual"}
                        </button>
                      </div>

                      <span className="font-mono text-xs text-mist block mt-0.5">
                        next due: {m.nextDueDate || "N/A"}
                      </span>

                      {/* Current Month Invoicing Status & Action */}
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        {m.lastInvoicedMonth === new Date().toISOString().substring(0, 7) ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                            <Check size={11} className="shrink-0" />
                            <span>{m.lastInvoiceNumber || "Invoice"} generated (Pending)</span>
                            {m.lastInvoiceId && (
                              <Link
                                to={`/admin/invoices/${m.lastInvoiceId}`}
                                className="text-cyan underline ml-0.5 inline-flex items-center gap-0.5"
                              >
                                <span>View</span>
                                <ArrowUpRight size={10} />
                              </Link>
                            )}
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-2 flex-wrap">
                            {m.status === "active" && (
                              <button
                                type="button"
                                disabled={generatingMaintId === m.id}
                                onClick={() => handleGenerateSingleInvoice(m)}
                                className="px-2.5 py-1 rounded-lg bg-grad-primary text-void font-bold text-xs flex items-center gap-1 hover:brightness-110 active:scale-95 transition shadow disabled:opacity-50"
                                title="Generate this month's invoice immediately with status Pending"
                              >
                                <Zap size={11} />
                                <span>
                                  {generatingMaintId === m.id
                                    ? "Generating..."
                                    : `Generate ${new Date().toLocaleDateString("en-US", { month: "short" })} Invoice`}
                                </span>
                              </button>
                            )}
                            <span className="text-[10px] font-mono text-mist/60">
                              {m.billingMode !== "manual"
                                ? `Auto on ${m.nextDueDate}`
                                : "Manual mode"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons: Start/Pause, Edit, and Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* 1-Click Start / Pause Button */}
                      <button
                        type="button"
                        onClick={() => toggleMaintenanceStatus(m)}
                        title={m.status === "active" ? "Pause this plan" : "Start / Activate this plan"}
                        className={`p-2 rounded-lg border text-xs font-mono transition flex items-center gap-1.5 ${
                          m.status === "active"
                            ? "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300"
                            : "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {m.status === "active" ? (
                          <>
                            <Pause size={12} />
                            <span className="text-[11px] font-semibold">Pause</span>
                          </>
                        ) : (
                          <>
                            <Play size={12} />
                            <span className="text-[11px] font-semibold">Start</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEditMaint(m)}
                        title="Edit this maintenance plan"
                        className={`p-2 rounded-lg border text-xs font-mono transition flex items-center gap-1 ${
                          isBeingEdited
                            ? "bg-cyan/20 border-cyan text-cyan"
                            : "border-edge bg-panel hover:bg-white/10 hover:border-cyan/40 text-mist hover:text-cyan"
                        }`}
                      >
                        <Edit2 size={13} />
                        <span className="hidden sm:inline text-[11px]">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMaintenance(m.id)}
                        title="Delete this maintenance plan"
                        className="p-2 rounded-lg border border-edge bg-panel hover:bg-red-500/10 hover:border-red-500/30 text-mist hover:text-red-400 transition flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span className="hidden sm:inline text-[11px]">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* REMINDERS CARD */}
        <div className={card}>
          <h2 className="font-display text-lg font-bold text-paper mb-4">Reminders</h2>
          <form onSubmit={addReminder} className="space-y-3 mb-5">
            <input
              required
              placeholder="What's due?"
              className={input}
              value={reminderForm.title}
              onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
            />
            <input
              required
              type="date"
              className={input}
              value={reminderForm.dueDate}
              onChange={(e) => setReminderForm({ ...reminderForm, dueDate: e.target.value })}
            />
            <button className={btn}>Add reminder</button>
          </form>

          <div className="space-y-2 border-t border-edge/60 pt-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-mist mb-2">
              Reminders ({reminders.length})
            </p>
            {reminders.length === 0 ? (
              <p className="text-xs text-mist/60 italic py-1">No reminders set for this client.</p>
            ) : (
              reminders.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl border border-edge/60 bg-void/40 text-sm">
                  <label className="flex items-center gap-3 cursor-pointer min-w-0 pr-2">
                    <input
                      type="checkbox"
                      checked={r.done}
                      onChange={() => toggleReminder(r)}
                      className="rounded accent-cyan"
                    />
                    <span className={`truncate text-sm ${r.done ? "line-through text-mist" : "text-paper"}`}>
                      {r.title}
                    </span>
                    <span className="font-mono text-xs text-mist shrink-0">{r.dueDate}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteReminder(r.id)}
                    title="Delete reminder"
                    className="p-1.5 rounded-lg border border-edge bg-panel hover:bg-red-500/10 hover:border-red-500/30 text-mist hover:text-red-400 transition shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* WELCOME NOTE / THANK YOU CARDS */}
        <div className={card}>
          <h2 className="font-display text-lg font-bold text-paper mb-4">Welcome note / thank-you card</h2>
          <form onSubmit={sendNote} className="space-y-3 mb-5">
            <select
              className={input}
              value={noteForm.type}
              onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
            >
              {noteTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <textarea
              required
              placeholder="Message"
              rows={3}
              className={input}
              value={noteForm.message}
              onChange={(e) => setNoteForm({ ...noteForm, message: e.target.value })}
            />
            <button className={btn}>Send Note</button>
          </form>

          <div className="space-y-2 border-t border-edge/60 pt-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-mist mb-2">
              Sent Notes & Cards ({notes.length})
            </p>
            {notes.length === 0 ? (
              <p className="text-xs text-mist/60 italic py-1">No notes or cards sent yet.</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="p-3 rounded-xl border border-edge/60 bg-void/40 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-cyan uppercase font-semibold">{n.type}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(n.id)}
                      title="Delete note"
                      className="p-1 rounded border border-edge bg-panel hover:bg-red-500/10 hover:border-red-500/30 text-mist hover:text-red-400 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-paper/90 text-xs sm:text-sm whitespace-pre-wrap">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
