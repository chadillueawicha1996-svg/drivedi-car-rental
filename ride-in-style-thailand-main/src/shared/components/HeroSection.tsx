import { useState, useEffect } from "react";
import { SearchForm } from "@/user/components/SearchForm";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop",
    alt: "วัดพระธาตุดอยสุเทพ เชียงใหม่"
  },
  {
    src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2070&auto=format&fit=crop",
    alt: "หาดป่าตอง ภูเก็ต"
  },
  {
    src: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=2070&auto=format&fit=crop",
    alt: "วัดพระแก้ว กรุงเทพ"
  }
];

export const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[600px]">
      <div className="relative w-full h-full">
        <img
          src="/images/hero/kran.JPG"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-10"></div>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl z-20">
        <SearchForm />
      </div>
    </section>
  );
};
