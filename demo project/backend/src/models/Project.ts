import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  slug: string;
  title: string;
  tagline: string;
  cover?: string;
  tags: string[];
  problem: string;
  solution: string;
  technology: string[];
  businessImpact: string;
  published: boolean;
}

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    cover: { type: String },
    tags: [{ type: String }],
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    technology: [{ type: String }],
    businessImpact: { type: String, required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
