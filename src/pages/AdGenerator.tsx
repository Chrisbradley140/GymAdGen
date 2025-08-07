
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Type, Tag, Camera, MessageSquare, Loader2 } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { AdBlock } from "@/components/ad-generator/AdBlock";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { useBrandSetup } from "@/hooks/useBrandSetup";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdGenerator = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: brandData, loading: brandLoading } = useBrandSetup();
  const { generateContent } = useAdGeneration();
  const { toast } = useToast();
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
            <h1 className="text-4xl font-bold mb-6">Complete Your Setup</h1>
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

  const generateAdCaption = async (): Promise<string> => {
    const systemPrompt = `
You are a fitness marketing expert trained on $100k/month ad spend data. Create a high-converting fitness ad caption following the FITNESSADS.AI Output Training Spec.

MANDATORY OUTPUT FORMAT:

HOOK: [scroll-stopping line]  
PAIN MIRROR: [relatable frustration, second-person POV]  
BELIEF BREAKER: [the wedge, mechanism, or big insight]  
CTA: [command-style action line]

BRAND TONE ENFORCEMENT:
Write this as if the user is a fitness coach or gym owner with this tone: [voice_tone_style] — e.g. bold, raw, friendly, hype-driven, edgy, etc.

VOICE EMULATION GOAL:
The ad must sound like the user themselves said it out loud — short sentences, preferred punctuation, no fluff.

FORBIDDEN PHRASES TO AVOID:
- "Sound familiar?"
- "Let's be real…"
- "With just a few clicks…"
- "Here's the thing…"
- Em dashes (—) or double hyphens (--)
- Generic GPT-style questions or soft closings
- Any phrases from the words_to_avoid list

REQUIRED BRAND VIBE:
The output should feel like:
- A gym owner who cracked ads
- A no-BS marketer
- Hormozi meets Gymshark founder

BRAND WORDS INTEGRATION:
- MUST include phrases from: brand_words
- NEVER use phrases from: words_to_avoid

INSTRUCTIONS:
- HOOK: Short, punchy, possibly contrarian. Make them stop scrolling.
- PAIN MIRROR: Reflect their frustration or failed attempts. Use second-person POV ("You've tried every diet...").
- BELIEF BREAKER: Introduce your differentiator/mechanism. Example: "Most trainers guess, but our system was trained on $100k/month fitness ad spend."
- CTA: Confident and direct command. No soft closes.

FINAL FILTER PASS:
- Strip all GPT-y phrases
- Remove emojis (unless specifically requested)
- Rewrite soft intros or vague language
- Ensure it sounds like a real person, not AI

BRAND CONTEXT:
- Business: Use insights from their website to match tone, USP, and positioning
- Target Market: Address their specific demographics and psychographics
- Main Problem: Center the pain mirror around their core frustration
- Failed Solutions: Reference what they've already tried unsuccessfully
- Dream Outcome: Connect to their magic wand result
- Voice & Tone: Match their established communication style
- Offer Type: Align CTA with their specific offer structure

Create copy that feels authentic to their brand while following the strict 4-part structure and voice calibration spec.
`;
    
    return await generateContent('ad-caption', systemPrompt);
  };

  const generateHeadlineOptions = async (): Promise<string> => {
    const systemPrompt = `
Generate 3-5 punchy, attention-grabbing headlines for ads, lead forms, and landing pages.

BRAND TONE ENFORCEMENT:
Write this as if the user is a fitness coach or gym owner with this tone: [voice_tone_style] — e.g. bold, raw, friendly, hype-driven, edgy, etc.

FORBIDDEN PHRASES TO AVOID:
- "Sound familiar?"
- "Let's be real…"
- "With just a few clicks…"
- "Here's the thing…"
- Em dashes (—) or double hyphens (--)
- Generic GPT-style questions or soft closings
- Any phrases from the words_to_avoid list

REQUIRED BRAND VIBE:
- A gym owner who cracked ads
- A no-BS marketer
- Hormozi meets Gymshark founder

BRAND WORDS INTEGRATION:
- MUST include phrases from: brand_words
- NEVER use phrases from: words_to_avoid

Focus on the target audience's main frustrations and the transformation your offer provides.

Format your response as:

HEADLINE 1: [Result-focused headline]

HEADLINE 2: [Problem-focused headline] 

HEADLINE 3: [Curiosity-driven headline]

HEADLINE 4: [Social proof/testimonial headline]

HEADLINE 5: [Urgency/scarcity headline]

Each headline should be under 40 characters for optimal ad performance. Make them punchy, benefit-driven, and conversion-focused.

FINAL FILTER PASS:
- Strip all GPT-y phrases
- Remove emojis (unless specifically requested)
- Ensure it sounds like a real person, not AI
`;
    
    return await generateContent('headline-options', systemPrompt);
  };

  const generateCampaignName = async (): Promise<string> => {
    const systemPrompt = `
Suggest 5 creative campaign titles that feel clever, seasonal, or results-driven.

BRAND TONE ENFORCEMENT:
Write this as if the user is a fitness coach or gym owner with this tone: [voice_tone_style] — e.g. bold, raw, friendly, hype-driven, edgy, etc.

FORBIDDEN PHRASES TO AVOID:
- "Sound familiar?"
- "Let's be real…"
- "With just a few clicks…"
- "Here's the thing…"
- Em dashes (—) or double hyphens (--)
- Generic GPT-style questions or soft closings
- Any phrases from the words_to_avoid list

REQUIRED BRAND VIBE:
- A gym owner who cracked ads
- A no-BS marketer
- Hormozi meets Gymshark founder

BRAND WORDS INTEGRATION:
- MUST include phrases from: brand_words
- NEVER use phrases from: words_to_avoid

Think along the lines of "Postcode Power Hour" - catchy, memorable, and relevant to the target market.

Format your response as:

CAMPAIGN 1: [Clever/witty campaign name]

CAMPAIGN 2: [Results-driven campaign name]

CAMPAIGN 3: [Seasonal/timely campaign name]

CAMPAIGN 4: [Transformation-focused campaign name]

CAMPAIGN 5: [Community/movement campaign name]

Make them memorable, brandable, and aligned with the business type and target audience.

FINAL FILTER PASS:
- Strip all GPT-y phrases
- Remove emojis (unless specifically requested)
- Ensure it sounds like a real person, not AI
`;
    
    return await generateContent('campaign-name', systemPrompt);
  };

  const generateIGStoryAd = async (): Promise<string> => {
    const systemPrompt = `
Create a 3-frame Instagram Story ad sequence that guides viewers through your funnel.

BRAND TONE ENFORCEMENT:
Write this as if the user is a fitness coach or gym owner with this tone: [voice_tone_style] — e.g. bold, raw, friendly, hype-driven, edgy, etc.

FORBIDDEN PHRASES TO AVOID:
- "Sound familiar?"
- "Let's be real…"
- "With just a few clicks…"
- "Here's the thing…"
- Em dashes (—) or double hyphens (--)
- Generic GPT-style questions or soft closings
- Any phrases from the words_to_avoid list

REQUIRED BRAND VIBE:
- A gym owner who cracked ads
- A no-BS marketer
- Hormozi meets Gymshark founder

BRAND WORDS INTEGRATION:
- MUST include phrases from: brand_words
- NEVER use phrases from: words_to_avoid

Structure:
Frame 1: Problem or hook that grabs attention
Frame 2: Breakthrough moment or solution reveal  
Frame 3: Clear call-to-action

Format your response as:

FRAME 1: [Problem/hook - make them stop scrolling]

FRAME 2: [Breakthrough moment - the "aha" moment]

FRAME 3: [Clear CTA - specific next steps]

Keep each frame concise (1-2 sentences max) as they'll be text overlays on visuals. Make it flow naturally from problem to solution to action.

FINAL FILTER PASS:
- Strip all GPT-y phrases
- Remove emojis (unless specifically requested)
- Ensure it sounds like a real person, not AI
`;
    
    return await generateContent('ig-story-ad', systemPrompt);
  };

  const generateCreativePrompt = async (): Promise<string> => {
    const systemPrompt = `
Generate 1-2 sentence visual ideas for a reel, carousel, or image ad.

BRAND TONE ENFORCEMENT:
Write this as if the user is a fitness coach or gym owner with this tone: [voice_tone_style] — e.g. bold, raw, friendly, hype-driven, edgy, etc.

FORBIDDEN PHRASES TO AVOID:
- "Sound familiar?"
- "Let's be real…"
- "With just a few clicks…"
- "Here's the thing…"
- Em dashes (—) or double hyphens (--)
- Generic GPT-style questions or soft closings
- Any phrases from the words_to_avoid list

REQUIRED BRAND VIBE:
- A gym owner who cracked ads
- A no-BS marketer
- Hormozi meets Gymshark founder

BRAND WORDS INTEGRATION:
- MUST include phrases from: brand_words
- NEVER use phrases from: words_to_avoid

Provide specific, actionable creative direction that a content creator could immediately implement.

Format your response as:

VISUAL IDEA 1: [Specific visual concept with clear direction]

VISUAL IDEA 2: [Alternative visual approach]

VISUAL IDEA 3: [Third creative option]

Examples: 
- "Coach points at whiteboard labeled '3 Fat Loss Lies' while shaking head disapprovingly"
- "Split screen showing 'before' morning routine vs 'after' optimized routine"
- "Person dramatically throws scale in trash, then shows progress photos on phone"

Make them engaging, clear, and easy to execute with common props/settings.

FINAL FILTER PASS:
- Strip all GPT-y phrases
- Remove emojis (unless specifically requested)
- Ensure it sounds like a real person, not AI
`;
    
    return await generateContent('creative-prompt', systemPrompt);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Let's build your next client getting campaign
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate high-converting ads tailored to your brand using AI. Each piece of content is created based on your brand setup and target audience.
          </p>
        </div>

        {/* Ad Generation Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <AdBlock
            title="Ad Caption Generator"
            description="Generate a full Instagram/Facebook ad caption with Hook → Pain Mirror → Belief Breaker → CTA structure"
            icon={<MessageSquare className="w-6 h-6 text-primary" />}
            onGenerate={generateAdCaption}
            placeholder="Your generated ad caption will appear here..."
            contentType="ad_caption"
          />

          <AdBlock
            title="Headline Options Generator"
            description="Output 3-5 punchy headlines for ads, lead forms, and landing pages based on your offer"
            icon={<Type className="w-6 h-6 text-primary" />}
            onGenerate={generateHeadlineOptions}
            placeholder="Your headline options will appear here..."
            contentType="headline"
          />

          <AdBlock
            title="Campaign Name Generator"
            description="Suggest creative campaign titles that feel clever, seasonal, or results-driven"
            icon={<Tag className="w-6 h-6 text-primary" />}
            onGenerate={generateCampaignName}
            placeholder="Your campaign name suggestions will appear here..."
            contentType="campaign_name"
          />

          <AdBlock
            title="IG Story Ad Generator"
            description="Create a 3-frame Instagram Story ad: Problem/Hook → Breakthrough → CTA"
            icon={<FaInstagram className="w-6 h-6 text-[#E4405F]" />}
            onGenerate={generateIGStoryAd}
            placeholder="Your Instagram Story ad sequence will appear here..."
            contentType="ig_story"
          />

          <AdBlock
            title="Creative Prompt Generator"
            description="Generate 1-2 sentence visual ideas for reels, carousels, or image ads"
            icon={<Camera className="w-6 h-6 text-primary" />}
            onGenerate={generateCreativePrompt}
            contentType="creative_prompt"
            placeholder="Your creative visual prompts will appear here..."
          />
        </div>

        {/* Future Features Placeholder */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-dashed border-2 border-muted-foreground/20">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
              <CardDescription>
                Export to PDF, Campaign Library, and more advanced features are in development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <Button variant="outline" disabled>
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => navigate('/library')}>
                  View Library
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdGenerator;
