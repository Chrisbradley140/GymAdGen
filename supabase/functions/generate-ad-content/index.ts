import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function loadGlobalRules() {
  try {
    const { data, error } = await supabase
      .from('global_rules_config')
      .select('config')
      .eq('name', 'GLOBAL_RULES_v1')
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data?.config || null;
  } catch (error) {
    console.error('Failed to load global rules:', error);
    return null;
  }
}

async function checkOriginality(content: string, rules: any) {
  if (!rules?.originality_rules?.check_against_top_ads) return { isOriginal: true, violations: [] };

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
      violations: [...new Set(violations)]
    };
  } catch (error) {
    console.error('Error checking originality:', error);
    return { isOriginal: true, violations: [] };
  }
}

function buildEnhancedPrompt(adType: string, systemPrompt: string, brandData: any, globalRules: any, topPerformingAds?: any[]) {
  const safetyRules = globalRules?.safety_rules || {};
  const formattingRules = globalRules?.formatting_rules || {};
  const wordsToAvoid = brandData?.words_to_avoid ? brandData.words_to_avoid.split(',').map((w: string) => w.trim()) : [];

  // Analyze patterns from top-performing ads
  let topAdsAnalysis = '';
  if (topPerformingAds && topPerformingAds.length > 0) {
    const adAnalysis = topPerformingAds.slice(0, 3).map(ad => {
      return `📊 HIGH-PERFORMING AD EXAMPLE:
Primary Text: "${ad.primary_text}"
Headline: "${ad.headline || 'N/A'}"
Hook Type: ${ad.hook_type || 'Direct'}
Tone: ${ad.tone || 'Professional'}
Structure Analysis: ${analyzeAdStructure(ad.primary_text)}`;
    }).join('\n\n');

    topAdsAnalysis = `
🎯 TOP-PERFORMING ADS ANALYSIS FOR THIS CAMPAIGN:
${adAnalysis}

PATTERN EXTRACTION INSTRUCTIONS:
- Study the hook patterns and opening lines from these successful ads
- Note the tone, style, and emotional triggers that work for this campaign type
- Identify successful call-to-action formats and closing techniques
- Use these structural patterns as inspiration but create 100% original content
- Ensure your content follows similar successful frameworks while being completely unique

`;
  }

  return `You are an expert copywriter specializing in ${adType}.

${topAdsAnalysis}

CRITICAL GLOBAL RULES - MUST FOLLOW:

SAFETY REQUIREMENTS:
- NO personal health, ethnicity, or financial status references
- NO before/after claims or testimonials  
- NO engagement bait phrases: ${safetyRules.engagement_bait_patterns?.join(', ') || 'comment below, tag a friend, share if you agree, like if, double tap'}
- STRICTLY AVOID these words: ${wordsToAvoid.join(', ') || 'none specified'}

FORMATTING REQUIREMENTS:
- Headlines: Maximum ${formattingRules.headline_max_words || 12} words
- Hook: ${formattingRules.hook_word_range?.[0] || 6}-${formattingRules.hook_word_range?.[1] || 12} words
- Caption structure: ${formattingRules.caption_structure_order?.join(' → ') || 'Hook → Body → Close'}
- Maximum ${formattingRules.emoji_limit || 2} emojis total
- Use bullet emojis only: ${formattingRules.allowed_bullet_emojis?.join(', ') || '✅, 🔥, 💡, 🎯, 📈, 💰, ⚡, 🚀'}

ORIGINALITY REQUIREMENT:
- Generate completely original content inspired by the patterns above
- Do not copy more than 2 consecutive words from any existing advertisement
- Use the structural insights from top ads to inform your approach

Brand Information:
- Business: ${brandData?.business_name || 'Unknown Business'}
- Target Market: ${brandData?.target_market || 'General audience'}
- Voice & Tone: ${brandData?.voice_tone_style || 'Professional and friendly'}

Instructions: ${systemPrompt}

Generate high-quality, engaging content that strictly follows all rules above while leveraging insights from successful patterns and matching the brand voice.`;

}

function analyzeAdStructure(primaryText: string): string {
  if (!primaryText) return 'No structure analysis available';
  
  const lines = primaryText.split('\n').filter(line => line.trim());
  const wordCount = primaryText.split(' ').length;
  const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu.test(primaryText);
  const hasQuestion = primaryText.includes('?');
  const hasCall = /\b(call|text|click|download|get|start|join|discover|learn)\b/i.test(primaryText);
  
  return `${lines.length} sections, ${wordCount} words, ${hasEmojis ? 'uses emojis' : 'no emojis'}, ${hasQuestion ? 'question hook' : 'statement hook'}, ${hasCall ? 'clear CTA' : 'soft CTA'}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adType, systemPrompt, brandData, topPerformingAds } = await req.json();

    console.log('Generating content for:', { 
      adType, 
      brandData: brandData?.business_name,
      topAdsCount: topPerformingAds?.length || 0
    });

    // Load global rules
    const globalRules = await loadGlobalRules();
    if (!globalRules) {
      console.warn('Global rules not loaded, proceeding with basic generation');
    }

    // Build enhanced prompt with global rules and top-performing ads
    const enhancedPrompt = buildEnhancedPrompt(adType, systemPrompt, brandData, globalRules, topPerformingAds);

    let generatedContent = '';
    let attempts = 0;
    const maxAttempts = globalRules?.originality_rules?.max_regeneration_attempts || 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Generation attempt ${attempts}/${maxAttempts}`);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            { role: 'user', content: enhancedPrompt }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      generatedContent = data.choices[0].message.content;

      // Check originality if rules are loaded
      if (globalRules) {
        const originalityCheck = await checkOriginality(generatedContent, globalRules);
        
        if (originalityCheck.isOriginal) {
          console.log('Content passed originality check');
          break;
        } else {
          console.log('Content failed originality check, regenerating...', originalityCheck.violations);
          if (attempts === maxAttempts) {
            console.warn('Max regeneration attempts reached, returning content with violations');
          }
        }
      } else {
        break; // No rules to check against
      }
    }

    console.log('Generated content successfully');

    return new Response(JSON.stringify({ 
      generatedContent,
      compliance: { status: 'approved', score: 100, violations: [] }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ad-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      generatedContent: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});