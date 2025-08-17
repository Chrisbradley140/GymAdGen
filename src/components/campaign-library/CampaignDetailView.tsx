import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download } from "lucide-react";
import { CampaignWithContent } from "@/hooks/useCampaigns";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface CampaignDetailViewProps {
  campaign: CampaignWithContent | null;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (contentType: string) => void;
  onToggleFavorite: (contentId: string, isFavorite: boolean) => void;
  onExportPDF: () => void;
}

const CampaignDetailView = ({ 
  campaign, 
  isOpen, 
  onClose, 
  onRegenerate, 
  onToggleFavorite, 
  onExportPDF 
}: CampaignDetailViewProps) => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  if (!campaign) return null;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (contentId: string) => {
    const newIsFavorite = !favorites[contentId];
    setFavorites(prev => ({ ...prev, [contentId]: newIsFavorite }));
    onToggleFavorite(contentId, newIsFavorite);
  };

  const renderContentBlock = (contentType: string, content: any, title: string) => {
    if (!content) return null;

    return (
      <Card key={contentType} className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg text-red-600">{title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(content.content, title)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content.content}
            readOnly
            className="min-h-[200px] resize-none"
          />
        </CardContent>
      </Card>
    );
  };

  const contentBlocks = [
    { type: 'ad_caption', title: 'Ad Caption', content: campaign.content.ad_caption },
    { type: 'headline', title: 'Headline Options', content: campaign.content.headline },
    { type: 'campaign_name', title: 'Campaign Name', content: campaign.content.campaign_name },
    { type: 'ig_story', title: 'Instagram Story', content: campaign.content.ig_story },
    { type: 'creative_prompt', title: 'Creative Prompt', content: campaign.content.creative_prompt },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">{campaign.name}</DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">
                  Created {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onExportPDF}>
                <Download className="w-4 h-4 mr-1" />
                Export PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {contentBlocks.map(({ type, title, content }) => 
            renderContentBlock(type, content, title)
          )}
          
          {contentBlocks.every(({ content }) => !content) && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No content generated for this campaign yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetailView;