import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdGeneration } from '@/hooks/useAdGeneration';
import { useBrandSetup } from '@/hooks/useBrandSetup';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useSavedContent } from '@/hooks/useSavedContent';
import { useTemplates, CampaignTemplate, TopPerformingAd } from '@/hooks/useTemplates';
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
  const { getAdTemplatesForCampaign, getTopPerformingAds } = useTemplates();
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
    // Get top-performing ads for this campaign
    const topPerformingAdsPromise = selectedCampaign ? getTopPerformingAds(selectedCampaign.canonical_name) : Promise.resolve([]);
    const topPerformingAds = await topPerformingAdsPromise;
    
    // Analyze patterns from top-performing ads
    const adExamples = topPerformingAds.slice(0, 3).map(ad => 
      `Primary Text: ${ad.primary_text}\nHeadline: ${ad.headline || 'N/A'}\nHook Type: ${ad.hook_type || 'N/A'}\nTone: ${ad.tone || 'N/A'}`
    ).join('\n\n---\n\n');

    const systemPrompt = `🚨 You are a HIGH-ENERGY fitness ad copywriter trained to replicate PROVEN top-performing ads that generate results! 🚨

${selectedCampaign ? `🎯 CAMPAIGN CONTEXT: "${selectedCampaign.name}" campaign targeting ${selectedCampaign.target_audience}. ${selectedCampaign.description}` : ''}

${adExamples ? `🔥 TOP-PERFORMING ADS TO REPLICATE:
${adExamples}

📌 CRITICAL: Match the EXACT energy, style, and structure of these proven winners! Use their patterns as your blueprint!` : ''}

Generate an ad caption following this PROVEN STRUCTURE:

🚨 **BIG HOOK** (Start with CAPS + emojis + location targeting like "🚨 ATTENTION [CITY] LADIES 🚨")
💔 **PAIN CALLOUT** (Hit their struggles hard - be conversational and emotional) 
🎯 **PROGRAM INTRO** (Present your transformation challenge with a clear name)
✅ **BENEFIT BULLETS** (Use emoji bullets: ✅ workouts ✅ nutrition ✅ community)
⏰ **SCARCITY** (Specific numbers: "15 local women", "10 spots only" + urgency phrases)
👆 **DIRECT CTA** ("Click Learn More", "Tap the link below", "Apply Here")

🎯 ENERGY & STYLE REQUIREMENTS:
- START BIG: Use 🚨 emojis, CAPS, location targeting ("HULL LADIES", "SUTTON WOMEN")
- BE PLAYFUL: Use elongated words like "REEEEEALLY", bold claims, fun exaggeration
- ADD SCARCITY: "HURRY", "if the link still works", specific spot numbers
- EMOJI BULLETS: Use ✅ 🔥 💪 🎯 for benefit lists
- TONE: Energetic, hype-driven, emoji-rich, slightly raw - NOT overly polished
- LENGTH: 100-200 words max

🚀 Make it SCROLL-STOPPING and match the exact energy of top-performing fitness ads!`;

    return await generateContent('ad_caption', systemPrompt, selectedCampaign?.canonical_name, topPerformingAds);
  };

  const generateHeadlineOptions = async () => {
    // Get top-performing ads for headline analysis
    const topPerformingAdsPromise = selectedCampaign ? getTopPerformingAds(selectedCampaign.canonical_name) : Promise.resolve([]);
    const topPerformingAds = await topPerformingAdsPromise;
    const headlineExamples = topPerformingAds
      .filter(ad => ad.headline)
      .slice(0, 5)
      .map(ad => `"${ad.headline}" (${ad.hook_type || 'direct'} style)`)
      .join(', ');

    const systemPrompt = `🔥 You're creating HIGH-IMPACT headlines based on proven fitness ad winners! 🔥

${selectedCampaign ? `🎯 CAMPAIGN: "${selectedCampaign.name}" targeting ${selectedCampaign.target_audience}` : ''}

${headlineExamples ? `🏆 PROVEN HEADLINES TO EMULATE: ${headlineExamples}

📌 REPLICATE their energy, urgency, and hook style - but make them original!` : ''}

Generate 5 PUNCHY headlines (40 chars max) in this style:

🎯 HEADLINE STYLES (copy the energy):
1. **BIG HOOK**: "🚨 15 SPOTS LEFT 🚨" (scarcity + emojis)
2. **CHALLENGE NAME**: "6 Week Body Blast" (transformation focus)  
3. **LOCAL CALLOUT**: "Hull Ladies Only!" (location + exclusivity)
4. **URGENCY**: "HURRY! Link Expires" (time pressure)
5. **BOLD CLAIM**: "TOTAL Body Reset" (caps + transformation)

📝 FORMAT RULES:
- NO explanations - just numbered headlines
- Use CAPS for impact words
- Include emojis where natural
- Keep under 40 characters
- Match the ENERGY of top performers

Example:
1. 🚨 10 SPOTS LEFT 🚨
2. 6 Week Transformation  
3. Local Ladies Only!
4. HURRY! Ends Monday
5. TOTAL Body Reset

Make them BOLD, ENERGETIC, and irresistible!`;

    return await generateContent('headline_options', systemPrompt, selectedCampaign?.canonical_name, topPerformingAds);
  };

  const generateCampaignName = async () => {
    // Don't create campaign during generation, only during save

    const systemPrompt = `🚀 You're creating UNFORGETTABLE campaign names based on proven fitness challenge winners! 🚀

${selectedCampaign ? `🎯 CAMPAIGN TYPE: "${selectedCampaign.name}" targeting ${selectedCampaign.target_audience}. ${selectedCampaign.description}` : ''}

Generate 5 campaign names that combine TRANSFORMATION + URGENCY like top performers:

🔥 PROVEN PATTERN EXAMPLES:
- "6 Week Total Body Transformation Challenge" 
- "The Bootybox Challenge"
- "Feel Good Again Challenge"
- "28 Day Body Blast"
- "New Year New You Reset"

🎯 NAME REQUIREMENTS:
- Include TRANSFORMATION word (Challenge, Reset, Blast, Transformation)
- Add TIME URGENCY (6 Week, 28 Day, etc.)
- Make it MEMORABLE and energetic
- Easy to say and share
- Create excitement and FOMO

💡 NAMING FORMULAS:
1. [TIME] + [BODY PART/GOAL] + "Challenge/Transformation"
2. "The [CATCHY NAME] Challenge" 
3. "[TRANSFORMATION] + [TIME PERIOD]"
4. "[SEASON/EVENT] + Body/Life + Reset/Blast"
5. "[LOCATION] + [TARGET] + Challenge"

FORMAT: Just numbered list - NO explanations!

Example:
1. 6 Week Total Transformation
2. The Confidence Challenge  
3. Summer Body Blast
4. 28 Day Reset Challenge
5. New You Challenge

Make them ENERGETIC and transformation-focused!`;

    return await generateContent('campaign_name', systemPrompt, selectedCampaign?.canonical_name, []);
  };

  const generateIGStoryAd = async () => {
    // Don't create campaign during generation, only during save

    const systemPrompt = `🚨 You're creating HIGH-ENERGY 3-frame IG Story ads based on proven fitness winners! 🚨

${selectedCampaign ? `🎯 CAMPAIGN: "${selectedCampaign.name}" targeting ${selectedCampaign.target_audience}` : ''}

Create a 3-frame Instagram Story sequence following this PROVEN STRUCTURE:

📱 **FRAME 1: BIG HOOK + PROBLEM** 
- Start with emoji + problem/desire
- Use relatable struggle or aspiration
- Example: "🚨 Tired of feeling uncomfortable in your own skin?"

📱 **FRAME 2: BENEFITS CHECKLIST** 
- List benefits with emoji bullets
- Show transformation possibilities
- Example: "Our 6 Week Challenge includes: ✅ Workouts ✅ Nutrition ✅ Community"

📱 **FRAME 3: SCARCITY + CTA**
- Add urgency/limited spots
- Clear action step
- Example: "⏰ Only 15 spots left! Tap below to secure yours!"

🎯 STYLE REQUIREMENTS:
- ENERGETIC and scroll-stopping
- Use emojis for visual appeal  
- Keep each frame short (1-2 sentences)
- Include urgency/scarcity in Frame 3
- Make it conversational and hype-driven

📝 OUTPUT FORMAT:
FRAME 1: [hook + problem with emojis]
FRAME 2: [benefits checklist with ✅ bullets]  
FRAME 3: [scarcity + direct CTA]

Make it IRRESISTIBLE and action-driving!`;

    return await generateContent('ig_story_ad', systemPrompt, selectedCampaign?.canonical_name, []);
  };

  const generateCreativePrompt = async () => {
    // Don't create campaign during generation, only during save

    const systemPrompt = `🎥 You're creating VIRAL visual concepts based on top-performing fitness content! 🎥

${selectedCampaign ? `🎯 CAMPAIGN: "${selectedCampaign.name}" targeting ${selectedCampaign.target_audience}` : ''}

Generate 3 SCROLL-STOPPING visual concepts that match proven patterns:

🔥 **CONCEPT TYPES TO CREATE:**
1. **TRANSFORMATION SHOWCASE** (exciting reveal style)
2. **DAY-IN-THE-LIFE** (relatable behind-scenes)  
3. **ENERGETIC WORKOUT PREVIEW** (dynamic action shots)

📱 **REQUIREMENTS FOR EACH:**
- ATTENTION-GRABBING title
- Dynamic scene description
- Bold text overlay ideas using CAPS + emojis
- Strong CTA placement
- Easy to film with phone
- High-energy and engaging

🎯 **STYLE ELEMENTS TO INCLUDE:**
- Use movement and energy
- Include workout/nutrition elements
- Show community/group aspects
- Add transformation themes
- Make it relatable and inspiring

📝 **OUTPUT FORMAT:**
CONCEPT 1: [ENERGETIC Title with emojis]
Scene: [Dynamic description with action]
Text Overlay: [Bold suggestions with CAPS + emojis]
CTA: [Placement and direct action]

CONCEPT 2: [ENERGETIC Title with emojis]
Scene: [Dynamic description with action] 
Text Overlay: [Bold suggestions with CAPS + emojis]
CTA: [Placement and direct action]

CONCEPT 3: [ENERGETIC Title with emojis]
Scene: [Dynamic description with action]
Text Overlay: [Bold suggestions with CAPS + emojis] 
CTA: [Placement and direct action]

Make them VIRAL-WORTHY and action-packed!`;

    return await generateContent('creative_prompt', systemPrompt, selectedCampaign?.canonical_name, []);
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
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdBlock
              title="Ad Caption"
              description="Generate compelling Facebook & Instagram ad captions with proven structure"
              icon={<MessageSquare className="text-red-500" />}
              onGenerate={generateAdCaption}
              contentType="ad_caption"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />

            <AdBlock
              title="Headline Options"
              description="Create 5 scroll-stopping headlines under 40 characters"
              icon={<Target className="text-red-500" />}
              onGenerate={generateHeadlineOptions}
              contentType="headline"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />

            <AdBlock
              title="Campaign Name"
              description="Generate memorable campaign names that create curiosity"
              icon={<Lightbulb className="text-red-500" />}
              onGenerate={generateCampaignName}
              contentType="campaign_name"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />

            <AdBlock
              title="IG Story Ad"
              description="Create engaging 3-frame Instagram Story sequences"
              icon={<Instagram className="text-red-500" />}
              onGenerate={generateIGStoryAd}
              contentType="ig_story"
              campaignId={currentCampaignId}
              onCampaignCreate={createOrGetCampaign}
            />

            <AdBlock
              title="Creative Prompt"
              description="Generate visual concepts for Reels & Carousels"
              icon={<Palette className="text-red-500" />}
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