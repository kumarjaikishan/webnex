import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../../api/client.js";
import InvoiceFormLineItems from "./InvoiceFormLineItems.jsx";
import InvoiceFormPaymentSection from "./InvoiceFormPaymentSection.jsx";

const DEFAULT_INVOICE_NOTES = `Thank you for partnering with Webnex Labs!
Payment is due within 14 days.

--- PAYMENT DETAILS ---
Beneficiary Name: Jai Kishan Kumar (Proprietor, Webnex Labs)
Account Type: Savings / Direct Settlement
UPI ID: [Your UPI ID / PhonePe / GPay]
Bank / A/C: [Your Bank Name] | A/C: [Your A/C Number] | IFSC: [IFSC Code]
GST Status: Exempt (Below GST registration threshold)`;

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  onInvoiceCreated,
  defaultPaymentDetails = {},
}) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [notes, setNotes] = useState(DEFAULT_INVOICE_NOTES);
  const [items, setItems] = useState([
    { description: "Custom Web Application & UI/UX Development", quantity: 1, price: 1500 },
  ]);

  // Payment Details
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Sync defaults from settings
  useEffect(() => {
    if (defaultPaymentDetails) {
      if (defaultPaymentDetails.beneficiaryName) setBeneficiaryName(defaultPaymentDetails.beneficiaryName);
      if (defaultPaymentDetails.upiId) setUpiId(defaultPaymentDetails.upiId);
      if (defaultPaymentDetails.bankName) setBankName(defaultPaymentDetails.bankName);
      if (defaultPaymentDetails.accountNumber) setAccountNumber(defaultPaymentDetails.accountNumber);
      if (defaultPaymentDetails.ifscCode) setIfscCode(defaultPaymentDetails.ifscCode);
    }
  }, [defaultPaymentDetails]);

  // Handle line items
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

  function resetForm() {
    setClientName("");
    setClientEmail("");
    setProjectTitle("");
    setTaxPercent(0);
    setDueDate("");
    setNotes(DEFAULT_INVOICE_NOTES);
    setItems([{ description: "Custom Web Application & UI/UX Development", quantity: 1, price: 1500 }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        clientName,
        clientEmail,
        projectTitle,
        items,
        taxPercent: Number(taxPercent),
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

      await api.post("/invoices", payload);
      resetForm();
      onClose();
      if (onInvoiceCreated) onInvoiceCreated();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to generate invoice");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 m-0 top-0 left-0 right-0 bottom-0">
      <div className="bg-panel border border-edge rounded-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-edge pb-3">
          <h2 className="font-display text-xl font-bold">Generate Webnex Labs Invoice</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-mist hover:text-paper text-lg font-mono p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-mist uppercase mb-1">Client Name</label>
              <input
                type="text"
                required
                placeholder="Acme Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
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
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
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
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-mist uppercase mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-sm focus-ring outline-none text-paper"
              />
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
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge px-3 py-2 text-xs focus-ring outline-none text-paper"
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
              {submitting ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
