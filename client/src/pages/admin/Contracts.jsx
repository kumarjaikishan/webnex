import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../api/client.js";
import DocumentCard from "../../components/DocumentCard.jsx";

const DEFAULT_AGREEMENT_TERMS = `# SOFTWARE DEVELOPMENT AND MAINTENANCE AGREEMENT

## 1. Parties
Client Name: [Client Name]
Client Contact: [Client Email]

Developer: Webnex Labs (Digital Studio & Engineering Solutions)
Contact Email: hello@webnexlabs.com

Collectively referred to as "the Parties."

---

## 2. Purpose
The Developer has developed and agrees to maintain a custom web-based software application for the Client.

The software consists of the following integrated modules:
1. MLM Product Sales & Commission Management
2. Land/Plot Sales with Down Payment & EMI Management
3. Investment Management with Daily/Monthly Accrual System
4. Referral & Commission Distribution
5. Admin Dashboard
6. Customer Dashboard
7. Reports and Analytics
8. User & Role Management
9. Wallet/Ledger System

---

## 3. Development Charges
Total Development Cost: ₹60,000/- (Rupees Sixty Thousand Only).
- Development Fee Paid: As agreed per invoice schedules.
- Balance Amount: Payable upon delivery/milestone completion.

---

## 4. Monthly Maintenance Charges
- Monthly Fee: ₹4,500/- per month
- Payment Due: Payable on or before the 5th day of every month.

---

## 5. Maintenance Includes
* Bug fixing & minor software corrections
* Security updates & framework patching
* Database optimization & backup guidance support
* Technical support during standard business hours
* System performance & uptime monitoring

---

## 6. Maintenance Does NOT Include (Charged Separately)
* New modules & new custom business logic
* Complete UI redesigns & native mobile apps
* Payment gateway/SMS/WhatsApp 3rd party API fees

---

## 7. Client Responsibilities
The Client shall provide server/domain credentials, business rules, and timely approvals.
Client bears costs for: Hosting, Domain registration, SMS gateways, and third-party APIs.

---

## 8. Source Code & Ownership
Upon payment of complete development charges, the Client owns the application data and holds a perpetual operational license for the code.

---

## 9. Confidentiality
All Client financial, commission, and user data shall remain strictly confidential and will not be disclosed to third parties.

---

## 10. Service SLA Response Times
- Critical Issue: Within 24 hours
- Medium Priority Issue: Within 2 business days
- Minor Issue: Within 5 business days

---

## 11. Termination
Either party may terminate the monthly maintenance agreement by giving 30 days' written notice.

---

## 12. Limitation of Liability & Disputes
Developer shall not be liable for third-party hosting outages or unauthorized external modifications.

---

## Signatures

Client Signature: _______________________      Date: _________

Developer Signature (Webnex Labs): _________________ Date: _________

Witness 1: ____________________________      Witness 2: ____________________________`;

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeContract, setActiveContract] = useState(null);
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
    if (showModal || activeContract || editingContract) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, activeContract, editingContract]);

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
        <p className="text-mist">Loading agreements...</p>
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
                    onClick={() => setActiveContract({ ...c, clientName: client?.name, clientEmail: client?.email })}
                    className="px-3 py-1.5 rounded-lg border border-edge text-xs hover:bg-white/5 transition font-semibold"
                  >
                    View & Print Agreement
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

      {/* VIEW & PRINT DETAILED AGREEMENT MODAL */}
      {activeContract && createPortal(
        <div className="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 m-0 top-0 left-0 right-0 bottom-0 printable-modal-portal">
          <div className="max-w-3xl w-full">
            <DocumentCard
              docType="AGREEMENT"
              docNumber={`AGR-${activeContract.id.slice(0, 6)}`}
              date={new Date().toISOString().split("T")[0]}
              secondaryDate={`₹${activeContract.amount?.toLocaleString()}`}
              secondaryDateLabel="Dev Cost"
              clientName={activeContract.clientName || "Client"}
              clientEmail={activeContract.clientEmail || "client@domain.com"}
              projectTitle={activeContract.title}
              status={activeContract.status?.toUpperCase()}
              onPrint={() => window.print()}
              onClose={() => setActiveContract(null)}
              notes="Legally binding Software Development & Maintenance Agreement executed via Webnex Labs CRM."
            >
              <div className="bg-void p-5 rounded-xl border border-edge font-mono text-xs text-paper whitespace-pre-wrap leading-relaxed shadow-inner max-h-[60vh] overflow-y-auto printable-agreement-text">
                {activeContract.terms || activeContract.scope || DEFAULT_AGREEMENT_TERMS}
              </div>
            </DocumentCard>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
