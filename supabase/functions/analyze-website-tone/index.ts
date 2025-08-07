import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { website_url, user_id } = await req.json();
    
    if (!website_url || !user_id) {
      return new Response(
        JSON.stringify({ error: 'website_url and user_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to fetch website content
    let websiteContent = '';
    try {
      console.log(`Fetching content from: ${website_url}`);
      const response = await fetch(website_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        const html = await response.text();
        // Basic text extraction from HTML
        websiteContent = html
          .replace(/<script[^>]*>.*?<\/script>/gis, '')
          .replace(/<style[^>]*>.*?<\/style>/gis, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 4000); // Limit content to avoid token limits
      }
    } catch (fetchError) {
      console.log(`Failed to fetch website content: ${fetchError.message}`);
      // Continue with empty content - we'll handle this gracefully
    }

    // If no content was retrieved, skip analysis
    if (!websiteContent) {
      console.log('No website content available, skipping analysis');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Website content unavailable, analysis skipped',
          website_tone_scan: null 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze content with GPT-4
    console.log('Analyzing website content with GPT-4');
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert brand analyst. Extract key information from website content and format it clearly.'
          },
          {
            role: 'user',
            content: `Here is the homepage content of a business. Based on this, extract the following:

- Brand Tone: [writing style, personality, formality level]
- Key Offers: [main products/services being promoted]
- Unique Selling Points: [what makes them different]
- Overall Positioning Style: [how they present themselves in market]

Return your output clearly labeled under each section.

Website content:
${websiteContent}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!gptResponse.ok) {
      console.error('GPT API error:', await gptResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to analyze website content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const gptData = await gptResponse.json();
    const analysis = gptData.choices[0].message.content;

    console.log('Analysis completed, saving to database');

    // Save analysis to user_onboarding table
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabase
      .from('user_onboarding')
      .update({ website_tone_scan: analysis })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Website tone analysis completed',
        website_tone_scan: analysis 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-website-tone function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});