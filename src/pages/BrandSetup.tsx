
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, RefreshCw, Zap } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useBrandSetup, OnboardingData } from "@/hooks/useBrandSetup";
import { GeneralInfoSection } from "@/components/brand-setup/GeneralInfoSection";
import { AudienceOfferSection } from "@/components/brand-setup/AudienceOfferSection";
import { BrandVoiceSection } from "@/components/brand-setup/BrandVoiceSection";
import { PsychologySection } from "@/components/brand-setup/PsychologySection";

const BrandSetup = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data, loading, saving, updateOnboardingData } = useBrandSetup();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<OnboardingData | null>(null);
  const [openSections, setOpenSections] = useState({
    general: true,
    audience: true,
    voice: true,
    psychology: true
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (data) {
      setEditedData({ ...data });
    }
  }, [data]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gradient">No Brand Setup Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              It looks like you haven't completed the onboarding process yet.
            </p>
            <Button size="lg" onClick={() => navigate('/onboarding')} className="px-8 py-3 text-lg">
              Complete Onboarding
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...data });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...data });
  };

  const handleSave = async () => {
    if (!editedData) return;
    
    const success = await updateOnboardingData(editedData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleFieldUpdate = (field: keyof OnboardingData, value: string | string[]) => {
    if (!editedData) return;
    setEditedData({
      ...editedData,
      [field]: value
    });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const currentData = isEditing ? editedData : data;

  if (!currentData) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-12">
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gradient">Brand Setup</h1>
              <p className="text-xl text-muted-foreground">
                View and update your brand settings to improve ad personalization
              </p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-2 text-base"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    size="lg"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 text-base"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={handleEdit} className="px-6 py-2 text-base">
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Info
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 max-w-5xl">
          {/* General Info Section */}
          <Card className="border-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <Collapsible open={openSections.general} onOpenChange={() => toggleSection('general')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-6">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Edit className="w-6 h-6 text-primary" />
                      </div>
                      General Information
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {openSections.general ? '−' : '+'}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base pl-11">
                    Your business name, logo, website, and brand colors
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <GeneralInfoSection
                    data={currentData}
                    isEditing={isEditing}
                    onUpdate={handleFieldUpdate}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Audience & Offer Section */}
          <Card className="border-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <Collapsible open={openSections.audience} onOpenChange={() => toggleSection('audience')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-6">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      Audience & Offer
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {openSections.audience ? '−' : '+'}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base pl-11">
                    Target market, offer type, and campaign preferences
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <AudienceOfferSection
                    data={currentData}
                    isEditing={isEditing}
                    onUpdate={handleFieldUpdate}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Brand Voice & Tone Section */}
          <Card className="border-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <Collapsible open={openSections.voice} onOpenChange={() => toggleSection('voice')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-6">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <RefreshCw className="w-6 h-6 text-primary" />
                      </div>
                      Brand Voice & Tone
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {openSections.voice ? '−' : '+'}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base pl-11">
                    Voice style, social accounts, and language preferences
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <BrandVoiceSection
                    data={currentData}
                    isEditing={isEditing}
                    onUpdate={handleFieldUpdate}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Disruptive Ad Psychology Section */}
          <Card className="border-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <Collapsible open={openSections.psychology} onOpenChange={() => toggleSection('psychology')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-6">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      Disruptive Ad Psychology
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {openSections.psychology ? '−' : '+'}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base pl-11">
                    Customer pain points, failed attempts, and desired outcomes
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <PsychologySection
                    data={currentData}
                    isEditing={isEditing}
                    onUpdate={handleFieldUpdate}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/onboarding')} 
              className="flex items-center gap-2 px-8 py-3 text-base"
            >
              <RefreshCw className="w-5 h-5" />
              Retake Onboarding Quiz
            </Button>
            
            <Button 
              size="lg"
              onClick={() => navigate('/generate')} 
              className="flex items-center gap-2 px-8 py-3 text-base"
            >
              <Zap className="w-5 h-5" />
              Regenerate Ads
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSetup;
