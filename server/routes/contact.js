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
    receivedAt: new Date().toISOString(),
  });
  res.status(201).json({ ok: true });
});

router.get("/", requireAuth, requireRole("admin"), (req, res) => {
  res.json(db.get("messages"));
});

export default router;
