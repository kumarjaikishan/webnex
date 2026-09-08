import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";

const DEFAULT_AGREEMENT_TERMS = `# SOFTWARE DEVELOPMENT AND MAINTENANCE AGREEMENT

## 1. Parties
Client Name: [Client Name]
Client Contact: [Client Email]

Developer / Studio: Webnex Labs (Represented by Jai Kishan Kumar, Lead Developer & Proprietor)
Contact Email: hello@webnexlabs.in
Website: https://webnexlabs.in

Collectively referred to as "the Parties."

---

## 2. Scope & Purpose
The Developer has architected, built, and agrees to maintain a custom web-based software application for the Client.

The software deliverables include:
1. Custom Frontend & Responsive UI/UX Interface
2. Backend API Architecture & Database Engineering
3. Authentication, Role-based Access & Security Controls
4. Third-party Integrations (Payment Gateway / SMS / Analytics)
5. Production Deployment, Domain Configuration & SSL Setup

---

## 3. Commercials & Milestones
- Total Development Fee: ₹60,000/- (Rupees Sixty Thousand Only)
- Payment Structure: Staged milestone schedule as per issued Webnex Labs invoices.
- Tax Status: GST Exempt (Under threshold limit).

---

## 4. Monthly Maintenance & Retainer (Optional/Post-Launch)
- Monthly Retainer Fee: ₹4,500/- per month
- Billing Cycle: Payable within 5 days of monthly invoice generation.
- Includes: Bug fixes, server uptime monitoring, security patching, and technical support.
- Excludes: Major new feature additions and separate standalone applications.

---

## 5. Intellectual Property & Code Ownership
Upon complete receipt of agreed development fees, the Client receives full perpetual ownership of application deliverables, data, and source code. Webnex Labs retains the right to display the completed work in its technical portfolio.

---

## 6. Confidentiality & Data Security
All Client proprietary logic, customer databases, and commercial data shall remain strictly confidential and protected under standard non-disclosure practices.

---

## 7. Governing Law & Dispute Resolution
This agreement is executed and governed under the laws of the Republic of India.

---

## Signatures & Execution

For Client:
Authorized Signature: _______________________      Date: _________
Name & Designation: [Client Name]

For Webnex Labs:
Authorized Signature: _______________________      Date: _________
Jai Kishan Kumar (Founder & Lead Developer, Webnex Labs)`;

