import { CampaignSelectionCard } from "./CampaignSelectionCard";
import { useTemplates, CampaignTemplate } from "@/hooks/useTemplates";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CampaignSelectionTabsProps {
  selectedCampaign: CampaignTemplate | null;
  onCampaignSelect: (campaign: CampaignTemplate) => void;
}

export const CampaignSelectionTabs = ({ selectedCampaign, onCampaignSelect }: CampaignSelectionTabsProps) => {
  const { 
    getMostPopularCampaigns, 
    isLoading 
  } = useTemplates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const renderCampaignGrid = (campaigns: CampaignTemplate[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <CampaignSelectionCard
          key={campaign.id}
          campaign={campaign}
          isSelected={selectedCampaign?.id === campaign.id}
          onClick={() => onCampaignSelect(campaign)}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Most Popular Campaigns</h3>
        <p className="text-muted-foreground text-sm">
          Choose from our most successful campaign templates
        </p>
      </div>
      
      {renderCampaignGrid(getMostPopularCampaigns())}
    </div>
  );
};