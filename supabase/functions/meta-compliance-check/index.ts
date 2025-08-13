import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MetaViolation {
  rule: string;
  reason: string;
  snippet?: string;
}

interface MetaComplianceResult {
  compliant: boolean;
  fixedText: string;
  violations: MetaViolation[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { content, contentType, brandTone } = await req.json();
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client for this request
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    console.log(`Checking Meta compliance for user ${user.id}, content type: ${contentType}`);

    // Meta Policy Master Prompt
    const systemPrompt = `You are a Meta advertising policy compliance expert. Your job is to check ad content against Meta's advertising policies and fix violations while preserving the original tone and intent.

CRITICAL META POLICY RULES TO CHECK:
1. No exaggerated claims about results or outcomes
2. No targeting of insecurities or personal attributes
3. No before/after claims without proper disclaimers
4. No misleading or false information
5. No inappropriate use of personal attributes for targeting
6. No content that could be considered discriminatory
7. No unrealistic promises or guarantees
8. No misleading health or fitness claims
9. No inappropriate targeting based on sensitive categories
10. No content that violates community standards

ANALYSIS INSTRUCTIONS:
- If content is compliant, return it unchanged
- If content has violations, rewrite it to be compliant while preserving:
  * Original meaning and intent
  * Brand tone: ${brandTone || 'professional'}
  * Call-to-action strength
  * Target audience appeal
- If content cannot be safely rewritten to be compliant, mark as non-compliant

Content Type: ${contentType}
Brand Tone: ${brandTone || 'Not specified'}

RESPONSE FORMAT (JSON only):
{
  "compliant": boolean,
  "fixedText": "rewritten content or empty string if cannot fix",
  "violations": [
    {
      "rule": "specific rule violated",
      "reason": "explanation of why it violates the rule",
      "snippet": "problematic text portion (optional)"
    }
  ]
}`;

    const userPrompt = `Check this ${contentType} content for Meta policy compliance:

"${content}"

Analyze thoroughly and provide compliance assessment with fixes if possible.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('OpenAI response received:', aiResponse);

    // Parse AI response
    let complianceResult: MetaComplianceResult;
    try {
      complianceResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      complianceResult = {
        compliant: false,
        fixedText: '',
        violations: [{
          rule: 'PARSE_ERROR',
          reason: 'Unable to parse compliance check response',
          snippet: content.substring(0, 100)
        }]
      };
    }

    // Determine compliance status
    const complianceStatus = complianceResult.compliant 
      ? 'passed' 
      : (complianceResult.fixedText ? 'fixed' : 'failed');

    // Save compliance check to database
    const { error: saveError } = await supabase
      .from('compliance_checks')
      .insert({
        user_id: user.id,
        content_type: contentType,
        original_text: content,
        fixed_text: complianceResult.fixedText || null,
        violations: complianceResult.violations || [],
        compliance_status: complianceStatus
      });

    if (saveError) {
      console.error('Error saving compliance check:', saveError);
      // Don't throw here, still return the compliance result
    }

    console.log(`Compliance check completed: ${complianceStatus}`);

    return new Response(JSON.stringify(complianceResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in meta-compliance-check function:', error);
    
    const errorResponse = {
      compliant: false,
      fixedText: '',
      violations: [{
        rule: 'SYSTEM_ERROR',
        reason: 'System error during compliance check',
        snippet: ''
      }]
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});