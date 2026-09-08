import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { toast } from "react-toastify";

const NOTE_TYPES = [
  { value: "all", label: "All Notes & Cards" },
  { value: "thank_you", label: "Thank You Note", badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10", icon: "✨" },
  { value: "holiday", label: "Holiday / Festive Greeting", badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10", icon: "🎉" },
  { value: "milestone", label: "Milestone Update", badgeColor: "border-cyan/30 text-cyan bg-cyan/10", icon: "🚀" },
  { value: "welcome", label: "Welcome Note", badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10", icon: "💌" },
  { value: "general", label: "General Courtesy Card", badgeColor: "border-white/20 text-mist bg-white/5", icon: "📝" },
];

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState("");
  const [type, setType] = useState("thank_you");
  const [customTitle, setCustomTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
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

  const fetchData = async () => {
    try {
      const [nRes, cRes] = await Promise.all([
        api.get("/notes"),
        api.get("/clients"),
      ]);
      setNotes(nRes.data || []);
      setClients(cRes.data || []);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  const openNewNoteModal = () => {
    const defaultClient = clients[0]?.id || "";
    setClientId(defaultClient);
    setType("thank_you");
    setCustomTitle("");
    
    const cl = clients.find((c) => c.id === defaultClient);
    const clientName = cl?.name || "Client";
    setMessage(
      `Dear ${clientName},\n\nThank you for partnering with Webnex Labs! We truly appreciate your collaboration and look forward to delivering exceptional digital results for your project.\n\nWarm regards,\nJai Kishan Kumar — Webnex Labs`
    );
    setShowModal(true);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    const cl = clients.find((c) => c.id === clientId);
    const clientName = cl?.name || "Client";

    if (newType === "thank_you") {
      setMessage(
        `Dear ${clientName},\n\nThank you for partnering with Webnex Labs! We truly appreciate your collaboration and look forward to delivering exceptional digital results.\n\nWarm regards,\nJai Kishan Kumar — Webnex Labs`
      );
    } else if (newType === "holiday") {
      setMessage(
        `Dear ${clientName},\n\nWishing you and your team a wonderful festive season filled with joy and success! Thank you for being a valued client of Webnex Labs.\n\nWarm regards,\nJai Kishan Kumar — Webnex Labs`
      );
    } else if (newType === "milestone") {
      setMessage(
        `Dear ${clientName},\n\nWe are excited to let you know that our latest development sprint milestone has been achieved. Check your client portal for live demo updates!\n\nBest regards,\nWebnex Labs Team`
      );
    } else if (newType === "general") {
      setMessage(
        `Dear ${clientName},\n\nJust checking in with a quick note from Webnex Labs regarding your active project sprint.\n\nBest regards,\nWebnex Labs`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error("Please enter a note message.");
    setSaving(true);
    try {
      const selectedClient = clients.find((c) => c.id === clientId);
      const payload = {
        clientId: clientId || "client-generic",
        clientName: selectedClient?.name || "Valued Client",
        clientEmail: selectedClient?.email || "",
        companyName: selectedClient?.company || "",
        type,
        customTitle: customTitle.trim() || undefined,
        message: message.trim(),
      };
      await api.post("/notes", payload);
      toast.success("✓ Note sent and logged!");
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to send note.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this note record?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note record deleted.");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete note.");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Filter notes
  const filtered = notes
    .filter((n) => {
      if (filterType !== "all") {
        if (filterType === "welcome") {
          return n.type === "welcome" || n.type === "welcome_note";
        }
        return n.type === filterType;
      }
      return true;
    })
    .filter((n) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const client = clients.find((c) => c.id === n.clientId);
      return (
        (client?.name && client.name.toLowerCase().includes(q)) ||
        (n.clientName && n.clientName.toLowerCase().includes(q)) ||
        (n.companyName && n.companyName.toLowerCase().includes(q)) ||
        (n.message && n.message.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => new Date(b.sentAt || 0) - new Date(a.sentAt || 0));

  const getTypeBadge = (noteType) => {
    const found = NOTE_TYPES.find((t) => t.value === noteType);
    if (found) {
      return (
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-mono uppercase flex items-center gap-1 ${found.badgeColor}`}>
          <span>{found.icon}</span>
          <span>{found.label}</span>
        </span>
      );
    }
    if (noteType === "welcome" || noteType === "welcome_note") {
      return (
        <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-purple-500/30 text-purple-400 bg-purple-500/10 font-mono uppercase flex items-center gap-1">
          <span>💌</span>
          <span>Welcome Letter</span>
        </span>
      );
    }
    return (
      <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-white/20 text-mist bg-white/5 font-mono uppercase">
        {noteType}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">Client Notes & Courtesy Cards</h1>
          <p className="text-mist text-sm">Log of greeting cards, thank you notes, and milestone courtesy messages sent to clients.</p>
        </div>
        <button
          onClick={openNewNoteModal}
          className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 transition focus-ring shadow"
        >
          + Send Note / Card
        </button>
      </div>

      {/* Controls: Search & Category Filter Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          {NOTE_TYPES.map((t) => {
            const active = filterType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setFilterType(t.value)}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition font-mono ${
                  active
                    ? "bg-cyan/15 border-cyan/40 text-cyan font-bold"
                    : "bg-panel border-edge text-mist hover:text-paper hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search notes or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-3.5 py-1.5 text-xs bg-panel border border-edge rounded-xl text-paper placeholder-mist focus:outline-none focus:border-cyan transition font-mono"
          />
        </div>
      </div>

      {/* Main Grid / Feed of Notes */}
      {loading ? (
        <GearboxLoader label="Loading notes & cards..." />
      ) : filtered.length === 0 ? (
        <div className="bg-panel border border-edge rounded-2xl p-12 text-center space-y-4">
          <div className="text-3xl">💌</div>
          <p className="text-mist text-sm">No notes or courtesy cards found.</p>
          <button
            onClick={openNewNoteModal}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm"
          >
            Create First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((n) => {
            const client = clients.find((c) => c.id === n.clientId);
            const isWelcome = n.type === "welcome" || n.type === "welcome_note";
            const dateStr = n.sentAt ? new Date(n.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";

            return (
              <div
                key={n.id}
                className="bg-panel border border-edge rounded-2xl p-5 flex flex-col justify-between hover:border-edge/90 transition shadow-sm group relative"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-paper text-base flex items-center gap-2">
                        <span>{n.clientName || client?.name || "Client Note"}</span>
                        {n.companyName && (
                          <span className="text-xs font-normal text-mist">({n.companyName})</span>
                        )}
                      </h3>
                      <p className="text-xs text-mist font-mono mt-0.5">Sent on {dateStr}</p>
                    </div>
                    {getTypeBadge(n.type)}
                  </div>

                  {/* Message Content with preserved formatting */}
                  <div className="bg-void/40 border border-white/5 rounded-xl p-3.5 mb-4 text-xs sm:text-sm text-paper/85 whitespace-pre-wrap font-sans leading-relaxed max-h-44 overflow-y-auto scrollbar-thin">
                    {n.message}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-edge/60 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(n.message)}
                      className="px-2.5 py-1 rounded-lg border border-edge text-mist hover:text-paper hover:bg-white/5 transition font-mono flex items-center gap-1"
                      title="Copy note message"
                    >
                      <span>📋</span>
                      <span>Copy</span>
                    </button>

                    {isWelcome && (
                      <button
                        onClick={() => navigate(`/admin/welcome-notes/${n.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition font-mono flex items-center gap-1"
                      >
                        <span>📄</span>
                        <span>Full Document</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-mist hover:text-rose-400 transition p-1 text-xs"
                    title="Delete Note"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: SEND NOTE / CARD */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg bg-panel border border-edge rounded-2xl shadow-2xl p-6 space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-edge pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💌</span>
                  <h2 className="font-display font-bold text-lg text-paper">Send Note / Courtesy Card</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-mist hover:text-paper p-1 rounded-lg hover:bg-white/5 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-mist mb-1">Select Client</label>
                  <select
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      const cl = clients.find((c) => c.id === e.target.value);
                      if (cl) {
                        handleTypeChange(type);
                      }
                    }}
                    className="w-full bg-void/60 border border-edge rounded-xl px-3.5 py-2 text-sm text-paper focus:outline-none focus:border-cyan transition"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-panel text-paper">
                        {c.name} {c.company ? `(${c.company})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-mist mb-1">Card / Note Type</label>
                  <select
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full bg-void/60 border border-edge rounded-xl px-3.5 py-2 text-sm text-paper focus:outline-none focus:border-cyan transition"
                  >
                    <option value="thank_you" className="bg-panel">✨ Thank You Note</option>
                    <option value="holiday" className="bg-panel">🎉 Holiday / Festive Greeting</option>
                    <option value="milestone" className="bg-panel">🚀 Milestone Update</option>
                    <option value="general" className="bg-panel">📝 General Courtesy Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-mist mb-1">Message Body</label>
                  <textarea
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your note or greeting here..."
                    className="w-full bg-void/60 border border-edge rounded-xl p-3.5 text-sm text-paper placeholder-mist/50 focus:outline-none focus:border-cyan transition leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-edge">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-edge text-sm text-mist hover:text-paper hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 transition shadow disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Send Note & Log"}
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
