import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "lucide-react";
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

  // Sync defaults or editing invoice data
  useEffect(() => {
    if (editingInvoice) {
      setClientName(editingInvoice.clientName || "");
      setClientEmail(editingInvoice.clientEmail || "");
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1 flex items-center justify-between">
                  <span>Invoice Date</span>
                  <span className="text-[10px] text-cyan normal-case font-mono">Today</span>
                </label>
                <div 
                  onClick={() => issueDateInputRef.current?.showPicker ? issueDateInputRef.current.showPicker() : issueDateInputRef.current?.focus()}
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    ref={issueDateInputRef}
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge pl-3 pr-9 py-2 text-xs focus-ring outline-none text-paper font-mono [color-scheme:dark] cursor-pointer"
                  />
                  <div className="absolute right-3 pointer-events-none text-white">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-mist uppercase mb-1">Due Date</label>
                <div 
                  onClick={() => dueDateInputRef.current?.showPicker ? dueDateInputRef.current.showPicker() : dueDateInputRef.current?.focus()}
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    ref={dueDateInputRef}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl bg-void border border-edge pl-3 pr-9 py-2 text-xs focus-ring outline-none text-paper font-mono [color-scheme:dark] cursor-pointer"
                  />
                  <div className="absolute right-3 pointer-events-none text-white">
                    <Calendar className="w-4 h-4" />
                  </div>
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
