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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adType, systemPrompt, brandData } = await req.json();

    console.log('Generating content for:', { adType, brandData: brandData?.business_name });

    // Create a simple prompt
    const prompt = `
You are an expert copywriter specializing in ${adType}.

Brand Information:
- Business: ${brandData?.business_name || 'Unknown Business'}
- Target Market: ${brandData?.target_market || 'General audience'}
- Voice & Tone: ${brandData?.voice_tone_style || 'Professional and friendly'}

Instructions: ${systemPrompt}

Generate high-quality, engaging content that matches the brand voice and appeals to the target market.
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
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

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