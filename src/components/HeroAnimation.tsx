
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap, Target } from "lucide-react";

const HeroAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const inputText = "Busy dads over 35 who want to lose weight without gym time";
  const generatedAd = {
    hook: '"Dad Bod to Dad Strength in 20 Minutes"',
    body: "Skip the gym guilt. This proven system builds real strength while your kids watch cartoons. No equipment needed.",
    cta: '"Get Your Dad Strength Blueprint (Free)"'
  };

  useEffect(() => {
    const animationLoop = () => {
      // Reset all states
      setCurrentStep(0);
      setIsTyping(false);
      setTypedText("");
      setShowResults(false);
      setIsGenerating(false);

      // Step 1: Start typing after brief pause
      setTimeout(() => {
        setCurrentStep(1);
        setIsTyping(true);
        
        // Typing effect with realistic speed
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
          if (currentIndex < inputText.length) {
            setTypedText(inputText.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            
            // Step 2: Button becomes active and starts generating
            setTimeout(() => {
              setCurrentStep(2);
              setIsGenerating(true);
              
              // Step 3: Show generated ad after generation
              setTimeout(() => {
                setIsGenerating(false);
                setCurrentStep(3);
                
                // Step 4: Show impressive results
                setTimeout(() => {
                  setShowResults(true);
                  
                  // Hold results for a moment, then restart
                  setTimeout(() => {
                    animationLoop();
                  }, 3000);
                }, 2000);
              }, 2500);
            }, 800);
          }
        }, 60); // More realistic typing speed
      }, 500);
    };

    animationLoop();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="p-6 bg-gradient-to-br from-card via-card to-secondary/30 border-2 border-primary/20 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse" />
        
        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-muted-foreground">FitAd AI Generator</span>
            </div>
            <Target className="w-4 h-4 text-primary" />
          </div>

          {/* Input Section */}
          <div>
            <label className="block text-sm font-bold mb-3 text-primary flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Target Audience
            </label>
            <Input
              value={typedText}
              readOnly
              placeholder="Enter your target audience..."
              className={`bg-background/80 border-2 transition-all duration-300 text-sm ${
                isTyping ? 'border-primary shadow-lg shadow-primary/20' : 'border-muted'
              }`}
            />
            {isTyping && (
              <div className="flex items-center mt-2 text-xs text-primary">
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce mr-1" />
                <span>AI analyzing your input...</span>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            className={`w-full transition-all duration-500 text-sm font-bold ${
              currentStep >= 2 
                ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 scale-105 shadow-lg shadow-primary/30' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            disabled={currentStep < 2}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                <span className="animate-pulse">Generating killer ad...</span>
              </>
            ) : currentStep >= 2 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Ad
              </>
            ) : (
              "Generate Ad"
            )}
          </Button>

          {/* Generated Ad */}
          {currentStep >= 3 && (
            <div className="space-y-3 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 bg-primary/20 rounded-full text-xs font-bold text-primary mb-3">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Generated
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-primary/30 transform hover:scale-105 transition-all duration-300">
                <h4 className="font-black text-primary text-xs mb-2 flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                  HOOK
                </h4>
                <p className="font-bold text-sm text-foreground">{generatedAd.hook}</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-lg border border-primary/20 transform hover:scale-105 transition-all duration-300">
                <h4 className="font-black text-primary text-xs mb-2 flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                  BODY
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{generatedAd.body}</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg border-2 border-primary/40 transform hover:scale-105 transition-all duration-300">
                <h4 className="font-black text-primary text-xs mb-2 flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                  CTA
                </h4>
                <p className="font-bold text-sm text-foreground">{generatedAd.cta}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur-sm" />
              <div className="relative flex items-center justify-center space-x-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg animate-fade-in">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
                    <span className="text-lg font-black text-green-800">30.9</span>
                  </div>
                  <div className="text-xs font-semibold text-green-700">ROAS</div>
                </div>
                <div className="w-px h-8 bg-green-300" />
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="w-5 h-5 text-green-600 mr-1" />
                    <span className="text-lg font-black text-green-800">83</span>
                  </div>
                  <div className="text-xs font-semibold text-green-700">Leads</div>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs font-bold text-green-600 animate-pulse">🔥 Performance Boost!</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HeroAnimation;
