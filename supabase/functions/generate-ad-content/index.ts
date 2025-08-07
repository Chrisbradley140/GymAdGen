
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
            content: `You are an expert fitness marketing copywriter who creates high-converting ads. Use the brand information provided to create compelling, conversion-focused copy that speaks directly to the target audience.

CRITICAL TONE AND STYLE REQUIREMENTS:
- Output must match the user's exact tone and cadence from their voice_tone_style
- Naturally weave in their brand_words throughout the content
- Completely avoid all words/phrases listed in words_to_avoid
- Use sentence structure that matches their preferred style (short/long)
- NEVER use em dashes (—) or double hyphens (--)
- NEVER use generic AI phrases like "Sound familiar?", "Just a few clicks...", "Here's the thing...", "Imagine if...", "What if I told you...", "The truth is...", "Let me ask you this...", etc.
- The content must sound like the actual business owner wrote it, not an AI or marketing agency
- Use authentic, conversational language that reflects their unique voice
- Avoid marketing clichés and corporate-speak
- Write as if you're the business owner speaking directly to your ideal customer` 
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
    const generatedContent = data.choices[0].message.content;

    console.log(`Successfully generated ${adType} content`);

    return new Response(JSON.stringify({ generatedContent }), {
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
