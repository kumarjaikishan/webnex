import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  icon: string;
  category: "core" | "business-systems" | "growth";
  order: number;
  published: boolean;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true, default: "Globe" },
    category: { type: String, enum: ["core", "business-systems", "growth"], default: "core" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = model<IService>("Service", serviceSchema);
