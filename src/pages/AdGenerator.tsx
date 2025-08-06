
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

const AdGenerator = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: brandData, loading: brandLoading } = useBrandSetup();
  const { generateContent } = useAdGeneration();
  const { toast } = useToast();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;
      
      try {
        // Check if user has completed onboarding
        setHasCompletedOnboarding(brandData !== null);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
      }
    };

    if (user && !brandLoading) {
      checkOnboardingStatus();
    }
  }, [user, brandData, brandLoading]);

  if (authLoading || brandLoading || hasCompletedOnboarding === null) {
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

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Complete Your Setup</h1>
            <p className="text-xl text-muted-foreground mb-8">
              You need to complete the onboarding process before you can generate ads.
            </p>
            <Button size="lg" onClick={() => navigate('/onboarding')} className="px-8 py-3 text-lg">
              Complete Onboarding
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const generateAdCaption = async (): Promise<string> => {
    const systemPrompt = `
Create a high-converting Instagram/Facebook ad caption following this exact structure:

HOOK → PAIN MIRROR → BELIEF BREAKER → CTA

Use the user's brand voice, target market problems, and offer details to create engaging copy.

Format your response as:

HOOK: [Attention-grabbing opener that stops the scroll]

PAIN MIRROR: [Acknowledge their main problem and failed solutions they've tried]

BELIEF BREAKER: [Challenge common misconceptions, present your unique angle]

CTA: [Clear, compelling call-to-action with specific next steps]

Keep it authentic, conversational, and aligned with the brand voice. Use emojis sparingly but effectively.
`;
    
    return await generateContent('ad-caption', systemPrompt);
  };

  const generateHeadlineOptions = async (): Promise<string> => {
    const systemPrompt = `
Generate 3-5 punchy, attention-grabbing headlines for ads, lead forms, and landing pages.

Focus on the target audience's main frustrations and the transformation your offer provides.

Format your response as:

HEADLINE 1: [Result-focused headline]

HEADLINE 2: [Problem-focused headline] 

HEADLINE 3: [Curiosity-driven headline]

HEADLINE 4: [Social proof/testimonial headline]

HEADLINE 5: [Urgency/scarcity headline]

Each headline should be under 40 characters for optimal ad performance. Make them punchy, benefit-driven, and conversion-focused.
`;
    
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
            <span className="text-sm font-medium text-primary">AI-Powered Content Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient leading-tight">
            Let's build your next
            <br />
            <span className="text-primary">client getting campaign</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Generate high-converting ads tailored to your brand using AI. Each piece of content is created based on your brand setup and target audience.
          </p>
          
          {/* Floating elements for visual interest */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        {/* Ad Generation Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <AdBlock
              title="Ad Caption Generator"
              description="Generate a full Instagram/Facebook ad caption with Hook → Pain Mirror → Belief Breaker → CTA structure"
              icon={<MessageSquare className="w-6 h-6 text-primary" />}
              onGenerate={generateAdCaption}
              placeholder="Your generated ad caption will appear here..."
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <AdBlock
              title="Headline Options Generator"
              description="Output 3-5 punchy headlines for ads, lead forms, and landing pages based on your offer"
              icon={<Type className="w-6 h-6 text-primary" />}
              onGenerate={generateHeadlineOptions}
              placeholder="Your headline options will appear here..."
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <AdBlock
              title="Campaign Name Generator"
              description="Suggest creative campaign titles that feel clever, seasonal, or results-driven"
              icon={<Tag className="w-6 h-6 text-primary" />}
              onGenerate={generateCampaignName}
              placeholder="Your campaign name suggestions will appear here..."
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <AdBlock
              title="IG Story Ad Generator"
              description="Create a 3-frame Instagram Story ad: Problem/Hook → Breakthrough → CTA"
              icon={<FaInstagram className="w-6 h-6 text-[#E4405F]" />}
              onGenerate={generateIGStoryAd}
              placeholder="Your Instagram Story ad sequence will appear here..."
            />
          </div>

          <div className="animate-fade-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.5s' }}>
            <AdBlock
              title="Creative Prompt Generator"
              description="Generate 1-2 sentence visual ideas for reels, carousels, or image ads"
              icon={<Camera className="w-6 h-6 text-primary" />}
              onGenerate={generateCreativePrompt}
              placeholder="Your creative visual prompts will appear here..."
            />
          </div>
        </div>

        {/* Future Features Placeholder */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Card className="max-w-2xl mx-auto border-dashed border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm hover-lift">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Coming Soon</CardTitle>
              <CardDescription className="text-lg">
                Export to PDF, Campaign Library, and more advanced features are in development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <Button variant="outline" disabled className="border-primary/30 text-primary/60">
                  Export PDF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/library')}
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
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
