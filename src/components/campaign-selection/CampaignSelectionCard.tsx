import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CampaignTemplate } from "@/hooks/useTemplates";
import { Zap, Users, Calendar, Target } from "lucide-react";

interface CampaignSelectionCardProps {
  campaign: CampaignTemplate;
  isSelected: boolean;
  onClick: () => void;
}

export const CampaignSelectionCard = ({ campaign, isSelected, onClick }: CampaignSelectionCardProps) => {
  // Get icon based on campaign name
  const getIcon = () => {
    const name = campaign.name.toLowerCase();
    if (name.includes('challenge') || name.includes('day')) return Zap;
    if (name.includes('people') || name.includes('group') || name.includes('training')) return Users;
    if (name.includes('seasonal') || name.includes('new year')) return Calendar;
    return Target;
  };

  const Icon = getIcon();

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${
        isSelected 
          ? 'ring-2 ring-primary/50 border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg' 
          : 'border-border hover:border-primary/30 hover:bg-gradient-to-br hover:from-muted/50 hover:to-background'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                isSelected 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-primary/10 text-primary'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <CardTitle className={`text-lg leading-tight font-semibold transition-colors duration-300 ${
                isSelected ? 'text-primary' : 'group-hover:text-primary'
              }`}>
                {campaign.name}
              </CardTitle>
            </div>
            {campaign.seasonal_timing && (
              <Badge 
                variant={isSelected ? "default" : "secondary"} 
                className="text-xs font-medium"
              >
                {campaign.seasonal_timing}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Animated background accent */}
        <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl transition-all duration-500 ${
          isSelected 
            ? 'bg-primary/20 scale-100 opacity-100' 
            : 'bg-primary/10 scale-75 opacity-0 group-hover:opacity-60 group-hover:scale-90'
        }`} />
      </CardHeader>

      <CardContent className="pt-0 relative">
        <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
          {campaign.description}
        </CardDescription>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};