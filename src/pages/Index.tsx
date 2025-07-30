
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Users,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import CTAButton from "@/components/CTAButton";
import Navigation from "@/components/Navigation";
import FAQ from "@/components/FAQ";

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Marcus Chen",
      title: "Online Fitness Coach",
      content: "This tool 3x'd my ad performance in the first month. Finally, ads that actually convert.",
      result: "+312% ROAS"
    },
    {
      name: "Sarah Martinez", 
      title: "Gym Owner",
      content: "Stopped burning money on ads that don't work. This prints results like nothing I've seen.",
      result: "$47K Revenue"
    },
    {
      name: "Jake Thompson",
      title: "Transformation Coach", 
      content: "My ads went from crickets to cash machines overnight. This is the real deal.",
      result: "+180% Leads"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16 pt-24 relative overflow-hidden font-klein">
        {/* Grid Pattern Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Center Logo */}
          <div className="mb-8">
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/36e2fe4a-6176-4447-8958-b3608de4485e.png" 
                alt="FitnessAds.AI Logo" 
                className="w-20 h-20 rounded-full shadow-lg glow-orange"
              />
            </div>
          </div>

          {/* Marketing Tool Description */}
          <div className="mb-8">
            <p className="text-sm text-white font-klein">
              <span className="text-white">The FIRST fitness MARKETING AI TOOL MADE BY</span>{" "}
              <span className="font-bold" style={{ color: '#FE0010' }}>GYMS OWNERS & ONLINE COACHES</span>
            </p>
          </div>

          {/* Main Headline */}
          <h1 
            className="font-klein font-extrabold text-white text-center mb-8"
            style={{
              fontSize: '42px',
              fontWeight: '800',
              lineHeight: '52px',
              letterSpacing: '-2px',
            }}
          >
            Outperform 'Fitness Marketing Agencies', Canva
            <br className="block" />
            Templates and ChatGPT — With The AI Ad Tool
            <br className="block" />
            Built for Real Fitness Businesses.
          </h1>

          {/* Subheadline CTA */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-2xl md:text-3xl font-semibold text-white font-klein">
              <span>Get Money Printing Ads In</span>
              <div 
                className="px-8 py-4 rounded-md"
                style={{ backgroundColor: '#FE0010' }}
              >
                <span className="text-white font-bold font-klein text-3xl md:text-4xl">20 seconds</span>
              </div>
            </div>
          </div>

          {/* Footer Tagline */}
          <p 
            className="text-lg md:text-xl text-white max-w-2xl mx-auto font-semibold"
            style={{ fontFamily: "'Klein Condensed Trial', sans-serif" }}
          >
            No more ChatGPT garbage that sounds like it was written by your nan.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            This Isn't a Tool.<br />
            It's a <span className="text-gradient">Fitness Ad Weapon.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop competing on price. Start dominating with copy that converts like crazy.
          </p>
          
          <CTAButton size="lg">Generate Your First Ad</CTAButton>
          
          <div className="mt-6 text-sm text-muted-foreground">
            Join 500+ fitness entrepreneurs already crushing it
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-12 px-4 border-t border-muted bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          {/* Bottom Section */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              © 2024 FitnessAds.ai. All rights reserved. Built by coaches, for coaches.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
