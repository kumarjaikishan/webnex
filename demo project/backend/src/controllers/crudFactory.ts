import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { ApiError } from "../middleware/errorHandler.js";

export function createCrudController(model: Model<any>) {
  return {
    getAll: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const items = await model.find({ published: true }).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, count: items.length, data: items });
      } catch (err) {
        next(err);
      }
    },

    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await model.findOne({ slug: req.params.slug });
        if (!item) throw new ApiError(404, "Not found");
        res.json({ success: true, data: item });
      } catch (err) {
        next(err);
      }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await model.create(req.body);
        res.status(201).json({ success: true, data: item });
      } catch (err) {
        next(err);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) throw new ApiError(404, "Not found");
        res.json({ success: true, data: item });
      } catch (err) {
        next(err);
      }
    },

    remove: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await model.findByIdAndDelete(req.params.id);
        if (!item) throw new ApiError(404, "Not found");
        res.json({ success: true, data: {} });
      } catch (err) {
        next(err);
      }
    },
  };
}
