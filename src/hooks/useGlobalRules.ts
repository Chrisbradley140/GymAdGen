import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type OutputSchemaField = 
  | { type: string; max_length: number; required: boolean; }
  | { type: string; max_length: number; required: boolean; structure: string[]; }
  | { type: string; items: { type: string; max_words: number; }; min_items: number; max_items: number; };

export interface GlobalRulesConfig {
  output_schemas: {
    campaign_name: OutputSchemaField;
    ad_caption: OutputSchemaField;
    headline_options: OutputSchemaField;
    ig_story_ad: OutputSchemaField;
    creative_prompt: OutputSchemaField;
  };
  safety_rules: {
    prohibited_content: string[];
    engagement_bait_patterns: string[];
    respect_words_to_avoid: boolean;
    brand_safety_checks: boolean;
  };
  formatting_rules: {
    headline_max_words: number;
    hook_word_range: [number, number];
    caption_structure_order: string[];
    emoji_limit: number;
    bullet_style: string;
    allowed_bullet_emojis: string[];
    line_breaks_between_sections: boolean;
  };
  originality_rules: {
    max_consecutive_words: number;
    similarity_threshold: number;
    check_against_top_ads: boolean;
    regenerate_on_violation: boolean;
    max_regeneration_attempts: number;
  };
  tone_enforcement: {
    use_brand_voice_profile: boolean;
    fallback_tone: string;
    maintain_consistency: boolean;
    adapt_to_platform: boolean;
  };
}

export const useGlobalRules = () => {
  const [rules, setRules] = useState<GlobalRulesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('global_rules_config')
        .select('config')
        .eq('name', 'GLOBAL_RULES_v1')
        .eq('is_active', true)
        .single();

      if (error) {
        throw error;
      }

      if (data?.config) {
        setRules(data.config as unknown as GlobalRulesConfig);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching global rules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch global rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalRules();
  }, []);

  const validateContent = (content: string, type: keyof GlobalRulesConfig['output_schemas'], wordsToAvoid?: string[]) => {
    if (!rules) return { isValid: true, errors: [] };

    const errors: string[] = [];
    const schema = rules.output_schemas[type];

    // Length validation
    if ('max_length' in schema && schema.max_length && content.length > schema.max_length) {
      errors.push(`Content exceeds maximum length of ${schema.max_length} characters`);
    }

    // Word count validation for headlines
    if (type === 'headline_options' && 'items' in schema && schema.items?.max_words) {
      const wordCount = content.split(/\s+/).length;
      if (wordCount > schema.items.max_words) {
        errors.push(`Headline exceeds maximum of ${schema.items.max_words} words`);
      }
    }

    // Safety checks
    if (rules.safety_rules.respect_words_to_avoid && wordsToAvoid) {
      const foundBadWords = wordsToAvoid.filter(word => 
        content.toLowerCase().includes(word.toLowerCase())
      );
      if (foundBadWords.length > 0) {
        errors.push(`Content contains avoided words: ${foundBadWords.join(', ')}`);
      }
    }

    // Engagement bait check
    const engagementBaitFound = rules.safety_rules.engagement_bait_patterns.some(pattern =>
      content.toLowerCase().includes(pattern.toLowerCase())
    );
    if (engagementBaitFound) {
      errors.push('Content contains engagement bait phrases');
    }

    // Emoji count check
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
    if (emojiCount > rules.formatting_rules.emoji_limit) {
      errors.push(`Content exceeds emoji limit of ${rules.formatting_rules.emoji_limit}`);
    }

    return { isValid: errors.length === 0, errors };
  };

  const checkOriginality = async (content: string) => {
    if (!rules?.originality_rules.check_against_top_ads) return { isOriginal: true, violations: [] };

    try {
      const { data: topAds } = await supabase
        .from('top_performing_ads')
        .select('primary_text, headline');

      if (!topAds) return { isOriginal: true, violations: [] };

      const violations: string[] = [];
      const maxConsecutive = rules.originality_rules.max_consecutive_words;

      for (const ad of topAds) {
        const adTexts = [ad.primary_text, ad.headline].filter(Boolean);
        
        for (const adText of adTexts) {
          if (adText) {
            const contentWords = content.toLowerCase().split(/\s+/);
            const adWords = adText.toLowerCase().split(/\s+/);

            for (let i = 0; i <= contentWords.length - maxConsecutive; i++) {
              const phrase = contentWords.slice(i, i + maxConsecutive).join(' ');
              
              for (let j = 0; j <= adWords.length - maxConsecutive; j++) {
                const adPhrase = adWords.slice(j, j + maxConsecutive).join(' ');
                
                if (phrase === adPhrase) {
                  violations.push(`Matches existing ad: "${phrase}"`);
                }
              }
            }
          }
        }
      }

      return { 
        isOriginal: violations.length === 0, 
        violations: [...new Set(violations)] // Remove duplicates
      };
    } catch (error) {
      console.error('Error checking originality:', error);
      return { isOriginal: true, violations: [] };
    }
  };

  const formatSystemPrompt = (brandVoice?: string, wordsToAvoid?: string[]) => {
    if (!rules) return '';

    const safetyInstructions = `
CRITICAL SAFETY RULES:
- NO personal health, ethnicity, or financial status references
- NO before/after claims or testimonials
- NO engagement bait phrases: ${rules.safety_rules.engagement_bait_patterns.join(', ')}
- AVOID these words: ${wordsToAvoid?.join(', ') || 'none specified'}

FORMATTING REQUIREMENTS:
- Headlines: Maximum ${rules.formatting_rules.headline_max_words} words
- Hook: ${rules.formatting_rules.hook_word_range[0]}-${rules.formatting_rules.hook_word_range[1]} words
- Caption structure: ${rules.formatting_rules.caption_structure_order.join(' → ')}
- Maximum ${rules.formatting_rules.emoji_limit} emojis
- Use bullet emojis: ${rules.formatting_rules.allowed_bullet_emojis.join(', ')}

ORIGINALITY REQUIREMENT:
- Do not copy more than ${rules.originality_rules.max_consecutive_words} consecutive words from any existing ad
- Generate unique, original content

TONE ENFORCEMENT:
${brandVoice ? `- Match this brand voice: ${brandVoice}` : `- Use ${rules.tone_enforcement.fallback_tone} tone`}
- Maintain consistency throughout all content
`;

    return safetyInstructions;
  };

  return {
    rules,
    loading,
    error,
    validateContent,
    checkOriginality,
    formatSystemPrompt,
    refetch: fetchGlobalRules
  };
};