
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StepOne from './onboarding/StepOne';
import StepTwo from './onboarding/StepTwo';
import StepThree from './onboarding/StepThree';
import StepFour from './onboarding/StepFour';
import StepFive from './onboarding/StepFive';
import StepSix from './onboarding/StepSix';
import OnboardingLayout from './onboarding/OnboardingLayout';
import StepIndicator from './onboarding/StepIndicator';

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
  website_tone_scan?: string;
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

const stepTitles = [
  'Brand Foundation',
  'Visual Identity', 
  'Campaign Strategy',
  'Social Presence',
  'Brand Voice',
  'Customer Psychology'
];

const stepSubtitles = [
  'Let\'s start with the basics of your brand',
  'Define your visual identity and target audience',
  'Choose your campaign types and approach',
  'Optional enhancers for better targeting',
  'Your unique brand language and tone',
  'Understand your customer\'s mindset'
];

const OnboardingWizard: React.FC<{ onComplete: () => void; forceRestart?: boolean; onCancel?: () => void }> = ({ onComplete, forceRestart = false, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
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
        setHasExistingData(true);
        
        // Always load existing data to display in the form
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
        
        // Only resume from saved step if not force restarting
        if (!forceRestart) {
          setCurrentStep(existingData.step_completed + 1);
        }
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
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error saving onboarding data:', error);
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive",
        });
      }

      // Trigger website analysis in background after Step 1 completion
      if (currentStep === 1 && data.website_url) {
        triggerWebsiteAnalysis();
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerWebsiteAnalysis = async () => {
    if (!user || !data.website_url) return;
    
    try {
      console.log('Triggering website tone analysis...');
      await supabase.functions.invoke('analyze-website-tone', {
        body: {
          website_url: data.website_url,
          user_id: user.id
        }
      });
    } catch (error) {
      console.error('Website analysis failed:', error);
      // Fail silently - this is a background enhancement
    }
  };

  const saveCompletedOnboarding = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user.id,
          step_completed: 6, // Explicitly set to 6 for completion
          ...data,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error saving completed onboarding data:', error);
        toast({
          title: "Error",
          description: "Failed to complete onboarding. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving completed onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setIsAnimating(true);
    
    // If this is the final step, mark as completed
    if (currentStep === totalSteps) {
      await saveCompletedOnboarding();
    } else {
      await saveProgress();
    }
    
    setTimeout(() => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        toast({
          title: "🎉 Onboarding Complete!",
          description: "Welcome to FitAd AI. Let's create your first ad!",
        });
        onComplete();
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    const stepProps = { data, updateData };
    
    switch (currentStep) {
      case 1: return <StepOne {...stepProps} />;
      case 2: return <StepTwo {...stepProps} />;
      case 3: return <StepThree {...stepProps} />;
      case 4: return <StepFour {...stepProps} />;
      case 5: return <StepFive {...stepProps} />;
      case 6: return <StepSix {...stepProps} />;
      default: return <StepOne {...stepProps} />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.business_name.trim() !== '' && data.website_url.trim() !== '';
      case 2: 
        return data.brand_colors.trim() !== '' && 
               data.target_market.trim() !== '' && 
               data.voice_tone_style.trim() !== '';
      case 3: 
        return data.offer_type.trim() !== '' && 
               data.campaign_types.length > 0;
      case 4: 
        return data.instagram_reel_url.trim() !== '';
      case 5: 
        return data.brand_words.trim() !== '' && 
               data.words_to_avoid.trim() !== '';
      case 6: 
        return data.main_problem.trim() !== '' && 
               data.failed_solutions.trim() !== '' && 
               data.client_words.trim() !== '' && 
               data.magic_wand_result.trim() !== '';
      default: return true;
    }
  };

  return (
    <OnboardingLayout brandColor={data.brand_colors}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Welcome to FITNESSADS.AI
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Let's build your perfect ad-generating machine
        </p>
        
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          stepTitles={stepTitles}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {stepTitles[currentStep - 1]}
              </h2>
              <p className="text-gray-300">
                {stepSubtitles[currentStep - 1]}
              </p>
            </div>

            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              
              {hasExistingData && forceRestart && onCancel && (
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white transition-colors"
                >
                  Cancel Quiz
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={loading || !canProceed()}
              className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Saving..." : currentStep === totalSteps ? "Complete Setup" : "Continue"}
              {!loading && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingWizard;
