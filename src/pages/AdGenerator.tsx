
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

INSTRUCTIONS:
- HOOK: Short, punchy, possibly contrarian. Make them stop scrolling.
- PAIN MIRROR: Reflect their frustration or failed attempts. Use second-person POV ("You've tried every diet...").
- BELIEF BREAKER: Introduce your differentiator/mechanism. Example: "Most trainers guess, but our system was trained on $100k/month fitness ad spend."
- CTA: Confident and direct command. No soft closes.

BRAND CONTEXT:
- Business: Use insights from their website to match tone, USP, and positioning
- Target Market: Address their specific demographics and psychographics
- Main Problem: Center the pain mirror around their core frustration
- Failed Solutions: Reference what they've already tried unsuccessfully
- Dream Outcome: Connect to their magic wand result
- Voice & Tone: Match their established communication style
- Brand Words: Incorporate their preferred terminology
- Words to Avoid: Never use their blacklisted terms
- Offer Type: Align CTA with their specific offer structure

Create copy that feels authentic to their brand while following the strict 4-part structure.
`;
    
    return await generateContent('ad-caption', systemPrompt);
  };

  const generateHeadlineOptions = async (): Promise<string> => {
    const voiceTone = brandData?.voice_tone_style || 'Bold';
    
    // Voice tone style conditioning
    const voicePatterns = {
      'Bold': 'Use direct, confident, commanding language. Examples: "Stop Making This Mistake", "The Truth About...", "Here\'s What Works"',
      'Playful': 'Use fun, cheeky, conversational language. Examples: "Oops! You\'re Doing It Wrong", "Plot Twist...", "Nobody Told You This"',
      'Premium': 'Use sophisticated, exclusive, high-value language. Examples: "The Elite Method", "Exclusive Access...", "Reserved for Members Only"',
      'Aggressive': 'Use intense, urgent, confrontational language. Examples: "Enough Excuses", "Time\'s Running Out", "Last Warning"'
    };

    const systemPrompt = `You are an elite fitness marketer with 10+ years creating high-converting headlines for transformation programs, personal trainers, and fitness brands.

VOICE TONE: ${voiceTone}
${voicePatterns[voiceTone as keyof typeof voicePatterns]}

Create 5 headline options that sound like they were written by a seasoned fitness industry insider - NOT generic AI copy.

MANDATORY PROVEN ANGLES (use 1-2 per headline):
- FRUSTRATION: Target specific fitness plateaus, slow results, confusing advice
- BELIEF BREAKER: Challenge fitness myths ("cardio for fat loss", "spot reduction", "no pain no gain")
- URGENCY: Summer body deadlines, wedding prep, age-related metabolism changes

FITNESS MARKETER LANGUAGE RULES:
- Use insider terms: "plateau", "body recomp", "metabolic damage", "training age"
- Reference real struggles: stubborn belly fat, muscle confusion, calorie cycling fails
- Include transformation timeframes: "30-day", "12-week", "summer ready"
- Use fitness-specific pain points: scales lying, clothes not fitting, energy crashes

FORMAT: Numbered list, each headline under 40 characters, conversion-focused with built-in urgency.

1. [Headline]
2. [Headline]
3. [Headline]
4. [Headline]
5. [Headline]

Write like a fitness marketer who's actually transformed thousands of bodies - not like ChatGPT.`;

    return await generateContent('headline-options', systemPrompt);
  };

  const generateCampaignName = async (): Promise<string> => {
    const systemPrompt = `
Suggest 5 creative campaign titles that feel clever, seasonal, or results-driven.

Think along the lines of "Postcode Power Hour" - catchy, memorable, and relevant to the target market.

Format your response as:

CAMPAIGN 1: [Clever/witty campaign name]

CAMPAIGN 2: [Results-driven campaign name]

CAMPAIGN 3: [Seasonal/timely campaign name]

CAMPAIGN 4: [Transformation-focused campaign name]

CAMPAIGN 5: [Community/movement campaign name]

Make them memorable, brandable, and aligned with the business type and target audience.
`;
    
    return await generateContent('campaign-name', systemPrompt);
  };

  const generateIGStoryAd = async (): Promise<string> => {
    const systemPrompt = `
Create a 3-frame Instagram Story ad sequence that guides viewers through your funnel.

Structure:
Frame 1: Problem or hook that grabs attention
Frame 2: Breakthrough moment or solution reveal  
Frame 3: Clear call-to-action

Format your response as:

FRAME 1: [Problem/hook - make them stop scrolling]

FRAME 2: [Breakthrough moment - the "aha" moment]

FRAME 3: [Clear CTA - specific next steps]

Keep each frame concise (1-2 sentences max) as they'll be text overlays on visuals. Make it flow naturally from problem to solution to action.
`;
    
    return await generateContent('ig-story-ad', systemPrompt);
  };

  const generateCreativePrompt = async (): Promise<string> => {
    const systemPrompt = `
Generate 1-2 sentence visual ideas for a reel, carousel, or image ad.

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
      </div>
    </div>
  );
};

export default AdGenerator;
