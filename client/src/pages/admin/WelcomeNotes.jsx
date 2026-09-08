import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { toast } from "react-toastify";

export default function WelcomeNotes() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [welcomeNotes, setWelcomeNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Form Fields
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [kickoffDate, setKickoffDate] = useState(new Date().toISOString().split("T")[0]);
  const [portalUrl, setPortalUrl] = useState("https://webnex.battlefiesta.in/login");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cRes, nRes] = await Promise.all([api.get("/clients"), api.get("/notes")]);
      setClients(cRes.data || []);
      const welcomes = (nRes.data || []).filter((n) => n.type === "welcome" || n.type === "welcome_note");
      setWelcomeNotes(welcomes);
    } catch (err) {
      console.error("Failed to load welcome notes data", err);
    } finally {
      setLoading(false);
    }
  };

  const generateWelcomeText = (clName, compName, prjTitle, kickDate, pUrl) => {
    const cName = clName || "[Client Name]";
    const cpName = compName || "[Company Name]";
    const pTitle = prjTitle || "[Project Title]";
    const kDate = kickDate || "[Date]";
    const portal = pUrl || "https://webnex.battlefiesta.in/login";

    return `Dear ${cName},

Welcome to Webnex Labs! We are thrilled to partner with ${cpName} for the upcoming "${pTitle}" development.

Here is a quick summary of what to expect during our onboarding:

1. Kickoff Date: ${kDate}
2. Client Workspace Portal: ${portal}
3. Deliverables & Milestones: Highlighting weekly progress demos and transparent updates.

Your dedicated development sprint is preparing the initial staging environment. Please log into your Client Portal to review the initial scope documents and milestone invoices.

If you have any questions before our kickoff call, feel free to reply directly to this note or contact hello@webnexlabs.in.

Warm regards,
Jai Kishan Kumar
Founder & Lead Developer — Webnex Labs
Web & Digital Solutions`;
  };

  const handleClientSelect = (id) => {
    setClientId(id);
    const cl = clients.find((c) => c.id === id);
    if (cl) {
      const cName = cl.name || "";
      const cEmail = cl.email || "";
      const compName = cl.company || cl.name || "";
      const pTitle = cl.projectTitle || "Custom Web Application";
      setClientName(cName);
      setClientEmail(cEmail);
      setCompanyName(compName);
      setProjectTitle(pTitle);
      setMessage(generateWelcomeText(cName, compName, pTitle, kickoffDate, portalUrl));
    }
  };

  const openCreateModal = () => {
    setClientId(clients[0]?.id || "");
    const initialClient = clients[0];
    const cName = initialClient?.name || "Alex Rivers";
    const cEmail = initialClient?.email || "alex@acmestudio.com";
    const compName = initialClient?.company || "Acme Studio";
    const pTitle = initialClient?.projectTitle || "E-commerce Storefront & Mobile API";
    const kDate = new Date().toISOString().split("T")[0];
    const pUrl = "https://webnex.battlefiesta.in/login";

    setClientName(cName);
    setClientEmail(cEmail);
    setCompanyName(compName);
    setProjectTitle(pTitle);
    setKickoffDate(kDate);
    setPortalUrl(pUrl);
    setMessage(generateWelcomeText(cName, compName, pTitle, kDate, pUrl));
    setShowCreateModal(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setClientId(note.clientId || "");
    setClientName(note.clientName || "");
    setClientEmail(note.clientEmail || "");
    setCompanyName(note.companyName || "");
    setProjectTitle(note.projectTitle || "");
    setKickoffDate(note.kickoffDate || note.sentAt?.split("T")[0] || new Date().toISOString().split("T")[0]);
    setPortalUrl(note.portalUrl || "https://webnex.battlefiesta.in/login");
    setMessage(note.message || "");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        clientId: clientId || "client-generic",
        clientName,
        clientEmail,
        companyName,
        projectTitle,
        kickoffDate,
        portalUrl,
        type: "welcome",
        message,
      };
      const res = await api.post("/notes", payload);
      toast.success("✓ Welcome letter created!");
      setShowCreateModal(false);
      fetchData();
      if (res.data?.id) {
        navigate(`/admin/welcome-notes/${res.data.id}`);
      }
    } catch (err) {
      toast.error("Failed to create welcome letter.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingNote) return;
    setSaving(true);
    try {
      const payload = {
        clientId: clientId || "client-generic",
        clientName,
        clientEmail,
        companyName,
        projectTitle,
        kickoffDate,
        portalUrl,
        type: "welcome",
        message,
      };
      await api.put(`/notes/${editingNote.id}`, payload);
      toast.success("✓ Welcome letter updated!");
      setEditingNote(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update welcome letter.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this welcome note record?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Welcome note deleted.");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete welcome note.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar (Identical to Agreements & Invoices) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">Client Welcome Letters & Notes</h1>
          <p className="text-mist text-sm">Issue and manage official Webnex onboarding letters and welcome cards.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 transition focus-ring shadow"
        >
          + Draft Welcome Letter
        </button>
      </div>

      {/* Main List of Welcome Letters */}
      {loading ? (
        <GearboxLoader label="Loading welcome letters..." />
      ) : welcomeNotes.length === 0 ? (
        <div className="bg-panel border border-edge rounded-2xl p-12 text-center space-y-4">
          <p className="text-mist">No welcome letters created yet.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm"
          >
            Draft Welcome Letter
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {welcomeNotes.map((n) => {
            const clientObj = clients.find((c) => c.id === n.clientId);
            return (
              <div
                key={n.id}
                className="bg-panel border border-edge rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-edge/80 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-paper text-base">
                      {n.clientName || clientObj?.name || "Client Welcome Note"}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono uppercase">
                      ONBOARDING ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-mist font-mono">
                    Company: <span className="text-paper">{n.companyName || clientObj?.company || "Studio"}</span> • Project: <span className="text-cyan">{n.projectTitle || "Development"}</span> • Date: <span className="text-paper">{n.sentAt?.split("T")[0]}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => navigate(`/admin/welcome-notes/${n.id}`)}
                    className="px-3 py-1.5 rounded-lg border border-edge text-xs hover:bg-white/5 transition font-semibold text-paper"
                  >
                    View Welcome Page
                  </button>

                  <button
                    onClick={() => openEditModal(n)}
                    className="px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan border border-cyan/30 text-xs hover:bg-cyan/20 transition font-semibold flex items-center gap-1"
                  >
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-mist hover:text-rose-400 text-xs px-1 transition"
                    title="Delete record"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE WELCOME LETTER MODAL */}
      {showCreateModal &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-panel border border-edge rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-edge pb-3">
                <h2 className="font-display text-lg font-bold text-paper">Draft Client Welcome Letter</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-mist hover:text-paper text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Select Client (Autofill)</label>
                  <select
                    value={clientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                  >
                    <option value="">Select client...</option>
                    {clients.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.name} ({cl.company || cl.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Client Contact Name</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        setMessage(generateWelcomeText(e.target.value, companyName, projectTitle, kickoffDate, portalUrl));
                      }}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Client Email</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        setMessage(generateWelcomeText(clientName, e.target.value, projectTitle, kickoffDate, portalUrl));
                      }}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Project Name</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => {
                        setProjectTitle(e.target.value);
                        setMessage(generateWelcomeText(clientName, companyName, e.target.value, kickoffDate, portalUrl));
                      }}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Kickoff Date</label>
                    <input
                      type="date"
                      value={kickoffDate}
                      onChange={(e) => {
                        setKickoffDate(e.target.value);
                        setMessage(generateWelcomeText(clientName, companyName, projectTitle, e.target.value, portalUrl));
                      }}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Portal Login Link</label>
                    <input
                      type="text"
                      value={portalUrl}
                      onChange={(e) => {
                        setPortalUrl(e.target.value);
                        setMessage(generateWelcomeText(clientName, companyName, projectTitle, kickoffDate, e.target.value));
                      }}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Letter Content & Clauses</label>
                  <textarea
                    rows={8}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none text-paper leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-edge">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-mist hover:text-paper"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs hover:brightness-110 disabled:opacity-50"
                  >
                    {saving ? "Creating..." : "Save & Open Page"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* EDIT WELCOME LETTER MODAL */}
      {editingNote &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-panel border border-edge rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-edge pb-3">
                <h2 className="font-display text-lg font-bold text-paper">Edit Welcome Letter</h2>
                <button
                  onClick={() => setEditingNote(null)}
                  className="text-mist hover:text-paper text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Assigned Client</label>
                  <select
                    value={clientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                  >
                    <option value="">Select client...</option>
                    {clients.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.name} ({cl.company || cl.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Client Contact Name</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Client Email</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Project Name</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Kickoff Date</label>
                    <input
                      type="date"
                      value={kickoffDate}
                      onChange={(e) => setKickoffDate(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-mist uppercase mb-1">Portal Login Link</label>
                    <input
                      type="text"
                      value={portalUrl}
                      onChange={(e) => setPortalUrl(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Letter Content & Clauses</label>
                  <textarea
                    rows={8}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs font-mono focus-ring outline-none text-paper leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-edge">
                  <button
                    type="button"
                    onClick={() => setEditingNote(null)}
                    className="px-4 py-2 rounded-xl text-xs text-mist hover:text-paper"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs hover:brightness-110 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
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
