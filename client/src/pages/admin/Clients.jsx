import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { toast } from "sonner";
import { useConfirm } from "../../context/ConfirmContext.jsx";
import { Plus, Edit2, Trash2, ArrowUpRight, Search, X, Shield, Building, Mail, User } from "lucide-react";

export default function Clients() {
  const confirm = useConfirm();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function load() {
    api.get("/clients")
      .then((r) => setClients(r.data || []))
      .catch((err) => console.error("Failed to load clients", err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  // Lock scroll when modal is active
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

  const openAddModal = () => {
    setEditingClient(null);
    setForm({ name: "", email: "", company: "", password: "" });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (client, e) => {
    if (e) e.stopPropagation();
    setEditingClient(client);
    setForm({
      name: client.name || "",
      email: client.email || "",
      company: client.company || "",
      password: "",
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setForm({ name: "", email: "", company: "", password: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (editingClient) {
        // Update Client Info
        const payload = {
          name: form.name,
          email: form.email,
          company: form.company,
        };
        await api.put(`/clients/${editingClient.id}`, payload);
        toast.success(`Client ${form.name} updated successfully`);
      } else {
        // Create New Client
        await api.post("/clients", {
          name: form.name,
          email: form.email,
          company: form.company,
          password: form.password,
        });
        toast.success(`Client ${form.name} added successfully`);
      }
      closeModal();
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not save client.");
      toast.error(err.response?.data?.error || "Could not save client.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (client, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const ok = await confirm({
      title: "Delete Client Account",
      message: `Are you sure you want to permanently delete "${client.name}"? This removes their portal access and associated CRM profile.`,
      confirmText: "Delete Client",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await api.delete(`/clients/${client.id}`);
      toast.success(`Client ${client.name} deleted.`);
      load();
    } catch (err) {
      toast.error("Failed to delete client.");
    }
  };

  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.company || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER BAR WITH ADD CLIENT BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-paper">Clients</h1>
          <p className="text-mist text-xs sm:text-sm mt-0.5">
            Client accounts, portal logins, active maintenance care, and agreements.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition shadow-lg focus-ring w-fit shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Client</span>
        </button>
      </div>

      {/* SEARCH FILTER */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
          <input
            type="text"
            placeholder="Search by client name, email or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-panel/80 border border-edge pl-10 pr-4 py-2.5 text-xs sm:text-sm text-paper placeholder:text-mist/50 focus-ring outline-none transition"
          />
        </div>
        <div className="text-xs font-mono text-mist">
          Total: <span className="text-cyan font-semibold">{clients.length}</span>
        </div>
      </div>

      {/* CLIENTS LIST WITH SERIAL NUMBERS */}
      <div className="rounded-2xl border border-edge bg-panel/70 backdrop-blur-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8">
            <GearboxLoader label="Loading clients directory..." />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-mist text-sm">
              {search ? "No clients match your search query." : "No clients in directory yet."}
            </p>
            {!search && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 rounded-xl border border-cyan/40 bg-cyan/10 text-cyan text-xs font-semibold hover:bg-cyan/20 transition"
              >
                + Add your first client
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredClients.map((c, index) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-all group"
              >
                {/* Left: Serial Number Badge & Client Details */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                  {/* Serial Number Pill */}
                  <div className="w-8 h-8 rounded-xl bg-void/80 border border-edge flex items-center justify-center font-mono text-xs font-bold text-cyan shrink-0 shadow-inner group-hover:border-cyan/40 transition-colors">
                    {index + 1}
                  </div>

                  {/* Name, Company & Email */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/admin/clients/${c.id}`}
                        className="text-sm sm:text-base font-semibold text-paper hover:text-cyan transition-colors truncate"
                      >
                        {c.name}
                      </Link>
                      {c.company && (
                        <span className="text-xs font-mono text-mist bg-panel border border-edge px-2 py-0.5 rounded-md truncate">
                          {c.company}
                        </span>
                      )}
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                        Active
                      </span>
                    </div>

                    <p className="font-mono text-xs text-mist/80 truncate mt-0.5">
                      {c.email}
                    </p>
                  </div>
                </div>

                {/* Right: CRM Stats & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pl-11 sm:pl-0">
                  {/* Maintenance Plan Status */}
                  <div className="text-left sm:text-right font-mono text-xs">
                    {c.maintenancePlan ? (
                      <Link
                        to="/admin/maintenance"
                        title={
                          c.maintenancePlan.status === "paused"
                            ? "Plan is paused - click to manage in Maintenance section"
                            : "Plan is active - click to manage in Maintenance section"
                        }
                        className={`font-semibold border transition px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 ${
                          c.maintenancePlan.status === "paused"
                            ? "text-amber-400 bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/20"
                            : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/20"
                        }`}
                      >
                        {c.maintenancePlan.status === "paused" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                        <span>₹{c.maintenancePlan.amount}/{c.maintenancePlan.cycle}</span>
                        {c.maintenancePlan.status === "paused" && (
                          <span className="text-[9px] uppercase font-mono px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            paused
                          </span>
                        )}
                      </Link>
                    ) : (
                      <Link
                        to="/admin/maintenance"
                        title="Click to add a maintenance plan"
                        className="text-mist/70 bg-void/50 border border-edge hover:border-cyan/30 hover:text-cyan transition px-2 py-1 rounded-lg text-[11px] inline-block"
                      >
                        no plan
                      </Link>
                    )}

                    {c.openReminders > 0 && (
                      <span className="ml-2 text-cyan font-bold">
                        {c.openReminders} due
                      </span>
                    )}
                  </div>

                  {/* Quick Action Icons */}
                  <div className="flex items-center gap-1.5">
                    {/* Edit Client Button */}
                    <button
                      onClick={(e) => openEditModal(c, e)}
                      title="Edit Client Information"
                      className="p-2 rounded-lg border border-edge bg-panel hover:bg-white/10 hover:text-cyan text-mist transition"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* Delete Client Button */}
                    <button
                      onClick={(e) => handleDeleteClient(c, e)}
                      title="Delete Client Record"
                      className="p-2 rounded-lg border border-edge bg-panel hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-mist transition"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* View Details Link */}
                    <Link
                      to={`/admin/clients/${c.id}`}
                      title="Open Client Detail CRM"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-panel hover:bg-white/10 border border-edge text-xs font-mono text-paper hover:text-cyan transition"
                    >
                      <span>CRM</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPUP MODAL: ADD / EDIT CLIENT */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-void/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl bg-panel border border-edge border-t-2 border-t-cyan shadow-2xl p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top ambient glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-24 bg-cyan/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-edge/80 pb-4 mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center shrink-0">
                  {editingClient ? <Edit2 size={18} /> : <User size={18} />}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-paper">
                    {editingClient ? "Edit Client Details" : "Add New Client"}
                  </h3>
                  <p className="text-xs text-mist">
                    {editingClient
                      ? "Update client name, contact email, and organization details."
                      : "Create a new client profile and initial client portal access."}
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-mist hover:text-paper hover:bg-white/5 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mist mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl bg-void border border-edge pl-10 pr-4 py-2.5 text-sm text-paper focus-ring outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mist mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl bg-void border border-edge pl-10 pr-4 py-2.5 text-sm text-paper focus-ring outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mist mb-1.5">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. GoodFeel Wellness Ltd."
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full rounded-xl bg-void border border-edge pl-10 pr-4 py-2.5 text-sm text-paper focus-ring outline-none"
                  />
                </div>
              </div>

              {!editingClient && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-mist mb-1.5">
                    Portal Password *
                  </label>
                  <div className="relative">
                    <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
                    <input
                      required
                      type="password"
                      placeholder="Initial login password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full rounded-xl bg-void border border-edge pl-10 pr-4 py-2.5 text-sm text-paper focus-ring outline-none"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-edge/60 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-edge bg-panel hover:bg-white/5 text-sm text-mist hover:text-paper font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition shadow-lg disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingClient
                    ? "Update Client"
                    : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