export default function Contracts() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);

  // Create Form State
  const [title, setTitle] = useState("Software Development and Maintenance Agreement");
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState(60000);
  const [terms, setTerms] = useState(DEFAULT_AGREEMENT_TERMS);

  // Edit Form State
  const [editTitle, setEditTitle] = useState("");
  const [editClientId, setEditClientId] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editTerms, setEditTerms] = useState("");
  const [editStatus, setEditStatus] = useState("sent");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showModal || editingContract) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, editingContract]);

  async function fetchData() {
    try {
      const [cRes, clRes] = await Promise.all([
        api.get("/contracts"),
        api.get("/clients"),
      ]);
      setContracts(cRes.data || []);
      setClients(clRes.data || []);
    } catch (err) {
      console.error("Failed to load contracts or clients", err);
    } finally {
      setLoading(false);
    }
  }

  function handleClientSelect(id) {
    setClientId(id);
    const client = clients.find((c) => c.id === id);
    if (client) {
      const updatedTerms = DEFAULT_AGREEMENT_TERMS
        .replace("[Client Name]", client.name)
        .replace("[Client Email]", client.email);
      setTerms(updatedTerms);
    }
  }

  async function handleCreateAgreement(e) {
    e.preventDefault();
    try {
      await api.post("/contracts", {
        title,
        clientId,
        amount: Number(amount),
        terms,
        status: "sent",
      });
      setShowModal(false);
      setTitle("Software Development and Maintenance Agreement");
      setAmount(60000);
      setTerms(DEFAULT_AGREEMENT_TERMS);
      fetchData();
    } catch (err) {
      alert("Failed to create contract/agreement");
    }
  }

  function openEditModal(c) {
    setEditingContract(c);
    setEditTitle(c.title || "");
    setEditClientId(c.clientId || "");
    setEditAmount(c.amount || "");
    setEditTerms(c.terms || c.scope || DEFAULT_AGREEMENT_TERMS);
    setEditStatus(c.status || "sent");
  }

  async function handleUpdateAgreement(e) {
    e.preventDefault();
    if (!editingContract) return;
    try {
      await api.put(`/contracts/${editingContract.id}`, {
        title: editTitle,
        clientId: editClientId,
        amount: Number(editAmount),
        terms: editTerms,
        status: editStatus,
      });
      setEditingContract(null);
      fetchData();
    } catch (err) {
      alert("Failed to update agreement");
    }
  }

  async function updateStatus(c, status) {
    try {
      await api.put(`/contracts/${c.id}`, { status });
      setContracts((prev) => prev.map((x) => (x.id === c.id ? { ...x, status } : x)));
    } catch (err) {
      alert("Failed to update status");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this agreement?")) return;
    try {
      await api.delete(`/contracts/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete agreement");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Client Agreements & Contracts</h1>
          <p className="text-mist text-sm">Detailed Software Development & Maintenance Agreements with full terms.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 transition focus-ring"
        >
          + Draft Detailed Agreement
        </button>
      </div>

      {loading ? (
        <GearboxLoader label="Loading agreements..." />
      ) : contracts.length === 0 ? (
        <div className="bg-panel border border-edge rounded-2xl p-12 text-center">
          <p className="text-mist mb-4">No detailed agreements created yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm"
          >
            Draft Detailed Agreement
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {contracts.map((c) => {
            const client = clients.find((x) => x.id === c.clientId);
            return (
              <div
                key={c.id}
                className="bg-panel border border-edge rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-edge/80 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-paper text-base">{c.title}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-cyan/30 text-cyan bg-cyan/10 font-mono uppercase">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-mist">
                    Client: <span className="text-paper">{client ? `${client.name} (${client.company || client.email})` : "Unassigned Client"}</span> • Dev Cost: <span className="font-mono text-cyan">₹{c.amount?.toLocaleString()}</span> • Retainer: <span className="font-mono text-emerald-400">₹4,500/mo</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/admin/contracts/${c.id}`)}
                    className="px-3 py-1.5 rounded-lg border border-edge text-xs hover:bg-white/5 transition font-semibold text-paper"
                  >
                    View Agreement
                  </button>

                  <button
                    onClick={() => openEditModal(c)}
                    className="px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan border border-cyan/30 text-xs hover:bg-cyan/20 transition font-semibold"
                  >
                    ✏️ Edit
                  </button>

                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c, e.target.value)}
                    className="font-mono text-xs bg-void border border-edge rounded-lg px-3 py-1.5 focus-ring text-paper outline-none uppercase"
                  >
                    <option value="draft">draft</option>
                    <option value="sent">sent</option>
                    <option value="signed">signed</option>
                    <option value="active">active</option>
                  </select>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-mist hover:text-rose-400 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE DETAILED AGREEMENT MODAL */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 m-0 top-0 left-0 right-0 bottom-0">
          <div className="bg-panel border border-edge rounded-2xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-edge pb-3">
              <h2 className="font-display text-lg font-bold">Draft Software Development & Maintenance Agreement</h2>
              <button onClick={() => setShowModal(false)} className="text-mist hover:text-paper">✕</button>
            </div>

            <form onSubmit={handleCreateAgreement} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Agreement Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Select Client</label>
                  <select
                    required
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
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Total Development Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Full Detailed Agreement Terms & Clauses</label>
                <textarea
                  rows="14"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-4 py-3 text-xs font-mono focus-ring outline-none leading-relaxed text-paper"
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
                  Create Detailed Agreement
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* EDIT DETAILED AGREEMENT MODAL */}
      {editingContract && createPortal(
        <div className="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 m-0 top-0 left-0 right-0 bottom-0">
          <div className="bg-panel border border-edge rounded-2xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-edge pb-3">
              <h2 className="font-display text-lg font-bold">Edit Agreement Clauses & Terms</h2>
              <button onClick={() => setEditingContract(null)} className="text-mist hover:text-paper">✕</button>
            </div>

            <form onSubmit={handleUpdateAgreement} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Agreement Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Assigned Client</label>
                  <select
                    value={editClientId}
                    onChange={(e) => setEditClientId(e.target.value)}
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
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Development Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper uppercase"
                  >
                    <option value="draft">DRAFT</option>
                    <option value="sent">SENT</option>
                    <option value="signed">SIGNED</option>
                    <option value="active">ACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Detailed Agreement Terms & Clauses</label>
                <textarea
                  rows="14"
                  value={editTerms}
                  onChange={(e) => setEditTerms(e.target.value)}
                  className="w-full rounded-xl bg-void border border-edge px-4 py-3 text-xs font-mono focus-ring outline-none leading-relaxed text-paper"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setEditingContract(null)}
                  className="px-4 py-2 rounded-xl text-xs text-mist hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs hover:brightness-110"
                >
                  Save Changes
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
