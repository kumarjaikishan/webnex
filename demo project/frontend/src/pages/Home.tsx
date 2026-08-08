import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ServicesGrid from "@/components/home/ServicesGrid";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import TestimonialsSlider from "@/components/home/TestimonialsSlider";
import PricingSection from "@/components/home/PricingSection";
import FAQPreview from "@/components/home/FAQPreview";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  useEffect(() => {
    document.title = "Lumix Digital | Website Development Company in Bihar Sharif, Nalanda";
  }, []);

  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <WhyChooseUs />
      <ProcessTimeline />
      <FeaturedProjects />
      <TestimonialsSlider />
      <PricingSection />
      <FAQPreview />
      <CTASection />
    </>
  );
}
