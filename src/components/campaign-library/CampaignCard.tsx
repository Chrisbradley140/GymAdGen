import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Eye, Trash2 } from "lucide-react";
import { Campaign } from "@/hooks/useCampaigns";
import { formatDistanceToNow } from "date-fns";

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
}

const CampaignCard = ({ campaign, onViewDetails, onDelete }: CampaignCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true });

  return (
    <Card className="bg-card/60 backdrop-blur-sm border border-border/60 hover-lift transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl page-heading text-gradient tracking-tight">{campaign.name}</CardTitle>
            <CardDescription className="mt-1">
              {campaign.description || "No description provided"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Created {formattedDate}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(campaign)}>
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(campaign.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;