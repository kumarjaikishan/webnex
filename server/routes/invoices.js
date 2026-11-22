import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { generateNextInvoiceNumber } from "../utils/invoiceNumber.js";

const router = express.Router();

/**
 * Recomputes invoice financials: subtotal, totalAmount, payments, discount, amountPaid, balanceDue, and status.
 */
export function recomputeInvoice(invoice) {
  if (!invoice) return null;

  const itemList = Array.isArray(invoice.items) ? invoice.items : [];
  const subtotal = itemList.reduce(
    (acc, item) =>
      acc + (Number(item.amount) || Number(item.quantity || 1) * Number(item.price || 0)),
    0
  );
  const taxRate = Number(invoice.taxPercent) || 0;
  const totalAmount = Math.round((subtotal + subtotal * (taxRate / 100)) * 100) / 100;

  const payments = Array.isArray(invoice.payments) ? invoice.payments : [];
  let amountPaid = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const discount = Number(invoice.discount) || 0;

  // Legacy fallback: if invoice was manually marked Paid and has no payments array
  if (payments.length === 0 && invoice.status === "Paid" && discount === 0) {
    amountPaid = totalAmount;
  }

  const balanceDue = Math.max(0, Math.round((totalAmount - amountPaid - discount) * 100) / 100);

  let status = invoice.status || "Pending";
  if (balanceDue <= 0 && (amountPaid > 0 || discount > 0 || invoice.status === "Paid")) {
    status = "Paid";
  } else if (amountPaid > 0 || discount > 0) {
    status = "Partially Paid";
  } else if (status === "Paid" && balanceDue > 0) {
    status = "Pending";
  }

  return {
    ...invoice,
    subtotal,
    totalAmount,
    discount,
    discountReason: invoice.discountReason || "",
    payments,
    amountPaid,
    balanceDue,
    status,
  };
}

// GET /api/invoices - list invoices (Admin: all, Client: matching client email/id)
router.get("/", requireAuth, (req, res) => {
  const invoices = db.get("invoices") || [];
  const processed = invoices.map(recomputeInvoice);

  if (req.user.role === "admin") {
    return res.json(processed);
  }
  const clientInvoices = processed.filter(
    (inv) => inv.clientEmail?.toLowerCase() === req.user.email.toLowerCase()
  );
  res.json(clientInvoices);
});

// GET /api/invoices/:id - get single invoice by id or invoiceNumber
router.get("/:id", requireAuth, (req, res) => {
  const invoices = db.get("invoices") || [];
  const raw = invoices.find(
    (inv) => inv.id === req.params.id || inv.invoiceNumber === req.params.id
  );
  if (!raw) {
    return res.status(404).json({ error: "Invoice not found." });
  }
  if (req.user.role !== "admin" && raw.clientEmail?.toLowerCase() !== req.user.email?.toLowerCase()) {
    return res.status(403).json({ error: "Access denied." });
  }
  res.json(recomputeInvoice(raw));
});

// POST /api/invoices - create invoice (Admin only)
router.post("/", requireAuth, requireAdmin, (req, res) => {
  const {
    invoiceNumber,
    clientName,
    clientEmail,
    projectTitle,
    items,
    taxPercent,
    issueDate,
    dueDate,
    status,
    notes,
    paymentDetails,
    discount,
    discountReason,
  } = req.body;

  if (!clientName || !clientEmail) {
    return res.status(400).json({ error: "Client name and email are required." });
  }

  const itemList = Array.isArray(items) ? items : [];
  const subtotal = itemList.reduce((acc, item) => acc + (Number(item.amount) || (Number(item.quantity || 1) * Number(item.price || 0))), 0);
  const taxRate = Number(taxPercent) || 0;
  const totalAmount = Math.round((subtotal + (subtotal * (taxRate / 100))) * 100) / 100;

  const existingInvoices = db.get("invoices") || [];
  const assignedInvoiceNumber = invoiceNumber?.trim() || generateNextInvoiceNumber(existingInvoices, "INV");

  const initialDiscount = Number(discount) || 0;
  const initialBalance = Math.max(0, Math.round((totalAmount - initialDiscount) * 100) / 100);

  const newInvoice = {
    id: uuid(),
    invoiceNumber: assignedInvoiceNumber,
    clientName,
    clientEmail,
    projectTitle: projectTitle || "Web Development & Services",
    items: itemList,
    taxPercent: taxRate,
    subtotal,
    totalAmount,
    discount: initialDiscount,
    discountReason: discountReason || "",
    payments: [],
    amountPaid: 0,
    balanceDue: initialBalance,
    issueDate: issueDate || new Date().toISOString().split("T")[0],
    dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    status: status || (initialBalance <= 0 ? "Paid" : "Pending"),
    notes: notes || "Thank you for choosing Webnex Labs!",
    paymentDetails: paymentDetails || null,
    createdAt: new Date().toISOString(),
  };

  db.insert("invoices", newInvoice);
  res.status(201).json(recomputeInvoice(newInvoice));
});

