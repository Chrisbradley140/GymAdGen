
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp } from "lucide-react";

const HeroAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showResults, setShowResults] = useState(false);

  const inputText = "Busy dads over 35 who want to lose weight without gym time";
  const generatedAd = {
    hook: '"Dad Bod to Dad Strength in 20 Minutes"',
    body: "Skip the gym guilt. This proven system builds real strength while your kids watch cartoons.",
    cta: '"Get Your Dad Strength Blueprint (Free)"'
  };

  useEffect(() => {
    const animationLoop = () => {
      // Step 1: Typing animation
      setCurrentStep(1);
      setIsTyping(true);
      setTypedText("");
      setShowResults(false);

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
            
            // Step 3: Show generated ad
            setTimeout(() => {
              setCurrentStep(3);
              
              // Step 4: Show results
              setTimeout(() => {
                setShowResults(true);
                
                // Reset after showing results
                setTimeout(() => {
                  animationLoop();
                }, 2000);
              }, 1500);
            }, 1000);
          }, 500);
        }
      }, 50);
    };

    animationLoop();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
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

          {/* Generated Ad */}
          {currentStep >= 3 && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-secondary/30 rounded-lg border border-primary/20">
                <h4 className="font-bold text-primary text-xs mb-1">HOOK:</h4>
                <p className="font-semibold text-sm">{generatedAd.hook}</p>
              </div>
              
              <div className="p-3 bg-secondary/30 rounded-lg border border-primary/20">
                <h4 className="font-bold text-primary text-xs mb-1">BODY:</h4>
                <p className="text-xs">{generatedAd.body}</p>
              </div>
              
              <div className="p-3 bg-primary/20 rounded-lg border border-primary/30">
                <h4 className="font-bold text-primary text-xs mb-1">CTA:</h4>
                <p className="font-bold text-sm">{generatedAd.cta}</p>
              </div>
            </div>
          )}

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
  );
};

export default HeroAnimation;
