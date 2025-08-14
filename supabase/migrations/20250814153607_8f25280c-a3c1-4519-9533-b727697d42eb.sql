-- Create campaign_templates table for global campaign types
CREATE TABLE public.campaign_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  target_audience TEXT,
  seasonal_timing TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ad_templates table for high-performing ad examples
CREATE TABLE public.ad_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_template_id UUID REFERENCES public.campaign_templates(id) ON DELETE CASCADE,
  primary_text TEXT NOT NULL,
  headline TEXT,
  offer_type TEXT,
  target_market TEXT,
  platform TEXT DEFAULT 'Meta',
  objective TEXT,
  tone TEXT,
  hook_type TEXT,
  performance_score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to read templates
CREATE POLICY "Authenticated users can view campaign templates" 
ON public.campaign_templates 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view ad templates" 
ON public.ad_templates 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_campaign_templates_updated_at
  BEFORE UPDATE ON public.campaign_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_templates_updated_at
  BEFORE UPDATE ON public.ad_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial campaign templates
INSERT INTO public.campaign_templates (name, description, category, target_audience, seasonal_timing, sort_order) VALUES
  ('6 Week Challenge', 'Transform your life in just 6 weeks with our proven system', 'Challenge-Based', 'Health & Fitness enthusiasts', null, 1),
  ('30 Day Challenge', 'Quick results in 30 days - perfect for busy professionals', 'Challenge-Based', 'Busy professionals', null, 2),
  ('New Year New Me', 'Start fresh with resolutions that actually stick', 'Seasonal', 'Resolution makers', 'January', 3),
  ('Summer Body Ready', 'Get beach ready with our summer transformation program', 'Seasonal', 'Fitness enthusiasts', 'April-June', 4),
  ('Black Friday Special', 'Limited time offer - biggest savings of the year', 'Seasonal', 'Bargain hunters', 'November', 5),
  ('Before & After Success', 'Real transformations from real people just like you', 'Social Proof', 'Skeptical prospects', null, 6),
  ('Free Resource Lead Magnet', 'Get valuable insights absolutely free - no strings attached', 'Lead Generation', 'Cold prospects', null, 7),
  ('Problem Agitation Solution', 'Tired of struggling? Here is the solution you have been looking for', 'Problem-Focused', 'Problem-aware prospects', null, 8),
  ('Authority Expert Positioning', 'Learn from industry experts with proven track records', 'Authority', 'Knowledge seekers', null, 9),
  ('Scarcity & Urgency', 'Limited spots available - do not miss out on this opportunity', 'Urgency', 'Decision-ready prospects', null, 10),
  ('Social Media Growth', 'Grow your following and engagement with proven strategies', 'Business Growth', 'Content creators', null, 11),
  ('Testimonial Showcase', 'See what our successful clients are saying about their results', 'Social Proof', 'Trust-building prospects', null, 12),
  ('Educational Content Series', 'Master the fundamentals with our comprehensive training', 'Educational', 'Learning-focused audience', null, 13);

-- Insert sample ad templates for the 6 Week Challenge
INSERT INTO public.ad_templates (campaign_template_id, primary_text, headline, offer_type, target_market, tone, hook_type, performance_score) 
SELECT 
  ct.id,
  'Are you tired of starting fitness programs that you never finish? 🔥

What if I told you that in just 6 weeks, you could completely transform not just your body, but your entire relationship with fitness?

The 6-Week Total Transformation Challenge is not just another workout program. It is a complete lifestyle reset designed for busy people who want real results.

✨ What makes this different:
• Workouts that fit into YOUR schedule (15-30 mins max)
• Meal plans that actually taste good
• Daily accountability and support
• Proven system used by 1000+ successful clients

Stop making excuses. Start making changes.

Your transformation starts NOW. 💪',
  'Transform Your Body in Just 6 Weeks',
  'Challenge Program',
  'Health & Fitness',
  'Motivational',
  'Problem/Solution',
  95
FROM public.campaign_templates ct WHERE ct.name = '6 Week Challenge';