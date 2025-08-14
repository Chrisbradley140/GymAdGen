import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CampaignTemplate } from "@/hooks/useTemplates";

interface CampaignSelectionCardProps {
  campaign: CampaignTemplate;
  isSelected: boolean;
  onClick: () => void;
}

export const CampaignSelectionCard = ({ campaign, isSelected, onClick }: CampaignSelectionCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{campaign.name}</CardTitle>
          {campaign.seasonal_timing && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {campaign.seasonal_timing}
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {campaign.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {campaign.target_audience && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Target:</span>
            <Badge variant="outline" className="text-xs">
              {campaign.target_audience}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};