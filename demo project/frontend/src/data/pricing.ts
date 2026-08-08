import { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "plan-starter",
    name: "Starter Website",
    startingPrice: "Starting From ₹9,999",
    description: "A clean, professional website for small businesses and individuals getting online for the first time.",
    features: ["Up to 5 pages", "Mobile responsive design", "Basic SEO setup", "Contact form", "1 round of revisions"],
  },
  {
    id: "plan-business",
    name: "Business Website",
    startingPrice: "Starting From ₹24,999",
    description: "A complete website built for businesses that want to generate consistent leads online.",
    features: ["Up to 12 pages", "Custom UI design", "Advanced SEO setup", "Blog integration", "WhatsApp & lead capture", "3 rounds of revisions"],
    highlighted: true,
  },
  {
    id: "plan-enterprise",
    name: "Enterprise Solution",
    startingPrice: "Starting From ₹79,999",
    description: "Custom platforms for organizations that need more than a website — dashboards, portals and systems.",
    features: ["Unlimited pages", "Admin dashboard", "Role-based access", "API integrations", "Priority support", "Dedicated project manager"],
  },
  {
    id: "plan-custom-app",
    name: "Custom Web App",
    startingPrice: "Starting From ₹1,49,999",
    description: "Full custom software — ERPs, CRMs, marketplaces — built around your exact business process.",
    features: ["Custom architecture", "Database design", "Scalable infrastructure", "Ongoing development", "SLA-backed support"],
  },
];
