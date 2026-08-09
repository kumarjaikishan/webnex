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

// welcome | thankyou | issue — sent from admin to a client
router.post("/", requireRole("admin"), (req, res) => {
  const { clientId, type, message } = req.body;
  if (!clientId || !type || !message) {
    return res.status(400).json({ error: "Client, type and message are required." });
  }
  const note = db.insert("notes", {
    id: uuid(),
    clientId,
    type, // welcome | thankyou | issue
    message,
    sentAt: new Date().toISOString(),
  });
  res.status(201).json(note);
});

router.delete("/:id", requireRole("admin"), (req, res) => {
  db.remove("notes", req.params.id);
  res.status(204).end();
});

export default router;
