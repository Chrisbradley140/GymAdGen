
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Target, Zap, ArrowRight } from "lucide-react";

const HeroAnimation = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMagic, setShowMagic] = useState(false);

  const inputText = "Busy dads who want to lose weight without gym time";
  const phases = [
    { 
      title: "Your Input", 
      color: "border-muted", 
      bg: "bg-card",
      icon: Target 
    },
    { 
      title: "AI Processing", 
      color: "border-primary/50", 
      bg: "bg-primary/5",
      icon: Zap 
    },
    { 
      title: "Generated Ad", 
      color: "border-green-500", 
      bg: "bg-green-50",
      icon: TrendingUp 
    }
  ];

  const generatedAd = {
    hook: "Dad Bod to Dad Strength in 20 Minutes",
    body: "Skip the gym guilt. This proven system builds real strength while your kids watch cartoons. No equipment needed.",
    cta: "Get Your Dad Strength Blueprint (Free)"
  };

  const results = {
    roas: "42.8",
    leads: "127",
    ctr: "8.4%"
  };

  useEffect(() => {
    const animationCycle = () => {
      // Phase 1: Typing
      setCurrentPhase(0);
      setTypedText("");
      setIsGenerating(false);
      setShowMagic(false);

      // Typing animation
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < inputText.length) {
          setTypedText(inputText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          
          // Phase 2: Processing
          setTimeout(() => {
            setCurrentPhase(1);
            setIsGenerating(true);
            setShowMagic(true);
            
            // Phase 3: Results
            setTimeout(() => {
              setCurrentPhase(2);
              setIsGenerating(false);
              
              // Hold results then restart
              setTimeout(() => {
                animationCycle();
              }, 3000);
            }, 2000);
          }, 800);
        }
      }, 60);
    };

    animationCycle();
  }, []);

  const currentPhaseData = phases[currentPhase];
  const IconComponent = currentPhaseData.icon;

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Magic particles */}
      {showMagic && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.5s"
              }}
            />
          ))}
        </div>
      )}

      {/* Main morphing card */}
      <Card className={`relative p-6 transition-all duration-700 transform ${currentPhaseData.color} ${currentPhaseData.bg} ${
        currentPhase === 1 ? 'scale-105 shadow-2xl' : 'shadow-lg'
      }`}>
        
        {/* Header with icon and title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full transition-all duration-500 ${
            currentPhase === 1 ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-secondary'
          }`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-muted-foreground">
            {currentPhaseData.title}
          </h3>
        </div>

        {/* Phase 0: Input */}
        {currentPhase === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2 text-primary">
                Target Audience
              </label>
              <Input
                value={typedText}
                readOnly
                placeholder="Enter your target audience..."
                className="bg-background/50 border-dashed text-sm"
              />
            </div>
            <Button 
              className="w-full opacity-50"
              disabled
            >
              Generate Ad
            </Button>
          </div>
        )}

        {/* Phase 1: Processing */}
        {currentPhase === 1 && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-primary mx-auto animate-spin" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping" />
              </div>
              <p className="text-sm font-medium mt-4 text-primary">
                AI is crafting your ad...
              </p>
              <div className="flex justify-center mt-2 space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Generated Ad */}
        {currentPhase === 2 && (
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Hook */}
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 transform animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-xs font-bold text-primary">HOOK</span>
                </div>
                <p className="font-bold text-sm">{generatedAd.hook}</p>
              </div>

              {/* Body */}
              <div className="p-3 bg-secondary/30 rounded-lg border border-muted transform animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full" />
                  <span className="text-xs font-bold text-secondary-foreground">BODY</span>
                </div>
                <p className="text-xs leading-relaxed">{generatedAd.body}</p>
              </div>

              {/* CTA */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200 transform animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-xs font-bold text-green-800">CTA</span>
                </div>
                <p className="font-bold text-sm text-green-800">{generatedAd.cta}</p>
              </div>
            </div>

            {/* Results */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between text-center">
                <div className="flex-1">
                  <div className="text-lg font-black text-green-600">{results.roas}</div>
                  <div className="text-xs text-green-700">ROAS</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-lg font-black text-blue-600">{results.leads}</div>
                  <div className="text-xs text-blue-700">Leads</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-lg font-black text-purple-600">{results.ctr}</div>
                  <div className="text-xs text-purple-700">CTR</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Progress indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {phases.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentPhase ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroAnimation;
