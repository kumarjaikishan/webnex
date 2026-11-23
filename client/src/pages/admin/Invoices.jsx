import { useEffect, useState, useRef, useMemo } from "react";
import api from "../../api/client.js";
import { toast } from "sonner";
import { useConfirm } from "../../context/ConfirmContext.jsx";
import GearboxLoader from "../../components/GearboxLoader.jsx";
import { InvoiceCard, CreateInvoiceModal, PaymentModal, InvoiceDocumentContent } from "../../components/invoices";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Building,
  Calendar,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Wallet,
  User,
} from "lucide-react";

export default function Invoices() {
  const confirm = useConfirm();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [exportInvoice, setExportInvoice] = useState(null);
  const offscreenCardRef = useRef(null);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" | "asc"

  // Filter States
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "paid" | "partially-paid" | "overdue"
  const [selectedClient, setSelectedClient] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all"); // "all" | "this-month" | "last-month" | "this-year"
  const [searchQuery, setSearchQuery] = useState("");

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
      const [invRes, setRes, clientsRes] = await Promise.all([
        api.get("/invoices"),
        api.get("/settings").catch(() => ({ data: null })),
        api.get("/clients").catch(() => ({ data: [] })),
      ]);
      setInvoices(invRes.data || []);
      setClients(clientsRes.data || []);

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

  async function handleDownloadPdf(inv) {
    if (downloadingId) return;
    setDownloadingId(inv.id);
    setExportInvoice(inv);
    const toastId = toast.loading(`Generating PDF for ${inv.invoiceNumber}...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      if (offscreenCardRef.current?.downloadPdf) {
        await offscreenCardRef.current.downloadPdf();
        toast.success(`✓ Downloaded ${inv.invoiceNumber}.pdf`, { id: toastId });
      } else {
        toast.error("Failed to render printable document.", { id: toastId });
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF.", { id: toastId });
    } finally {
      setDownloadingId(null);
      setExportInvoice(null);
    }
  }

  // Helper: Determine if invoice is overdue
  const isInvoiceOverdue = (inv) => {
    if (inv.status === "Paid") return false;
    if (!inv.dueDate) return false;
    const due = new Date(inv.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Build Client Dropdown Options (Client Name Only)
  const clientOptions = useMemo(() => {
    const map = new Map();
    clients.forEach((c) => {
      const name = (c.name || "").trim();
      if (name && !map.has(name.toLowerCase())) {
        map.set(name.toLowerCase(), {
          value: name,
          label: name,
        });
      }
    });
    invoices.forEach((inv) => {
      const name = (inv.clientName || "").trim();
      if (name && !map.has(name.toLowerCase())) {
        map.set(name.toLowerCase(), {
          value: name,
          label: name,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [clients, invoices]);

  // Overall Financial Metrics
  const metrics = useMemo(() => {
    let totalInvoiced = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let overdueCount = 0;

    invoices.forEach((inv) => {
      const amount = Number(inv.totalAmount ?? inv.amount ?? 0);
      totalInvoiced += amount;

      if (inv.status === "Paid") {
        totalCollected += amount;
      } else if (inv.status === "Partially Paid") {
        const paid = Number(inv.amountPaid ?? 0);
        const due = Number(inv.balanceDue ?? (amount - paid));
        totalCollected += paid;
        totalPending += due;
      } else {
        totalPending += amount;
      }

      if (isInvoiceOverdue(inv)) {
        overdueCount += 1;
      }
    });

    return { totalInvoiced, totalCollected, totalPending, overdueCount };
  }, [invoices]);

  // Status Tab Counts
  const statusCounts = useMemo(() => {
    return {
      all: invoices.length,
      pending: invoices.filter((i) => i.status === "Pending").length,
      paid: invoices.filter((i) => i.status === "Paid").length,
      partial: invoices.filter((i) => i.status === "Partially Paid").length,
      overdue: invoices.filter((i) => isInvoiceOverdue(i)).length,
    };
  }, [invoices]);

  // Filter Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Status Filter
      if (statusFilter === "pending") {
        if (inv.status !== "Pending") return false;
      } else if (statusFilter === "paid") {
        if (inv.status !== "Paid") return false;
      } else if (statusFilter === "partially-paid") {
        if (inv.status !== "Partially Paid") return false;
      } else if (statusFilter === "overdue") {
        if (!isInvoiceOverdue(inv)) return false;
      }

      // 2. Client Filter (by client name)
      if (selectedClient !== "all") {
        const clientLower = selectedClient.toLowerCase();
        const clientName = (inv.clientName || "").toLowerCase();
        if (!clientName.includes(clientLower)) {
          return false;
        }
      }

      // 3. Period Filter
      if (periodFilter !== "all") {
        const dateStr = inv.issueDate || inv.createdAt;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const now = new Date();

        if (periodFilter === "this-month") {
          if (d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) {
            return false;
          }
        } else if (periodFilter === "last-month") {
          const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          if (d.getFullYear() !== lastMonthDate.getFullYear() || d.getMonth() !== lastMonthDate.getMonth()) {
            return false;
          }
        } else if (periodFilter === "this-year") {
          if (d.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNum = (inv.invoiceNumber || "").toLowerCase().includes(q);
        const matchesClient = (inv.clientName || "").toLowerCase().includes(q);
        const matchesCompany = (inv.clientCompany || "").toLowerCase().includes(q);
        const matchesTitle = (inv.projectTitle || "").toLowerCase().includes(q);
        const matchesItems = inv.items?.some((i) => (i.description || "").toLowerCase().includes(q));
        if (!matchesNum && !matchesClient && !matchesCompany && !matchesTitle && !matchesItems) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, statusFilter, selectedClient, periodFilter, searchQuery]);

  // Sort Invoices
  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort((a, b) => {
      const dateA = new Date(a.issueDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.issueDate || b.createdAt || 0).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredInvoices, sortOrder]);

  const isFilterActive =
    statusFilter !== "all" ||
    selectedClient !== "all" ||
    periodFilter !== "all" ||
    searchQuery.trim() !== "";

  const resetFilters = () => {
    setStatusFilter("all");
    setSelectedClient("all");
    setPeriodFilter("all");
    setSearchQuery("");
  };

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
          className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm hover:brightness-110 transition focus-ring cursor-pointer shadow-sm"
        >
          + Generate New Invoice
        </button>
      </div>

      {/* Financial Summary Metric Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Invoiced */}
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === "all"
              ? "bg-cyan/10 border-cyan/40 shadow-sm"
              : "bg-panel/60 border-edge/80 hover:bg-panel hover:border-cyan/30"
          }`}
        >
          <div className="flex items-center gap-2 text-mist text-xs font-mono mb-1">
            <Receipt size={14} className="text-cyan" />
            <span>Total Invoiced</span>
          </div>
          <div className="font-mono font-bold text-paper text-lg sm:text-xl">
            ₹{metrics.totalInvoiced.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-mist font-mono mt-0.5">{invoices.length} total invoices</p>
        </button>

        {/* Collected / Paid */}
        <button
          type="button"
          onClick={() => setStatusFilter("paid")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === "paid"
              ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
              : "bg-panel/60 border-edge/80 hover:bg-panel hover:border-emerald-500/30"
          }`}
        >
          <div className="flex items-center gap-2 text-mist text-xs font-mono mb-1">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Collected / Paid</span>
          </div>
          <div className="font-mono font-bold text-emerald-400 text-lg sm:text-xl">
            ₹{metrics.totalCollected.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-mist font-mono mt-0.5">{statusCounts.paid} settled invoices</p>
        </button>

        {/* Pending / Due */}
        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === "pending"
              ? "bg-amber-500/10 border-amber-500/40 shadow-sm"
              : "bg-panel/60 border-edge/80 hover:bg-panel hover:border-amber-500/30"
          }`}
        >
          <div className="flex items-center gap-2 text-mist text-xs font-mono mb-1">
            <Clock size={14} className="text-amber-400" />
            <span>Pending / Due</span>
          </div>
          <div className="font-mono font-bold text-amber-400 text-lg sm:text-xl">
            ₹{metrics.totalPending.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-mist font-mono mt-0.5">{statusCounts.pending} pending invoices</p>
        </button>

        {/* Overdue Alerts */}
        <button
          type="button"
          onClick={() => setStatusFilter("overdue")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === "overdue"
              ? "bg-rose-500/10 border-rose-500/40 shadow-sm"
              : "bg-panel/60 border-edge/80 hover:bg-panel hover:border-rose-500/30"
          }`}
        >
          <div className="flex items-center gap-2 text-mist text-xs font-mono mb-1">
            <AlertCircle size={14} className={metrics.overdueCount > 0 ? "text-rose-400" : "text-mist"} />
            <span>Overdue Invoices</span>
          </div>
          <div className={`font-mono font-bold text-lg sm:text-xl ${metrics.overdueCount > 0 ? "text-rose-400" : "text-paper"}`}>
            {metrics.overdueCount} {metrics.overdueCount === 1 ? "invoice" : "invoices"}
          </div>
          <p className="text-[10px] text-mist font-mono mt-0.5">
            {metrics.overdueCount > 0 ? "Requires payment follow-up" : "No overdue invoices"}
          </p>
        </button>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="bg-panel/50 border border-edge/80 rounded-2xl p-3 sm:p-4 space-y-3">
        {/* Row 1: Status Tabs & Result Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-edge/60 pb-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
            {[
              { id: "all", label: "All Invoices", count: statusCounts.all },
              { id: "pending", label: "Pending", count: statusCounts.pending, color: "text-amber-400" },
              { id: "paid", label: "Paid", count: statusCounts.paid, color: "text-emerald-400" },
              ...(statusCounts.partial > 0
                ? [{ id: "partially-paid", label: "Partially Paid", count: statusCounts.partial, color: "text-cyan" }]
                : []),
              {
                id: "overdue",
                label: "Overdue",
                count: statusCounts.overdue,
                color: statusCounts.overdue > 0 ? "text-rose-400" : "text-mist",
              },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-cyan/15 text-cyan border border-cyan/40 shadow-sm"
                      : "text-mist hover:text-paper hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      active ? "bg-cyan/30 text-cyan" : "bg-void border border-edge text-mist"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Clear Filter Pill */}
          {isFilterActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-cyan bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 transition shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw size={11} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Row 2: Search Input, Company Select, and Date Period Select */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Universal Search (6 Cols) */}
          <div className="sm:col-span-6 relative">
            <Search size={14} className="absolute left-3.5 top-3 text-mist/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice #, client, company or item..."
              className="w-full rounded-xl bg-void border border-edge pl-9 pr-8 py-2 text-xs font-mono text-paper placeholder:text-mist/50 focus-ring outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-mist hover:text-paper p-0.5 rounded cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Client Name Filter (3 Cols) */}
          <div className="sm:col-span-3 relative">
            <User size={13} className="absolute left-3 top-3 text-cyan pointer-events-none" />
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge pl-8 pr-3 py-2 text-xs font-mono text-paper focus-ring outline-none transition cursor-pointer truncate"
            >
              <option value="all">All Clients</option>
              {clientOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter (3 Cols) */}
          <div className="sm:col-span-3 relative">
            <Calendar size={13} className="absolute left-3 top-3 text-cyan pointer-events-none" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full rounded-xl bg-void border border-edge pl-8 pr-3 py-2 text-xs font-mono text-paper focus-ring outline-none transition cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year (2026)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-mist pt-1">
          <span>
            Showing <strong className="text-paper">{sortedInvoices.length}</strong> of{" "}
            <strong className="text-paper">{invoices.length}</strong> invoices
          </span>
          {isFilterActive && (
            <span className="text-cyan">
              Filtered by: {[
                statusFilter !== "all" ? `Status (${statusFilter})` : null,
                selectedClient !== "all" ? `Client (${selectedClient})` : null,
                periodFilter !== "all" ? `Period (${periodFilter})` : null,
                searchQuery ? `Query ("${searchQuery}")` : null,
              ]
                .filter(Boolean)
                .join(" • ")}
            </span>
          )}
        </div>
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
            className="px-4 py-2 rounded-xl bg-grad-primary text-void font-semibold text-sm cursor-pointer"
          >
            Create Your First Invoice
          </button>
        </div>
      ) : sortedInvoices.length === 0 ? (
        <div className="bg-panel/60 border border-dashed border-edge/80 rounded-2xl p-12 text-center">
          <p className="text-mist text-sm mb-2">No invoices match the selected filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-mono text-cyan hover:underline inline-flex items-center gap-1"
          >
            <RotateCcw size={12} />
            <span>Reset filters to view all invoices</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Column Header Bar for Desktop */}
          <div className="hidden md:grid md:grid-cols-[36px_105px_1fr_110px_100px_150px] items-center gap-3 lg:gap-4 px-5 py-1 text-xs font-mono uppercase tracking-wider text-mist">
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
                onOpenPayments={(invoice) => {
                  setPaymentInvoice(invoice);
                }}
                onDownloadPdf={handleDownloadPdf}
                isDownloadingPdf={downloadingId === inv.id}
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

      {/* Payment & Installment Ledger Modal */}
      {paymentInvoice && (
        <PaymentModal
          isOpen={Boolean(paymentInvoice)}
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onPaymentUpdated={(updated) => {
            setPaymentInvoice(updated);
            fetchInvoices();
          }}
        />
      )}

      {/* Off-screen DocumentCard for Instant Background PDF Generation */}
      {exportInvoice && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "800px",
            opacity: 1,
            pointerEvents: "none",
            zIndex: -50,
          }}
        >
          <InvoiceDocumentContent
            ref={offscreenCardRef}
            invoice={exportInvoice}
            bankSettings={defaultPaymentDetails}
            isPage={false}
            showCardActions={false}
          />
        </div>
      )}
    </div>
  );
}