// PUT /api/invoices/:id - update invoice details or status (Admin only)
router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const existing = db.findOne("invoices", (inv) => inv.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Invoice not found." });
  }

  // If status is changed to "Paid" directly, ensure amountPaid matches totalAmount if no payments exist
  let patch = { ...req.body };
  if (req.body.status === "Paid" && (!existing.payments || existing.payments.length === 0)) {
    patch.amountPaid = existing.totalAmount;
    patch.balanceDue = 0;
  } else if (req.body.status === "Pending" && (!existing.payments || existing.payments.length === 0)) {
    patch.amountPaid = 0;
    patch.balanceDue = existing.totalAmount;
  }

  const merged = { ...existing, ...patch };
  const recomputed = recomputeInvoice(merged);

  db.update("invoices", req.params.id, recomputed);
  res.json(recomputed);
});

// POST /api/invoices/:id/payments - record a payment installment (Admin only)
router.post("/:id/payments", requireAuth, requireAdmin, (req, res) => {
  const invoice = db.findOne("invoices", (inv) => inv.id === req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found." });
  }

  const paymentAmount = Number(req.body.amount);
  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    return res.status(400).json({ error: "Valid payment amount greater than 0 is required." });
  }

  const newPayment = {
    id: uuid(),
    amount: Math.round(paymentAmount * 100) / 100,
    date: req.body.date || new Date().toISOString().split("T")[0],
    method: req.body.method || "UPI",
    reference: req.body.reference ? String(req.body.reference).trim() : "",
    note: req.body.note ? String(req.body.note).trim() : "",
    createdAt: new Date().toISOString(),
  };

  const existingPayments = Array.isArray(invoice.payments) ? invoice.payments : [];
  const updatedPayments = [...existingPayments, newPayment];

  const merged = {
    ...invoice,
    payments: updatedPayments,
  };

  const recomputed = recomputeInvoice(merged);
  db.update("invoices", invoice.id, recomputed);

  res.status(201).json(recomputed);
});

// DELETE /api/invoices/:id/payments/:paymentId - delete a payment installment (Admin only)
router.delete("/:id/payments/:paymentId", requireAuth, requireAdmin, (req, res) => {
  const invoice = db.findOne("invoices", (inv) => inv.id === req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found." });
  }

  const existingPayments = Array.isArray(invoice.payments) ? invoice.payments : [];
  const updatedPayments = existingPayments.filter((p) => p.id !== req.params.paymentId);

  const merged = {
    ...invoice,
    payments: updatedPayments,
  };

  const recomputed = recomputeInvoice(merged);
  db.update("invoices", invoice.id, recomputed);

  res.json(recomputed);
});

// POST /api/invoices/:id/settle - apply settlement discount / concession (Admin only)
router.post("/:id/settle", requireAuth, requireAdmin, (req, res) => {
  const invoice = db.findOne("invoices", (inv) => inv.id === req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found." });
  }

  const currentRecomputed = recomputeInvoice(invoice);
  let discountVal = Number(req.body.discount);

  // If settling remaining balance as discount directly
  if (req.body.settleBalance) {
    discountVal = (Number(invoice.discount) || 0) + currentRecomputed.balanceDue;
  }

  if (isNaN(discountVal) || discountVal < 0) {
    return res.status(400).json({ error: "Valid discount amount is required." });
  }

  const merged = {
    ...invoice,
    discount: Math.round(discountVal * 100) / 100,
    discountReason: req.body.discountReason ? String(req.body.discountReason).trim() : "Full & final settlement concession",
  };

  const recomputed = recomputeInvoice(merged);
  db.update("invoices", invoice.id, recomputed);

  res.json(recomputed);
});

// DELETE /api/invoices/:id - delete invoice (Admin only)
router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  const invoice = db.findOne("invoices", (inv) => inv.id === req.params.id);
  db.remove("invoices", req.params.id);

  // If this was a maintenance invoice, reset the plan's cached lastInvoiced fields if it referenced this invoice
  if (invoice?.maintenancePlanId) {
    const plan = db.findOne("maintenance", (m) => m.id === invoice.maintenancePlanId);
    if (plan && (plan.lastInvoiceId === invoice.id || plan.lastInvoiceNumber === invoice.invoiceNumber)) {
      db.update("maintenance", plan.id, {
        lastInvoicedDate: null,
        lastInvoicedMonth: null,
        lastInvoiceId: null,
        lastInvoiceNumber: null,
      });
    }
  }

  res.json({ ok: true });
});

export default router;
