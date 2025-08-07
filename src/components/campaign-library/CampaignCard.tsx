import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw, Trash2 } from "lucide-react";
import { Campaign } from "@/hooks/useCampaigns";
import { formatDistanceToNow } from "date-fns";

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails: (campaign: Campaign) => void;
  onRegenerate: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
}

const CampaignCard = ({ campaign, onViewDetails, onRegenerate, onDelete }: CampaignCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl">{campaign.name}</CardTitle>
            <CardDescription className="mt-1">
              {campaign.description || "No description provided"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {campaign.offer_type && (
              <Badge variant="outline">{campaign.offer_type}</Badge>
            )}
            {campaign.tone_style && (
              <Badge variant="secondary">{campaign.tone_style}</Badge>
            )}
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
            <Button variant="outline" size="sm" onClick={() => onRegenerate(campaign)}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Regenerate
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