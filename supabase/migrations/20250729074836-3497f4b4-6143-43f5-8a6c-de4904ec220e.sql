
-- Create table for user onboarding data
CREATE TABLE public.user_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  step_completed INTEGER DEFAULT 0,
  business_name TEXT,
  logo_url TEXT,
  website_url TEXT,
  brand_colors TEXT,
  target_market TEXT,
  voice_tone_style TEXT,
  offer_type TEXT,
  campaign_types TEXT[], -- Array to store multiple campaign types
  seasonal_launch_options TEXT[], -- Array for seasonal options
  instagram_reel_url TEXT,
  meta_account TEXT,
  competitor_urls TEXT,
  brand_words TEXT,
  words_to_avoid TEXT,
  main_problem TEXT,
  failed_solutions TEXT,
  client_words TEXT,
  magic_wand_result TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies for user onboarding data
CREATE POLICY "Users can view their own onboarding data" 
  ON public.user_onboarding 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding data" 
  ON public.user_onboarding 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data" 
  ON public.user_onboarding 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_onboarding_updated_at
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
