import { useEffect, useState } from "react";
import api from "../../api/client.js";
import { toast } from "sonner";
import { useConfirm } from "../../context/ConfirmContext.jsx";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { InvoiceCard, CreateInvoiceModal } from "../../components/invoices";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function Invoices() {
  const confirm = useConfirm();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" | "asc"
  const [defaultPaymentDetails, setDefaultPaymentDetails] = useState({
    beneficiaryName: "Jai Kishan Kumar (Webnex Labs)",
    upiId: "8210539367@jio",
    bankName: "Jio Payment Bank",
    accountNumber: "8210539367",
    ifscCode: "JIOP0000001",
  });

  useEffect(() => {
    fetchInvoices();
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

  async function fetchInvoices() {
    try {
      const [invRes, setRes] = await Promise.all([
        api.get("/invoices"),
        api.get("/settings").catch(() => ({ data: null })),
      ]);
      setInvoices(invRes.data);

      if (setRes.data?.paymentDetails) {
        setDefaultPaymentDetails((prev) => ({
          ...prev,
          ...setRes.data.paymentDetails,
        }));
      }
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await api.put(`/invoices/${id}`, { status });
      toast.success("Invoice status updated");
      fetchInvoices();
    } catch (err) {
      toast.error("Failed to update invoice status");
    }
  }

  async function handleDelete(id) {
    const ok = await confirm({
      title: "Delete Invoice",
      message: "Are you sure you want to delete this invoice? This cannot be undone.",
      confirmText: "Delete Invoice",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await api.delete(`/invoices/${id}`);
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (err) {
      toast.error("Failed to delete invoice");
    }
  }

  const sortedInvoices = [...invoices].sort((a, b) => {
    const dateA = new Date(a.issueDate || a.createdAt || 0).getTime();
    const dateB = new Date(b.issueDate || b.createdAt || 0).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Invoice Generation & Management</h1>
          <p className="text-mist text-sm">Generate professional invoices with receiving bank details & dynamic UPI QR codes.</p>
        </div>
        <button
          onClick={() => {
            setEditingInvoice(null);
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 transition focus-ring"
        >
          + Generate New Invoice
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <GearboxLoader label="Loading invoices..." />
      ) : invoices.length === 0 ? (
        <div className="bg-panel border border-edge rounded-2xl p-12 text-center">
          <p className="text-mist mb-4">No invoices created yet.</p>
          <button
            onClick={() => {
              setEditingInvoice(null);
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm"
          >
            Create Your First Invoice
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Column Header Bar for Desktop */}
          <div className="hidden md:grid md:grid-cols-[40px_110px_1fr_120px_130px_130px] items-center gap-4 px-5 py-1 text-xs font-mono uppercase tracking-wider text-mist">
            <span>#</span>
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
              className="flex items-center gap-1.5 hover:text-cyan transition group text-left cursor-pointer"
              title={`Click to sort by date ${sortOrder === "desc" ? "(Currently Newest First)" : "(Currently Oldest First)"}`}
            >
              <span className={sortOrder ? "text-paper font-semibold" : ""}>Date</span>
              <span className="p-0.5 rounded bg-void/60 border border-edge/60 group-hover:border-cyan/40 text-cyan">
                {sortOrder === "desc" ? (
                  <ArrowDown size={12} className="stroke-[2.5]" />
                ) : (
                  <ArrowUp size={12} className="stroke-[2.5]" />
                )}
              </span>
            </button>
            <span>Invoice & Client</span>
            <span className="text-center">Status</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {sortedInvoices.map((inv, index) => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                serialNumber={index + 1}
                onStatusChange={handleStatusChange}
                onEdit={(invoice) => {
                  setEditingInvoice(invoice);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Invoice Modal Component */}
      <CreateInvoiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingInvoice(null);
        }}
        onInvoiceCreated={fetchInvoices}
        editingInvoice={editingInvoice}
        defaultPaymentDetails={defaultPaymentDetails}
      />
    </div>
  );
}
