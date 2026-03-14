import CTASection from "@/components/landing/CTASection";
import FeaturesBento from "@/components/landing/FeaturesBento";
import FourPillars from "@/components/landing/FourPillars";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import NEPSection from "@/components/landing/NEPSection";
import StatsCounter from "@/components/landing/StatsCounter";
import TestimonialsCarousel from "@/components/landing/TestimonialsCarousel";
import TrustedByBar from "@/components/landing/TrustedByBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustedByBar />
      <FourPillars />
      <HowItWorks />
      <FeaturesBento />
      <StatsCounter />
      <TestimonialsCarousel />
      <NEPSection />
      <CTASection />
    </>
  );
}
