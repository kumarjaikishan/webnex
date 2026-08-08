import { useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import PricingSection from "@/components/home/PricingSection";

export default function Pricing() {
  useEffect(() => {
    document.title = "Pricing | Lumix Digital";
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Plans Built for Every Stage of Business"
        subtitle="Transparent starting prices — your exact quote depends on your project scope."
      />
      <PricingSection />
    </>
  );
}
