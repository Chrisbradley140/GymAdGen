import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComplianceRequest {
  content: string;
  contentType: string;
  brandTone?: string;
}

interface ComplianceResult {
  isCompliant: boolean;
  violations: string[];
  fixedText?: string;
  canBeSaved: boolean;
  complianceStatus: 'passed' | 'fixed' | 'failed';
  checkId?: string;
}

const META_POLICY_PROMPT = `You are a Meta Advertising Policy compliance expert. Review the provided ad content and check for violations against these specific Meta advertising rules:

1. PERSONAL ATTRIBUTES: Ads must not directly or indirectly claim to know or assume personal details such as race, ethnicity, religion, beliefs, age, sexual orientation, gender identity, disability, physical/mental health, medical conditions, financial status, voting status, union membership, criminal record, or a person's name.
   - VIOLATION EXAMPLES: "Are you 40 and struggling with weight?" or "Meet other Christian singles."
   - ALLOWED: General statements not tied to personal attributes (e.g., "Join the challenge for more energy.")

2. NEGATIVE SELF-PERCEPTION/BODY SHAMING: Ads for weight loss, cosmetic products, or appearance-related services must not:
   - Promote unrealistic body ideals or imply there's a "perfect" body type
   - Use before/after imagery that shames the "before" state
   - Highlight body "flaws" to create insecurity
   - ALLOWED: Positive, empowering statements focused on health, energy, and well-being

3. SHOCKING/SENSATIONAL CONTENT: Avoid fear tactics, exaggerated claims, or unsafe suggestions.
   - VIOLATION EXAMPLES: "Melt 50 lbs in 2 weeks — guaranteed!" or "Doctors hate this one trick."

4. MISLEADING/UNVERIFIABLE CLAIMS: All claims must be realistic and verifiable, without promising impossible results.

5. ADULT CONTENT: Ads must not promote sexual arousal products, adult entertainment, or explicit sexual references.
   - Sexual/reproductive health ads are allowed if focused on health benefits (not pleasure) and target 18+

6. PROHIBITED CONTENT: No profanity, hate speech, dangerous activities, misinformation, or content violating Meta's Community Standards.

TASK: Analyze the content and respond with a JSON object containing:
- isCompliant (boolean): true if no violations found
- violations (array): list of specific rule violations found
- fixedText (string): if violations can be fixed, provide corrected version maintaining the same tone and intent
- canBeSaved (boolean): true if content is compliant or can be fixed
- complianceStatus (string): "passed", "fixed", or "failed"

If fixing content, maintain the original brand tone and marketing intent while ensuring full compliance.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, contentType, brandTone }: ComplianceRequest = await req.json();

    if (!content || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Content and contentType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking Meta compliance for ${contentType}: ${content.substring(0, 100)}...`);

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare the prompt with brand tone context
    const brandToneContext = brandTone ? `\n\nBRAND TONE TO MAINTAIN: ${brandTone}` : '';
    const fullPrompt = `${META_POLICY_PROMPT}${brandToneContext}\n\nCONTENT TYPE: ${contentType}\nCONTENT TO CHECK: "${content}"`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a Meta Advertising Policy compliance expert. Always respond with valid JSON only.' 
          },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const openAIData = await response.json();
    let complianceResponse = openAIData.choices[0].message.content;

    console.log('OpenAI compliance response:', complianceResponse);

    // Clean up markdown formatting if present
    if (complianceResponse.includes('```json')) {
      complianceResponse = complianceResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    // Parse the JSON response
    let complianceResult: ComplianceResult;
    try {
      complianceResult = JSON.parse(complianceResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw response:', complianceResponse);
      throw new Error('Invalid response format from compliance checker');
    }

    // Get user ID from JWT
    const authHeader = req.headers.get('authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { authorization: authHeader! },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Save compliance check to database
    const { data: savedCheck, error: saveError } = await supabase
      .from('compliance_checks')
      .insert({
        user_id: user.id,
        content_type: contentType,
        original_text: content,
        fixed_text: complianceResult.fixedText || null,
        compliance_status: complianceResult.complianceStatus,
        violations: complianceResult.violations || [],
      })
      .select('id')
      .single();

    if (saveError) {
      console.error('Error saving compliance check:', saveError);
      // Don't fail the entire request if saving fails
    } else {
      complianceResult.checkId = savedCheck.id;
    }

    console.log(`Compliance check completed: ${complianceResult.complianceStatus} with ${complianceResult.violations.length} violations`);

    return new Response(
      JSON.stringify(complianceResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in meta-compliance-check function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});