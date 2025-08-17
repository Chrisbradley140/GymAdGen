
import { useState, useEffect } from "react";
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
  FileText,
  Check
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
import ComparisonTable from "@/components/ComparisonTable";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [liveCounter, setLiveCounter] = useState(147);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Live counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => {
        // Randomly increment between 1-3 every 30-60 seconds
        const increment = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
        const newValue = prev + increment;
        // Keep it between 147 and 199 to stay realistic
        return Math.min(newValue, 199);
      });
    }, Math.random() * 30000 + 30000); // 30-60 seconds

    return () => clearInterval(interval);
  }, []);

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

  const rightBadgePhrases = [
    "Are you tired of feeling stuck?",
    "Unlock your full potential",
    "Step into your power",
    "Game-changing offer",
    "Crush your goals",
    "Discover the secret to success",
    "Live the life you deserve",
    "What if I told you...",
    "It's not your fault",
    "Join a community of like-minded individuals",
    "Click the link below to get started"
  ];

  const floatingEmojis = [
    { src: "/lovable-uploads/0e7dfd69-d2c4-4337-9a53-f7083d24feef.png", top: "20%", left: "-60px" },
    { src: "/lovable-uploads/380a2309-f988-4fc4-94e0-0efd0501082a.png", top: "60%", left: "-50px" },
    { src: "/lovable-uploads/b08c3395-c0c6-48d2-a16d-838dc51a2d36.png", top: "30%", right: "-60px" },
    { src: "/lovable-uploads/156100f0-a562-4072-927d-e95b76e42ab5.png", top: "70%", right: "-70px" }
  ];

  const leftFloatingEmojis = [
    { src: "/lovable-uploads/b4a1dafd-17d8-4e57-be39-7bba36123b1e.png", top: "15%", left: "-60px" },
    { src: "/lovable-uploads/bb03f84d-37a1-4b96-b1f4-573b3c7c8ce6.png", top: "45%", left: "-50px" },
    { src: "/lovable-uploads/8fc795c7-b7fa-477b-940a-aa5a24328099.png", top: "25%", right: "-60px" },
    { src: "/lovable-uploads/3f3b8dbd-5ce2-430a-a79e-f092a8d6e332.png", top: "65%", right: "-70px" }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const setCurrentStep = (arg0: number) => {
    throw new Error("Function not implemented.");
  }

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
              <span className="text-xl font-bold text-white font-klein">FITNESSADS.AI</span>
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
                  className="flex items-center gap-2 text-white border-white/20 hover:bg-white/10"
                  style={{ backgroundColor: '#FF3600' }}
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
                <span className="text-white">For gyms, studios, and coaches who want</span>{" "}
                <span className="font-bold" style={{ color: '#FE0010' }}>more sign-ups without the guesswork.</span>
              </p>
            </div>

            {/* Main Headline */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center justify-center gap-4 font-klein font-extrabold text-white text-3xl md:text-4xl lg:text-5xl leading-tight">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <span>Get More Fitness Clients in</span>
                  <div 
                    className="px-6 py-3 rounded-md"
                    style={{ backgroundColor: '#FE0010' }}
                  >
                    <span className="text-white font-bold font-klein text-3xl md:text-4xl lg:text-5xl">90 Seconds</span>
                  </div>
                </div>
                <div>
                  — With Ads Built Just for Fitness Businesses.
                </div>
              </div>
            </div>

            {/* New tagline */}
            <div className="mb-8">
              <p className="text-xl md:text-2xl font-semibold text-white font-klein">
                The world's first ad engine trained on £100k/month of real fitness ad spend.
              </p>
            </div>

            {/* Footer Tagline */}
            <p className="text-base md:text-lg text-white max-w-2xl mx-auto font-semibold font-klein mb-8">
              No generic AI. No wasted time. Just campaigns that convert.
            </p>

            {/* Primary CTA */}
            <div className="flex justify-center">
              <CTAButton size="lg">
                Build My First Campaign
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Micro-Proof Section at bottom of header */}
        <div className="relative z-50 w-full mb-8">
          <div className="container mx-auto flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3">
              <p className="text-white text-sm font-medium font-klein text-center">
                Already used by <span className="font-bold text-orange-400">{liveCounter}</span> UK gyms, studios, and coaches — be part of the first 200.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO ELSE IS USING FITNESSADS.AI Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-klein">
              Who Else Is Already Winning With FitnessAds.ai?
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              From solo PTs to multi-location studios, early adopters are getting results that would've taken weeks — now in minutes.
            </p>
          </div>

          {/* Enhanced Proof Tiles Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Rorie - Online Coach */}
            <Card className="relative p-8 bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 backdrop-blur-sm group">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">R</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Rorie</h3>
                  <p className="text-muted-foreground font-medium">Online Coach for Semi Professional Footballers</p>
                </div>
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-4xl font-black text-primary mb-3">£10k</p>
                  <p className="text-white font-medium leading-relaxed">per month online after launching FitnessAds.ai-generated campaigns</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>

            {/* Vanda - Studio Owner */}
            <Card className="relative p-8 bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 backdrop-blur-sm group">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">V</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Vanda</h3>
                  <p className="text-muted-foreground font-medium">Studio Owner</p>
                </div>
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-4xl font-black text-primary mb-3">£34,956</p>
                  <p className="text-white font-medium leading-relaxed">in sales from one campaign pack</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>

            {/* Chris - Group PT Gym */}
            <Card className="relative p-8 bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 backdrop-blur-sm group">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">C</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Chris</h3>
                  <p className="text-muted-foreground font-medium">Group PT Gym</p>
                </div>
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-4xl font-black text-primary mb-3">133</p>
                  <p className="text-white font-medium leading-relaxed">SGPT members and expanding to a second site</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <CTAButton size="lg" onClick={() => navigate('/auth')}>
              Join the Movement Now
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Section After Hero - Left Aligned and Responsive */}
      <section 
        className="px-4 py-16"
        style={{ backgroundColor: '#1a1820' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 font-klein">
              This isn't chatGpt wearing gym leggings that make it's glutes look bigger
            </h2>
            <p className="text-lg text-white/90 max-w-3xl leading-relaxed mb-8">
              You don't need another AI that can write a 5/10 ad for any industry under the sun.
              You need one that knows your buyers inside out. What they think, feel, and fear at the exact moment they see your ad.
            </p>
            
            {/* New Heading for Bullet Points */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 font-klein">
              FitnessAds.ai was trained on
            </h3>
            
            {/* Bullet Points */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-lg text-white font-medium">1000's of real gym + online coaching ads</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-lg text-white font-medium">Real lead data</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-lg text-white font-medium">Real buying behaviour</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-lg text-white font-medium">And it writes ads in your voice, your tone, your values</p>
              </div>
            </div>

            {/* New Layout Section - Left Aligned */}
            <div className="mt-16">
              <p className="text-white font-klein max-w-[600px] text-xl md:text-2xl font-bold leading-relaxed">
                It doesn't write generic garbage. It writes stuff that converts. Fast. We've tested them all.
                <br /><br />
                But it's hard to make good ad creative at scale. And the bottleneck is creative, until now…
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Results Showcase Section - moved before ChatGPT Drive section */}
      <ResultsShowcase />

      {/* ChatGPT Drive Section - moved after Results Showcase */}
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
          {/* Top Section with Badges */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8 relative">
            {/* Left Side - Heading and Description */}
            <div className="lg:w-3/5 relative">
              <h2 className="text-2xl md:text-4xl font-black text-white mb-6 font-klein">
                <span className="block">Recognise Any of This</span>
                <span className="block">ChatGPT Drive?</span>
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                What's the secret sauce? How can I give ChatGPT a wedgie so bad his cousin Claude feels it? PLUS, make better ads that beat 99% of copywriters? It's in my proprietary private data set. Lemme explain…
              </p>
              
              {/* Left Badges - Vertical Layout with floating emojis */}
              <div className="flex flex-col gap-3 items-start max-w-md relative">
                {badgePhrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-lg px-4 py-2 text-sm hover:bg-gray-600/40 transition-all duration-200 hover:scale-105"
                    style={{ color: '#FFFFFF' }}
                  >
                    {phrase}
                  </div>
                ))}
                
                {/* Left Floating Emojis */}
                {leftFloatingEmojis.map((emoji, index) => (
                  <img
                    key={index}
                    src={emoji.src}
                    alt="emoji"
                    className="absolute w-12 h-12 animate-bounce"
                    style={{
                      top: emoji.top,
                      ...(emoji.left ? { left: emoji.left } : { right: emoji.right }),
                      animationDelay: `${index * 0.5}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Right Badges with floating emojis */}
            <div className="lg:absolute lg:right-0 lg:top-0 lg:w-80 lg:pt-16 relative">
              <div className="flex flex-col gap-3 items-start">
                {rightBadgePhrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-lg px-4 py-2 text-sm hover:bg-gray-600/40 transition-all duration-200 hover:scale-105"
                    style={{ color: '#FFFFFF' }}
                  >
                    {phrase}
                  </div>
                ))}
              </div>
              
              {/* Right Floating Emojis */}
              {floatingEmojis.map((emoji, index) => (
                <img
                  key={index}
                  src={emoji.src}
                  alt="emoji"
                  className="absolute w-12 h-12 animate-bounce"
                  style={{
                    top: emoji.top,
                    ...(emoji.left ? { left: emoji.left } : { right: emoji.right }),
                    animationDelay: `${index * 0.5}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Paragraph - moved higher up */}
          <div className="flex justify-start pl-[50%] -mt-16">
            <div className="w-full max-w-2xl">
              <p className="font-inter font-normal text-left text-lg leading-relaxed text-white">
                AI is only as good as the data sets you give it. And my Daddy (Sabri Suby) runs a digital marketing agency that's generated over $7.8 billion (with a B) in ROAS. We've taken that data and fed it into Kong. Creating a large language model (LLM) on the best-performing ad copy and creatives from over $200m in ad spend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Facebook Cost Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Content */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 font-klein leading-tight">
                The cost to advertise
                <br />
                on <span style={{ color: '#1478ED' }}>FACEBOOK</span> has
                <br />
                <br />
                <span className="bg-white text-black px-3 py-1 rounded-lg">almost doubled!</span>
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                The cost of traffic is going to keep going up. The businesses that will win are the ones that can get the most leverage from traffic.
              </p>
              <p className="text-sm text-muted-foreground">
                Source: enhencer.com
              </p>
            </div>

            {/* Right Side - Chart Image */}
            <div className="lg:w-1/2 flex justify-center">
              <img 
                src="/lovable-uploads/e5c0642e-d7f1-491f-933b-10802e0174d2.png" 
                alt="Facebook advertising cost chart showing increase from $7.29 in 2017 to $13.20 in 2024"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <ComparisonTable />

      {/* WHO IT'S FOR Section */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 font-klein">
              Whether You're a Solo PT or Running 5 Locations — We've Got You Covered.
            </h2>
          </div>

          {/* Personas Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Burnt-Out Online Coach */}
            <Card className="p-6 border border-muted hover:border-primary transition-colors">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-primary mb-2 font-klein">Burnt-Out Online Coach</h3>
                <Target className="w-8 h-8 text-primary mb-3" />
                <p className="text-muted-foreground">Done-for-you ads in your voice.</p>
              </div>
            </Card>

            {/* Local Gym Owner */}
            <Card className="p-6 border border-muted hover:border-primary transition-colors">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-primary mb-2 font-klein">Local Gym Owner</h3>
                <MapPin className="w-8 h-8 text-primary mb-3" />
                <p className="text-muted-foreground">Hyper-local ads that stand out in a crowded feed.</p>
              </div>
            </Card>

            {/* Solo PT in Big Box Gym */}
            <Card className="p-6 border border-muted hover:border-primary transition-colors">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-primary mb-2 font-klein">Solo PT in Big Box Gym</h3>
                <User className="w-8 h-8 text-primary mb-3" />
                <p className="text-muted-foreground">Postcode-targeted campaigns, no funnel required.</p>
              </div>
            </Card>

            {/* Wellness Niche Coach */}
            <Card className="p-6 border border-muted hover:border-primary transition-colors">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-primary mb-2 font-klein">Wellness Niche Coach</h3>
                <Star className="w-8 h-8 text-primary mb-3" />
                <p className="text-muted-foreground">Tone-matched ads with emotional precision.</p>
              </div>
            </Card>

            {/* Studio Scaling Fast */}
            <Card className="p-6 border border-muted hover:border-primary transition-colors md:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-primary mb-2 font-klein">Studio Scaling Fast</h3>
                <TrendingUp className="w-8 h-8 text-primary mb-3" />
                <p className="text-muted-foreground">Brand-cohesive campaigns, seasonally aligned.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 font-klein">
              Professional Ads at a Fraction of Traditional Costs.
            </h2>
          </div>

          {/* Clean Pricing Table */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Pro Plan */}
            <Card className="p-8 border border-muted bg-card/50 backdrop-blur-sm hover:border-muted-foreground/20 transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 font-klein">Pro</h3>
                <div className="text-4xl font-black text-white mb-2 font-klein">£99</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Unlimited ad generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Basic analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Single user account</span>
                </div>
              </div>
              <Button className="w-full" variant="outline">Get Started</Button>
            </Card>

            {/* Scale Plan */}
            <Card className="p-8 border border-primary bg-card/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 font-klein">Scale</h3>
                <div className="text-4xl font-black text-white mb-2 font-klein">£199</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Everything in Pro</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Team accounts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Multi-location support</span>
                </div>
              </div>
              <Button className="w-full">Get Started</Button>
            </Card>

            {/* Lifetime Deal - Highlighted in Brand Orange */}
            <Card className="p-8 border-2 border-primary bg-primary/5 backdrop-blur-sm relative overflow-hidden glow-orange">
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 text-xs font-bold rounded-full">
                LIMITED SPOTS
              </div>
              <div className="text-center mb-6 mt-6">
                <h3 className="text-xl font-bold text-primary mb-2 font-klein">Lifetime Deal</h3>
                <div className="text-4xl font-black text-primary mb-2 font-klein">£499</div>
                <p className="text-sm text-primary/80">one-time payment</p>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Everything in Scale</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Future updates included</span>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Claim Your Spot
              </Button>
            </Card>
          </div>

          {/* Reassurance Text */}
          <div className="text-center mb-8">
            <p className="text-lg text-muted-foreground">
              Start small. Test with £5/day. See results before you scale.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <CTAButton size="lg">
              Get Started Today
            </CTAButton>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg mb-4">🔥 What you are waiting for? 🔥</p>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight font-klein">
            Still <span className="bg-white text-black px-3 py-1 rounded-lg inline-block">Reading</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            You've seen what generic AI can do. Now meet the weapon built for fitness business owners who want better clients, cheaper leads, and profitable ads fast.
          </p>
          
          <CTAButton size="lg" className="rounded-2xl">Get started</CTAButton>
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
