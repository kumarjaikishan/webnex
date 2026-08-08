import { Schema, model, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  businessType?: string;
  message?: string;
  source?: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    businessType: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, trim: true, default: "website" },
    status: { type: String, enum: ["new", "contacted", "converted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export const Lead = model<ILead>("Lead", leadSchema);
