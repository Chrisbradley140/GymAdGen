import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Zap, Target } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { DeviceMockups } from "./DeviceMockups";

export const EnhancedHeroAnimation = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetAudience, setTargetAudience] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [adContent, setAdContent] = useState({
    headline: "",
    body: "",
    cta: "",
    showImage: false,
  });

  const targetText = "Busy professionals wanting to lose weight";
  const generatedContent = {
    headline: "Finally Lose Weight Without Giving Up Your Busy Schedule",
    body: "Designed for professionals who value their time. Get fit in just 30 minutes, 3x per week. No meal prep, no endless gym sessions.",
    cta: "Start Your Transformation",
  };

  useEffect(() => {
    const animationLoop = () => {
      // Reset everything
      setAnimationStep(0);
      setIsGenerating(false);
      setTargetAudience("");
      setTypingIndex(0);
      setAdContent({ headline: "", body: "", cta: "", showImage: false });

      // Step 1: Typing animation (3 seconds)
      setTimeout(() => {
        setAnimationStep(1);
        const typingInterval = setInterval(() => {
          setTypingIndex((prev) => {
            if (prev >= targetText.length) {
              clearInterval(typingInterval);
              setTargetAudience(targetText);
              return targetText.length;
            }
            setTargetAudience(targetText.substring(0, prev + 1));
            return prev + 1;
          });
        }, 100);
      }, 1000);

      // Step 2: Start generation (after typing)
      setTimeout(() => {
        setAnimationStep(2);
        setIsGenerating(true);
      }, 4500);

      // Step 3: Show image (after 30 seconds of countdown)
      setTimeout(() => {
        setAnimationStep(3);
        setAdContent(prev => ({ ...prev, showImage: true }));
      }, 34500);

      // Step 4: Show headline (after 60 seconds)
      setTimeout(() => {
        setAnimationStep(4);
        setAdContent(prev => ({ ...prev, headline: generatedContent.headline }));
      }, 64500);

      // Step 5: Show body (after 75 seconds)
      setTimeout(() => {
        setAnimationStep(5);
        setAdContent(prev => ({ ...prev, body: generatedContent.body }));
      }, 79500);

      // Step 6: Show CTA and complete (after 90 seconds)
      setTimeout(() => {
        setAnimationStep(6);
        setAdContent(prev => ({ ...prev, cta: generatedContent.cta }));
        setIsGenerating(false);
      }, 94500);

      // Step 7: Reset for next loop
      setTimeout(() => {
        animationLoop();
      }, 99500);
    };

    animationLoop();
  }, []);

  const handleCountdownComplete = () => {
    setIsGenerating(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Control Panel */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Input Section */}
          <div className="flex-1 w-full">
            <label className="block text-white text-sm font-medium mb-2">
              Target Audience
            </label>
            <div className="flex gap-3">
              <Input
                value={targetAudience}
                readOnly
                placeholder="Enter your target audience..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button
                className="bg-primary text-white hover:bg-primary/90 min-w-[140px]"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Building...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Generate Ad
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="lg:w-auto">
            <CountdownTimer
              seconds={90}
              isActive={isGenerating}
              onComplete={handleCountdownComplete}
            />
          </div>
        </div>

        {/* Status Indicators */}
        {isGenerating && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`flex items-center gap-2 p-3 rounded-lg ${animationStep >= 3 ? 'bg-green-500/20 border-green-500/30' : 'bg-white/5 border-white/10'} border`}>
              <div className={`w-2 h-2 rounded-full ${animationStep >= 3 ? 'bg-green-500' : 'bg-white/30'}`}></div>
              <span className="text-white text-sm">Image Selected</span>
            </div>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${animationStep >= 4 ? 'bg-green-500/20 border-green-500/30' : 'bg-white/5 border-white/10'} border`}>
              <div className={`w-2 h-2 rounded-full ${animationStep >= 4 ? 'bg-green-500' : 'bg-white/30'}`}></div>
              <span className="text-white text-sm">Headline Created</span>
            </div>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${animationStep >= 5 ? 'bg-green-500/20 border-green-500/30' : 'bg-white/5 border-white/10'} border`}>
              <div className={`w-2 h-2 rounded-full ${animationStep >= 5 ? 'bg-green-500' : 'bg-white/30'}`}></div>
              <span className="text-white text-sm">Body Text Generated</span>
            </div>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${animationStep >= 6 ? 'bg-green-500/20 border-green-500/30' : 'bg-white/5 border-white/10'} border`}>
              <div className={`w-2 h-2 rounded-full ${animationStep >= 6 ? 'bg-green-500' : 'bg-white/30'}`}></div>
              <span className="text-white text-sm">CTA Optimized</span>
            </div>
          </div>
        )}
      </div>

      {/* Device Mockups */}
      <DeviceMockups 
        adContent={adContent}
        className="animate-fade-in"
      />

      {/* Results Summary */}
      {animationStep >= 6 && (
        <div className="mt-8 text-center animate-fade-in">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold">Campaign Ready!</span>
            </div>
            <p className="text-white/80 text-sm">
              Your high-converting fitness ad was generated in 90 seconds, 
              optimized for your target audience.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};