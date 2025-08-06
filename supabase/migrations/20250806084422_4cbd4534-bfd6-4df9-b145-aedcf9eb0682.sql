-- Create table for saved ad content
CREATE TABLE public.saved_ad_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL, -- 'ad_caption', 'headline', 'campaign_name', 'ig_story', 'creative_prompt'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Store additional data like generation parameters
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_ad_content ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved content" 
ON public.saved_ad_content 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved content" 
ON public.saved_ad_content 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved content" 
ON public.saved_ad_content 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved content" 
ON public.saved_ad_content 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_ad_content_updated_at
BEFORE UPDATE ON public.saved_ad_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_saved_ad_content_user_id ON public.saved_ad_content(user_id);
CREATE INDEX idx_saved_ad_content_type ON public.saved_ad_content(content_type);
CREATE INDEX idx_saved_ad_content_created_at ON public.saved_ad_content(created_at DESC);