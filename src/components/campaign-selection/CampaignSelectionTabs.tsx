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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {campaigns.map((campaign, index) => (
        <div
          key={campaign.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CampaignSelectionCard
            campaign={campaign}
            isSelected={selectedCampaign?.id === campaign.id}
            onClick={() => onCampaignSelect(campaign)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold mb-3 text-foreground">
          Most Popular Campaigns
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our most successful campaign templates to generate high-converting ad content
        </p>
      </div>
      
      {renderCampaignGrid(getMostPopularCampaigns())}
    </div>
  );
};