
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Monitor, Smartphone, Timer } from "lucide-react";

const HeroAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const [showHeadline, setShowHeadline] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const inputText = "Busy dads over 35 who want to lose weight without gym time";
  const generatedAd = {
    headline: "Dad Bod to Dad Strength in 20 Minutes",
    body: "Skip the gym guilt. This proven system builds real strength while your kids watch cartoons. Join 10,000+ busy dads who transformed their bodies in just 20 minutes a day.",
    cta: "Get Your Dad Strength Blueprint (Free)",
    image: "/lovable-uploads/6a040b17-69af-419e-ae78-74717a00e18b.png"
  };

  useEffect(() => {
    const animationLoop = () => {
      // Reset all states
      setCurrentStep(1);
      setIsTyping(true);
      setTypedText("");
      setShowResults(false);
      setShowHeadline(false);
      setShowBody(false);
      setShowCTA(false);
      setCountdown(90);

      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Typing effect
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < inputText.length) {
          setTypedText(inputText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Step 2: Generate button click
          setTimeout(() => {
            setCurrentStep(2);
            
            // Step 3: Build ad elements progressively
            setTimeout(() => {
              setCurrentStep(3);
              setShowHeadline(true);
              
              setTimeout(() => {
                setShowBody(true);
                
                setTimeout(() => {
                  setShowCTA(true);
                  
                  // Step 4: Show results
                  setTimeout(() => {
                    setShowResults(true);
                    clearInterval(countdownInterval);
                    
                    // Reset after showing results
                    setTimeout(() => {
                      animationLoop();
                    }, 3000);
                  }, 1000);
                }, 800);
              }, 800);
            }, 1000);
          }, 500);
        }
      }, 50);
    };

    animationLoop();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Countdown Timer */}
      {currentStep >= 2 && countdown > 0 && (
        <div className="flex items-center justify-center mb-6">
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-lg">
            <Timer className="w-5 h-5" />
            <span className="font-mono">{countdown}s</span>
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Input Control Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-card border-2 border-muted shadow-lg">
            <div className="space-y-4">
              {/* Input Section */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">
                  Target Audience
                </label>
                <Input
                  value={typedText}
                  readOnly
                  placeholder="Enter your target audience..."
                  className={`bg-background border-muted transition-all duration-300 ${
                    isTyping ? 'border-primary' : ''
                  }`}
                />
              </div>

              {/* Generate Button */}
              <Button
                className={`w-full transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-primary hover:bg-primary/90 scale-105' : 'bg-muted'
                }`}
                disabled={currentStep < 2}
              >
                {currentStep >= 2 ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Ad"
                )}
              </Button>

              {/* Results */}
              {showResults && (
                <div className="flex items-center justify-center space-x-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm font-bold text-green-800">ROAS 30.9</span>
                  </div>
                  <div className="text-sm font-bold text-green-800">•</div>
                  <div className="text-sm font-bold text-green-800">Leads 83</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Device Mockups */}
        <div className="lg:col-span-2 space-y-6">
          {/* Desktop Mockup */}
          <div className="relative">
            <div className="bg-gray-800 rounded-t-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 ml-4">
                  <span className="text-gray-400 text-sm">facebook.com</span>
                </div>
              </div>
              
              {/* Facebook Feed Mockup */}
              <div className="bg-white rounded-lg min-h-[400px] p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">FitAd AI</h3>
                    <p className="text-sm text-gray-500">Sponsored</p>
                  </div>
                </div>

                {/* Generated Ad Content */}
                {currentStep >= 3 && (
                  <div className="space-y-3 animate-fade-in">
                    {showHeadline && (
                      <h2 className="text-xl font-bold text-gray-900 animate-fade-in">
                        {generatedAd.headline}
                      </h2>
                    )}
                    
                    {showBody && (
                      <p className="text-gray-700 animate-fade-in">
                        {generatedAd.body}
                      </p>
                    )}
                    
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <img 
                        src={generatedAd.image} 
                        alt="Ad visual" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    {showCTA && (
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white animate-fade-in">
                        {generatedAd.cta}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Mockup */}
          <div className="relative max-w-sm mx-auto">
            <div className="bg-gray-900 rounded-3xl p-4">
              <div className="bg-white rounded-2xl overflow-hidden min-h-[500px]">
                {/* Instagram Story Mockup */}
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">fitad_ai</h3>
                      <p className="text-xs text-gray-500">Sponsored</p>
                    </div>
                  </div>

                  {/* Generated Ad Content - Mobile Version */}
                  {currentStep >= 3 && (
                    <div className="space-y-3">
                      {showHeadline && (
                        <h2 className="text-lg font-bold text-gray-900 animate-fade-in">
                          {generatedAd.headline}
                        </h2>
                      )}
                      
                      <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <img 
                          src={generatedAd.image} 
                          alt="Ad visual" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      {showBody && (
                        <p className="text-gray-700 text-sm animate-fade-in">
                          {generatedAd.body}
                        </p>
                      )}
                      
                      {showCTA && (
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm animate-fade-in">
                          {generatedAd.cta}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;
