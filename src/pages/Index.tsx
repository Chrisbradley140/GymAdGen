
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, TrendingUp, Target, Zap, Clock, DollarSign } from "lucide-react";
import StickyHeader from "@/components/StickyHeader";
import CTAButton from "@/components/CTAButton";
import BenefitCard from "@/components/BenefitCard";
import StatCard from "@/components/StatCard";
import PerformanceBlock from "@/components/PerformanceBlock";
import ResultsShowcase from "@/components/ResultsShowcase";
import FAQ from "@/components/FAQ";
import Navigation from "@/components/Navigation";
import HeroAnimation from "@/components/HeroAnimation";
import ProductDemo from "@/components/ProductDemo";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Add your page content here */}
      <Navigation />
      <HeroAnimation />
      <ProductDemo />
      {/* Add other components as needed */}
    </div>
  );
};

export default Index;
