
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-muted z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">FITNESSADS.AI</span>
        </div>
        
        <Button variant="outline" size="default">
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
