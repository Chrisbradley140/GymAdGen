
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
    
    // Enhanced voice tone patterns for fitness marketing
    const voicePatterns = {
      'Bold': 'Direct, commanding, no-nonsense. Examples: "Drop 15lbs in 8 weeks", "Build muscle after 40", "Transform in 12 weeks without cardio"',
      'Playful': 'Cheeky, fun, conversational but still results-focused. Examples: "The lazy way to six-pack abs", "Cheat your way to 15% body fat", "Skip cardio, keep curves"', 
      'Premium': 'Exclusive, sophisticated, high-value positioning. Examples: "Elite transformation protocol", "Executive body recomp system", "VIP metabolism reset method"',
      'Aggressive': 'Intense, urgent, confrontational with deadlines. Examples: "Drop 2 dress sizes by summer", "Burn fat faster than ever", "Destroy your plateau in 30 days"'
    };

    const systemPrompt = `You are an elite fitness marketer who has generated millions in revenue from transformation programs. Create 3-5 scroll-stopping headlines that would make fitness professionals rich.

VOICE TONE: ${voiceTone}
${voicePatterns[voiceTone as keyof typeof voicePatterns]}

🚫 STRICT PROHIBITIONS (NEVER USE):
- "Feel better", "More energy", "What if..."
- "Sound familiar?", "Let's be real", "Struggling with..."
- Soft rhetorical questions or Canva-style inspiration
- Em dashes (—) or double hyphens (--)
- Vague wellness language
- Generic GPT phrases

✅ MANDATORY REQUIREMENTS (EVERY HEADLINE MUST HAVE):
- Specific numbers (timeframes, weight loss, body fat %)
- Direct outcomes ("lose X lbs", "build X muscle", "drop X sizes")
- Wedges/differentiators ("without cardio", "without meal plans", "without gym")
- Second-person direct address ("you", "your")
- 60-70 characters max (campaign-worthy length)

🎯 PROVEN ANGLES TO INCORPORATE:
- FRUSTRATION: Plateaus, slow results, confusing advice, failed diets
- BELIEF BREAKER: Challenge myths about cardio, spot reduction, extreme dieting
- URGENCY: Summer deadlines, wedding prep, metabolism slowing with age

FITNESS INSIDER LANGUAGE:
- Transformation timeframes: "30-day", "12-week", "90-day"
- Body composition terms: "body recomp", "lean muscle", "stubborn fat"
- Real pain points: "plateau", "skinny fat", "metabolic damage"
- Differentiators: "without cardio", "eating pizza", "20 minutes"

FORMAT EXAMPLE:
1. Drop 15lbs in 8 weeks without cardio
2. Build muscle after 40 (even with bad knees)  
3. The 20-minute method busy moms use to lose belly fat
4. How Sarah lost 25lbs eating pizza twice a week
5. Transform your body in 90 days (no gym required)

Create headlines that fitness professionals would pay thousands for because they convert browsers into buyers.`;

    return await generateContent('headline-options', systemPrompt);
  };

  const generateCampaignName = async (): Promise<string> => {
    const voiceTone = brandData?.voice_tone_style || 'Bold';
    const offerType = brandData?.offer_type || '';
    const mainProblem = brandData?.main_problem || '';
    const targetMarket = brandData?.target_market || '';
    const failedSolutions = brandData?.failed_solutions || '';
    const campaignTypes = brandData?.campaign_types || [];
    const seasonalOptions = brandData?.seasonal_launch_options || [];
    
    // Build seasonal context
    let seasonalContext = '';
    if (seasonalOptions.length > 0) {
      const seasonal = seasonalOptions.join(', ');
      if (seasonal.includes('Summer')) seasonalContext += 'SEASONAL PRIORITY: Summer themes (Summer Shred, Beach Body, Bikini Ready). ';
      if (seasonal.includes('January') || seasonal.includes('New Year')) seasonalContext += 'SEASONAL PRIORITY: New Year themes (Resolution Reset, New Year Burnout Fix, January Jump-Start). ';
      if (seasonal.includes('Back to School')) seasonalContext += 'SEASONAL PRIORITY: Back-to-School themes (September Shred, Back-to-School Belly Drop, Student Strong). ';
      if (seasonal.includes('Holiday')) seasonalContext += 'SEASONAL PRIORITY: Holiday themes (Holiday Hustle, Thanksgiving Turnaround, Christmas Challenge). ';
    }
    
    // Build audience-specific context
    let audienceContext = '';
    if (targetMarket.toLowerCase().includes('busy moms') || targetMarket.toLowerCase().includes('mothers')) {
      audienceContext = 'AUDIENCE FOCUS: Mom-specific angles (Mom Squad Strong, Mama Method, Mom Boss Challenge). ';
    } else if (targetMarket.toLowerCase().includes('executive') || targetMarket.toLowerCase().includes('professional')) {
      audienceContext = 'AUDIENCE FOCUS: Professional angles (Executive Edge, CEO Strong, Professional Power). ';
    } else if (targetMarket.toLowerCase().includes('over 40') || targetMarket.toLowerCase().includes('40+')) {
      audienceContext = 'AUDIENCE FOCUS: Over-40 angles (40+ Uprising, Midlife Method, Prime Time Protocol). ';
    }
    
    // Build pain point context
    let painContext = '';
    if (mainProblem.toLowerCase().includes('cardio') || failedSolutions.toLowerCase().includes('cardio')) {
      painContext = 'PAIN ANGLE: Anti-cardio focus (No-Cardio Commitment, Cardio-Free Challenge, Zero-Cardio Zone). ';
    }
    if (mainProblem.toLowerCase().includes('time') || mainProblem.toLowerCase().includes('busy')) {
      painContext += 'PAIN ANGLE: Time-focused (15-Minute Method, Busy Body Blitz, Quick Results). ';
    }
    if (mainProblem.toLowerCase().includes('plateau') || failedSolutions.toLowerCase().includes('plateau')) {
      painContext += 'PAIN ANGLE: Plateau-busting (Plateau Buster, Breakthrough Protocol, Stalled Strong). ';
    }
    
    // Build campaign type context
    let campaignContext = '';
    if (campaignTypes.includes('Reactivation Campaign')) {
      campaignContext = 'CAMPAIGN TYPE: Reactivation focus (Comeback Challenge, Return Strong, Revival Reset). ';
    } else if (campaignTypes.includes('Time-Sensitive Promo')) {
      campaignContext = 'CAMPAIGN TYPE: Urgency focus (Last Call Lean, Final Week Fury, Deadline Demolition). ';
    }
    
    const systemPrompt = `You are a direct-response fitness marketer who creates campaigns that generate millions in revenue. Create 3-5 bold, conversion-focused campaign names that fitness professionals would pay thousands for.

BRAND INPUTS:
VOICE TONE: ${voiceTone}
OFFER TYPE: ${offerType}
TARGET MARKET: ${targetMarket}
MAIN PROBLEM: ${mainProblem}
FAILED SOLUTIONS: ${failedSolutions}

${seasonalContext}
${audienceContext}
${painContext}
${campaignContext}

🚫 STRICT PROHIBITIONS (NEVER USE):
- Vague terms: "Fitness Journey", "Wellness Reset", "Healthy Lifestyle", "Better You"
- Self-help book style: "Consistency Code", "Mindset Mastery", "Inner Strength"
- Generic gym flyers: "Get Fit Now", "Transform Today", "New You", "Ultimate Guide"
- Blog-style phrases: "How to", "Guide to", "Secrets of"
- Soft wellness language: "Gentle", "Nurturing", "Balanced"
- More than 5 words (prioritize 2-3 words for maximum impact)

✅ MANDATORY REQUIREMENTS:
- EXACTLY 2-5 words (shorter = more brandable)
- Direct-response marketing feel (scroll-stopping, high ROAS energy)
- Campaign-worthy (sounds like real marketing campaigns worth $$$)
- Incorporate seasonal themes if provided above
- Match audience demographics if specified
- Address specific pain points mentioned
- Use power words: Shred, Blast, Demolish, Protocol, Method, Challenge, System

🎯 TONE-SPECIFIC FORMULAS:
BOLD/AGGRESSIVE: "Beast Mode", "Savage Shred", "Demolition Days", "Fat Fury"
DIRECT + WARM: "Mama Strong", "Gentle Giant", "Warm Warrior", "Kind Crush"
EDGY/HYPE: "Anti-Cardio Club", "Lazy Lean", "Cheat Code", "Rebel Results"
CONFIDENT: "Power Protocol", "Elite Edge", "Champion Challenge", "Victory Method"

FORMAT (provide 3-5 names):
1. [2-3 word power name]
2. [Seasonal/audience specific name]
3. [Pain-point focused name]
4. [Offer-type aligned name]
5. [Bold brandable name]

These must sound like they belong on high-converting fitness ads that generate 6-figure launches, not gym bulletin boards.`;
    
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
