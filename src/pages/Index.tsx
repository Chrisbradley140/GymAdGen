
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
import AdCard from "@/components/AdCard";
import BenefitCard from "@/components/BenefitCard";
import ProductDemo from "@/components/ProductDemo";
import Navigation from "@/components/Navigation";
import FAQ from "@/components/FAQ";
import ResultsShowcase from "@/components/ResultsShowcase";
import HeroAnimation from "@/components/HeroAnimation";

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
          {/* Center Glowing Logo */}
          <div className="mb-12">
            <div className="relative inline-block">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-primary rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-50 scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-red-500 rounded-2xl opacity-80"></div>
                
                {/* Logo Content */}
                <div className="relative z-10">
                  <Zap className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Top Badge */}
          <div className="mb-8">
            <div className="inline-block bg-secondary/30 rounded-full px-4 py-2 border border-muted">
              <span className="text-sm text-muted-foreground font-klein">
                The FIRST fitness MARKETING AI TOOL MADE BY{" "}
                <span className="font-bold text-primary">GYMS OWNERS & ONLINE COACHES</span>
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 
            className="font-klein font-extrabold text-white text-center mb-8"
            style={{
              fontSize: '60px',
              fontWeight: '800',
              lineHeight: '77px',
              letterSpacing: '-2px',
            }}
          >
            Outperform 'Fitness Marketing Agencies', Canva Templates and ChatGPT —{" "}
            <br className="hidden md:block" />
            With The AI Ad Tool Built for Real Fitness Businesses.
          </h1>

          {/* Subheadline CTA */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xl md:text-2xl font-semibold text-white font-klein">
              <span>Get Money Printing Ads In</span>
              <div className="bg-primary px-4 py-2 rounded-full">
                <span className="text-white font-bold font-klein">20 seconds</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-12">
            <CTAButton size="lg">Generate Your First Ad</CTAButton>
          </div>

          {/* Footer Tagline */}
          <p className="text-sm md:text-base text-muted-foreground/80 max-w-2xl mx-auto font-klein">
            No more ChatGPT garbage that sounds like it was written by your nan.
          </p>
        </div>
      </section>

      {/* How It Works / Product Proof */}
      <section className="py-12 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              From Weak Copy → <span className="text-gradient">Profit-Pulling Ads</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how real fitness entrepreneurs turned their ad disasters into money-makers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <AdCard
              label="Weight Loss Coach"
              hook="Stop Counting Calories. Start Dropping Pounds."
              body="This 15-minute morning ritual burns fat while you drink your coffee. No gym. No starving. Just results."
              cta="Get Your Fat-Burning Blueprint (Free)"
              performance="+284% CTR"
            />
            
            <AdCard
              label="Strength Coach"
              hook="Weak at 40? This Changes Everything."
              body="Former weakling shows you how to build impressive strength without living in the gym."
              cta="Download My Strength System"
              performance="+195% Leads"
            />
            
            <AdCard
              label="Nutrition Coach"
              hook="Eat Pizza. Lose Weight. (Here's How)"
              body="The 'backwards' nutrition approach that melts fat while you enjoy your favorite foods."
              cta="Get My Food Freedom Guide"
              performance="+312% ROAS"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Stop Bleeding Money on <span className="text-gradient">Bad Ads</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Built specifically for fitness entrepreneurs who are tired of ads that don't convert
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <BenefitCard
              icon={DollarSign}
              title="Stop Wasting Money"
              description="End the cycle of throwing cash at ads that get ignored. Every ad this tool generates is built to convert."
            />
            
            <BenefitCard
              icon={Target}
              title="Write Like a Pro"
              description="Get copy that reads like you hired a $5K/month copywriter. Hooks that stop thumbs, bodies that build desire."
            />
            
            <BenefitCard
              icon={TrendingUp}
              title="Scale Your Revenue"
              description="Turn your best-performing ads into profit machines. Consistent results, predictable growth."
            />
          </div>
        </div>
      </section>

      {/* Product Demo */}
      <section className="py-12 px-4 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Watch It <span className="text-gradient">Transform</span> Your Input
            </h2>
            <p className="text-lg text-muted-foreground">
              From basic info to high-converting ad copy in seconds
            </p>
          </div>

          <ProductDemo />
        </div>
      </section>

      {/* New Results Showcase Section */}
      <ResultsShowcase />

      {/* Social Proof */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Real Results from <span className="text-gradient">Real Coaches</span>
            </h2>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">284%</div>
              <div className="text-muted-foreground">Average ROAS Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">$2.3M</div>
              <div className="text-muted-foreground">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">47s</div>
              <div className="text-muted-foreground">Average Gen Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Coaches Using It</div>
            </div>
          </div>

          {/* Testimonial Slider */}
          <Card className="p-8 bg-secondary/30 border-muted relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl font-semibold mb-4 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="mb-3">
                <div className="font-bold text-base">{testimonials[currentTestimonial].name}</div>
                <div className="text-muted-foreground text-sm">{testimonials[currentTestimonial].title}</div>
              </div>
              
              <Badge className="bg-green-600 text-white font-bold px-3 py-1">
                {testimonials[currentTestimonial].result}
              </Badge>
            </div>
            
            <button 
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-primary" />
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-primary" />
            </button>
          </Card>
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
