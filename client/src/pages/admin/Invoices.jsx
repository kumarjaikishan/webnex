import { useEffect, useState } from "react";
import api from "../../api/client.js";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { InvoiceCard, CreateInvoiceModal } from "../../components/invoices";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-edge pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Invoice Generation & Management</h1>
          <p className="text-mist text-sm">Generate professional invoices with receiving bank details & dynamic UPI QR codes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm"
          >
            Create Your First Invoice
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {invoices.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Invoice Modal Component */}
      <CreateInvoiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onInvoiceCreated={fetchInvoices}
        defaultPaymentDetails={defaultPaymentDetails}
      />
    </div>
  );
}
