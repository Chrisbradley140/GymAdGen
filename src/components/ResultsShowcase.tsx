
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Clock } from "lucide-react";
import CTAButton from "./CTAButton";

const ResultsShowcase = () => {
  const results = [
    {
      metric: "312% ROAS",
      description: "Average return on ad spend",
      icon: TrendingUp,
      change: "+180%"
    },
    {
      metric: "$2.3M",
      description: "Total revenue generated",
      icon: DollarSign,
      change: "$800K"
    },
    {
      metric: "500+",
      description: "Active fitness entrepreneurs",
      icon: Users,
      change: "+200"
    },
    {
      metric: "47s",
      description: "Average ad generation time",
      icon: Clock,
      change: "-2min"
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground font-klein">
            The Ads That Print Money <span className="text-gradient">Every Season.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from real fitness entrepreneurs who stopped playing around with amateur copy.
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {results.map((result, index) => (
            <Card key={index} className="p-6 text-center bg-card border-border hover-lift">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <result.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-black text-foreground mb-2">{result.metric}</div>
              <div className="text-sm text-muted-foreground mb-3">{result.description}</div>
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {result.change}
              </Badge>
            </Card>
          ))}
        </div>

        {/* Featured Case Study */}
        <Card className="p-8 bg-secondary/10 border-border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Case Study</Badge>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                From $3K to $47K in 60 Days
              </h3>
              <p className="text-muted-foreground mb-6">
                "I was burning through ad budgets with zero results. This AI tool completely transformed my copy. Now my ads print money while I sleep."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">Sarah Martinez</div>
                  <div className="text-sm text-muted-foreground">Online Fitness Coach</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                <span className="text-muted-foreground">Monthly Revenue</span>
                <span className="font-bold text-primary">$47,000</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                <span className="text-muted-foreground">ROAS Improvement</span>
                <span className="font-bold text-primary">+284%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                <span className="text-muted-foreground">Time to Results</span>
                <span className="font-bold text-primary">60 Days</span>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <CTAButton size="lg">Get These Results Too</CTAButton>
          <p className="mt-4 text-sm text-muted-foreground">
            Join the coaches who stopped settling for mediocre results
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsShowcase;
