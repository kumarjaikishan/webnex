import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public — the "Contact" form on the portfolio site
router.post("/", (req, res) => {
  const { name, phone, email, businessType, subject, message } = req.body;
  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: "Name and at least phone or email are required." });
  }
  db.insert("messages", {
    id: uuid(),
    name,
    phone: phone || "",
    email: email || "",
    businessType: businessType || "",
    subject: subject || "New Project Inquiry",
    message: message || "",
    status: "new", // "new" | "contacted" | "converted" | "archived"
    receivedAt: new Date().toISOString(),
  });
  res.status(201).json({ ok: true });
});

// GET /api/contact - Admin view all messages
router.get("/", requireAuth, requireRole("admin"), (req, res) => {
  const messages = db.get("messages") || [];
  res.json(messages);
});

// PUT /api/contact/:id - Admin update status or notes
router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const updated = db.update("messages", req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Message not found" });
  }
  res.json(updated);
});

// DELETE /api/contact/:id - Admin delete inquiry
router.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {
  db.remove("messages", req.params.id);
  res.json({ ok: true });
});

export default router;
