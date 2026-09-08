import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { generateNextInvoiceNumber } from "../utils/invoiceNumber.js";

const router = express.Router();
router.use(requireAuth);

function scoped(req) {
  const all = db.get("maintenance") || [];
  if (req.user.role === "admin") return all;
  return all.filter((m) => m.clientId === req.user.id);
}

// GET /api/maintenance - List maintenance plans
router.get("/", (req, res) => res.json(scoped(req)));

// POST /api/maintenance - Create new maintenance plan (Admin only)
router.post("/", requireRole("admin"), (req, res) => {
  const { clientId, amount, cycle, nextDueDate, planTitle, notes } = req.body;
  if (!clientId || !amount) {
    return res.status(400).json({ error: "Client and amount are required." });
  }

  const client = db.findOne("clients", (c) => c.id === clientId);

  const plan = {
    id: uuid(),
    clientId,
    clientName: client?.name || "Client",
    clientEmail: client?.email || "",
    planTitle: planTitle || "Monthly Website Care & Maintenance",
    amount: Number(amount),
    cycle: cycle || "monthly", // monthly | quarterly | yearly
    nextDueDate: nextDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    lastInvoicedDate: null,
    notes: notes || "Includes software updates, security backups, and uptime monitoring.",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  db.insert("maintenance", plan);
  res.status(201).json(plan);
});

// POST /api/maintenance/generate-invoices - 1-Click Generate Monthly Invoices (Admin only)
router.post("/generate-invoices", requireRole("admin"), (req, res) => {
  const plans = db.get("maintenance") || [];
  const clients = db.get("clients") || [];
  const activePlans = plans.filter((p) => p.status === "active");

  if (activePlans.length === 0) {
    return res.status(400).json({ error: "No active maintenance plans found to invoice." });
  }

  const generatedInvoices = [];
  const todayStr = new Date().toISOString().split("T")[0];

  activePlans.forEach((plan) => {
    const client = clients.find((c) => c.id === plan.clientId) || {
      name: plan.clientName || "Client",
      email: plan.clientEmail || "client@domain.com",
    };

    const existingInvoices = db.get("invoices") || [];
    const invoiceNum = generateNextInvoiceNumber(existingInvoices, "INV");

    const newInvoice = {
      id: uuid(),
      invoiceNumber: invoiceNum,
      clientName: client.name,
      clientEmail: client.email,
      projectTitle: `${plan.planTitle || "Monthly Website Maintenance"} (${plan.cycle || "monthly"})`,
      items: [
        {
          description: `${plan.planTitle || "Website Maintenance Plan"} - ${plan.cycle || "Monthly"} Service Fee`,
          quantity: 1,
          price: Number(plan.amount),
          amount: Number(plan.amount),
        },
      ],
      taxPercent: 0,
      subtotal: Number(plan.amount),
      totalAmount: Number(plan.amount),
      issueDate: todayStr,
      dueDate: plan.nextDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      status: "Pending",
      notes: `Monthly maintenance invoice. Payment due upon receipt. Thank you for choosing Webnex Labs!`,
      createdAt: new Date().toISOString(),
    };

    db.insert("invoices", newInvoice);
    generatedInvoices.push(newInvoice);

    // Update plan's next due date (+30 days for monthly)
    const nextDue = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
    db.update("maintenance", plan.id, {
      lastInvoicedDate: todayStr,
      nextDueDate: nextDue,
    });
  });

  res.status(201).json({
    message: `Successfully generated ${generatedInvoices.length} monthly maintenance invoice(s).`,
    invoices: generatedInvoices,
  });
});

// PUT /api/maintenance/:id - Update plan (Admin only)
router.put("/:id", requireRole("admin"), (req, res) => {
  const updated = db.update("maintenance", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Plan not found." });
  res.json(updated);
});

// DELETE /api/maintenance/:id - Delete plan (Admin only)
router.delete("/:id", requireRole("admin"), (req, res) => {
  db.remove("maintenance", req.params.id);
  res.status(204).end();
});

export default router;
