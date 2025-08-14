import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignSelectionCard } from "./CampaignSelectionCard";
import { useTemplates, CampaignTemplate } from "@/hooks/useTemplates";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CampaignSelectionTabsProps {
  selectedCampaign: CampaignTemplate | null;
  onCampaignSelect: (campaign: CampaignTemplate) => void;
}

export const CampaignSelectionTabs = ({ selectedCampaign, onCampaignSelect }: CampaignSelectionTabsProps) => {
  const { 
    getCampaignsByCategory, 
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
    <Tabs defaultValue="popular" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="popular">Most Popular</TabsTrigger>
        <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
        <TabsTrigger value="challenge">Challenge-Based</TabsTrigger>
      </TabsList>

      <TabsContent value="popular" className="mt-6">
        {renderCampaignGrid(getMostPopularCampaigns())}
      </TabsContent>

      <TabsContent value="seasonal" className="mt-6">
        {renderCampaignGrid(getCampaignsByCategory('Seasonal'))}
      </TabsContent>

      <TabsContent value="challenge" className="mt-6">
        {renderCampaignGrid(getCampaignsByCategory('Challenge-Based'))}
        {renderCampaignGrid(getCampaignsByCategory('Social Proof'))}
        {renderCampaignGrid(getCampaignsByCategory('Lead Generation'))}
        {renderCampaignGrid(getCampaignsByCategory('Problem-Focused'))}
        {renderCampaignGrid(getCampaignsByCategory('Authority'))}
        {renderCampaignGrid(getCampaignsByCategory('Urgency'))}
        {renderCampaignGrid(getCampaignsByCategory('Business Growth'))}
        {renderCampaignGrid(getCampaignsByCategory('Educational'))}
      </TabsContent>
    </Tabs>
  );
};