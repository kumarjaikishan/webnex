import { Router } from "express";
import { Model } from "mongoose";
import { createCrudController } from "../controllers/crudFactory.js";

export function createContentRouter(model: Model<any>, options: { hasSlug?: boolean } = {}) {
  const router = Router();
  const controller = createCrudController(model);

  router.get("/", controller.getAll);
  if (options.hasSlug) {
    router.get("/:slug", controller.getOne);
  }
  router.post("/", controller.create); // TODO: protect with admin auth before production use
  router.put("/:id", controller.update); // TODO: protect with admin auth before production use
  router.delete("/:id", controller.remove); // TODO: protect with admin auth before production use

  return router;
}
