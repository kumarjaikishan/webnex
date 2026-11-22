import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import { toast } from "sonner";
import { useConfirm } from "../../context/ConfirmContext.jsx";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { Check, Zap, ArrowUpRight, Clock, Edit2, Calendar } from "lucide-react";

export default function Maintenance() {
  const confirm = useConfirm();
  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [customGenPlan, setCustomGenPlan] = useState(null);
  const [customPeriod, setCustomPeriod] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [customIssueDate, setCustomIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [customDueDate, setCustomDueDate] = useState("");
  const [customForce, setCustomForce] = useState(false);
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const customIssueDateRef = useRef(null);
  const customDueDateRef = useRef(null);
  const createDueDateRef = useRef(null);
  const customPeriodRef = useRef(null);

  // Form State
  const [clientId, setClientId] = useState("");
  const [planTitle, setPlanTitle] = useState("Monthly Web Care & Support Plan");
  const [amount, setAmount] = useState(150);
  const [cycle, setCycle] = useState("monthly");
  const [billingMode, setBillingMode] = useState("auto"); // auto | manual
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("Includes monthly security updates, automated backups, and 2 hours of feature support.");

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (showModal || customGenPlan) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, customGenPlan]);

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
      setInvoices(
        (iRes.data || []).filter(
          (inv) =>
            inv.isMaintenance ||
            inv.projectTitle?.toLowerCase().includes("maintenance") ||
            inv.invoiceNumber?.includes("MNT")
        )
      );
    } catch (err) {
      console.error("Failed to load maintenance data", err);
    } finally {
      setLoading(false);
    }
  }

  // Batch generate for all active plans
  async function handleGenerateMonthlyInvoices() {
    const ok = await confirm({
      title: "Generate Monthly Invoices",
      message: "Are you sure you want to generate monthly maintenance invoices for all active clients now?",
      confirmText: "Generate Invoices",
      variant: "primary",
    });
    if (!ok) return;
    setGenerating(true);
    try {
      const res = await api.post("/maintenance/generate-invoices");
      toast.success(res.data.message || "Monthly invoices generated successfully!");
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to generate monthly invoices.");
    } finally {
      setGenerating(false);
    }
  }

  // Single-plan 1-click invoice generator
  async function handleGenerateSingleInvoice(plan) {
    setGeneratingId(plan.id);
    try {
      const res = await api.post(`/maintenance/${plan.id}/generate-invoice`);
      toast.success(res.data.message || "Invoice generated with status Pending!");
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to generate invoice.");
    } finally {
      setGeneratingId(null);
    }
  }

  function openCustomGenModal(plan) {
    setCustomGenPlan(plan);
    setCustomPeriod(new Date().toISOString().substring(0, 7));
    setCustomIssueDate(new Date().toISOString().split("T")[0]);
    setCustomDueDate(plan.nextDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);
    setCustomForce(false);
  }

  async function handleExecuteCustomGenerate(e) {
    e.preventDefault();
    if (!customGenPlan) return;
    setCustomSubmitting(true);
    try {
      const res = await api.post(`/maintenance/${customGenPlan.id}/generate-invoice`, {
        periodMonth: customPeriod,
        issueDate: customIssueDate,
        dueDate: customDueDate,
        force: customForce,
      });
      toast.success(res.data.message || "Custom period invoice generated!");
      setCustomGenPlan(null);
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to generate invoice.");
    } finally {
      setCustomSubmitting(false);
    }
  }

  // Quick toggle between Auto and Manual billing mode
  async function handleToggleBillingMode(plan) {
    const nextMode = plan.billingMode === "manual" ? "auto" : "manual";
    try {
      await api.put(`/maintenance/${plan.id}`, { billingMode: nextMode });
      toast.success(
        nextMode === "auto"
          ? "Switched to Auto-Billing (Auto-generates on due date)"
          : "Switched to Manual Billing (Click to generate)"
      );
      loadAllData();
    } catch (err) {
      toast.error("Failed to update billing mode.");
    }
  }

  async function handleCreatePlan(e) {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.put(`/maintenance/${editingPlan.id}`, {
          clientId,
          planTitle,
          amount: Number(amount),
          cycle,
          billingMode,
          nextDueDate: nextDueDate || editingPlan.nextDueDate,
          notes,
        });
        toast.success("Maintenance plan updated successfully!");
      } else {
        await api.post("/maintenance", {
          clientId,
          planTitle,
          amount: Number(amount),
          cycle,
          billingMode,
          nextDueDate: nextDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
          notes,
        });
        toast.success("Maintenance plan created!");
      }
      setShowModal(false);
      resetForm();
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${editingPlan ? "update" : "create"} maintenance plan`);
    }
  }

  function handleOpenCreate() {
    resetForm();
    setEditingPlan(null);
    setShowModal(true);
  }

  function handleOpenEdit(plan) {
    setEditingPlan(plan);
    setClientId(plan.clientId || "");
    setPlanTitle(plan.planTitle || "");
    setAmount(plan.amount || 0);
    setCycle(plan.cycle || "monthly");
    setBillingMode(plan.billingMode || "auto");
    setNextDueDate(plan.nextDueDate || "");
    setNotes(plan.notes || "");
    setShowModal(true);
  }

  async function handleStatusToggle(plan) {
    const newStatus = plan.status === "active" ? "paused" : "active";
    try {
      await api.put(`/maintenance/${plan.id}`, { status: newStatus });
      toast.success(`Plan marked as ${newStatus}`);
      loadAllData();
    } catch (err) {
      toast.error("Failed to update plan status");
    }
  }

  async function handleDeletePlan(id) {
    const ok = await confirm({
      title: "Delete Maintenance Plan",
      message: "Are you sure you want to delete this maintenance plan?",
      confirmText: "Delete Plan",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await api.delete(`/maintenance/${id}`);
      toast.success("Maintenance plan deleted.");
      loadAllData();
    } catch (err) {
      toast.error("Failed to delete plan");
    }
  }

  function resetForm() {
    setEditingPlan(null);
    setClientId("");
    setPlanTitle("Monthly Web Care & Support Plan");
    setAmount(150);
    setCycle("monthly");
    setBillingMode("auto");
    setNextDueDate("");
    setNotes("Includes monthly security updates, automated backups, and 2 hours of feature support.");
  }

  const sortedPlans = [...plans].sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Client Maintenance & Recurring Invoices</h1>
          <p className="text-mist text-sm">
            Manage retainer care plans, auto or 1-click invoice generation, and duplicate-safe billing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerateMonthlyInvoices}
            disabled={generating}
            className="px-4 py-2 rounded-xl bg-cyan/15 text-cyan border border-cyan/30 text-xs font-semibold hover:bg-cyan/25 transition focus-ring disabled:opacity-50 flex items-center gap-1.5"
          >
            <Zap size={14} />
            <span>{generating ? "Generating..." : "⚡ Run Batch Invoicing Now"}</span>
          </button>
          <button
            onClick={handleOpenCreate}
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
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-paper">Active Retainer Plans ({plans.length})</h2>
          <span className="text-xs font-mono text-mist">Safe duplicate-check enabled</span>
        </div>

        {loading ? (
          <GearboxLoader label="Loading maintenance plans..." />
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
              const isAlreadyInvoicedThisMonth = m.lastInvoicedMonth === currentMonthStr;
              const isAuto = m.billingMode !== "manual";

              return (
                <div
                  key={m.id}
                  className="bg-panel border border-edge rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-edge/80 transition shadow-lg"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-semibold text-paper text-base">{m.planTitle || "Website Maintenance"}</h3>

                      {/* Active / Paused Status */}
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-semibold ${
                          m.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {m.status}
                      </span>

                      {/* Interactive Mode Pill (Auto vs Manual) */}
                      <button
                        type="button"
                        onClick={() => handleToggleBillingMode(m)}
                        title="Click to switch between Auto-Generate and Manual Billing"
                        className={`text-xs px-3 py-0.5 rounded-full border font-mono transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                          isAuto
                            ? "bg-cyan/15 text-cyan border-cyan/40 hover:bg-cyan/25"
                            : "bg-void/80 text-mist border-edge hover:text-paper hover:border-mist"
                        }`}
                      >
                        {isAuto ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                            <span>⚡ Auto-Billing</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-mist" />
                            <span>✋ Manual Billing</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-mist">
                      Client:{" "}
                      <span className="text-paper font-medium">
                        {client ? `${client.name} (${client.company || client.email})` : m.clientName || "Client"}
                      </span>{" "}
                      • Fee:{" "}
                      <span className="font-mono text-cyan font-semibold">
                        ₹{m.amount} / {m.cycle}
                      </span>
                    </p>

                    {/* Month Billing Status / 1-Click Invoice Action */}
                    <div className="pt-1.5 flex items-center gap-3 flex-wrap">
                      {isAlreadyInvoicedThisMonth ? (
                        <div className="inline-flex items-center gap-2 flex-wrap">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                            <Check size={13} className="shrink-0" />
                            <span>
                              Invoice <strong>{m.lastInvoiceNumber || ""}</strong> generated for this month
                            </span>
                            {m.lastInvoiceId && (
                              <Link
                                to={`/admin/invoices/${m.lastInvoiceId}`}
                                className="text-cyan underline hover:text-cyan/80 ml-1 inline-flex items-center gap-0.5"
                              >
                                <span>View</span>
                                <ArrowUpRight size={12} />
                              </Link>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => openCustomGenModal(m)}
                            className="px-2.5 py-1 rounded-xl border border-edge bg-void text-mist hover:text-paper hover:border-mist text-[11px] font-mono transition flex items-center gap-1"
                            title="Generate invoice for previous/custom period or backdate"
                          >
                            <Calendar size={12} />
                            <span>Issue for Another Month</span>
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-3 flex-wrap">
                          {m.status === "active" && (
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                disabled={generatingId === m.id}
                                onClick={() => handleGenerateSingleInvoice(m)}
                                className="px-3.5 py-1.5 rounded-xl bg-grad-primary text-void font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition shadow disabled:opacity-50"
                                title="Click to generate invoice immediately for current month with status Pending"
                              >
                                <Zap size={13} />
                                <span>
                                  {generatingId === m.id
                                    ? "Generating..."
                                    : `⚡ Generate ${new Date().toLocaleDateString("en-US", { month: "short" })} Invoice`}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openCustomGenModal(m)}
                                className="px-2.5 py-1.5 rounded-xl border border-edge bg-panel hover:bg-void text-mist hover:text-paper text-xs font-mono transition flex items-center gap-1"
                                title="Select past month, custom period or custom date"
                              >
                                <Calendar size={12} />
                                <span>Custom / Past Period</span>
                              </button>
                            </div>
                          )}
                          <span className="text-[11px] font-mono text-mist/70">
                            {isAuto
                              ? `Auto-generates on ${m.nextDueDate}`
                              : "Manual mode"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side: Next Due & Controls */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-edge/60">
                    <div className="text-left md:text-right">
                      <p className={`font-mono text-xs ${dueSoon ? "text-amber-400 font-bold" : "text-mist"}`}>
                        Next Due: {m.nextDueDate}
                      </p>
                      {m.lastInvoicedDate && (
                        <p className="text-[11px] text-mist/70 font-mono">Last Invoiced: {m.lastInvoicedDate}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 rounded-xl border border-edge bg-panel hover:bg-cyan/10 hover:border-cyan/30 text-mist hover:text-cyan transition"
                        title="Edit plan details"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(m)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
                          m.status === "active"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                        }`}
                      >
                        {m.status === "active" ? "Pause" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeletePlan(m.id)}
                        className="p-1.5 rounded-xl border border-edge bg-panel hover:bg-red-500/10 hover:border-red-500/30 text-mist hover:text-red-400 transition"
                        title="Delete plan"
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
          <div>
            <h2 className="font-display text-lg font-bold text-paper">Maintenance Invoice Payment History</h2>
            <p className="text-xs text-mist">All generated maintenance invoices are linked here and under Invoices.</p>
          </div>
          <span className="text-xs text-mist font-mono">{invoices.length} invoice records</span>
        </div>

        {invoices.length === 0 ? (
          <p className="text-mist text-xs">
            No maintenance invoices generated yet. Use the 1-click button on an active plan above to issue an invoice.
          </p>
        ) : (
          <div className="bg-panel border border-edge rounded-2xl divide-y divide-edge">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/invoices/${inv.id}`}
                      className="font-mono font-semibold text-cyan hover:underline inline-flex items-center gap-1"
                    >
                      <span>{inv.invoiceNumber}</span>
                      <ArrowUpRight size={12} />
                    </Link>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                        inv.status === "Paid"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-mist mt-1">
                    {inv.clientName} ({inv.clientEmail}) • Issued: {inv.issueDate} • Due: {inv.dueDate}
                  </p>
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
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-void/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl bg-panel border border-edge border-t-2 border-t-cyan shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-edge/80 pb-3">
                <h2 className="font-display text-lg font-bold text-paper">
                  {editingPlan ? "Edit Maintenance Plan" : "New Maintenance Plan"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-mist hover:text-paper hover:bg-white/5 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Select Client *</label>
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
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Fee Amount (₹) *</label>
                    <input
                      type="number"
                      min="0"
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

                {/* Billing Mode Selection */}
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1.5">
                    Invoice Generation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBillingMode("auto")}
                      className={`p-3 rounded-xl border text-left transition ${
                        billingMode === "auto"
                          ? "border-cyan bg-cyan/10 text-paper ring-1 ring-cyan/40"
                          : "border-edge bg-void text-mist hover:text-paper"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-cyan">
                        <span>⚡ Auto-Generate</span>
                      </div>
                      <p className="text-[11px] text-mist mt-1">
                        Auto-generates Pending invoice on due date / 1st of month.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBillingMode("manual")}
                      className={`p-3 rounded-xl border text-left transition ${
                        billingMode === "manual"
                          ? "border-cyan bg-cyan/10 text-paper ring-1 ring-cyan/40"
                          : "border-edge bg-void text-mist hover:text-paper"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-400">
                        <span>✋ Manual Billing</span>
                      </div>
                      <p className="text-[11px] text-mist mt-1">
                        Single-click button to generate on demand with duplicate prevention.
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">First Due Date *</label>
                  <div
                    onClick={() => createDueDateRef.current?.showPicker ? createDueDateRef.current.showPicker() : createDueDateRef.current?.focus()}
                    className="relative flex items-center cursor-pointer"
                  >
                    <input
                      ref={createDueDateRef}
                      type="date"
                      required
                      value={nextDueDate}
                      onChange={(e) => setNextDueDate(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge pl-3 pr-8 py-2 text-sm focus-ring outline-none font-mono text-paper [color-scheme:dark] cursor-pointer"
                    />
                    <div className="absolute right-3 pointer-events-none text-white">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Scope & Notes</label>
                  <textarea
                    rows="2"
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
                    className="px-5 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs hover:brightness-110 shadow"
                  >
                    {editingPlan ? "Update Plan" : "Save Maintenance Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* CUSTOM / PREVIOUS PERIOD INVOICE GENERATION MODAL VIA PORTAL */}
      {customGenPlan &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-void/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl bg-panel border border-edge border-t-2 border-t-cyan shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-edge/80 pb-3">
                <div>
                  <h2 className="font-display text-base font-bold text-paper">Generate Custom Period Invoice</h2>
                  <p className="text-xs text-mist">
                    {customGenPlan.clientName || "Client"} • {customGenPlan.planTitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomGenPlan(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-mist hover:text-paper hover:bg-white/5 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleExecuteCustomGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">
                    Billing Period (Month & Year) *
                  </label>
                  <div
                    onClick={() => customPeriodRef.current?.showPicker ? customPeriodRef.current.showPicker() : customPeriodRef.current?.focus()}
                    className="relative flex items-center cursor-pointer"
                  >
                    <input
                      ref={customPeriodRef}
                      type="month"
                      required
                      value={customPeriod}
                      onChange={(e) => setCustomPeriod(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge pl-3 pr-8 py-2 text-xs focus-ring outline-none font-mono text-paper [color-scheme:dark] cursor-pointer"
                    />
                    <div className="absolute right-2.5 pointer-events-none text-white">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-[11px] text-mist/70 mt-1">
                    Select any past month (e.g. Oct 2026, Sept 2026) or future period.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Invoice / Issue Date</label>
                    <div
                      onClick={() => customIssueDateRef.current?.showPicker ? customIssueDateRef.current.showPicker() : customIssueDateRef.current?.focus()}
                      className="relative flex items-center cursor-pointer"
                    >
                      <input
                        ref={customIssueDateRef}
                        type="date"
                        required
                        value={customIssueDate}
                        onChange={(e) => setCustomIssueDate(e.target.value)}
                        className="w-full rounded-xl bg-void border border-edge pl-3 pr-8 py-2 text-xs focus-ring outline-none font-mono text-paper [color-scheme:dark] cursor-pointer"
                      />
                      <div className="absolute right-2.5 pointer-events-none text-white">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Due Date</label>
                    <div
                      onClick={() => customDueDateRef.current?.showPicker ? customDueDateRef.current.showPicker() : customDueDateRef.current?.focus()}
                      className="relative flex items-center cursor-pointer"
                    >
                      <input
                        ref={customDueDateRef}
                        type="date"
                        required
                        value={customDueDate}
                        onChange={(e) => setCustomDueDate(e.target.value)}
                        className="w-full rounded-xl bg-void border border-edge pl-3 pr-8 py-2 text-xs focus-ring outline-none font-mono text-paper [color-scheme:dark] cursor-pointer"
                      />
                      <div className="absolute right-2.5 pointer-events-none text-white">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-void/60 border border-edge flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-paper">Fee Amount</p>
                    <p className="text-[11px] text-mist">{customGenPlan.cycle || "Monthly"} fee</p>
                  </div>
                  <span className="font-mono text-cyan font-bold text-sm">₹{customGenPlan.amount}</span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-mist select-none pt-1">
                  <input
                    type="checkbox"
                    checked={customForce}
                    onChange={(e) => setCustomForce(e.target.checked)}
                    className="rounded border-edge text-cyan focus:ring-0"
                  />
                  <span>Force generate even if already invoiced for this period</span>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-edge">
                  <button
                    type="button"
                    onClick={() => setCustomGenPlan(null)}
                    className="px-4 py-2 rounded-xl text-xs text-mist hover:text-paper"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={customSubmitting}
                    className="px-5 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs hover:brightness-110 shadow disabled:opacity-50"
                  >
                    {customSubmitting ? "Generating..." : "Generate Invoice Now"}
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
