
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
  Play
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
  const [email, setEmail] = useState("");
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
      <section className="min-h-screen flex items-center justify-center px-4 py-16 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text and CTA */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-3 py-1.5 text-sm font-semibold">
                Built For Coaches. By a Coach.
              </Badge>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 animate-fade-in">
                Not Another GPT Tool.<br />
                This <span className="text-gradient">Prints Scroll-Stopping</span><br />
                Fitness Ads.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Built for Coaches. By a Coach. Not an AI intern.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                <CTAButton size="lg">Generate Your First Ad</CTAButton>
                <button className="flex items-center text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-10 h-10 border-2 border-muted rounded-full flex items-center justify-center mr-3 group-hover:border-primary transition-colors">
                    <Play className="w-4 h-4 ml-1" />
                  </div>
                  <span className="text-base font-semibold">Watch 2-min demo</span>
                </button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                ✨ No credit card required • Generate ads in 30 seconds
              </div>
            </div>

            {/* Right Column - Animation */}
            <div className="flex justify-center lg:justify-end">
              <HeroAnimation />
            </div>
          </div>
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

      {/* Scarcity Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-red-600 text-white font-bold px-3 py-1.5 text-sm animate-pulse">
              LIMITED TIME
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Only <span className="text-gradient">50 Early Users</span><br />
            Get Free Lifetime Access
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6">
            Skip the $97/month fee. Lock in your spot before we hit capacity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto mb-4">
            <Input 
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-muted"
            />
            <CTAButton className="whitespace-nowrap">Join Waitlist</CTAButton>
          </div>
          
          <div className="text-sm text-muted-foreground">
            🔒 We hate spam too. Unsubscribe anytime.
          </div>
        </div>
      </section>

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

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-muted bg-secondary/20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-xl font-bold mb-3">FitAd AI</div>
          <p className="text-muted-foreground mb-4">
            The only ad generation tool built specifically for fitness entrepreneurs.
          </p>
          <div className="text-sm text-muted-foreground">
            © 2024 FitAd AI. Built by coaches, for coaches.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
