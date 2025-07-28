
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

const CTAButton = ({ children, size = "lg", className = "", onClick }: CTAButtonProps) => {
  return (
    <Button
      size={size}
      onClick={onClick}
      className={`
        bg-primary hover:bg-primary/90 text-white font-bold tracking-wide
        transition-all duration-300 transform hover:scale-105 hover:shadow-lg
        glow-orange hover:animate-pulse-glow group
        ${size === "xl" ? "px-12 py-6 text-xl" : ""}
        ${className}
      `}
    >
      {children}
      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
};

export default CTAButton;
