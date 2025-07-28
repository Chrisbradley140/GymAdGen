
import { useState, useEffect } from "react";
import CTAButton from "./CTAButton";

const StickyHeader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-muted z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FitAd AI</h1>
        <CTAButton size="default">Generate Your First Ad</CTAButton>
      </div>
    </div>
  );
};

export default StickyHeader;
