import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Phone,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Library,
  Settings,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CTAButton from "@/components/CTAButton";
import AdCard from "@/components/AdCard";
import BenefitCard from "@/components/BenefitCard";
import ProductDemo from "@/components/ProductDemo";
import FAQ from "@/components/FAQ";
import ResultsShowcase from "@/components/ResultsShowcase";
import HeroAnimation from "@/components/HeroAnimation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const handleLogoClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Ad Generator", path: "/generate", icon: Zap },
    { name: "Campaign Library", path: "/library", icon: Library },
    { name: "Brand Setup", path: "/brand-setup", icon: Settings },
    { name: "Export PDF", path: "/export", icon: FileText },
    { name: "Account", path: "/account", icon: User },
  ];

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

  const badgePhrases = [
    "This isn't just another program",
    "We're not like the other guys",
    "Results guaranteed - or your money back",
    "Our proven system has helped thousands",
    "You're just one step away",
    "Ready to take things to the next level?",
    "Sound familiar?",
    "It's time to stop settling",
    "No fluff - just results",
    "Don't wait - act now"
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with integrated navigation */}
      <section 
        className="min-h-screen flex flex-col px-4 py-6 relative overflow-hidden font-klein"
        style={{
          backgroundImage: `url('/lovable-uploads/bee63c12-d6f3-4277-9edb-5f0fc8c01595.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Navigation Header */}
        <nav className="relative z-50 w-full">
          <div className="container mx-auto flex justify-between items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleLogoClick}
            >
              <img 
                src="/lovable-uploads/c4cf7462-6a0c-4f7b-ac89-546cd215771a.png" 
                alt="FitnessAds.AI Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-white">FITNESSADS.AI</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{user.email}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover">
                    <DropdownMenuLabel className="text-muted-foreground">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {navigationItems.map((item) => (
                      <DropdownMenuItem
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleAuthAction}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={handleAuthAction}
                  className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="max-w-5xl mx-auto text-center">
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
                  className="px-6 py-3 rounded-md"
                  style={{ backgroundColor: '#FE0010' }}
                >
                  <span className="text-white font-bold font-klein text-2xl md:text-3xl">20 seconds</span>
                </div>
              </div>
            </div>

            {/* Footer Tagline */}
            <p 
              className="text-base md:text-lg text-white max-w-2xl mx-auto font-semibold"
              style={{ fontFamily: "'Klein Condensed Trial', sans-serif" }}
            >
              No more ChatGPT garbage that sounds like it was written by your nan.
            </p>
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

      {/* ChatGPT Drive Section */}
      <section 
        className="py-16 px-4 relative overflow-hidden"
        style={{
          backgroundImage: `url('/lovable-uploads/5ab46530-2ea7-444d-b47c-765e37a84154.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay with 40% opacity */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Top Section */}
          <div className="text-left mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-klein">
              <span className="block">Recognise Any of This</span>
              <span className="block">ChatGPT Drive?</span>
            </h2>
            <p className="text-lg text-white/90 max-w-3xl leading-relaxed px-4">
              You've seen these clichés everywhere. Generic, soulless copy that screams "I used AI" from a mile away. 
              Your audience is tired of it. They scroll past it. They ignore it.
            </p>
          </div>

          {/* Badges Section */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-start">
              {badgePhrases.map((phrase, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-full px-4 py-2 text-white/80 text-sm hover:bg-gray-600/50 transition-all duration-200 hover:scale-105"
                >
                  {phrase}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Paragraph */}
          <div className="text-center">
            <p className="text-white/70 max-w-4xl mx-auto leading-relaxed text-sm px-4">
              AI is only as good as the data sets you give it. ChatGPT was trained on billions of web pages filled with 
              generic marketing drivel. Kong was trained exclusively on high-converting fitness ads that actually made money. 
              The difference? Kong doesn't sound like every other AI tool because it learned from winners, not wannabes.
            </p>
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
