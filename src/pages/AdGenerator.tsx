import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdGeneration } from '@/hooks/useAdGeneration';
import { useBrandSetup } from '@/hooks/useBrandSetup';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useSavedContent } from '@/hooks/useSavedContent';
import { useTemplates, CampaignTemplate } from '@/hooks/useTemplates';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdBlock } from '@/components/ad-generator/AdBlock';
import { CampaignSelectionTabs } from '@/components/campaign-selection/CampaignSelectionTabs';
import { MessageSquare, Lightbulb, Target, Instagram, Palette, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const AdGenerator = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: brandData } = useBrandSetup();
  const { generateContent } = useAdGeneration();
  const { createCampaign } = useCampaigns();
  const { saveContent } = useSavedContent();
  const { getAdTemplatesForCampaign } = useTemplates();
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignTemplate | null>(null);
  const [showGenerationOptions, setShowGenerationOptions] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<{
    isComplete: boolean;
    stepCompleted: number;
  } | null>(null);

  // Auth redirect check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Onboarding completion check
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        console.log('No user found in checkOnboardingStatus');
        return;
      }
      
      console.log('Checking onboarding status for user:', user.id);
      
      try {
        const { data: onboardingData, error } = await supabase
          .from('user_onboarding')
          .select('step_completed')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        console.log('Onboarding query result:', { onboardingData, error });

        if (error) {
          console.error('Error checking onboarding status:', error);
          setOnboardingStatus({ isComplete: false, stepCompleted: 0 });
          return;
        }

        const stepCompleted = onboardingData?.step_completed || 0;
        const isComplete = stepCompleted >= 6;
        
        console.log('Onboarding status calculated:', { stepCompleted, isComplete });
        
        setOnboardingStatus({ isComplete, stepCompleted });

        // Auto-redirect if onboarding incomplete
        if (!isComplete) {
          console.log('Redirecting to onboarding - step completed:', stepCompleted);
          navigate('/onboarding');
          return;
        } else {
          console.log('Onboarding complete - allowing access to generator');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setOnboardingStatus({ isComplete: false, stepCompleted: 0 });
      }
    };

    if (user && !authLoading) {
      checkOnboardingStatus();
    }
  }, [user, authLoading, navigate]);

  // Create campaign for this generation session
  const createOrGetCampaign = async () => {
    if (currentCampaignId) return currentCampaignId;
    
    const timestamp = new Date().toLocaleDateString();
    const campaignName = selectedCampaign 
      ? `${selectedCampaign.name} - ${timestamp}`
      : `Campaign - ${timestamp}`;
    
    const campaign = await createCampaign(
      campaignName,
      selectedCampaign 
        ? `${selectedCampaign.description} - Generated on ${timestamp}`
        : `Generated campaign from ${timestamp}`
    );
    
    if (campaign) {
      setCurrentCampaignId(campaign.id);
      return campaign.id;
    }
    return null;
  };

  const generateAdCaption = async () => {
    const campaign = await createOrGetCampaign();
    if (!campaign) return null;

    // Get relevant ad templates for the selected campaign
    const adTemplates = selectedCampaign ? getAdTemplatesForCampaign(selectedCampaign.id) : [];
    const templateExamples = adTemplates.slice(0, 2).map(template => template.primary_text).join('\n\n---\n\n');

    const systemPrompt = `You are an expert Meta Ads copywriter specializing in high-converting Facebook and Instagram ad captions.

${selectedCampaign ? `CAMPAIGN CONTEXT: You are creating content for a "${selectedCampaign.name}" campaign targeting ${selectedCampaign.target_audience}. ${selectedCampaign.description}` : ''}

${templateExamples ? `HIGH-PERFORMING REFERENCE EXAMPLES:
${templateExamples}

Use these examples as structural and tonal inspiration, but create completely original content for the user's specific brand.` : ''}

Generate a compelling ad caption that follows this EXACT structure:

🎯 HOOK (1-2 sentences that grab attention and call out the target audience)
💪 PAIN MIRROR (2-3 sentences that reflect their current struggles/frustrations)
✨ BELIEF BREAKER (2-3 sentences that challenge limiting beliefs and present new possibilities)  
🚀 CTA (1-2 sentences with clear, action-oriented call-to-action)

CRITICAL REQUIREMENTS:
- Use simple, conversational language (8th grade reading level)
- Include relevant emojis naturally throughout
- Keep total length under 150 words
- Make it scroll-stopping and engaging
- Ensure Meta policy compliance (no personal attributes, body shaming, or unrealistic claims)
- Match the brand's voice and tone exactly
- Focus on transformation and results, not just features

The caption should feel authentic, relatable, and motivate immediate action while staying compliant with Meta's advertising policies.`;

    return await generateContent('ad_caption', systemPrompt);
  };

  const generateHeadlineOptions = async () => {
    const campaign = await createOrGetCampaign();
    if (!campaign) return null;

    // Get relevant ad templates for headlines
    const adTemplates = selectedCampaign ? getAdTemplatesForCampaign(selectedCampaign.id) : [];
    const headlineExamples = adTemplates
      .filter(template => template.headline)
      .slice(0, 3)
      .map(template => template.headline)
      .join(', ');

    const systemPrompt = `You are an expert Meta Ads copywriter specializing in high-converting headlines for Facebook and Instagram ads.

${selectedCampaign ? `CAMPAIGN CONTEXT: You are creating headlines for a "${selectedCampaign.name}" campaign targeting ${selectedCampaign.target_audience}.` : ''}

${headlineExamples ? `HIGH-PERFORMING HEADLINE EXAMPLES: ${headlineExamples}

Use these as inspiration for tone and structure, but create original headlines for this specific brand.` : ''}

Generate 5 powerful headline options that are:

HEADLINE REQUIREMENTS:
- Maximum 40 characters (Meta's headline limit)
- Action-oriented and benefit-focused
- Emotionally compelling
- Clear and specific
- Meta policy compliant (no personal attributes, superlatives, or unrealistic claims)

HEADLINE STYLES TO INCLUDE:
1. Question-based headline (creates curiosity)
2. Benefit-focused headline (clear value proposition)  
3. Urgency/scarcity headline (creates FOMO)
4. Problem/solution headline (addresses pain point)
5. Transformation headline (promises change)

FORMAT:
Present each headline as a numbered list with a brief explanation of the psychology behind each one.

CRITICAL: Each headline must be under 40 characters and comply with Meta's advertising policies.`;

    return await generateContent('headline_options', systemPrompt);
  };

  const generateCampaignName = async () => {
    const campaign = await createOrGetCampaign();
    if (!campaign) return null;

    const systemPrompt = `You are a marketing strategist specializing in creating memorable, scroll-stopping campaign names.

${selectedCampaign ? `CAMPAIGN CONTEXT: You are creating names inspired by the "${selectedCampaign.name}" campaign type, targeting ${selectedCampaign.target_audience}. The campaign focuses on: ${selectedCampaign.description}` : ''}

Generate 4-5 campaign name options that are:

CAMPAIGN NAME REQUIREMENTS:
- Memorable and brandable
- Creates curiosity and intrigue  
- Reflects the campaign's core value proposition
- Easy to remember and share
- Professional yet engaging
- Avoid generic terms like "Ultimate" or "Complete"

NAMING STRATEGIES TO USE:
1. Transformation-focused (emphasizes change/results)
2. Time-based (leverages urgency/timeline) 
3. Community-focused (builds belonging)
4. Method/system-focused (implies proven process)
5. Benefit-focused (clear value proposition)

CONTEXT TO CONSIDER:
- Current season/time of year for relevance
- Target audience pain points and desires
- Brand voice and personality
- Competitive differentiation
${selectedCampaign?.seasonal_timing ? `- Seasonal timing: ${selectedCampaign.seasonal_timing}` : ''}

FORMAT: Present each campaign name with a brief rationale for why it would be effective.

The names should feel fresh, exciting, and make people want to learn more.`;

    return await generateContent('campaign_name', systemPrompt);
  };

  const generateIGStoryAd = async () => {
    const campaign = await createOrGetCampaign();
    if (!campaign) return null;

    const systemPrompt = `You are a performance marketer creating Instagram Story ads for Meta.

${selectedCampaign ? `CAMPAIGN CONTEXT: You are creating story content for a "${selectedCampaign.name}" campaign targeting ${selectedCampaign.target_audience}.` : ''}

Create a 3-frame Instagram Story ad sequence that is inclusive, upbeat, and policy-safe.

Meta Safety Rules:
- Do not state or imply personal attributes (age, gender, health status, body type, physical condition, finances, relationship status)
- No numeric promises about weight, body fat, inches, percentages, or timelines
- Replace "you" statements tied to a problem with inclusive, general observations
- Use broad descriptors instead of specific demographics
- Never suggest the viewer lacks consistency, energy, or success
- Avoid negative body image or shaming. Focus on positive, aspirational benefits

Style:
- Short, visual, and upbeat; 1–2 sentences per frame
- Never start with a question
- Simple, energetic, conversational language
- Positive, inviting, and solution-focused

Structure:
Frame 1: Bold hook as a general observation/trend
Frame 2: Belief breaker + solution reveal in inclusive, aspirational terms
Frame 3: Clear CTA inviting action

Output format:
FRAME 1: [text]
FRAME 2: [text]
FRAME 3: [text]`;

    return await generateContent('ig_story_ad', systemPrompt);
  };

  const generateCreativePrompt = async () => {
    const campaign = await createOrGetCampaign();
    if (!campaign) return null;

    const systemPrompt = `You are a creative director specializing in Meta-safe visual concepts for Reels and Carousels.

${selectedCampaign ? `CAMPAIGN CONTEXT: You are creating visual concepts for a "${selectedCampaign.name}" campaign targeting ${selectedCampaign.target_audience}.` : ''}

Generate 3 Meta-safe visual concepts that include:

CONCEPT REQUIREMENTS:
- Title for the creative concept
- Scene description and setting
- Text overlay suggestions
- Call-to-action placement
- Meta policy compliance (inclusive, positive, no personal attributes)

VISUAL CONCEPTS TO INCLUDE:
1. Before/After style (without showing actual bodies)
2. Day-in-the-life / Behind-the-scenes
3. Educational / How-to format

Each concept should be:
- Scroll-stopping and engaging
- Easy to execute with phone camera
- Compliant with Meta advertising policies
- Aligned with brand voice and target audience

FORMAT:
CONCEPT 1: [Title]
Scene: [Description]
Text Overlay: [Suggestions]
CTA: [Placement and text]

CONCEPT 2: [Title]
Scene: [Description] 
Text Overlay: [Suggestions]
CTA: [Placement and text]

CONCEPT 3: [Title]
Scene: [Description]
Text Overlay: [Suggestions] 
CTA: [Placement and text]`;

    return await generateContent('creative_prompt', systemPrompt);
  };


  const handleCampaignSelect = (campaign: CampaignTemplate) => {
    setSelectedCampaign(campaign);
    setShowGenerationOptions(true);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setShowGenerationOptions(false);
  };

  if (authLoading || onboardingStatus === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // This fallback UI shouldn't be reached due to auto-redirect, but kept for safety
  if (!onboardingStatus.isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-klein font-extrabold text-white mb-6">Let's build your next client getting campaign</h1>
            <p className="text-xl text-muted-foreground mb-8">
              You need to complete the onboarding process before you can generate ads.
              {onboardingStatus.stepCompleted > 0 && (
                <span className="block mt-2 text-sm">
                  Step {onboardingStatus.stepCompleted} of 6 completed.
                </span>
              )}
            </p>
            <Button size="lg" onClick={() => navigate('/onboarding')} className="px-8 py-3 text-lg">
              {onboardingStatus.stepCompleted > 0 ? 'Continue Onboarding' : 'Start Onboarding'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-klein font-extrabold text-white mb-2">Ad Generator</h1>
        <p className="text-muted-foreground">
          Generate high-converting ad content powered by your brand setup
        </p>
      </div>

      {!showGenerationOptions ? (
        <>
          <CampaignSelectionTabs
            selectedCampaign={selectedCampaign}
            onCampaignSelect={handleCampaignSelect}
          />
        </>
      ) : (
        <>
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToCampaigns}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
            
            {selectedCampaign && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedCampaign.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedCampaign.description}
                      </CardDescription>
                    </div>
                    {selectedCampaign.seasonal_timing && (
                      <Badge variant="secondary">
                        {selectedCampaign.seasonal_timing}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Category: {selectedCampaign.category}</span>
                    {selectedCampaign.target_audience && (
                      <span>• Target: {selectedCampaign.target_audience}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdBlock
              title="Ad Caption"
              description="Generate compelling Facebook & Instagram ad captions with proven structure"
              icon={<MessageSquare />}
              onGenerate={generateAdCaption}
              contentType="ad_caption"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />

            <AdBlock
              title="Headline Options"
              description="Create 5 scroll-stopping headlines under 40 characters"
              icon={<Target />}
              onGenerate={generateHeadlineOptions}
              contentType="headline"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />

            <AdBlock
              title="Campaign Name"
              description="Generate memorable campaign names that create curiosity"
              icon={<Lightbulb />}
              onGenerate={generateCampaignName}
              contentType="campaign_name"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />

            <AdBlock
              title="IG Story Ad"
              description="Create engaging 3-frame Instagram Story sequences"
              icon={<Instagram />}
              onGenerate={generateIGStoryAd}
              contentType="ig_story"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />

            <AdBlock
              title="Creative Prompt"
              description="Generate visual concepts for Reels & Carousels"
              icon={<Palette />}
              onGenerate={generateCreativePrompt}
              contentType="creative_prompt"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdGenerator;