import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import InstitutionsSection from "@/components/landing/InstitutionsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RolesSection from "@/components/landing/RolesSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <InstitutionsSection />
      <FeaturesSection />
      <RolesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
