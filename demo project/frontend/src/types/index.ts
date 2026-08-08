export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide-react icon name
  category: "core" | "business-systems" | "growth";
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  cover: string;
  tags: string[];
  problem: string;
  solution: string;
  technology: string[];
  businessImpact: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  clientProblem: string;
  ourSolution: string;
  technologies: string[];
  challenges: string;
  result: string;
  businessGrowth: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  business: string;
  location: string;
  rating: number;
  review: string;
  avatar: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  startingPrice: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  cover: string;
}
