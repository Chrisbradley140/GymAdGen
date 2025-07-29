
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StepOne from './onboarding/StepOne';
import StepTwo from './onboarding/StepTwo';
import StepThree from './onboarding/StepThree';
import StepFour from './onboarding/StepFour';
import StepFive from './onboarding/StepFive';
import StepSix from './onboarding/StepSix';

interface OnboardingData {
  business_name: string;
  logo_url: string;
  website_url: string;
  brand_colors: string;
  target_market: string;
  voice_tone_style: string;
  offer_type: string;
  campaign_types: string[];
  seasonal_launch_options: string[];
  instagram_reel_url: string;
  meta_account: string;
  competitor_urls: string;
  brand_words: string;
  words_to_avoid: string;
  main_problem: string;
  failed_solutions: string;
  client_words: string;
  magic_wand_result: string;
}

const initialData: OnboardingData = {
  business_name: '',
  logo_url: '',
  website_url: '',
  brand_colors: '',
  target_market: '',
  voice_tone_style: '',
  offer_type: '',
  campaign_types: [],
  seasonal_launch_options: [],
  instagram_reel_url: '',
  meta_account: '',
  competitor_urls: '',
  brand_words: '',
  words_to_avoid: '',
  main_problem: '',
  failed_solutions: '',
  client_words: '',
  magic_wand_result: '',
};

const OnboardingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const totalSteps = 6;

  useEffect(() => {
    loadExistingData();
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;
    
    try {
      const { data: existingData, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading onboarding data:', error);
        return;
      }

      if (existingData) {
        setData({
          business_name: existingData.business_name || '',
          logo_url: existingData.logo_url || '',
          website_url: existingData.website_url || '',
          brand_colors: existingData.brand_colors || '',
          target_market: existingData.target_market || '',
          voice_tone_style: existingData.voice_tone_style || '',
          offer_type: existingData.offer_type || '',
          campaign_types: existingData.campaign_types || [],
          seasonal_launch_options: existingData.seasonal_launch_options || [],
          instagram_reel_url: existingData.instagram_reel_url || '',
          meta_account: existingData.meta_account || '',
          competitor_urls: existingData.competitor_urls || '',
          brand_words: existingData.brand_words || '',
          words_to_avoid: existingData.words_to_avoid || '',
          main_problem: existingData.main_problem || '',
          failed_solutions: existingData.failed_solutions || '',
          client_words: existingData.client_words || '',
          magic_wand_result: existingData.magic_wand_result || '',
        });
        setCurrentStep(existingData.step_completed + 1);
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  };

  const saveProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user.id,
          step_completed: currentStep,
          ...data,
          completed_at: currentStep === totalSteps ? new Date().toISOString() : null,
        });

      if (error) {
        console.error('Error saving onboarding data:', error);
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await saveProgress();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Onboarding Complete!",
        description: "Welcome to FitAd AI. Let's create your first ad!",
      });
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne data={data} updateData={updateData} />;
      case 2:
        return <StepTwo data={data} updateData={updateData} />;
      case 3:
        return <StepThree data={data} updateData={updateData} />;
      case 4:
        return <StepFour data={data} updateData={updateData} />;
      case 5:
        return <StepFive data={data} updateData={updateData} />;
      case 6:
        return <StepSix data={data} updateData={updateData} />;
      default:
        return <StepOne data={data} updateData={updateData} />;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to FitAd AI</h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <div className="flex-1 max-w-md">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === 1 && "Brand Basics"}
              {currentStep === 2 && "Brand Identity"}
              {currentStep === 3 && "Campaign Type"}
              {currentStep === 4 && "Optional Enhancers"}
              {currentStep === 5 && "Brand Language"}
              {currentStep === 6 && "Disruptive Ad Psychology"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? "Saving..." : currentStep === totalSteps ? "Complete" : "Next"}
            {!loading && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
