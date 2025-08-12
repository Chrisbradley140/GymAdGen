
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Privacy violations detection patterns
const PRIVACY_VIOLATION_PATTERNS = {
  raceEthnicity: [
    /\b(meet|find|are you|other)\s+(hispanic|black|white|asian|latino|african|caucasian)\b/gi,
    /\b(hispanic|black|white|asian|latino|african|caucasian)\s+(men|women|singles|people)\b/gi
  ],
  religion: [
    /\b(meet|find|are you|other)\s+(christian|muslim|jewish|hindu|buddhist|catholic)\b/gi,
    /\b(christian|muslim|jewish|hindu|buddhist|catholic)\s+(singles|dating|men|women)\b/gi
  ],
  age: [
    /\b(meet|are you|other)\s+(seniors|teens|teenagers|elderly)\b/gi,
    /\b(seniors|teens|teenagers|elderly)\s+(dating|singles|meet)\b/gi,
    /\bare you \d+\s+years?\s+old\b/gi
  ],
  sexualOrientation: [
    /\b(meet|find|are you|other)\s+(gay|lesbian|lgbtq|homosexual|bisexual)\b/gi,
    /\b(gay|lesbian|lgbtq|homosexual|bisexual)\s+(singles|dating|cruises)\b/gi
  ],
  genderIdentity: [
    /\b(meet|find|are you|other)\s+(transgender|trans)\b/gi,
    /\bquestioning your gender identity\b/gi
  ],
  health: [
    /\b(do you have|are you|suffering from)\s+(diabetes|depression|cancer|bulimia|anxiety)\b/gi,
    /\b(diabetes|depression|cancer|bulimia|anxiety)\s+(treatment|counselling|getting you down)\b/gi
  ],
  financial: [
    /\bare you (bankrupt|broke|in debt)\b/gi,
    /\bvulnerable financial status\b/gi
  ],
  voting: [
    /\byour (ballot|voter registration)\b/gi,
    /\brecords show.*voter\b/gi
  ],
  union: [
    /\b(join our union|dislike your union)\b/gi,
    /\bmembership in.*union\b/gi
  ],
  criminal: [
    /\bare you.*convicted\b/gi,
    /\bcriminal record\b/gi,
    /\bprevious offences\b/gi
  ],
  personalInfo: [
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+,?\s+(get this|your name)\b/gi,
    /\bwhat is your.*number\b/gi,
    /\bhave a.*licence\b/gi
  ]
};

