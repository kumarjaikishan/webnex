import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { generateNextInvoiceNumber } from "../utils/invoiceNumber.js";

const router = express.Router();

// GET /api/invoices - list invoices (Admin: all, Client: matching client email/id)
router.get("/", requireAuth, (req, res) => {
  const invoices = db.get("invoices") || [];
  if (req.user.role === "admin") {
    return res.json(invoices);
  }
  const clientInvoices = invoices.filter(
    (inv) => inv.clientEmail?.toLowerCase() === req.user.email.toLowerCase()
  );
  res.json(clientInvoices);
});

// GET /api/invoices/:id - get single invoice by id or invoiceNumber
router.get("/:id", requireAuth, (req, res) => {
  const invoices = db.get("invoices") || [];
  const invoice = invoices.find(
    (inv) => inv.id === req.params.id || inv.invoiceNumber === req.params.id
  );
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found." });
  }
  if (req.user.role !== "admin" && invoice.clientEmail?.toLowerCase() !== req.user.email?.toLowerCase()) {
    return res.status(403).json({ error: "Access denied." });
  }
  res.json(invoice);
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
    dueDate,
    status,
    notes,
    paymentDetails,
  } = req.body;

  if (!clientName || !clientEmail) {
    return res.status(400).json({ error: "Client name and email are required." });
  }

  const itemList = Array.isArray(items) ? items : [];
  const subtotal = itemList.reduce((acc, item) => acc + (Number(item.amount) || (Number(item.quantity || 1) * Number(item.price || 0))), 0);
  const taxRate = Number(taxPercent) || 0;
  const totalAmount = subtotal + (subtotal * (taxRate / 100));

  const existingInvoices = db.get("invoices") || [];
  const assignedInvoiceNumber = invoiceNumber?.trim() || generateNextInvoiceNumber(existingInvoices, "INV");

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
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    status: status || "Pending",
    notes: notes || "Thank you for choosing Webnex Labs!",
    paymentDetails: paymentDetails || null,
    createdAt: new Date().toISOString(),
  };

  db.insert("invoices", newInvoice);
  res.status(201).json(newInvoice);
});

// PUT /api/invoices/:id - update status or invoice details (Admin only)
router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const updated = db.update("invoices", req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Invoice not found." });
  }
  res.json(updated);
});

// DELETE /api/invoices/:id - delete invoice (Admin only)
router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  db.remove("invoices", req.params.id);
  res.json({ ok: true });
});

export default router;
