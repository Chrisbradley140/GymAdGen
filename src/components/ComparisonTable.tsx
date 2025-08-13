import { Clock, MapPin, MessageCircle, TrendingUp, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

const ComparisonTable = () => {
  const comparisonData = [
    {
      icon: Clock,
      oldWay: "Wait weeks on an agency",
      newWay: "Instant ads, made for you",
      category: "Speed"
    },
    {
      icon: MapPin,
      oldWay: "Generic targeting guesswork", 
      newWay: "Precision fitness audience targeting",
      category: "Targeting"
    },
    {
      icon: MessageCircle,
      oldWay: "Cookie-cutter copy templates",
      newWay: "Your unique brand voice",
      category: "Voice"
    },
    {
      icon: TrendingUp,
      oldWay: "Hope for the best results",
      newWay: "Data-driven performance optimization",
      category: "Results"
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-klein">
            Old Way vs New Way
          </h2>
          <p className="text-lg text-muted-foreground">
            Stop struggling with outdated methods
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Old Way - Left Side (Grayscale) */}
          <Card className="p-8 bg-muted/10 border border-muted relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-muted-foreground font-klein">The Old Way</h3>
              </div>
              
              {/* Cluttered Desktop Simulation */}
              <div className="space-y-4 filter grayscale">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 bg-muted/30 rounded border border-muted/50 p-2">
                    <div className="text-xs text-muted-foreground">Canva</div>
                    <div className="w-full h-2 bg-muted/40 rounded mt-1"></div>
                  </div>
                  <div className="h-16 bg-muted/30 rounded border border-muted/50 p-2">
                    <div className="text-xs text-muted-foreground">Photoshop</div>
                    <div className="w-full h-2 bg-muted/40 rounded mt-1"></div>
                  </div>
                </div>
                <div className="h-20 bg-muted/30 rounded border border-muted/50 p-2">
                  <div className="text-xs text-muted-foreground">Facebook Ads Manager</div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="h-2 bg-muted/40 rounded"></div>
                    <div className="h-2 bg-muted/40 rounded"></div>
                    <div className="h-2 bg-muted/40 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-12 bg-muted/30 rounded border border-muted/50 p-2">
                    <div className="text-xs text-muted-foreground">Notes</div>
                  </div>
                  <div className="flex-1 h-12 bg-muted/30 rounded border border-muted/50 p-2">
                    <div className="text-xs text-muted-foreground">Excel</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground">
                Multiple tools, scattered workflow, endless revisions...
              </div>
            </div>
          </Card>

          {/* New Way - Right Side (Colorful) */}
          <Card className="p-8 bg-primary/5 border border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary font-klein">The FitnessAds.AI Way</h3>
              </div>
              
              {/* Clean Single Screen */}
              <div className="bg-background/80 rounded-lg border border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="text-sm font-medium text-primary">FitnessAds.AI</div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded border border-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary mb-2">Your Ad Preview</div>
                      <div className="text-sm text-primary/80">Generated in seconds</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-primary/10 rounded flex items-center px-3">
                      <div className="w-2 h-2 bg-primary rounded mr-2"></div>
                      <div className="text-xs text-primary">Analytics</div>
                    </div>
                    <div className="h-8 bg-primary/10 rounded flex items-center px-3">
                      <div className="w-2 h-2 bg-primary rounded mr-2"></div>
                      <div className="text-xs text-primary">Targeting</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-primary/90">
                One platform, streamlined workflow, instant results ✨
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Comparison Rows */}
        <div className="space-y-6">
          {comparisonData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="grid lg:grid-cols-2 gap-6">
                {/* Old Way */}
                <Card className="p-6 bg-muted/10 border border-muted">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">
                        {item.category}
                      </div>
                      <div className="flex items-center gap-3">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-foreground">{item.oldWay}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* New Way */}
                <Card className="p-6 bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide text-primary/80 font-medium mb-1">
                        {item.category}
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{item.newWay}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join 1000+ fitness businesses already ahead</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;