// Policy compliance checker
const checkPrivacyCompliance = (content: string): { isCompliant: boolean; violations: string[] } => {
  const violations: string[] = [];
  
  Object.entries(PRIVACY_VIOLATION_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        violations.push(`${category}: "${matches[0]}" - violates privacy policy`);
      }
    });
  });
  
  return {
    isCompliant: violations.length === 0,
    violations
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adType, systemPrompt, brandData } = await req.json();
    
    console.log(`Generating ${adType} content for brand: ${brandData.business_name}`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Pre-generation privacy compliance check on brand data
    const brandDataText = `${brandData.target_market} ${brandData.main_problem} ${brandData.client_words} ${brandData.magic_wand_result}`;
    const preCheck = checkPrivacyCompliance(brandDataText);
    
    if (!preCheck.isCompliant) {
      console.warn('Brand data contains potential privacy violations:', preCheck.violations);
      // Continue but log warnings - brand setup issues should be handled at setup time
    }

    const websiteContext = brandData.website_url ? 
      `\nHomepage URL: ${brandData.website_url}\n\nScan this homepage and extract the brand's unique selling points (USP), tone of voice, and positioning. Use these insights to shape the ad copy tone and style. If you cannot extract useful information from this URL, fall back to the brand data provided below.\n` : '';

    const prompt = `${websiteContext}
Brand: ${brandData.business_name}
Target Market: ${brandData.target_market}
Voice & Tone: ${brandData.voice_tone_style}
Offer Type: ${brandData.offer_type}
Brand Words to Use: ${brandData.brand_words}
Words to Avoid: ${brandData.words_to_avoid}
Main Problem Client Faces: ${brandData.main_problem}
Failed Solutions They've Tried: ${brandData.failed_solutions}
How Clients Describe Their Problem: ${brandData.client_words}
Dream Outcome: ${brandData.magic_wand_result}
Campaign Types: ${brandData.campaign_types.join(', ')}

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

META ADS PRIVACY POLICY COMPLIANCE - ABSOLUTELY CRITICAL:
- NEVER assert or imply personal attributes about the audience
- NEVER use phrases like "Meet [race/ethnicity] singles", "Are you [age/condition]?", "Other [group] members"
- NEVER reference specific ages, medical conditions, financial status, or personal characteristics
- NEVER ask for or reference personal information like names, ID numbers, or private details
- ALLOWED: General location references ("New Yorker"), broad age ranges, celebrity names, "you/your" without personal attributes
- FOCUS ON: Product benefits, general audience needs, broad demographic terms without assertions

FORBIDDEN ELEMENTS:
- NO em dashes (—) or double hyphens (--) - ABSOLUTELY FORBIDDEN
- NO generic AI phrases like: "Sound familiar?", "Just a few clicks…", "Here's the thing…", "The bottom line is…", "At the end of the day…", "game-changer", "unlock the secrets", "transform your life", "take your business to the next level"
- NO corporate marketing speak or buzzwords
- NO overly polished agency-style copy
- NO personal attribute assertions or implications per Meta policy

AUTHENTICITY REQUIREMENTS:
- Write in first person when appropriate (I, we, my, our)
- Use the exact language and terminology the business owner would use
- Match their energy level and personality
- Include specific details about their offer and approach
- Sound conversational and genuine, not scripted
- Reflect their actual expertise and experience

Create compelling, conversion-focused copy that speaks directly to the target audience while maintaining complete authenticity to the brand voice.` 
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

    // Post-generation privacy compliance check
    const postCheck = checkPrivacyCompliance(generatedContent);
    
    if (!postCheck.isCompliant) {
      console.error('Generated content violates privacy policy:', postCheck.violations);
      
      // Attempt to regenerate with stricter compliance prompts
      const stricterPrompt = `${prompt}

CRITICAL: The previous generation contained privacy policy violations. 
REGENERATE ensuring ZERO personal attribute assertions or implications.
Focus ONLY on product benefits and general audience needs.`;

      const retryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

META ADS PRIVACY POLICY COMPLIANCE - ABSOLUTELY CRITICAL:
- NEVER assert or imply personal attributes about the audience
- NEVER use phrases like "Meet [race/ethnicity] singles", "Are you [age/condition]?", "Other [group] members"
- NEVER reference specific ages, medical conditions, financial status, or personal characteristics
- NEVER ask for or reference personal information like names, ID numbers, or private details
- ALLOWED: General location references ("New Yorker"), broad age ranges, celebrity names, "you/your" without personal attributes
- FOCUS ON: Product benefits, general audience needs, broad demographic terms without assertions

FORBIDDEN ELEMENTS:
- NO em dashes (—) or double hyphens (--) - ABSOLUTELY FORBIDDEN
- NO generic AI phrases
- NO corporate marketing speak or buzzwords
- NO overly polished agency-style copy
- NO personal attribute assertions or implications per Meta policy

AUTHENTICITY REQUIREMENTS:
- Write in first person when appropriate (I, we, my, our)
- Use the exact language and terminology the business owner would use
- Match their energy level and personality
- Include specific details about their offer and approach
- Sound conversational and genuine, not scripted
- Reflect their actual expertise and experience

Create compelling, conversion-focused copy that speaks directly to the target audience while maintaining complete authenticity to the brand voice.` 
            },
            { role: 'user', content: stricterPrompt }
          ],
          temperature: 0.5, // Lower temperature for more controlled output
          max_tokens: 1000,
        }),
      });

      if (retryResponse.ok) {
        const retryData = await retryResponse.json();
        generatedContent = retryData.choices[0].message.content;
        
        // Final compliance check
        const finalCheck = checkPrivacyCompliance(generatedContent);
        if (!finalCheck.isCompliant) {
          console.error('Retry still contains violations:', finalCheck.violations);
          return new Response(JSON.stringify({ 
            error: 'Generated content violates Meta privacy policy. Please review brand data and try again.',
            violations: finalCheck.violations 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // Post-processing: Remove em dashes and double hyphens as a safety net
    generatedContent = generatedContent
      .replace(/—/g, '-')  // Replace em dashes with regular hyphens
      .replace(/--/g, '-'); // Replace double hyphens with single hyphens

    console.log(`Successfully generated ${adType} content - Privacy compliant: ${postCheck.isCompliant}`);

    return new Response(JSON.stringify({ 
      generatedContent,
      privacyCompliant: postCheck.isCompliant,
      violations: postCheck.violations 
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
