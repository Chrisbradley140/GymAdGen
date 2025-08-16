-- Create global_rules_config table for storing ad generation rules
CREATE TABLE public.global_rules_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  version TEXT NOT NULL DEFAULT 'v1',
  config JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.global_rules_config ENABLE ROW LEVEL SECURITY;

-- Create policies for global rules config
CREATE POLICY "Global rules are viewable by authenticated users" 
ON public.global_rules_config 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage global rules" 
ON public.global_rules_config 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_global_rules_config_updated_at
BEFORE UPDATE ON public.global_rules_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the GLOBAL_RULES_v1 configuration
INSERT INTO public.global_rules_config (name, version, config) VALUES (
  'GLOBAL_RULES_v1',
  'v1',
  '{
    "output_schemas": {
      "campaign_name": {
        "type": "string",
        "max_length": 50,
        "required": true
      },
      "ad_caption": {
        "type": "string",
        "max_length": 2200,
        "required": true,
        "structure": ["Hook", "Body", "Close"]
      },
      "headline_options": {
        "type": "array",
        "items": {
          "type": "string",
          "max_words": 12
        },
        "min_items": 3,
        "max_items": 5
      },
      "ig_story_ad": {
        "type": "string",
        "max_length": 125,
        "required": true
      },
      "creative_prompt": {
        "type": "string",
        "max_length": 500,
        "required": true
      }
    },
    "safety_rules": {
      "prohibited_content": [
        "personal_health_attributes",
        "ethnicity_references", 
        "financial_status_assumptions",
        "before_after_claims",
        "engagement_bait_phrases"
      ],
      "engagement_bait_patterns": [
        "comment below",
        "tag a friend",
        "share if you agree",
        "like if",
        "double tap"
      ],
      "respect_words_to_avoid": true,
      "brand_safety_checks": true
    },
    "formatting_rules": {
      "headline_max_words": 12,
      "hook_word_range": [6, 12],
      "caption_structure_order": ["Hook", "Body", "Close"],
      "emoji_limit": 2,
      "bullet_style": "emoji_bullets",
      "allowed_bullet_emojis": ["✅", "🔥", "💡", "🎯", "📈", "💰", "⚡", "🚀"],
      "line_breaks_between_sections": true
    },
    "originality_rules": {
      "max_consecutive_words": 3,
      "similarity_threshold": 0.7,
      "check_against_top_ads": true,
      "regenerate_on_violation": true,
      "max_regeneration_attempts": 3
    },
    "tone_enforcement": {
      "use_brand_voice_profile": true,
      "fallback_tone": "professional_friendly",
      "maintain_consistency": true,
      "adapt_to_platform": true
    }
  }'::jsonb
);