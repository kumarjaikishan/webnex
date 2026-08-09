import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

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
  } = req.body;

  if (!clientName || !clientEmail) {
    return res.status(400).json({ error: "Client name and email are required." });
  }

  const itemList = Array.isArray(items) ? items : [];
  const subtotal = itemList.reduce((acc, item) => acc + (Number(item.amount) || (Number(item.quantity || 1) * Number(item.price || 0))), 0);
  const taxRate = Number(taxPercent) || 0;
  const totalAmount = subtotal + (subtotal * (taxRate / 100));

  const newInvoice = {
    id: uuid(),
    invoiceNumber: invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
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
