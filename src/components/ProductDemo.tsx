
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import CTAButton from "./CTAButton";

const ProductDemo = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Input Side */}
        <Card className="p-8 bg-secondary/30 border-muted">
          <h3 className="text-xl font-bold mb-6 text-center">Your Input</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary">Target Audience</label>
              <Input 
                placeholder="Busy dads over 35 who want to lose weight"
                className="bg-background border-muted"
                readOnly
                value="Busy dads over 35 who want to lose weight"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary">Pain Point</label>
              <Input 
                placeholder="No time for 2-hour gym sessions"
                className="bg-background border-muted"
                readOnly
                value="No time for 2-hour gym sessions"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary">Offer</label>
              <Input 
                placeholder="20-minute home workouts"
                className="bg-background border-muted"
                readOnly
                value="20-minute home workouts"
              />
            </div>
          </div>
        </Card>

        {/* Arrow */}
        <div className="flex justify-center md:justify-start">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-glow">
            <ArrowRight className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Output Side */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            AI-Generated Ad
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg border border-primary/20">
              <h4 className="font-bold text-primary text-sm mb-2">HOOK:</h4>
              <p className="font-semibold text-lg">"Dad Bod to Dad Strength in 20 Minutes"</p>
            </div>
            
            <div className="p-4 bg-background rounded-lg border border-primary/20">
              <h4 className="font-bold text-primary text-sm mb-2">BODY:</h4>
              <p className="text-sm">Skip the gym guilt. This proven system builds real strength while your kids watch cartoons. No equipment. No excuses. Just results.</p>
            </div>
            
            <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
              <h4 className="font-bold text-primary text-sm mb-2">CTA:</h4>
              <p className="font-bold">"Get Your Dad Strength Blueprint (Free)"</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <CTAButton>Try It Now</CTAButton>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDemo;
