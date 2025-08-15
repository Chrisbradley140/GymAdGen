
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Meta Policy Compliance Validator
function validateMetaCompliance(content: string) {
  const violations: string[] = [];
  let fixedContent = content;
  let hasViolations = false;

  // Personal Attributes Check
  const personalAttributePatterns = [
    // Direct age/gender references
    /(men|women|guys|girls|ladies)\s+(over|under|age)\s+\d+/gi,
    /(men|women|guys|girls|ladies)\s+(in\s+their\s+)?\d+s/gi,
    /if\s+you'?re\s+(a\s+)?(man|woman|guy|girl|senior|teen)/gi,
    
    // Direct personal addressing
    /this\s+is\s+for\s+you/gi,
    /you'?re\s+not\s+alone/gi,
    /you\s+(men|women|guys|girls)/gi,
    
    // Health/weight assumptions
    /you'?re\s+(overweight|fat|obese|skinny|underweight)/gi,
    /if\s+you'?re\s+(broke|poor|rich|wealthy)/gi,
    /you\s+(have|suffer from|struggle with)\s+(low energy|depression|anxiety)/gi,
    
    // Age-specific targeting
    /for\s+(seniors|elderly|teens|teenagers|young people|millennials|boomers)/gi,
    /(seniors|elderly|teens|teenagers)\s+(who|that)/gi
  ];

  personalAttributePatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains personal attribute assumptions or direct targeting");
      hasViolations = true;
      fixedContent = fixedContent.replace(pattern, (match) => {
        // Age/gender specific replacements
        if (match.toLowerCase().includes('men over') || match.toLowerCase().includes('guys over')) {
          return "people looking to";
        }
        if (match.toLowerCase().includes('women over') || match.toLowerCase().includes('ladies over')) {
          return "anyone ready to";
        }
        if (match.toLowerCase().includes('this is for you')) {
          return "this approach works when";
        }
        if (match.toLowerCase().includes("you're not alone")) {
          return "many people experience this";
        }
        // Health/weight assumptions
        if (match.toLowerCase().includes('overweight') || match.toLowerCase().includes('fat')) {
          return "looking to improve your health";
        }
        if (match.toLowerCase().includes('broke') || match.toLowerCase().includes('poor')) {
          return "on a budget";
        }
        // Default fallback
        return "ready to make a change";
      });
    }
  });

  // Body Shaming Check
  const bodyShamingPatterns = [
    /ugly\s+(belly|fat|body)/gi,
    /disgusting\s+(fat|body)/gi,
    /embarrassing\s+(belly|fat|body)/gi,
    /get\s+rid\s+of\s+your\s+(ugly|gross|disgusting)/gi
  ];

  bodyShamingPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains body-shaming language");
      hasViolations = true;
      fixedContent = fixedContent.replace(pattern, "transform your");
    }
  });

  // Unrealistic Claims Check
  const unrealisticClaimsPatterns = [
    /lose\s+\d+\s+(lbs?|pounds?|kg)\s+in\s+\d+\s+(days?|weeks?)/gi,
    /guaranteed\s+(results?|weight\s+loss)/gi,
    /miracle\s+(cure|solution|results?)/gi,
    /instant\s+(results?|weight\s+loss|transformation)/gi
  ];

  unrealisticClaimsPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains unrealistic weight loss claims");
      hasViolations = true;
      fixedContent = fixedContent.replace(pattern, "achieve sustainable results");
    }
  });

  // Sensational Content Check
  const sensationalPatterns = [
    /doctors?\s+hate\s+this/gi,
    /shocking\s+(truth|secret|discovery)/gi,
    /this\s+weird\s+trick/gi,
    /you\s+won't\s+believe/gi
  ];

  sensationalPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains sensational or fear-based claims");
      hasViolations = true;
      fixedContent = fixedContent.replace(pattern, "discover this approach");
    }
  });

  // Determine status
  let status: 'PASS' | 'FIXED' | 'FAIL';
  if (violations.length === 0) {
    status = 'PASS';
  } else if (hasViolations && fixedContent !== content) {
    status = 'FIXED';
  } else {
    status = 'FAIL';
  }

  return {
    status,
    violations,
    originalText: hasViolations ? content : undefined,
    fixedText: hasViolations ? fixedContent : undefined
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adType, systemPrompt, brandData, campaignCanonicalName } = await req.json();
    
    console.log(`Generating ${adType} content for brand: ${brandData.business_name}`);
    console.log(`Campaign canonical name: ${campaignCanonicalName}`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Fetch top-performing ads for inspiration if campaign canonical name is provided
    let topPerformingAds = [];
    let campaignContext = '';
    
    if (campaignCanonicalName) {
      try {
        // Fetch campaign details
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaign_templates')
          .select('name, description, target_audience')
          .eq('canonical_name', campaignCanonicalName)
          .single();
          
        if (!campaignError && campaignData) {
          campaignContext = `CAMPAIGN CONTEXT:
Campaign: ${campaignData.name}
Description: ${campaignData.description}
Target Audience: ${campaignData.target_audience || 'General'}

`;
        }
        
        // Fetch top-performing ads
        const { data: adsData, error: adsError } = await supabase
          .from('top_performing_ads')
          .select('*')
          .eq('campaign_canonical_name', campaignCanonicalName)
          .order('result', { ascending: false })
          .order('cost_per_result', { ascending: true })
          .limit(10);
          
        if (!adsError && adsData && adsData.length > 0) {
          topPerformingAds = adsData;
          console.log(`Found ${topPerformingAds.length} top-performing ads for campaign: ${campaignCanonicalName}`);
        } else {
          console.log(`No top-performing ads found for campaign: ${campaignCanonicalName}, falling back to AI-only generation`);
        }
      } catch (error) {
        console.error('Error fetching top-performing ads:', error);
        // Continue with AI-only generation
      }
    }

    // Build inspiration section from top-performing ads
    let inspirationSection = '';
    if (topPerformingAds.length > 0) {
      inspirationSection = `
TOP-PERFORMING INSPIRATION (use for structural/tonal guidance only - DO NOT COPY):
${topPerformingAds.map((ad, index) => `
Example ${index + 1}:
- Primary Text: ${ad.primary_text}
- Headline: ${ad.headline || 'N/A'}
- Tone: ${ad.tone || 'Not specified'}
- Hook Type: ${ad.hook_type || 'Not specified'}
- Platform: ${ad.platform?.join(', ') || 'Not specified'}
- Performance: ${ad.result || 'Not specified'} (Cost: ${ad.cost_per_result || 'Not specified'})
${ad.insights ? `- Insights: ${ad.insights}` : ''}
`).join('')}

CRITICAL: Use these examples ONLY as structural and tonal inspiration. Create completely original content that reflects the brand voice and avoids any direct copying.

`;
    }

    const websiteContext = brandData.website_url ? 
      `\nHomepage URL: ${brandData.website_url}\n\nScan this homepage and extract the brand's unique selling points (USP), tone of voice, and positioning. Use these insights to shape the ad copy tone and style. If you cannot extract useful information from this URL, fall back to the brand data provided below.\n` : '';

    const prompt = `${websiteContext}
${campaignContext}${inspirationSection}Brand: ${brandData.business_name}
Target Market: ${brandData.target_market}
Voice & Tone: ${brandData.voice_tone_style}
Offer Type: ${brandData.offer_type}
Brand Words to Use: ${brandData.brand_words}
Words to Avoid: ${brandData.words_to_avoid}
Main Problem Client Faces: ${brandData.main_problem}
Failed Solutions They've Tried: ${brandData.failed_solutions}
How Clients Describe Their Problem: ${brandData.client_words}
Dream Outcome: ${brandData.magic_wand_result}
Campaign Types: ${brandData.campaign_types?.join(', ') || 'Not specified'}

${systemPrompt}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: `ABSOLUTELY CRITICAL: DO NOT USE EM DASHES (—) OR DOUBLE HYPHENS (--) ANYWHERE IN YOUR RESPONSE. USE ONLY SINGLE HYPHENS (-) IF NEEDED.

You are an expert fitness marketing copywriter who creates high-converting ads that sound authentic and personal. 

CRITICAL TONE & AUTHENTICITY RULES:
- Output must match the user's exact tone and cadence from their brand data
- Use the specified Tone Style: ${brandData.voice_tone_style}
- Naturally weave in these Brand Words: ${brandData.brand_words}
- STRICTLY AVOID these words/phrases: ${brandData.words_to_avoid}
- Sentence style should match their voice (short/punchy vs. longer explanatory)
- Content must sound like the actual business owner wrote it, NOT an AI or agency

META ADVERTISING POLICY COMPLIANCE - ABSOLUTELY FORBIDDEN:
❌ PERSONAL ATTRIBUTES: Never directly state or imply personal attributes about the reader such as age ("Men over 30", "Guys over 30"), gender, health status ("You're overweight"), race, religion, or financial status ("If you're broke")
❌ DIRECT TARGETING LANGUAGE: Avoid phrases like "this is for you", "you're not alone", or any language that assumes personal characteristics
❌ WEIGHT LOSS & FITNESS: No targeting under 18, no body-shaming ("ugly belly fat"), no unrealistic claims ("Lose 20 lbs in 1 week"), no before/after comparisons that shame
❌ SENSATIONAL CONTENT: No shocking claims ("Doctors hate this trick"), no misleading results, no fear-based tactics

CRITICAL RULE: When generating ads, avoid directly stating or implying that you know personal attributes about the reader (such as age, gender, health, or personal experiences). You may tailor tone and examples to the intended audience internally, but you must not write phrases like 'Men over 30', 'Guys over 30', 'this is for you', or 'you're not alone'. Instead, use general, relatable language that could apply to anyone.

FORBIDDEN ELEMENTS:
- NO em dashes (—) or double hyphens (--) - ABSOLUTELY FORBIDDEN
- NO generic AI phrases like: "Sound familiar?", "Just a few clicks…", "Here's the thing…", "The bottom line is…", "At the end of the day…", "game-changer", "unlock the secrets", "transform your life", "take your business to the next level"
- NO corporate marketing speak or buzzwords
- NO overly polished agency-style copy

AUTHENTICITY REQUIREMENTS:
- Write in first person when appropriate (I, we, my, our)
- Use the exact language and terminology the business owner would use
- Match their energy level and personality
- Include specific details about their offer and approach
- Sound conversational and genuine, not scripted
- Reflect their actual expertise and experience

Create compelling, conversion-focused copy that speaks directly to the target audience while maintaining complete authenticity to the brand voice AND full Meta policy compliance.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let generatedContent = data.choices[0].message.content;

    // Post-processing: Remove em dashes and double hyphens as a safety net
    generatedContent = generatedContent
      .replace(/—/g, '-')  // Replace em dashes with regular hyphens
      .replace(/--/g, '-'); // Replace double hyphens with single hyphens

    // Meta Policy Compliance Check
    const metaCompliance = validateMetaCompliance(generatedContent);
    
    console.log(`Successfully generated ${adType} content with compliance status: ${metaCompliance.status}`);

    return new Response(JSON.stringify({ 
      generatedContent: metaCompliance.status === 'FAIL' ? null : (metaCompliance.fixedText || generatedContent),
      metaCompliance 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ad-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
