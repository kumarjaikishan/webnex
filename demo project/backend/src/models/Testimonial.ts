import { Schema, model, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  business: string;
  location: string;
  rating: number;
  review: string;
  avatar?: string;
  published: boolean;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    business: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, required: true },
    avatar: { type: String },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
