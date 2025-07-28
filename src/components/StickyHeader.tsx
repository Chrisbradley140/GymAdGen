
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CTAButton from "./CTAButton";

const StickyHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => {
    if (user) {
      // User is logged in, proceed with ad generation
      console.log('Generate ad for user:', user.email);
    } else {
      // User not logged in, redirect to auth
      navigate('/auth');
    }
  };

  return (
    <div className={`fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-muted z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FitAd AI</h1>
        <CTAButton size="default" onClick={handleCTAClick}>
          Generate Your First Ad
        </CTAButton>
      </div>
    </div>
  );
};

export default StickyHeader;
