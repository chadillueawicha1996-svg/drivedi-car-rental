
import { SearchForm } from "../components/SearchForm";
import { FeaturedCars } from "@/shared/components/FeaturedCars";
import { Services } from "@/shared/components/Services";
import { ContactSection } from "@/shared/components/ContactSection";
import { Navigation } from "../components/Navigation";
import { HeroSection } from "@/shared/components/HeroSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navigation />
      <HeroSection />
      <FeaturedCars />
      <Services />
      <ContactSection />
    </div>
  );
};

export default Index;
