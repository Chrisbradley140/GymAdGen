
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Brand Setup Found</h1>
          <p className="text-muted-foreground mb-6">
            It looks like you haven't completed the onboarding process yet.
          </p>
          <Button onClick={() => navigate('/onboarding')}>
            Complete Onboarding
          </Button>
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold">Brand Setup</h1>
            <p className="text-muted-foreground">
              View and update your brand settings to improve ad personalization
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-1" />
                Edit Info
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {/* General Info Section */}
        <Card>
          <Collapsible open={openSections.general} onOpenChange={() => toggleSection('general')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  General Information
                  <div className="text-sm text-muted-foreground">
                    {openSections.general ? '−' : '+'}
                  </div>
                </CardTitle>
                <CardDescription>
                  Your business name, logo, website, and brand colors
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
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
        <Card>
          <Collapsible open={openSections.audience} onOpenChange={() => toggleSection('audience')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  Audience & Offer
                  <div className="text-sm text-muted-foreground">
                    {openSections.audience ? '−' : '+'}
                  </div>
                </CardTitle>
                <CardDescription>
                  Target market, offer type, and campaign preferences
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
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
        <Card>
          <Collapsible open={openSections.voice} onOpenChange={() => toggleSection('voice')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  Brand Voice & Tone
                  <div className="text-sm text-muted-foreground">
                    {openSections.voice ? '−' : '+'}
                  </div>
                </CardTitle>
                <CardDescription>
                  Voice style, social accounts, and language preferences
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
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
        <Card>
          <Collapsible open={openSections.psychology} onOpenChange={() => toggleSection('psychology')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  Disruptive Ad Psychology
                  <div className="text-sm text-muted-foreground">
                    {openSections.psychology ? '−' : '+'}
                  </div>
                </CardTitle>
                <CardDescription>
                  Customer pain points, failed attempts, and desired outcomes
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
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
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/onboarding')} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retake Onboarding Quiz
          </Button>
          
          <Button 
            onClick={() => navigate('/generate')} 
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Regenerate Ads
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandSetup;
