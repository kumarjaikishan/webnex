import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Calendar, Building, UserPlus } from "lucide-react";
import api from "../../api/client.js";
import { toast } from "sonner";
import InvoiceFormLineItems from "./InvoiceFormLineItems.jsx";
import InvoiceFormPaymentSection from "./InvoiceFormPaymentSection.jsx";

const DEFAULT_INVOICE_NOTES = `Thank you for partnering with Webnex Labs!
Payment is due within 14 days via Bank Transfer or UPI.
Please share payment confirmation / UTR reference after settlement.`;

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  onInvoiceCreated,
  editingInvoice = null,
  defaultPaymentDetails = {},
}) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [clients, setClients] = useState([]);
  const [clientMode, setClientMode] = useState("saved"); // "saved" | "custom"
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [issueDate, setIssueDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [notes, setNotes] = useState(DEFAULT_INVOICE_NOTES);
  const [items, setItems] = useState([
    {
      description: "Custom Web Application & UI/UX Development",
      subDescription: "Bespoke software engineering & digital implementation",
      quantity: 1,
      price: 1500,
    },
  ]);

  // Payment Details
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const issueDateInputRef = useRef(null);
  const dueDateInputRef = useRef(null);

  // Load clients when modal opens
  useEffect(() => {
    if (isOpen) {
      api
        .get("/clients")
        .then((res) => {
          setClients(res.data || []);
        })
        .catch((err) => console.error("Failed to load clients in invoice modal", err));
    }
  }, [isOpen]);

  // Sync defaults or editing invoice data
  useEffect(() => {
    if (editingInvoice) {
      setClientName(editingInvoice.clientName || "");
      setClientEmail(editingInvoice.clientEmail || "");
      setClientCompany(editingInvoice.clientCompany || "");
      if (editingInvoice.clientId) {
        setClientMode("saved");
        setSelectedClientId(editingInvoice.clientId);
      } else {
        setClientMode("custom");
        setSelectedClientId("");
      }
      setProjectTitle(editingInvoice.projectTitle || "");
      setIssueDate(editingInvoice.issueDate || todayStr);
      setDueDate(editingInvoice.dueDate || "");
      setTaxPercent(editingInvoice.taxPercent || 0);
      setNotes(editingInvoice.notes || DEFAULT_INVOICE_NOTES);
      setItems(
        editingInvoice.items?.length
          ? editingInvoice.items.map((it) => ({
              ...it,
              subDescription:
                it.subDescription !== undefined
                  ? it.subDescription
                  : it.subtitle !== undefined
                  ? it.subtitle
                  : "Bespoke software engineering & digital implementation",
            }))
          : [
              {
                description: "Custom Web Application & UI/UX Development",
                subDescription: "Bespoke software engineering & digital implementation",
                quantity: 1,
                price: 1500,
              },
            ]
      );
      if (editingInvoice.paymentDetails) {
        setShowPaymentDetails(true);
        setBeneficiaryName(editingInvoice.paymentDetails.beneficiaryName || "");
        setUpiId(editingInvoice.paymentDetails.upiId || "");
        setBankName(editingInvoice.paymentDetails.bankName || "");
        setAccountNumber(editingInvoice.paymentDetails.accountNumber || "");
        setIfscCode(editingInvoice.paymentDetails.ifscCode || "");
      } else {
        setShowPaymentDetails(false);
      }
    } else if (isOpen) {
      resetForm();
      if (defaultPaymentDetails) {
        if (defaultPaymentDetails.beneficiaryName) setBeneficiaryName(defaultPaymentDetails.beneficiaryName);
        if (defaultPaymentDetails.upiId) setUpiId(defaultPaymentDetails.upiId);
        if (defaultPaymentDetails.bankName) setBankName(defaultPaymentDetails.bankName);
        if (defaultPaymentDetails.accountNumber) setAccountNumber(defaultPaymentDetails.accountNumber);
        if (defaultPaymentDetails.ifscCode) setIfscCode(defaultPaymentDetails.ifscCode);
      }
    }
  }, [editingInvoice, isOpen, defaultPaymentDetails]);

  // Handle line items
  function handleAddItem() {
    setItems([...items, { description: "", subDescription: "", quantity: 1, price: 0 }]);
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

  function resetForm() {
    setClientMode("saved");
    setSelectedClientId("");
    setClientCompany("");
    setClientName("");
    setClientEmail("");
    setProjectTitle("");
    setIssueDate(todayStr);
    setTaxPercent(0);
    setDueDate("");
    setNotes(DEFAULT_INVOICE_NOTES);
    setItems([
      {
        description: "Custom Web Application & UI/UX Development",
        subDescription: "Bespoke software engineering & digital implementation",
        quantity: 1,
        price: 1500,
      },
    ]);
  }

  function handleSelectSavedClient(clientId) {
    setSelectedClientId(clientId);
    if (!clientId) {
      setClientName("");
      setClientEmail("");
      setClientCompany("");
      return;
    }
    const found = clients.find((c) => String(c.id) === String(clientId));
    if (found) {
      setClientName(found.name || "");
      setClientEmail(found.email || "");
      setClientCompany(found.company || "");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const itemList = Array.isArray(items) ? items : [];
      const subtotal = itemList.reduce(
        (sum, item) => sum + (Number(item.amount) || Number(item.quantity || 1) * Number(item.price || 0)),
        0
      );
      const taxRate = Number(taxPercent) || 0;
      const totalAmount = subtotal + subtotal * (taxRate / 100);

      const payload = {
        clientId: clientMode === "saved" && selectedClientId ? selectedClientId : null,
        clientCompany: clientCompany || "",
        clientName,
        clientEmail,
        projectTitle,
        items: itemList,
        subtotal,
        totalAmount,
        taxPercent: taxRate,
        issueDate: issueDate || todayStr,
        dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        notes,
        paymentDetails: showPaymentDetails
          ? {
              beneficiaryName: beneficiaryName || defaultPaymentDetails.beneficiaryName || "Jai Kishan Kumar (Webnex Labs)",
              upiId: upiId || defaultPaymentDetails.upiId || "8210539367@jio",
              bankName: bankName || defaultPaymentDetails.bankName || "Jio Payment Bank",
              accountNumber: accountNumber || defaultPaymentDetails.accountNumber || "8210539367",
              ifscCode: (ifscCode || defaultPaymentDetails.ifscCode || "JIOP0000001").trim().toUpperCase(),
            }
          : null,
      };

      if (editingInvoice) {
        await api.put(`/invoices/${editingInvoice.id}`, payload);
        toast.success("Invoice updated successfully!");
      } else {
        await api.post("/invoices", payload);
        toast.success("Invoice generated successfully!");
      }

      resetForm();
      onClose();
      if (onInvoiceCreated) onInvoiceCreated();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save invoice");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-void/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl bg-panel border border-edge border-t-2 border-t-cyan shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-edge/80 pb-3">
          <h2 className="font-display text-xl font-bold text-paper">
            {editingInvoice ? `Edit Invoice (${editingInvoice.invoiceNumber})` : "Generate Webnex Labs Invoice"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-mist hover:text-paper hover:bg-white/5 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CLIENT SELECTION: SAVED CLIENT VS NEW / CUSTOM ENTRY */}
          <div className="bg-void/40 border border-edge/70 rounded-xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-edge/60 pb-2.5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-mist">
                Client Information
              </span>

              {/* Segmented Toggle: Saved vs Custom */}
              <div className="flex items-center gap-1 bg-void p-1 rounded-xl border border-edge/80">
                <button
                  type="button"
                  onClick={() => {
                    setClientMode("saved");
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    clientMode === "saved"
                      ? "bg-cyan/20 text-cyan border border-cyan/40 shadow-sm"
                      : "text-mist hover:text-paper"
                  }`}
                >
                  <Building size={12} />
                  <span>Saved Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClientMode("custom");
                    setSelectedClientId("");
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    clientMode === "custom"
                      ? "bg-cyan/20 text-cyan border border-cyan/40 shadow-sm"
                      : "text-mist hover:text-paper"
                  }`}
                >
                  <UserPlus size={12} />
                  <span>+ New / Custom Entry</span>
                </button>
              </div>
            </div>

            {clientMode === "saved" ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-mist uppercase mb-1">
                    Choose from Saved Clients *
                  </label>
                  <div className="relative">
                    <Building size={14} className="absolute left-3.5 top-3 text-cyan pointer-events-none" />
                    <select
                      value={selectedClientId}
                      onChange={(e) => handleSelectSavedClient(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge pl-9 pr-3 py-2 text-sm text-paper focus-ring outline-none transition cursor-pointer"
                    >
                      <option value="">-- Select Saved Client --</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.company ? `(${c.company})` : ""} — {c.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  {clients.length === 0 && (
                    <p className="text-[10px] text-mist/60 font-mono mt-1">
                      No saved clients found. Switch to "+ New / Custom Entry" above.
                    </p>
                  )}
                </div>

                {/* Auto-populated, yet editable client name & email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-mist uppercase mb-1">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Client Name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-mist uppercase mb-1">Client Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="client@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-mist uppercase mb-1">New Client / Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp / John Doe"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-mist uppercase mb-1">Client Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="client@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-mist/60 font-mono">
                  Enter new or one-off client details directly without needing to save them in CRM beforehand.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-mist uppercase mb-1">Project Title</label>
              <input
                type="text"
                placeholder="Full-Stack Web App Rebuild"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1 flex items-center justify-between">
                  <span>Invoice Date</span>
                  <span className="text-[10px] text-cyan normal-case font-mono">Today</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    ref={issueDateInputRef}
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="date-input-custom w-full rounded-xl bg-void border border-edge pl-3 pr-9 py-2 text-xs focus-ring outline-none text-paper font-mono [color-scheme:dark]"
                  />
                  <button
                    type="button"
                    onClick={() => issueDateInputRef.current?.showPicker ? issueDateInputRef.current.showPicker() : issueDateInputRef.current?.focus()}
                    className="absolute right-2.5 p-1 text-mist hover:text-cyan transition-colors rounded-lg cursor-pointer"
                    title="Choose from calendar"
                    tabIndex={-1}
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Due Date</label>
                <div className="relative flex items-center">
                  <input
                    ref={dueDateInputRef}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="date-input-custom w-full rounded-xl bg-void border border-edge pl-3 pr-9 py-2 text-xs focus-ring outline-none text-paper font-mono [color-scheme:dark]"
                  />
                  <button
                    type="button"
                    onClick={() => dueDateInputRef.current?.showPicker ? dueDateInputRef.current.showPicker() : dueDateInputRef.current?.focus()}
                    className="absolute right-2.5 p-1 text-mist hover:text-cyan transition-colors rounded-lg cursor-pointer"
                    title="Choose from calendar"
                    tabIndex={-1}
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Line items & Tax section */}
          <InvoiceFormLineItems
            items={items}
            onAddItem={handleAddItem}
            onItemChange={handleItemChange}
            onRemoveItem={handleRemoveItem}
            taxPercent={taxPercent}
            setTaxPercent={setTaxPercent}
            totalAmount={calculateTotal()}
          />

          {/* Bank & UPI Section */}
          <InvoiceFormPaymentSection
            showPaymentDetails={showPaymentDetails}
            setShowPaymentDetails={setShowPaymentDetails}
            upiId={upiId}
            setUpiId={setUpiId}
            beneficiaryName={beneficiaryName}
            setBeneficiaryName={setBeneficiaryName}
            bankName={bankName}
            setBankName={setBankName}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            ifscCode={ifscCode}
            setIfscCode={setIfscCode}
          />

          <div>
            <label className="block text-xs font-mono text-mist uppercase mb-1">Notes / Terms</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs focus-ring outline-none text-paper leading-relaxed resize-y min-h-[90px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-edge">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-mist hover:text-paper"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-grad-primary text-void font-semibold text-xs hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingInvoice ? "Update Invoice" : "Generate Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
