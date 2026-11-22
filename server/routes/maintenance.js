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

// Helper to advance nextDueDate by billing cycle
export function getNextCycleDate(baseDateStr, cycle = "monthly") {
  let date = new Date(baseDateStr);
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  if (cycle === "quarterly") {
    date.setMonth(date.getMonth() + 3);
  } else if (cycle === "yearly") {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    // monthly default
    date.setMonth(date.getMonth() + 1);
  }
  return date.toISOString().split("T")[0];
}

// Core helper: generates a pending maintenance invoice for a plan
export function generateInvoiceForPlan(plan, force = false, customOptions = {}) {
  const clients = db.get("clients") || [];
  const existingInvoices = db.get("invoices") || [];
  const client = clients.find((c) => c.id === plan.clientId) || {
    name: plan.clientName || "Client",
    email: plan.clientEmail || "client@domain.com",
    company: plan.companyName || "",
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const issueDate = customOptions.issueDate || todayStr;
  const targetPeriodMonth = customOptions.periodMonth || issueDate.substring(0, 7); // e.g. "2026-11"

  // Check if invoice for this plan has already been generated for this periodMonth
  if (!force && plan.lastInvoicedMonth === targetPeriodMonth) {
    return {
      success: false,
      alreadyInvoiced: true,
      message: `Invoice for this period (${targetPeriodMonth}) has already been generated (${plan.lastInvoiceNumber || "INV"}).`,
    };
  }

  const invoiceNum = generateNextInvoiceNumber(existingInvoices, "INV");
  const invoiceDueDate = customOptions.dueDate || plan.nextDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  // Parse target period month name (e.g. "November 2026")
  let periodDate = new Date(issueDate);
  if (customOptions.periodMonth) {
    const [y, m] = customOptions.periodMonth.split("-");
    if (y && m) {
      periodDate = new Date(parseInt(y), parseInt(m) - 1, 1);
    }
  }
  const formattedPeriodName = periodDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const customPlanTitle = customOptions.planTitle || plan.planTitle || "Website Maintenance Plan";
  const customAmount = customOptions.amount !== undefined ? Number(customOptions.amount) : Number(plan.amount);

  const newInvoice = {
    id: uuid(),
    invoiceNumber: invoiceNum,
    clientId: plan.clientId,
    clientName: client.name,
    clientEmail: client.email,
    projectTitle: `${customPlanTitle} (${plan.cycle || "monthly"})`,
    items: [
      {
        description: customPlanTitle,
        subDescription: `${plan.cycle ? plan.cycle.charAt(0).toUpperCase() + plan.cycle.slice(1) : "Monthly"} retainer & system care (${formattedPeriodName})`,
        quantity: 1,
        price: customAmount,
        amount: customAmount,
      },
    ],
    taxPercent: 0,
    subtotal: customAmount,
    totalAmount: customAmount,
    issueDate: issueDate,
    dueDate: invoiceDueDate,
    status: "Pending",
    notes: `Recurring maintenance invoice for ${formattedPeriodName}. Payment due upon receipt. Thank you for choosing Webnex Labs!`,
    isMaintenance: true,
    maintenancePlanId: plan.id,
    periodMonth: targetPeriodMonth,
    createdAt: new Date().toISOString(),
  };

  db.insert("invoices", newInvoice);

  // Advance nextDueDate
  const nextDueDateStr = getNextCycleDate(invoiceDueDate, plan.cycle);

  const updatedPlan = db.update("maintenance", plan.id, {
    lastInvoicedDate: issueDate,
    lastInvoicedMonth: targetPeriodMonth,
    lastInvoiceId: newInvoice.id,
    lastInvoiceNumber: invoiceNum,
    nextDueDate: nextDueDateStr,
  });

  return {
    success: true,
    invoice: newInvoice,
    plan: updatedPlan,
  };
}

// Background / On-access Auto Billing Runner
export function runAutoBilling() {
  const plans = db.get("maintenance") || [];
  const todayStr = new Date().toISOString().split("T")[0];
  const currentMonthStr = todayStr.substring(0, 7);

  const autoPlans = plans.filter((p) => {
    if (p.status !== "active") return false;
    if (p.billingMode === "manual") return false; // skip manual plans
    // if billingMode is 'auto' (or not explicitly set)
    // Check if nextDueDate is today or in the past
    if (!p.nextDueDate || p.nextDueDate <= todayStr) {
      if (p.lastInvoicedMonth === currentMonthStr) return false;
      return true;
    }
    return false;
  });

  const generated = [];
  autoPlans.forEach((plan) => {
    const res = generateInvoiceForPlan(plan, false);
    if (res.success) {
      generated.push(res.invoice);
    }
  });

  return generated;
}

// GET /api/maintenance - List maintenance plans (runs auto-billing check first)
router.get("/", (req, res) => {
  try {
    runAutoBilling();
  } catch (err) {
    console.error("Auto billing error:", err);
  }
  res.json(scoped(req));
});

// POST /api/maintenance - Create new maintenance plan (Admin only)
router.post("/", requireRole("admin"), (req, res) => {
  const { clientId, amount, cycle, nextDueDate, planTitle, notes, billingMode, dayOfMonth } = req.body;
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
    billingMode: billingMode === "manual" ? "manual" : "auto", // auto | manual
    dayOfMonth: Number(dayOfMonth) || 1, // e.g. 1st of each month
    nextDueDate: nextDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    lastInvoicedDate: null,
    lastInvoicedMonth: null,
    lastInvoiceId: null,
    lastInvoiceNumber: null,
    notes: notes || "Includes software updates, security backups, and uptime monitoring.",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  db.insert("maintenance", plan);
  res.status(201).json(plan);
});

// POST /api/maintenance/:id/generate-invoice - 1-Click Generate Single Plan Invoice (Admin only)
router.post("/:id/generate-invoice", requireRole("admin"), (req, res) => {
  const plan = db.findOne("maintenance", (m) => m.id === req.params.id);
  if (!plan) {
    return res.status(404).json({ error: "Maintenance plan not found." });
  }

  const force = req.query.force === "true" || req.body?.force === true;
  const customOptions = {
    issueDate: req.body?.issueDate,
    dueDate: req.body?.dueDate,
    periodMonth: req.body?.periodMonth,
    planTitle: req.body?.planTitle,
    amount: req.body?.amount,
  };

  const result = generateInvoiceForPlan(plan, force, customOptions);

  if (!result.success) {
    return res.status(400).json({
      error: result.message,
      alreadyInvoiced: true,
      lastInvoiceNumber: plan.lastInvoiceNumber,
      lastInvoiceId: plan.lastInvoiceId,
    });
  }

  res.status(201).json({
    message: `Invoice ${result.invoice.invoiceNumber} generated successfully with status Pending!`,
    invoice: result.invoice,
    plan: result.plan,
  });
});

// POST /api/maintenance/generate-invoices - Batch generate for all active plans
router.post("/generate-invoices", requireRole("admin"), (req, res) => {
  const plans = db.get("maintenance") || [];
  const activePlans = plans.filter((p) => p.status === "active");

  if (activePlans.length === 0) {
    return res.status(400).json({ error: "No active maintenance plans found to invoice." });
  }

  const generatedInvoices = [];
  activePlans.forEach((plan) => {
    const resPlan = generateInvoiceForPlan(plan, false);
    if (resPlan.success) {
      generatedInvoices.push(resPlan.invoice);
    }
  });

  if (generatedInvoices.length === 0) {
    return res.status(200).json({
      message: "All active plans are already invoiced for this month.",
      invoices: [],
    });
  }

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
