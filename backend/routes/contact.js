import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public — the "Contact" form on the portfolio site
router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }
  db.insert("messages", {
    id: uuid(),
    name,
    email,
    subject: subject || "New Project Inquiry",
    message,
    receivedAt: new Date().toISOString(),
  });
  res.status(201).json({ ok: true });
});

router.get("/", requireAuth, requireRole("admin"), (req, res) => {
  res.json(db.get("messages"));
});

export default router;
