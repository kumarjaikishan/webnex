import { Router } from "express";
import leadsRouter from "./leads.js";
import { createContentRouter } from "./contentRouterFactory.js";
import { Testimonial } from "../models/Testimonial.js";
import { Project } from "../models/Project.js";
import { BlogPost } from "../models/BlogPost.js";
import { FAQ } from "../models/FAQ.js";
import { Service } from "../models/Service.js";

const router = Router();

router.use("/leads", leadsRouter);
router.use("/testimonials", createContentRouter(Testimonial));
router.use("/projects", createContentRouter(Project, { hasSlug: true }));
router.use("/blog", createContentRouter(BlogPost, { hasSlug: true }));
router.use("/faqs", createContentRouter(FAQ));
router.use("/services", createContentRouter(Service));

router.get("/health", (_req, res) => res.json({ success: true, message: "Lumix Digital API is running" }));

export default router;
