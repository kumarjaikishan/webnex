import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../api/client.js";
import DocumentCard from "../../components/DocumentCard.jsx";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null); // For printable preview

  // Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("Thank you for partnering with Webnex Labs! Payment is due within 14 days.");
  const [items, setItems] = useState([
    { description: "Custom Web Application & UI/UX Development", quantity: 1, price: 1500 },
  ]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (showModal || activeInvoice) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, activeInvoice]);

  async function fetchInvoices() {
    try {
      const res = await api.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddItem() {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  }

  function handleItemChange(index, field, value) {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  }

  function handleRemoveItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + (Number(item.quantity || 1) * Number(item.price || 0)), 0);

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return sub + sub * (Number(taxPercent || 0) / 100);
  };

  async function handleCreateInvoice(e) {
    e.preventDefault();
    try {
      const payload = {
        clientName,
        clientEmail,
        projectTitle,
        items,
        taxPercent: Number(taxPercent),
        dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        notes,
      };
      await api.post("/invoices", payload);
      setShowModal(false);
      resetForm();
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to generate invoice");
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await api.put(`/invoices/${id}`, { status });
      fetchInvoices();
    } catch (err) {
      alert("Failed to update invoice status");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await api.delete(`/invoices/${id}`);
      fetchInvoices();
    } catch (err) {
      alert("Failed to delete invoice");
    }
  }

  function resetForm() {
    setClientName("");
    setClientEmail("");
    setProjectTitle("");
    setTaxPercent(0);
    setDueDate("");
    setItems([{ description: "Custom Web Application & UI/UX Development", quantity: 1, price: 1500 }]);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Overdue":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Invoice Generation & Management</h1>
          <p className="text-mist text-sm">Generate professional invoices for Webnex Labs clients with identical UI design.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 transition focus-ring"
        >
          + Generate New Invoice
        </button>
      </div>

      {loading ? (
        <p className="text-mist">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <div className="bg-panel border border-edge rounded-2xl p-12 text-center">
          <p className="text-mist mb-4">No invoices created yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm"
          >
            Create Your First Invoice
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-panel border border-edge rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-edge/80 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-cyan">{inv.invoiceNumber}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${getStatusColor(inv.status)}`}>
                    {inv.status}
                  </span>
                </div>
                <h3 className="font-medium text-paper">{inv.clientName} ({inv.clientEmail})</h3>
                <p className="text-xs text-mist">{inv.projectTitle} • Issued: {inv.issueDate} • Due: {inv.dueDate}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono text-lg font-bold text-paper">₹{inv.totalAmount?.toLocaleString()}</p>
                  <p className="text-xs text-mist">{inv.items?.length || 0} line item(s)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveInvoice(inv)}
                    className="px-3 py-1.5 rounded-lg border border-edge text-xs hover:bg-white/5 transition"
                  >
                    View / Print
                  </button>
                  {inv.status !== "Paid" && (
                    <button
                      onClick={() => handleStatusChange(inv.id, "Paid")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 transition"
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="p-1.5 text-mist hover:text-rose-400 text-xs transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE INVOICE MODAL VIA PORTAL */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 m-0 top-0 left-0 right-0 bottom-0">
          <div className="bg-panel border border-edge rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-edge pb-3">
              <h2 className="font-display text-xl font-bold">Generate Webnex Labs Invoice</h2>
              <button onClick={() => setShowModal(false)} className="text-mist hover:text-paper">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corp"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Client Email</label>
                  <input
                    type="email"
                    required
                    placeholder="client@acme.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Project Title</label>
                  <input
                    type="text"
                    placeholder="Full-Stack Web App Rebuild"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                  />
                </div>
              </div>

              {/* LINE ITEMS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan uppercase tracking-wider">Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-cyan hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-void/50 p-2.5 rounded-xl border border-edge">
                    <input
                      type="text"
                      placeholder="Item Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      className="flex-1 rounded-lg bg-void border border-edge px-3 py-1.5 text-xs focus-ring outline-none"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      className="w-16 rounded-lg bg-void border border-edge px-2 py-1.5 text-xs focus-ring outline-none text-center"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Price (₹)"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                      className="w-24 rounded-lg bg-void border border-edge px-2 py-1.5 text-xs focus-ring outline-none text-right"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-mist hover:text-rose-400 text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-mist uppercase mb-1">Tax (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none"
                  />
                </div>
                <div className="text-right flex flex-col justify-end">
                  <span className="text-xs text-mist">Total Amount</span>
                  <span className="font-mono text-xl font-bold text-cyan">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Notes / Terms</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* PRINTABLE INVOICE PREVIEW MODAL VIA PORTAL */}
      {activeInvoice && createPortal(
        <div className="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 m-0 top-0 left-0 right-0 bottom-0 printable-modal-portal">
          <div className="max-w-2xl w-full">
            <DocumentCard
              docType="INVOICE"
              docNumber={activeInvoice.invoiceNumber}
              date={activeInvoice.issueDate}
              secondaryDate={activeInvoice.dueDate}
              secondaryDateLabel="Due Date"
              clientName={activeInvoice.clientName}
              clientEmail={activeInvoice.clientEmail}
              projectTitle={activeInvoice.projectTitle}
              status={activeInvoice.status}
              notes={activeInvoice.notes}
              onPrint={() => window.print()}
              onClose={() => setActiveInvoice(null)}
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-edge font-mono text-mist">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge/50">
                  {(activeInvoice.items || []).map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 text-paper">{it.description}</td>
                      <td className="py-3 text-center">{it.quantity || 1}</td>
                      <td className="py-3 text-right">₹{Number(it.price || 0).toLocaleString()}</td>
                      <td className="py-3 text-right font-mono">₹{(Number(it.quantity || 1) * Number(it.price || 0)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end pt-4 border-t border-edge">
                <div className="w-48 space-y-1 text-right text-xs">
                  <div className="flex justify-between text-mist">
                    <span>Subtotal:</span>
                    <span>₹{activeInvoice.subtotal?.toLocaleString()}</span>
                  </div>
                  {activeInvoice.taxPercent > 0 && (
                    <div className="flex justify-between text-mist">
                      <span>Tax ({activeInvoice.taxPercent}%):</span>
                      <span>₹{(activeInvoice.subtotal * (activeInvoice.taxPercent / 100)).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-cyan pt-2 border-t border-edge font-mono">
                    <span>Total Due:</span>
                    <span>₹{activeInvoice.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </DocumentCard>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
