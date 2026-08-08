import { Router } from "express";
import { createLead, getLeads } from "../controllers/leadController.js";

const router = Router();

router.post("/", createLead);
router.get("/", getLeads); // TODO: protect with admin auth before production use

export default router;
