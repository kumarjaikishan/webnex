import { Schema, model, Document } from "mongoose";

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover?: string;
  readTime: string;
  published: boolean;
  publishedAt: Date;
}

const blogSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    cover: { type: String },
    readTime: { type: String, default: "5 min read" },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const BlogPost = model<IBlogPost>("BlogPost", blogSchema);
