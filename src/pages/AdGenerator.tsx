
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Video, FileText, Loader2 } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
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

  const generateFacebookAd = async (): Promise<string> => {
    const systemPrompt = `
Create a high-converting Facebook ad with a compelling headline and engaging body copy.
Format your response as:

HEADLINE: [compelling headline that grabs attention]

BODY: [engaging body copy that addresses the main problem, mentions failed solutions, and presents the offer as the solution. Include a strong call-to-action.]

Keep the headline under 40 characters and body under 125 words for optimal Facebook performance.
`;
    
    return await generateContent('facebook-ad', systemPrompt);
  };

  const generateInstagramStory = async (): Promise<string> => {
    const systemPrompt = `
Create 3-5 Instagram Story slides for a fitness campaign. Each slide should be engaging and lead to the next.
Format your response as:

SLIDE 1: [Hook slide - grab attention with a question or bold statement]

SLIDE 2: [Problem slide - highlight the main problem they face]

SLIDE 3: [Solution slide - present your offer as the solution]

SLIDE 4: [Social proof or urgency slide]

SLIDE 5: [Call-to-action slide with clear next steps]

Keep each slide concise (1-2 sentences max) as they'll be displayed as text overlays on images.
`;
    
    return await generateContent('instagram-story', systemPrompt);
  };

  const generateReelsScript = async (): Promise<string> => {
    const systemPrompt = `
Create a 30-60 second Instagram Reels script that's engaging and conversion-focused.
Format your response as:

HOOK (0-3 seconds): [Attention-grabbing opener]

SETUP (3-15 seconds): [Present the problem/situation]

CONTENT (15-45 seconds): [Provide value, show solution]

CTA (45-60 seconds): [Clear call-to-action]

Include specific visual cues and transitions. Make it authentic and relatable to your target audience.
`;
    
    return await generateContent('reels-script', systemPrompt);
  };

  const generateLandingPageCopy = async (): Promise<string> => {
    // Placeholder for now as requested
    return "Landing page copy generation will be available soon. This feature is currently in development.";
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <AdBlock
            title="Facebook Ad"
            description="Generate compelling Facebook ad copy with headline and body text optimized for conversions"
            icon={<FaFacebook className="w-6 h-6 text-[#1877F2]" />}
            onGenerate={generateFacebookAd}
            placeholder="Your generated Facebook ad will appear here..."
          />

          <AdBlock
            title="Instagram Story Slides"
            description="Create 3-5 engaging Instagram Story slides that guide your audience through your funnel"
            icon={<FaInstagram className="w-6 h-6 text-[#E4405F]" />}
            onGenerate={generateInstagramStory}
            placeholder="Your Instagram Story sequence will appear here..."
          />

          <AdBlock
            title="Reels Script"
            description="Generate a 30-60 second Instagram Reels script with hooks, transitions, and clear CTAs"
            icon={<Video className="w-6 h-6 text-primary" />}
            onGenerate={generateReelsScript}
            placeholder="Your Reels script with timing and visual cues will appear here..."
          />

          <AdBlock
            title="Landing Page Copy"
            description="Coming soon - Generate high-converting landing page copy that matches your ads"
            icon={<FileText className="w-6 h-6 text-muted-foreground" />}
            onGenerate={generateLandingPageCopy}
            placeholder="Landing page copy generation coming soon..."
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
