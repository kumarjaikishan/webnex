import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Lead } from "../models/Lead.js";
import { ApiError } from "../middleware/errorHandler.js";

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  businessType: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message || "Invalid lead data");
    }
    const lead = await Lead.create(parsed.data);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

export async function getLeads(_req: Request, res: Response, next: NextFunction) {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
}
