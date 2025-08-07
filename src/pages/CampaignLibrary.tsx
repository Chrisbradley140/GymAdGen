import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBrandSetup } from "@/hooks/useBrandSetup";
import { useCampaigns, Campaign, CampaignWithContent } from "@/hooks/useCampaigns";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CampaignCard from "@/components/campaign-library/CampaignCard";
import CampaignFilters from "@/components/campaign-library/CampaignFilters";
import CampaignDetailView from "@/components/campaign-library/CampaignDetailView";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const CampaignLibrary = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: brandData } = useBrandSetup();
  const { getCampaigns, getCampaignWithContent, deleteCampaign, isLoading } = useCampaigns();
  const { generateContent } = useAdGeneration();

  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignWithContent | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [offerType, setOfferType] = useState("all");
  const [toneStyle, setToneStyle] = useState("all");

  // Check onboarding and load campaigns
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      // Check if onboarding is complete
      if (brandData === null) {
        setIsOnboardingComplete(false);
        return;
      }
      
      // Check if all required fields are filled (indicating complete onboarding)
      if (!brandData.business_name || !brandData.target_market || !brandData.voice_tone_style) {
        setIsOnboardingComplete(false);
        return;
      }

      setIsOnboardingComplete(true);
      loadCampaigns();
    }
  }, [user, loading, navigate, brandData]);

  const loadCampaigns = async () => {
    const filters = {
      search: search || undefined,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
      offerType: offerType !== "all" ? offerType : undefined,
      toneStyle: toneStyle !== "all" ? toneStyle : undefined,
    };

    const campaignData = await getCampaigns(filters);
    setCampaigns(campaignData);
  };

  // Reload campaigns when filters change
  useEffect(() => {
    if (isOnboardingComplete) {
      loadCampaigns();
    }
  }, [search, dateFrom, dateTo, offerType, toneStyle, isOnboardingComplete]);

  const handleViewDetails = async (campaign: Campaign) => {
    const campaignWithContent = await getCampaignWithContent(campaign.id);
    if (campaignWithContent) {
      setSelectedCampaign(campaignWithContent);
      setShowDetailView(true);
    }
  };

  const handleRegenerate = (campaign: Campaign) => {
    navigate('/generate', { state: { campaignId: campaign.id } });
  };

  const handleDelete = async (campaignId: string) => {
    const success = await deleteCampaign(campaignId);
    if (success) {
      loadCampaigns(); // Reload campaigns
    }
  };

  const handleToggleFavorite = async (contentId: string, isFavorite: boolean) => {
    // TODO: Implement favorite functionality
    toast({
      title: "Feature Coming Soon",
      description: "Favorite functionality will be implemented soon.",
    });
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    toast({
      title: "Feature Coming Soon",
      description: "PDF export functionality will be implemented soon.",
    });
  };

  const handleRegenerateContent = async (contentType: string) => {
    // TODO: Implement content regeneration
    toast({
      title: "Feature Coming Soon",
      description: "Content regeneration will be implemented soon.",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setOfferType("all");
    setToneStyle("all");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Show onboarding redirect if not complete
  if (!isOnboardingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="py-8">
            <Library className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <CardTitle className="mb-2">Complete Onboarding First</CardTitle>
            <CardDescription className="mb-4">
              Please complete your onboarding to generate and view campaigns.
            </CardDescription>
            <Button onClick={() => navigate('/onboarding')}>
              <Zap className="w-4 h-4 mr-2" />
              Complete Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Campaign Library</h1>
          <p className="text-muted-foreground">
            View and manage all your generated ad campaigns
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CampaignFilters
            search={search}
            onSearchChange={setSearch}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            offerType={offerType}
            onOfferTypeChange={setOfferType}
            toneStyle={toneStyle}
            onToneStyleChange={setToneStyle}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Campaigns Grid */}
        {!isLoading && campaigns.length > 0 && (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onViewDetails={handleViewDetails}
                onRegenerate={handleRegenerate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && campaigns.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Library className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <CardTitle className="mb-2">No campaigns yet</CardTitle>
              <CardDescription className="mb-4">
                You haven't generated any campaigns yet. Go to /generate to get started.
              </CardDescription>
              <Button onClick={() => navigate('/generate')}>
                <Zap className="w-4 h-4 mr-2" />
                Generate First Campaign
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Campaign Detail View Modal */}
        <CampaignDetailView
          campaign={selectedCampaign}
          isOpen={showDetailView}
          onClose={() => setShowDetailView(false)}
          onRegenerate={handleRegenerateContent}
          onToggleFavorite={handleToggleFavorite}
          onExportPDF={handleExportPDF}
        />
      </div>
    </div>
  );
};

export default CampaignLibrary;
