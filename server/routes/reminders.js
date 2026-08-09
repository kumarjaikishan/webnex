import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

function scoped(req) {
  const all = db.get("reminders");
  if (req.user.role === "admin") return all;
  return all.filter((r) => r.clientId === req.user.id);
}

router.get("/", (req, res) => res.json(scoped(req)));

router.post("/", requireRole("admin"), (req, res) => {
  const { clientId, title, dueDate, type } = req.body;
  if (!clientId || !title || !dueDate) {
    return res.status(400).json({ error: "Client, title and due date are required." });
  }
  const reminder = db.insert("reminders", {
    id: uuid(),
    clientId,
    title,
    dueDate,
    type: type || "general", // maintenance | contract | issue | general
    done: false,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(reminder);
});

router.put("/:id", requireRole("admin"), (req, res) => {
  const updated = db.update("reminders", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Reminder not found." });
  res.json(updated);
});

router.delete("/:id", requireRole("admin"), (req, res) => {
  db.remove("reminders", req.params.id);
  res.status(204).end();
});

export default router;
