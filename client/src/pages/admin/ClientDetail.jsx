import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { useConfirm } from "../../context/ConfirmContext.jsx";
import { toast } from "sonner";
import {
  Edit2,
  Trash2,
  X,
  ArrowLeft,
  Send,
  Check,
  Play,
  Pause,
  Zap,
  ArrowUpRight,
  User,
  Building,
  Mail,
  Lock,
  FileText,
  CreditCard,
  Shield,
  Calendar,
  LayoutDashboard as LayoutDashboardIcon,
} from "lucide-react";

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
  const [invoices, setInvoices] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "maintenance" | "invoices" | "contracts" | "reminders" | "notes" | "profile"
  // Client Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    status: "active",
    notes: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

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
  const [showMaintForm, setShowMaintForm] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);

  const [reminderForm, setReminderForm] = useState({ title: "", dueDate: "", type: "general" });
  const [noteForm, setNoteForm] = useState({ type: "welcome", message: "" });

  async function load() {
    try {
      const [cRes, contractsRes, maintRes, invRes, remRes, notesRes] = await Promise.all([
        api.get(`/clients/${id}`),
        api.get("/contracts"),
        api.get("/maintenance"),
        api.get("/invoices"),
        api.get("/reminders"),
        api.get("/notes"),
      ]);

      const clientData = cRes.data;
      setClient(clientData);
      if (clientData) {
        setProfileForm({
          name: clientData.name || "",
          email: clientData.email || "",
          company: clientData.company || "",
          password: "",
          status: clientData.status || "active",
          notes: clientData.notes || "",
        });
      }

      setContracts(contractsRes.data.filter((c) => c.clientId === id));
      setMaintenance(maintRes.data.filter((m) => m.clientId === id));
      setInvoices(
        invRes.data.filter(
          (inv) =>
            inv.clientId === id ||
            (clientData?.email && inv.clientEmail?.toLowerCase() === clientData.email.toLowerCase())
        )
      );
      setReminders(remRes.data.filter((x) => x.clientId === id));
      setNotes(notesRes.data.filter((n) => n.clientId === id));
    } catch (err) {
      console.error("Failed to load client details:", err);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        company: profileForm.company.trim(),
        status: profileForm.status,
        notes: profileForm.notes,
      };
      if (profileForm.password && profileForm.password.trim().length > 0) {
        payload.password = profileForm.password.trim();
      }

      const res = await api.put(`/clients/${id}`, payload);
      setClient(res.data);
      toast.success("Client profile updated successfully!");
      setProfileForm((prev) => ({ ...prev, password: "" }));
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update client profile.");
    } finally {
      setSavingProfile(false);
    }
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
      setShowContractForm(false);
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
    setShowMaintForm(true);
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
    setShowMaintForm(false);
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
      setShowMaintForm(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <Link
            to="/admin/clients"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-mist hover:text-cyan transition mb-2"
          >
            <ArrowLeft size={13} /> Back to Clients directory
          </Link>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-paper">{client.name}</h1>
            {client.company && (
              <span className="text-xs font-mono text-mist bg-panel border border-edge px-2.5 py-0.5 rounded-md">
                {client.company}
              </span>
            )}
            <span
              className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold border ${
                client.status === "active"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {client.status || "Active"}
            </span>
          </div>
          <p className="text-mist text-xs sm:text-sm font-mono mt-1">
            {client.email}
          </p>
        </div>

        {/* Quick Profile Tab Button */}
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition shrink-0 shadow-sm self-start sm:self-auto cursor-pointer ${
            activeTab === "profile"
              ? "bg-cyan/15 border-cyan text-cyan shadow-cyan/10"
              : "bg-panel border border-edge hover:border-cyan/40 hover:bg-white/5 text-paper"
          }`}
        >
          <Edit2 size={13} className="text-cyan" />
          <span>Edit Profile & Login</span>
        </button>
      </div>

      {/* Summary KPI Badges Row - Clickable Quick Jump to Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("maintenance")}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            activeTab === "maintenance"
              ? "border-cyan bg-cyan/10 shadow-lg shadow-cyan/5"
              : "border-edge/80 bg-panel/60 hover:bg-panel hover:border-cyan/40"
          }`}
        >
          <div className="flex items-center gap-2 text-mist text-xs font-mono mb-1">
            <Shield size={14} className="text-cyan" />
            <span>Maintenance</span>
          </div>
          <div className="font-mono font-bold text-paper text-sm sm:text-base">
            {maintenance.length > 0
              ? `₹${Number(maintenance[0].amount).toLocaleString("en-IN")}/${maintenance[0].cycle === "semi-yearly" ? "semi-yr" : maintenance[0].cycle}`
              : "No Plan"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            activeTab === "invoices"
              ? "border-cyan bg-cyan/10 shadow-lg shadow-cyan/5"
              : "border-edge/80 bg-panel/60 hover:bg-panel hover:border-cyan/40"
          }`}
        >
          <div className="flex items-center gap-2 text-mist text-xs font-mono mb-1">
            <CreditCard size={14} className="text-cyan" />
            <span>Invoices</span>
          </div>
          <div className="font-mono font-bold text-paper text-sm sm:text-base">
            {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contracts")}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            activeTab === "contracts"
              ? "border-cyan bg-cyan/10 shadow-lg shadow-cyan/5"
              : "border-edge/80 bg-panel/60 hover:bg-panel hover:border-cyan/40"
          }`}
        >
          <div className="flex items-center gap-2 text-mist text-xs font-mono mb-1">
            <FileText size={14} className="text-cyan" />
            <span>Contracts</span>
          </div>
          <div className="font-mono font-bold text-paper text-sm sm:text-base">
            {contracts.length} {contracts.length === 1 ? "contract" : "contracts"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reminders")}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            activeTab === "reminders"
              ? "border-cyan bg-cyan/10 shadow-lg shadow-cyan/5"
              : "border-edge/80 bg-panel/60 hover:bg-panel hover:border-cyan/40"
          }`}
        >
          <div className="flex items-center gap-2 text-mist text-xs font-mono mb-1">
            <Check size={14} className="text-cyan" />
            <span>Open Reminders</span>
          </div>
          <div className="font-mono font-bold text-paper text-sm sm:text-base">
            {reminders.filter((r) => !r.done).length} active
          </div>
        </button>
      </div>

      {/* SLEEK TAB NAVIGATION BAR */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 border-b border-edge/80 [scrollbar-width:none]">
        {[
          { id: "overview", label: "All Sections", icon: LayoutDashboardIcon },
          { id: "maintenance", label: "Maintenance", icon: Shield, badge: maintenance.length > 0 ? "Active" : null },
          { id: "invoices", label: "Invoices", icon: CreditCard, count: invoices.length },
          { id: "contracts", label: "Contracts & Agreements", icon: FileText, count: contracts.length },
          { id: "reminders", label: "Reminders", icon: Check, count: reminders.filter((r) => !r.done).length },
          { id: "notes", label: "Welcome Notes & Cards", icon: Send, count: notes.length },
          { id: "profile", label: "Profile & Login", icon: User },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan/15 text-cyan border border-cyan/40 shadow-sm"
                  : "text-mist hover:text-paper hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon size={13} className={isActive ? "text-cyan" : "text-mist"} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? "bg-cyan/30 text-cyan" : "bg-void border border-edge text-mist"
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-md text-[9px] uppercase font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={activeTab === "overview" ? "grid md:grid-cols-2 gap-6 items-start" : "space-y-6 max-w-4xl mx-auto"}>
        {/* CLIENT PROFILE & CREDENTIALS CARD */}
        {(activeTab === "overview" || activeTab === "profile") && (
          <div className={card} id="client-profile-section">
            <div className="flex items-center justify-between mb-4 border-b border-edge/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                  <User size={16} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-paper">Client Profile & Login</h2>
                  <p className="text-xs text-mist font-mono">Contact details, organization & credentials</p>
                </div>
              </div>
              {savingProfile && (
                <span className="text-xs font-mono text-cyan animate-pulse">Saving...</span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-1.5">
                    Client Name *
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-3 text-mist/60" />
                    <input
                      required
                      type="text"
                      className="w-full rounded-xl bg-void border border-edge pl-9 pr-3 py-2 text-sm text-paper focus-ring outline-none transition"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building size={14} className="absolute left-3.5 top-3 text-mist/60" />
                    <input
                      type="text"
                      className="w-full rounded-xl bg-void border border-edge pl-9 pr-3 py-2 text-sm text-paper focus-ring outline-none transition"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-3 text-mist/60" />
                    <input
                      required
                      type="email"
                      className="w-full rounded-xl bg-void border border-edge pl-9 pr-3 py-2 text-sm text-paper focus-ring outline-none transition"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="client@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-1.5">
                    Account Status
                  </label>
                  <select
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm text-paper focus-ring outline-none transition"
                    value={profileForm.status}
                    onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-1.5">
                    Reset Portal Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-3 text-mist/60" />
                    <input
                      type="password"
                      className="w-full rounded-xl bg-void border border-edge pl-9 pr-3 py-2 text-sm text-paper focus-ring outline-none transition"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      placeholder="Leave blank to keep unchanged"
                    />
                  </div>
                  <p className="text-[10px] text-mist/60 font-mono mt-1">Only fills if changing login password</p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-mist uppercase tracking-wider mb-1.5">
                    Internal Notes
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-xl bg-void border border-edge p-2.5 text-sm text-paper focus-ring outline-none transition"
                    value={profileForm.notes}
                    onChange={(e) => setProfileForm({ ...profileForm, notes: e.target.value })}
                    placeholder="Internal notes about this client..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-edge/60">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className={btn}
                >
                  {savingProfile ? "Saving..." : "Save Profile & Credentials"}
                </button>
              </div>
            </form>
          </div>
        )}
        {/* CONTRACTS CARD */}
        {(activeTab === "overview" || activeTab === "contracts") && (
          <div className={card}>
            <div className="flex items-center justify-between mb-4 border-b border-edge/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                  <FileText size={16} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-paper">Contracts & Agreements</h2>
                  <p className="text-xs text-mist font-mono">Scopes of work and legal agreements</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowContractForm(!showContractForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel border border-edge hover:border-cyan/40 hover:bg-white/5 text-xs font-mono font-semibold text-paper hover:text-cyan transition shadow-sm cursor-pointer"
              >
                {showContractForm ? <X size={12} /> : <Edit2 size={12} className="text-cyan" />}
                <span>{showContractForm ? "Close" : "+ Issue Contract"}</span>
              </button>
            </div>

            {(showContractForm || contracts.length === 0) && (
              <form onSubmit={issueContract} className="space-y-3 mb-5 p-4 rounded-xl border border-edge/70 bg-void/30 animate-fade-in">
                <div className="text-xs font-semibold text-cyan font-mono mb-1">Issue New Contract</div>
                <input
                  required
                  placeholder="Contract Title"
                  className={input}
                  value={contractForm.title}
                  onChange={(e) => setContractForm({ ...contractForm, title: e.target.value })}
                />
                <textarea
                  placeholder="Scope of work description"
                  rows={2}
                  className={input}
                  value={contractForm.scope}
                  onChange={(e) => setContractForm({ ...contractForm, scope: e.target.value })}
                />
                <div className="flex items-center gap-2 pt-1">
                  <button className={btn}>Send Contract</button>
                  {contracts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowContractForm(false)}
                      className="px-4 py-2 rounded-xl border border-edge text-mist hover:text-paper text-xs transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="space-y-2">
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
                      <span className="font-mono text-xs text-cyan uppercase font-semibold">
                        {c.status}
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
        )}

        {/* MAINTENANCE PLAN CARD */}
        {(activeTab === "overview" || activeTab === "maintenance") && (
          <div className={card}>
          <div className="flex items-center justify-between mb-4 border-b border-edge/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                <Shield size={16} />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-paper">Maintenance Care Plan</h2>
                <p className="text-xs text-mist font-mono">Retainer cycles, billing & automated invoices</p>
              </div>
            </div>

            {/* Change Maintenance Plan / New Plan Button */}
            {!showMaintForm ? (
              <button
                type="button"
                onClick={() => {
                  if (maintenance.length > 0) {
                    startEditMaint(maintenance[0]);
                  } else {
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
                    setShowMaintForm(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-panel border border-edge hover:border-cyan/40 hover:bg-white/5 text-xs font-mono font-semibold text-paper hover:text-cyan transition shadow-sm cursor-pointer"
              >
                <Edit2 size={12} className="text-cyan" />
                <span>{maintenance.length > 0 ? "Change Plan" : "+ Create Plan"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelEditMaint}
                className="text-xs text-mist hover:text-paper font-mono flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-edge hover:bg-white/10 transition cursor-pointer"
              >
                <X size={12} /> Cancel
              </button>
            )}
          </div>

          {/* Form for Creating / Changing Maintenance Plan */}
          {showMaintForm ? (
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4 mb-2 animate-fade-in">
              <div className="bg-void/40 border border-edge/70 rounded-xl p-3.5 mb-2">
                <span className="text-xs font-semibold text-cyan font-mono block mb-1">
                  {editingMaint ? "Change Maintenance Plan Details" : "Create New Maintenance Plan"}
                </span>
                <p className="text-xs text-mist">
                  Configure retainer pricing, billing period (monthly, quarterly, semi-yearly, or yearly), and invoicing mode.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    required
                    placeholder="e.g. 4000"
                    type="number"
                    min="0"
                    className={input}
                    value={maintForm.amount}
                    onChange={(e) => setMaintForm({ ...maintForm, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                    Billing Cycle *
                  </label>
                  <select
                    className={input}
                    value={maintForm.cycle}
                    onChange={(e) => {
                      const cycle = e.target.value;
                      const titleByCycle = {
                        monthly: "Monthly Website Care & Maintenance",
                        quarterly: "Quarterly Website Care & Maintenance",
                        "semi-yearly": "Semi-Yearly Website Care & Maintenance",
                        yearly: "Annual Website Care & Maintenance",
                      };
                      setMaintForm({
                        ...maintForm,
                        cycle,
                        planTitle: titleByCycle[cycle] || maintForm.planTitle,
                      });
                    }}
                  >
                    <option value="monthly">Monthly (Every 1 Month)</option>
                    <option value="quarterly">Quarterly (Every 3 Months)</option>
                    <option value="semi-yearly">Semi-Yearly (Every 6 Months)</option>
                    <option value="yearly">Yearly (Every 12 Months)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                  Plan Title
                </label>
                <input
                  type="text"
                  className={input}
                  value={maintForm.planTitle}
                  onChange={(e) => setMaintForm({ ...maintForm, planTitle: e.target.value })}
                  placeholder="e.g. Monthly Website Care & Maintenance"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
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
                  <option value="auto">Auto-Generate (Auto on due date / 1st of period)</option>
                  <option value="manual">Manual Billing (Click to generate on demand)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-mist uppercase tracking-wider mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  className={input}
                  value={maintForm.notes}
                  onChange={(e) => setMaintForm({ ...maintForm, notes: e.target.value })}
                  placeholder="Optional scope or notes..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-edge/60">
                <button
                  type="button"
                  onClick={cancelEditMaint}
                  className="px-4 py-2 rounded-xl border border-edge text-mist hover:text-paper text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button className={btn}>
                  {editingMaint ? "Save Plan Changes" : "Create Maintenance Plan"}
                </button>
              </div>
            </form>
          ) : (
            /* Active Plan Summary Cards */
            <div className="space-y-4">
              {maintenance.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-xl border border-dashed border-edge/80 bg-void/30">
                  <Shield size={28} className="mx-auto text-mist/40 mb-2" />
                  <p className="text-sm font-semibold text-paper mb-1">No Active Maintenance Plan</p>
                  <p className="text-xs text-mist max-w-sm mx-auto mb-4">
                    Setup a recurring maintenance retainer (monthly, quarterly, semi-yearly, or yearly) to automate client invoicing.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
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
                      setShowMaintForm(true);
                    }}
                    className={btn}
                  >
                    + Setup Maintenance Plan
                  </button>
                </div>
              ) : (
                maintenance.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-edge/80 bg-void/40 space-y-3 transition hover:border-cyan/30"
                  >
                    {/* Top Row: Amount, Cycle & Interactive Status Pills */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-display text-2xl font-bold text-paper font-mono">
                            ₹{Number(m.amount).toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs font-mono font-semibold text-cyan uppercase tracking-wider px-2 py-0.5 rounded bg-cyan/10 border border-cyan/20">
                            {m.cycle === "semi-yearly" ? "Semi-Yearly" : m.cycle}
                          </span>
                        </div>
                        <p className="text-xs text-paper/80 font-medium mt-0.5">{m.planTitle}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Interactive Clickable Status Pill */}
                        <button
                          type="button"
                          onClick={() => toggleMaintenanceStatus(m)}
                          title={`Click to switch status to ${m.status === "active" ? "Paused" : "Active"}`}
                          className={`text-xs font-mono uppercase px-3 py-1 rounded-full font-semibold transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
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
                          className={`text-xs font-mono uppercase px-2.5 py-1 rounded-full font-semibold transition flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 ${
                            m.billingMode !== "manual"
                              ? "bg-cyan/15 text-cyan border border-cyan/30"
                              : "bg-void/80 text-mist border border-edge hover:text-paper"
                          }`}
                        >
                          {m.billingMode !== "manual" ? "⚡ Auto-Billing" : "✋ Manual"}
                        </button>
                      </div>
                    </div>

                    {/* Metadata: Next Due & Last Invoiced Status */}
                    <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-edge/60 text-mist">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-cyan shrink-0" />
                        <span>Next Due: <strong className="text-paper">{m.nextDueDate || "N/A"}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText size={13} className="text-cyan shrink-0" />
                        <span>
                          {m.lastInvoicedDate ? (
                            <>Last Invoiced: <strong className="text-paper">{m.lastInvoicedDate}</strong></>
                          ) : (
                            "Not invoiced yet"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-edge/60 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* 1-Click Invoice Generation */}
                        {m.status === "active" && (
                          <button
                            type="button"
                            disabled={generatingMaintId === m.id}
                            onClick={() => handleGenerateSingleInvoice(m)}
                            className="px-3 py-1.5 rounded-xl bg-grad-primary text-void font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition shadow disabled:opacity-50 cursor-pointer"
                            title="Generate invoice immediately for this period"
                          >
                            <Zap size={12} />
                            <span>
                              {generatingMaintId === m.id ? "Generating..." : "Generate Invoice Now"}
                            </span>
                          </button>
                        )}

                        {m.lastInvoiceId && (
                          <Link
                            to={`/admin/invoices/${m.lastInvoiceId}`}
                            className="px-2.5 py-1.5 rounded-xl border border-edge bg-panel text-xs font-mono text-cyan hover:underline inline-flex items-center gap-1"
                          >
                            <span>Latest: {m.lastInvoiceNumber || "Invoice"}</span>
                            <ArrowUpRight size={11} />
                          </Link>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Change Plan Button */}
                        <button
                          type="button"
                          onClick={() => startEditMaint(m)}
                          className="px-3 py-1.5 rounded-xl border border-edge bg-panel hover:bg-white/10 hover:border-cyan/40 text-mist hover:text-cyan text-xs font-mono font-semibold transition inline-flex items-center gap-1 cursor-pointer"
                          title="Change maintenance amount, billing cycle or due date"
                        >
                          <Edit2 size={12} />
                          <span>Change Plan</span>
                        </button>

                        {/* Delete Plan */}
                        <button
                          type="button"
                          onClick={() => handleDeleteMaintenance(m.id)}
                          className="p-1.5 rounded-xl border border-edge bg-panel hover:bg-red-500/10 hover:border-red-500/30 text-mist hover:text-red-400 transition cursor-pointer"
                          title="Delete this maintenance plan"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        )}

        {/* REMINDERS CARD */}
        {(activeTab === "overview" || activeTab === "reminders") && (
          <div className={card}>
            <div className="flex items-center justify-between mb-4 border-b border-edge/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                  <Check size={16} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-paper">Reminders & Tasks</h2>
                  <p className="text-xs text-mist font-mono">Tasks, checklists & upcoming due dates</p>
                </div>
              </div>
            </div>

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
        )}

        {/* WELCOME NOTE / THANK YOU CARDS */}
        {(activeTab === "overview" || activeTab === "notes") && (
          <div className={card}>
            <div className="flex items-center justify-between mb-4 border-b border-edge/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                  <Send size={16} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-paper">Welcome Notes & Cards</h2>
                  <p className="text-xs text-mist font-mono">Client onboarding letters & thank-you notes</p>
                </div>
              </div>
            </div>

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
        )}

        {/* INVOICES & BILLING HISTORY CARD */}
        {(activeTab === "overview" || activeTab === "invoices") && (
          <div className={card}>
            <div className="flex items-center justify-between mb-4 border-b border-edge/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-paper">Invoices & Billing</h2>
                  <p className="text-xs text-mist font-mono">Invoice history and payment tracking</p>
                </div>
              </div>
              <Link
                to="/admin/invoices"
                className="text-xs font-mono text-cyan hover:underline inline-flex items-center gap-1"
              >
                <span>All Invoices</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {invoices.length === 0 ? (
                <p className="text-xs text-mist/60 italic py-3 text-center">No invoices issued for this client yet.</p>
              ) : (
                invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl border border-edge/60 bg-void/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-paper truncate">{inv.invoiceNumber || inv.id}</span>
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold border ${
                            inv.status?.toLowerCase() === "paid"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : inv.status?.toLowerCase().includes("partial")
                              ? "bg-cyan/10 border-cyan/30 text-cyan"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          }`}
                        >
                          {inv.status || "Pending"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-mist text-[11px] font-mono mt-0.5">
                        <span>{inv.issueDate || inv.date || (inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("en-IN") : "No date")}</span>
                        {inv.dueDate && <span>• due: {inv.dueDate}</span>}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-paper">
                        ₹{Number(inv.totalAmount ?? inv.amount ?? 0).toLocaleString("en-IN")}
                      </div>
                      {inv.status?.toLowerCase().includes("partial") && (
                        <div className="text-[10px] font-mono text-amber-400">
                          Due: ₹{Number(inv.balanceDue || 0).toLocaleString("en-IN")}
                        </div>
                      )}
                      <Link
                        to={`/admin/invoices/${inv.id}`}
                        className="text-[11px] font-mono text-cyan hover:underline inline-flex items-center gap-0.5 mt-0.5"
                      >
                        <span>View</span>
                        <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
