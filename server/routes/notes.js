import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

function scoped(req) {
  const all = db.get("notes");
  if (req.user.role === "admin") return all;
  return all.filter((n) => n.clientId === req.user.id);
}

router.get("/", (req, res) => res.json(scoped(req)));

router.get("/:id", (req, res) => {
  const note = scoped(req).find((n) => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
});

// welcome | thankyou | issue — sent from admin to a client
router.post("/", requireRole("admin"), (req, res) => {
  const { clientId, type, message, clientName, clientEmail, companyName, projectTitle, kickoffDate, portalUrl } = req.body;
  if (!clientId || !type || !message) {
    return res.status(400).json({ error: "Client, type and message are required." });
  }
  const note = db.insert("notes", {
    id: uuid(),
    clientId,
    clientName,
    clientEmail,
    companyName,
    projectTitle,
    kickoffDate,
    portalUrl,
    type, // welcome | thankyou | issue
    message,
    sentAt: new Date().toISOString(),
  });
  res.status(201).json(note);
});

router.put("/:id", requireRole("admin"), (req, res) => {
  const updated = db.update("notes", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Note not found" });
  res.json(updated);
});

router.delete("/:id", requireRole("admin"), (req, res) => {
  db.remove("notes", req.params.id);
  res.status(204).end();
});

export default router;
