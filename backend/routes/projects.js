import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public — anyone visiting the portfolio can see projects
router.get("/", (req, res) => {
  const projects = db.get("projects").sort((a, b) => a.order - b.order);
  res.json(projects);
});

// Admin only — manage the showcase
router.post("/", requireAuth, requireRole("admin"), (req, res) => {
  const { title, summary, tags, coverColor, liveUrl, featured } = req.body;
  if (!title || !summary) return res.status(400).json({ error: "Title and summary are required." });
  const project = {
    id: uuid(),
    title,
    summary,
    tags: tags || [],
    coverColor: coverColor || "#3A6B63",
    liveUrl: liveUrl || "",
    featured: !!featured,
    order: db.get("projects").length + 1,
  };
  res.status(201).json(db.insert("projects", project));
});

router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const updated = db.update("projects", req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Project not found." });
  res.json(updated);
});

router.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {
  db.remove("projects", req.params.id);
  res.status(204).end();
});

export default router;
