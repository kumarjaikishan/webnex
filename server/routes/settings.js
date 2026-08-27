import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public — Frontend gets site settings (e.g. showGhost, hero3DStyle, themes, etc.)
router.get("/", (req, res) => {
  try {
    const settings = db.get("settings") || [];
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    // Default values if not set yet
    if (settingsObj.showGhost === undefined) {
      settingsObj.showGhost = true;
    }
    if (settingsObj.hero3DStyle === undefined) {
      settingsObj.hero3DStyle = "three_3d"; // "three_3d" | "canvas_ghost" | "none"
    }

    res.json(settingsObj);
  } catch (err) {
    console.error("Error retrieving settings:", err);
    res.status(500).json({ error: "Failed to get settings" });
  }
});

// Admin only — Update settings
router.post("/", requireAuth, requireRole("admin"), (req, res) => {
  try {
    const newSettings = req.body; // e.g. { showGhost: true, hero3DStyle: "three_3d" }
    const currentList = db.get("settings") || [];
    
    // Convert to map for easy deduplication
    const settingsMap = new Map();
    currentList.forEach((item) => {
      if (item.key) settingsMap.set(item.key, item);
    });

    Object.keys(newSettings).forEach((key) => {
      if (settingsMap.has(key)) {
        const existing = settingsMap.get(key);
        existing.value = newSettings[key];
      } else {
        settingsMap.set(key, { id: uuid(), key, value: newSettings[key] });
      }
    });

    const updatedList = Array.from(settingsMap.values());
    db.save("settings", updatedList);

    const resultObj = updatedList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return res.json({ message: "Settings updated successfully", settings: resultObj });
  } catch (err) {
    console.error("Error updating settings:", err);
    return res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
