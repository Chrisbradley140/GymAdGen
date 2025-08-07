
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
import { useCampaigns } from "@/hooks/useCampaigns";
import { supabase } from "@/integrations/supabase/client";

const AdGenerator = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: brandData, loading: brandLoading } = useBrandSetup();
  const { generateContent } = useAdGeneration();
  const { createCampaign } = useCampaigns();
  const { toast } = useToast();
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);
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
    const campaign = await createCampaign(
      `Campaign - ${timestamp}`,
      `Generated campaign from ${timestamp}`
    );
    
    if (campaign) {
      setCurrentCampaignId(campaign.id);
      return campaign.id;
    }
    return null;
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
    if (!brandData) return '';

    const voiceTone = brandData.voice_tone_style || 'Bold';
    const offerType = brandData.offer_type || '';
    const mainProblem = brandData.main_problem || '';
    const targetMarket = brandData.target_market || '';
    const failedSolutions = brandData.failed_solutions || '';
    const campaignTypes = brandData.campaign_types || [];
    const seasonalOptions = brandData.seasonal_launch_options || [];
    
    // Build seasonal context with specific action verbs
    let seasonalContext = '';
    if (seasonalOptions.length > 0) {
      const seasonal = seasonalOptions.join(', ');
      if (seasonal.includes('Summer')) {
        seasonalContext += 'SEASONAL PRIORITY: Summer themes with action verbs. Examples: "Summer Shred", "Beach Bod Blast", "Bikini Drop", "Summer Sculpt". ';
      }
      if (seasonal.includes('January') || seasonal.includes('New Year')) {
        seasonalContext += 'SEASONAL PRIORITY: New Year themes with action verbs. Examples: "Resolution Crush", "January Melt", "New Year Strip", "Fresh Start Shred". ';
      }
      if (seasonal.includes('Back to School')) {
        seasonalContext += 'SEASONAL PRIORITY: Back-to-School themes with action verbs. Examples: "September Shred", "School Drop Challenge", "Back-to-School Blast". ';
      }
      if (seasonal.includes('Holiday')) {
        seasonalContext += 'SEASONAL PRIORITY: Holiday themes with action verbs. Examples: "Holiday Shred", "Turkey Drop", "Christmas Crush". ';
      }
    }
    
    // Build audience-specific context with action formulas
    let audienceContext = '';
    if (targetMarket.toLowerCase().includes('busy mom') || targetMarket.toLowerCase().includes('mother')) {
      audienceContext = 'AUDIENCE FOCUS: Mom-specific action names. Examples: "Mom Squad Shred", "Mama Melt Challenge", "Busy Mom Blast", "Mom Bod Drop". ';
    } else if (targetMarket.toLowerCase().includes('executive') || targetMarket.toLowerCase().includes('professional')) {
      audienceContext = 'AUDIENCE FOCUS: Professional action names. Examples: "Executive Edge", "Boss Bod Drop", "Corporate Crush", "CEO Shred". ';
    } else if (targetMarket.toLowerCase().includes('over 40') || targetMarket.toLowerCase().includes('40+')) {
      audienceContext = 'AUDIENCE FOCUS: Over-40 action names. Examples: "40+ Shred", "Midlife Melt", "Prime Time Drop", "Silver Strength". ';
    }
    
    // Build pain point context with specific action solutions
    let painContext = '';
    if (mainProblem.toLowerCase().includes('cardio') || failedSolutions.toLowerCase().includes('cardio')) {
      painContext = 'PAIN INTEGRATION: Anti-cardio focus with action verbs. Examples: "Cardio-Free Crush", "No-Cardio Challenge", "Anti-Cardio Shred". ';
    }
    if (mainProblem.toLowerCase().includes('time') || mainProblem.toLowerCase().includes('busy')) {
      painContext += 'PAIN INTEGRATION: Time-focused with action verbs. Examples: "Quick Drop", "15-Minute Melt", "Busy Body Blast". ';
    }
    if (mainProblem.toLowerCase().includes('plateau') || failedSolutions.toLowerCase().includes('plateau')) {
      painContext += 'PAIN INTEGRATION: Plateau-busting with action verbs. Examples: "Plateau Crusher", "Breakthrough Blast", "Stall Breaker". ';
    }
    
    // Build campaign type context
    let campaignContext = '';
    if (campaignTypes.includes('Reactivation Campaign')) {
      campaignContext = 'CAMPAIGN TYPE: Reactivation with action focus. Examples: "Comeback Crush", "Return Strong", "Revival Rush". ';
    } else if (campaignTypes.includes('Time-Sensitive Promo')) {
      campaignContext = 'CAMPAIGN TYPE: Urgency with action focus. Examples: "Last Call Lean", "Final Rush", "Deadline Drop". ';
    }
    
    const systemPrompt = `You are an elite fitness campaign specialist who creates bold, action-driven campaign names that generate millions in revenue. Create 4-5 scroll-stopping campaign names that feel like strategic fitness challenges.

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

CRITICAL REQUIREMENTS:
- Each name must be 2-5 words maximum (prioritize 2-3 words for maximum impact)
- Must sound like strategic fitness challenges or launches, NOT clinical programs
- Names should be scroll-stopping, ad-ready, and conversion-focused
- Must use ACTION VERBS as core components

CAMPAIGN NAME FORMULAS (use these structures):
1. [Action Verb] + [Body Part/Result]: "Drop Belly Fat", "Blast Love Handles", "Melt Dad Bod"
2. [Pain Point] + [Action]: "Cardio-Free Crush", "No-Gym Shred", "Busy Mom Blast"
3. [Timeframe] + [Action]: "30-Day Drop", "Summer Melt", "Weekend Warrior"
4. [Audience] + [Action]: "Mom Squad Shred", "Dad Bod Drop", "Boss Lady Blast"
5. [Intensity] + [Result]: "Fat Fury", "Belly Blitz", "Love Handle Storm"

POWER WORDS - USE THESE EXCLUSIVELY:
- Action Verbs: Drop, Melt, Blast, Crush, Shred, Torch, Demolish, Strip, Burn, Carve, Sculpt
- Intensity Words: Blitz, Sprint, Rush, Fury, Fire, Storm, Demolition
- Challenge Terms: Challenge, Bootcamp, Blitz, Sprint, Rush, Crusher, Buster

FORBIDDEN WORDS - NEVER USE THESE:
- Clinical Terms: Protocol, System, Method, Program, Blueprint, Solution, Formula
- Vague Wellness: Journey, Transformation, Lifestyle, Wellness, Better, Healthy
- Blog-Style: Guide, Ultimate, Complete, Secret, Strategy, Comprehensive
- Soft Language: Gentle, Nurturing, Balanced, Mindful, Inner

TONE-SPECIFIC ACTION FORMULAS:
- Bold/Aggressive: "Fat Fury", "Belly Demolition", "Love Handle Crusher", "Beast Mode Blast"
- Direct + Warm: "Mom Bod Melt", "Gentle Giant Drop", "Busy Dad Shred", "Family Fit Rush"
- Edgy/Hype: "Cardio-Free Crush", "Lazy Girl Torch", "Couch Potato Blast", "Anti-Gym Shred"
- Confident: "Summer Sculpt", "Beach Bod Drop", "Bikini Shred", "Power Melt"

BRAND CONTEXT:
- Business: ${brandData.business_name}
- Offer Type: ${offerType}
- Campaign Types: ${campaignTypes.join(', ')}
- Voice/Tone: ${voiceTone}

Each name must feel like a high-converting fitness campaign that would stop someone scrolling and make them want to join immediately. Think like a fitness influencer launching their biggest challenge of the year - bold, action-focused, and results-driven.`;
    
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
    if (!brandData) return '';

    const voiceTone = brandData.voice_tone_style || 'Bold';
    const mainProblem = brandData.main_problem || '';
    const failedSolutions = brandData.failed_solutions || '';
    const targetMarket = brandData.target_market || '';
    const offerType = brandData.offer_type || '';
    const magicWandResult = brandData.magic_wand_result || '';
    const clientWords = brandData.client_words || '';
    
    // Build emotion-specific context
    let frustrationHook = '';
    if (mainProblem.toLowerCase().includes('cardio') || failedSolutions.toLowerCase().includes('cardio')) {
      frustrationHook = 'FRUSTRATION HOOK: Show someone exhausted on treadmill, looking defeated/bored. ';
    } else if (mainProblem.toLowerCase().includes('time') || mainProblem.toLowerCase().includes('busy')) {
      frustrationHook = 'FRUSTRATION HOOK: Show someone checking watch frantically, looking overwhelmed by gym equipment. ';
    } else if (mainProblem.toLowerCase().includes('plateau') || failedSolutions.toLowerCase().includes('plateau')) {
      frustrationHook = 'FRUSTRATION HOOK: Show someone staring at scale with confused/frustrated expression, shaking head. ';
    }
    
    // Build audience-specific visual context
    let audienceContext = '';
    if (targetMarket.toLowerCase().includes('busy mom') || targetMarket.toLowerCase().includes('mother')) {
      audienceContext = 'AUDIENCE VISUALS: Mom in kitchen/living room, kids in background, juggling multiple tasks. Props: coffee mug, yoga mat in corner, family photos. ';
    } else if (targetMarket.toLowerCase().includes('executive') || targetMarket.toLowerCase().includes('professional')) {
      audienceContext = 'AUDIENCE VISUALS: Professional in office/home office setting, suit/business attire, laptop visible. Props: coffee, work papers, professional environment. ';
    } else if (targetMarket.toLowerCase().includes('over 40') || targetMarket.toLowerCase().includes('40+')) {
      audienceContext = 'AUDIENCE VISUALS: Mid-life person in comfortable home setting, realistic body type, casual but put-together appearance. ';
    }
    
    // Build solution reveal context
    let solutionReveal = '';
    if (offerType.toLowerCase().includes('challenge') || offerType.toLowerCase().includes('program')) {
      solutionReveal = 'SOLUTION REVEAL: Quick montage of simple exercises at home, person looking confident and energized. ';
    } else if (offerType.toLowerCase().includes('coaching') || offerType.toLowerCase().includes('guide')) {
      solutionReveal = 'SOLUTION REVEAL: Coach demonstrating simple movement, person nodding with "aha" expression, transformation shots. ';
    }

    const systemPrompt = `You are an elite fitness marketing creative director who produces scroll-stopping ads that generate millions in revenue. Create 3 conversion-focused visual concepts for Instagram Reels/Carousels that tell complete emotional stories.

BRAND CONTEXT:
VOICE TONE: ${voiceTone}
TARGET MARKET: ${targetMarket}
MAIN PROBLEM: ${mainProblem}
FAILED SOLUTIONS: ${failedSolutions}
DREAM OUTCOME: ${magicWandResult}
CLIENT LANGUAGE: "${clientWords}"
OFFER TYPE: ${offerType}

${frustrationHook}
${audienceContext}
${solutionReveal}

MANDATORY STRUCTURE FOR EACH CONCEPT:
1. FRUSTRATION MOMENT: Specific visual showing the pain point
2. TRANSITION/REVELATION: Visual "aha" moment or breakthrough
3. SOLUTION IN ACTION: Person demonstrating/experiencing the solution
4. VISUAL CTA: Strong call-to-action overlay or gesture

CREATIVE REQUIREMENTS:
- Each concept must show EMOTION SHIFT: frustration → relief/confidence
- Use REAL PROPS and specific settings (kitchen, living room, office, etc.)
- Include FACIAL EXPRESSIONS and body language details
- Add TEXT OVERLAY suggestions for key moments
- End with clear VISUAL CTA (gesture, text, action)

VISUAL STORYTELLING ELEMENTS TO INCLUDE:
- Specific props: scale, measuring tape, old workout DVDs, gym membership card, treadmill, dumbbells
- Facial expressions: eye rolls, sighs, lightbulb moments, confident smiles
- Gestures: pointing, shaking head, thumbs up, fist pumps, dramatic reveals
- Text overlays: "This used to be me", "Then I discovered...", "Challenge Accepted"

FORMAT REQUIREMENTS:
CONCEPT 1: [Frustration setup] → [Revelation moment] → [Solution demo] → [Visual CTA]

CONCEPT 2: [Different frustration angle] → [Breakthrough visual] → [Action sequence] → [Strong CTA]

CONCEPT 3: [Third emotional hook] → [Solution reveal] → [Confidence moment] → [Clear CTA]

FORBIDDEN ELEMENTS:
- NO generic fitness stock footage descriptions
- NO vague "working out" or "eating healthy" visuals  
- NO corporate or clinical language
- NO emojis or social media fluff
- NO "lifestyle" or "wellness journey" concepts

Each concept must be a complete creative brief that a video editor could execute immediately to create scroll-stopping, conversion-focused ads that speak directly to ${targetMarket} experiencing ${mainProblem}.`;
    
    return await generateContent('creative-prompt', systemPrompt);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-klein font-extrabold text-white mb-4">
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
            onCampaignCreate={createOrGetCampaign}
          />

          <AdBlock
            title="Headline Options Generator"
            description="Output 3-5 punchy headlines for ads, lead forms, and landing pages based on your offer"
            icon={<Type className="w-6 h-6 text-primary" />}
            onGenerate={generateHeadlineOptions}
            placeholder="Your headline options will appear here..."
            contentType="headline"
            onCampaignCreate={createOrGetCampaign}
          />

          <AdBlock
            title="Campaign Name Generator"
            description="Suggest creative campaign titles that feel clever, seasonal, or results-driven"
            icon={<Tag className="w-6 h-6 text-primary" />}
            onGenerate={generateCampaignName}
            placeholder="Your campaign name suggestions will appear here..."
            contentType="campaign_name"
            onCampaignCreate={createOrGetCampaign}
          />

          <AdBlock
            title="IG Story Ad Generator"
            description="Create a 3-frame Instagram Story ad: Problem/Hook → Breakthrough → CTA"
            icon={<FaInstagram className="w-6 h-6 text-[#E4405F]" />}
            onGenerate={generateIGStoryAd}
            placeholder="Your Instagram Story ad sequence will appear here..."
            contentType="ig_story"
            onCampaignCreate={createOrGetCampaign}
          />

          <AdBlock
            title="Creative Prompt Generator"
            description="Generate 1-2 sentence visual ideas for reels, carousels, or image ads"
            icon={<Camera className="w-6 h-6 text-primary" />}
            onGenerate={generateCreativePrompt}
            contentType="creative_prompt"
            placeholder="Your creative visual prompts will appear here..."
            onCampaignCreate={createOrGetCampaign}
          />
        </div>
      </div>
    </div>
  );
};

export default AdGenerator;
