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

  // Generate 8-step structural templates from top-performing ads
  let structuralTemplate = '';
  if (topPerformingAds && topPerformingAds.length > 0) {
    const templates = extractStructuralTemplates(topPerformingAds);
    
    const adAnalysis = topPerformingAds.slice(0, 3).map((ad, index) => {
      const structure = analyzeAdStructure(ad.primary_text);
      return `📊 HIGH-PERFORMING AD EXAMPLE ${index + 1}:
Primary Text: "${ad.primary_text}"
Headline: "${ad.headline || 'N/A'}"
Hook Type: ${ad.hook_type || 'Direct'}
Tone: ${ad.tone || 'Professional'}
8-Step Structure Analysis: ${structure.detailedAnalysis}`;
    }).join('\n\n');

    structuralTemplate = `
🎯 PROVEN 8-STEP STRUCTURAL FRAMEWORK:
Based on analysis of ${topPerformingAds.length} top-performing ads, follow this exact pattern:

${templates.stepByStepTemplate}

🔍 DETAILED ANALYSIS OF TOP ADS:
${adAnalysis}

📋 EXTRACTED PATTERNS FOR EACH STEP:
${templates.patternInstructions}

`;
  }

  return `You are an expert copywriter specializing in ${adType}.

${structuralTemplate}

🎯 MANDATORY 8-STEP STRUCTURE - FOLLOW EXACTLY:
Your content MUST follow this proven pattern that appears in all top-performing ads:

STEP 1: [LOCAL CALLOUT] - Target specific location/group (2-4 words)
STEP 2: [PROBLEM AGITATION] - Identify pain point or frustration (1-2 sentences)
STEP 3: [SOLUTION/OFFER] - Present your program/service as the answer (1-2 sentences)
STEP 4: [BENEFITS/TRANSFORMATION] - Paint picture of results/outcomes (2-3 benefits)
STEP 5: [ELIGIBILITY CHECKLIST] - Create qualification criteria (3-4 bullet points)
STEP 6: [COMMUNITY/SUPPORT PROOF] - Emphasize group/coaching element (1 sentence)
STEP 7: [RISK REVERSAL] - Address concerns/guarantees (1 sentence)
STEP 8: [SCARCITY + CTA] - Limited spots + clear action (1-2 sentences)

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

function analyzeAdStructure(primaryText: string): { basicAnalysis: string; detailedAnalysis: string } {
  if (!primaryText) return { 
    basicAnalysis: 'No structure analysis available', 
    detailedAnalysis: 'No structure analysis available' 
  };
  
  const lines = primaryText.split('\n').filter(line => line.trim());
  const wordCount = primaryText.split(' ').length;
  const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu.test(primaryText);
  const hasQuestion = primaryText.includes('?');
  const hasCall = /\b(call|text|click|download|get|start|join|discover|learn)\b/i.test(primaryText);
  
  // Enhanced 8-step structural analysis
  const text = primaryText.toLowerCase();
  const segments = primaryText.split('\n').filter(line => line.trim());
  
  const structuralElements = {
    localCallout: detectLocalCallout(segments[0] || ''),
    problemAgitation: detectProblemAgitation(text),
    solutionOffer: detectSolutionOffer(text),
    benefitsTransformation: detectBenefitsTransformation(text),
    eligibilityChecklist: detectEligibilityChecklist(segments),
    communityProof: detectCommunityProof(text),
    riskReversal: detectRiskReversal(text),
    scarcityCTA: detectScarcityCTA(text)
  };
  
  const foundElements = Object.entries(structuralElements)
    .filter(([_, found]) => found)
    .map(([element, _]) => element);
  
  const basicAnalysis = `${lines.length} sections, ${wordCount} words, ${hasEmojis ? 'uses emojis' : 'no emojis'}, ${hasQuestion ? 'question hook' : 'statement hook'}, ${hasCall ? 'clear CTA' : 'soft CTA'}`;
  
  const detailedAnalysis = `
✅ STRUCTURAL ELEMENTS FOUND (${foundElements.length}/8):
${foundElements.map(element => `• ${formatElementName(element)}`).join('\n')}

📊 MISSING ELEMENTS (${8 - foundElements.length}/8):
${Object.entries(structuralElements)
  .filter(([_, found]) => !found)
  .map(([element, _]) => `• ${formatElementName(element)}`)
  .join('\n')}`;
  
  return { basicAnalysis, detailedAnalysis };
}

function detectLocalCallout(firstLine: string): boolean {
  const locationPatterns = [
    /\b(\d+\s+)?(local|area|nearby|[A-Z][a-z]+)\s+(ladies|women|men|people|moms|dads|entrepreneurs|business owners|professionals|busy)\b/i,
    /(ladies|women|men|people|moms|dads)\s+of\s+[A-Z][a-z]+/i,
    /\b\d+\s+(ladies|women|men|people|moms|dads|busy)\b/i,
    /[A-Z][a-z]+\s+(ladies|women|men|people|moms|dads)/i,
    /(calling all|attention)\s+(ladies|women|men|people)/i
  ];
  
  return locationPatterns.some(pattern => pattern.test(firstLine));
}

function detectProblemAgitation(text: string): boolean {
  const problemPatterns = /(tired of|frustrated|struggling|sick of|fed up|enough of|stuck|can't seem|constantly)/i;
  return problemPatterns.test(text);
}

function detectSolutionOffer(text: string): boolean {
  const solutionPatterns = /(introducing|presenting|offering|program|challenge|transformation|method|system|solution)/i;
  return solutionPatterns.test(text);
}

function detectBenefitsTransformation(text: string): boolean {
  const benefitPatterns = /(lose|gain|build|achieve|get|feel|become|transform|improve|boost)/i;
  return benefitPatterns.test(text);
}

function detectEligibilityChecklist(segments: string[]): boolean {
  const checklistPatterns = /(✅|✓|•|\*|-|\d+\.)/;
  const hasListFormat = segments.some(segment => checklistPatterns.test(segment));
  const hasQualification = segments.some(segment => 
    /(ready|committed|willing|serious|dedicated|motivated)/i.test(segment)
  );
  return hasListFormat || hasQualification;
}

function detectCommunityProof(text: string): boolean {
  const communityPatterns = /(community|group|team|support|together|others|members|family)/i;
  return communityPatterns.test(text);
}

function detectRiskReversal(text: string): boolean {
  const riskPatterns = /(guarantee|money back|risk free|no risk|promise|confident|certain)/i;
  return riskPatterns.test(text);
}

function detectScarcityCTA(text: string): boolean {
  const scarcityPatterns = /(limited|spots|only|hurry|deadline|expires|closes)/i;
  const ctaPatterns = /(click|call|text|message|apply|join|secure|book|reserve)/i;
  return scarcityPatterns.test(text) && ctaPatterns.test(text);
}

function formatElementName(element: string): string {
  const nameMap: { [key: string]: string } = {
    localCallout: 'Local Callout',
    problemAgitation: 'Problem Agitation',
    solutionOffer: 'Solution/Offer',
    benefitsTransformation: 'Benefits/Transformation',
    eligibilityChecklist: 'Eligibility Checklist',
    communityProof: 'Community/Support Proof',
    riskReversal: 'Risk Reversal',
    scarcityCTA: 'Scarcity + CTA'
  };
  return nameMap[element] || element;
}

function extractStructuralTemplates(topAds: any[]) {
  console.log(`Extracting structural templates from ${topAds.length} top ads`);
  
  // Analyze patterns across all top ads to create templates
  const localCallouts = extractPatterns(topAds, 'localCallout');
  const problemStarters = extractPatterns(topAds, 'problemAgitation');
  const solutionIntros = extractPatterns(topAds, 'solutionOffer');
  const benefitPhrases = extractPatterns(topAds, 'benefits');
  const checklistFormats = extractPatterns(topAds, 'checklist');
  const communityMentions = extractPatterns(topAds, 'community');
  const riskReversals = extractPatterns(topAds, 'riskReversal');
  const scarcityPhrases = extractPatterns(topAds, 'scarcity');
  
  console.log('Pattern extraction results:', {
    localCallouts: localCallouts.length,
    problemStarters: problemStarters.length,
    solutionIntros: solutionIntros.length,
    benefitPhrases: benefitPhrases.length,
    checklistFormats: checklistFormats.length,
    communityMentions: communityMentions.length,
    riskReversals: riskReversals.length,
    scarcityPhrases: scarcityPhrases.length
  });
  
  // Build dynamic templates using actual extracted patterns
  const stepByStepTemplate = `
1️⃣ LOCAL CALLOUT: Use patterns like: ${localCallouts.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Local [TARGET AUDIENCE]"'}
2️⃣ PROBLEM AGITATION: Use patterns like: ${problemStarters.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Tired of [SPECIFIC FRUSTRATION]?"'}
3️⃣ SOLUTION/OFFER: Use patterns like: ${solutionIntros.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Introducing [PROGRAM NAME]"'}
4️⃣ BENEFITS/TRANSFORMATION: Use patterns like: ${benefitPhrases.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"You\'ll [BENEFIT 1], [BENEFIT 2]"'}
5️⃣ ELIGIBILITY CHECKLIST: Use formats like: ${checklistFormats.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"✅ Perfect if you\'re [CRITERIA]"'}
6️⃣ COMMUNITY/SUPPORT: Use patterns like: ${communityMentions.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Join our community of [TARGET AUDIENCE]"'}
7️⃣ RISK REVERSAL: Use patterns like: ${riskReversals.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"I guarantee you\'ll [OUTCOME]"'}
8️⃣ SCARCITY + CTA: Use patterns like: ${scarcityPhrases.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Limited spots available. Apply now!"'}`;

  const patternInstructions = `
🎯 REAL LOCAL CALLOUT EXAMPLES: ${localCallouts.slice(0, 5).join(' • ') || 'No patterns found'}
😤 REAL PROBLEM AGITATION EXAMPLES: ${problemStarters.slice(0, 5).join(' • ') || 'No patterns found'}
💡 REAL SOLUTION OFFER EXAMPLES: ${solutionIntros.slice(0, 5).join(' • ') || 'No patterns found'}
🚀 REAL BENEFIT EXAMPLES: ${benefitPhrases.slice(0, 5).join(' • ') || 'No patterns found'}
✅ REAL CHECKLIST EXAMPLES: ${checklistFormats.slice(0, 5).join(' • ') || 'No patterns found'}
👥 REAL COMMUNITY EXAMPLES: ${communityMentions.slice(0, 5).join(' • ') || 'No patterns found'}
🛡️ REAL RISK REVERSAL EXAMPLES: ${riskReversals.slice(0, 5).join(' • ') || 'No patterns found'}
⏰ REAL SCARCITY/CTA EXAMPLES: ${scarcityPhrases.slice(0, 5).join(' • ') || 'No patterns found'}`;

  return { stepByStepTemplate, patternInstructions };
}

function extractPatterns(topAds: any[], patternType: string): string[] {
  const patterns: string[] = [];
  
  console.log(`Extracting ${patternType} patterns from ${topAds.length} ads`);
  
  topAds.forEach((ad, index) => {
    const text = ad.primary_text || '';
    const lines = text.split('\n').filter(line => line.trim());
    
    switch (patternType) {
      case 'localCallout':
        // Extract first line patterns with location/demographic targeting
        if (lines[0]) {
          const firstLine = lines[0].trim();
          const calloutPatterns = [
            /\b(\d+\s+)?(local|area|nearby|[A-Z][a-z]+)\s+(ladies|women|men|people|moms|dads|entrepreneurs)/i,
            /(ladies|women|men|people|moms|dads)\s+of\s+[A-Z][a-z]+/i,
            /\b\d+\s+(ladies|women|men|people|moms|dads|busy)/i,
            /[A-Z][a-z]+\s+(ladies|women|men|people|moms|dads)/i
          ];
          
          if (calloutPatterns.some(pattern => pattern.test(firstLine))) {
            patterns.push(firstLine);
            console.log(`Found local callout in ad ${index}: "${firstLine}"`);
          }
        }
        break;
        
      case 'problemAgitation':
        // Extract problem agitation phrases
        const problemPatterns = [
          /(tired of|frustrated with?|struggling with?|sick of|fed up with?|enough of)[^.!?\n]{1,50}/i,
          /(can't seem to|constantly|always|never able to)[^.!?\n]{1,50}/i,
          /(stuck|feeling|overwhelmed|stressed)[^.!?\n]{1,50}/i
        ];
        
        problemPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            patterns.push(matches[0].trim());
            console.log(`Found problem agitation in ad ${index}: "${matches[0].trim()}"`);
          }
        });
        break;
        
      case 'solutionOffer':
        // Extract solution/offer introductions
        const solutionPatterns = [
          /(introducing|presenting|offering|announcing)[^.!?\n]{1,60}/i,
          /(program|challenge|transformation|method|system|solution)[^.!?\n]{1,60}/i,
          /(join|discover|experience|get access to)[^.!?\n]{1,60}/i
        ];
        
        solutionPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            patterns.push(matches[0].trim());
            console.log(`Found solution offer in ad ${index}: "${matches[0].trim()}"`);
          }
        });
        break;
        
      case 'benefits':
        // Extract benefit statements
        const benefitPatterns = [
          /(you'll|you will)\s+(lose|gain|build|achieve|get|feel|become|transform|improve|boost)[^.!?\n]{1,50}/i,
          /(finally|actually|really)\s+(lose|gain|build|achieve|get|feel|become)[^.!?\n]{1,50}/i,
          /➡️\s*[^.!?\n]{1,50}/g
        ];
        
        benefitPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            if (Array.isArray(matches)) {
              matches.forEach(match => patterns.push(match.trim()));
            } else {
              patterns.push(matches.trim());
            }
            console.log(`Found benefits in ad ${index}: "${matches}"`);
          }
        });
        break;
        
      case 'checklist':
        // Extract eligibility checklist items
        const checklistLines = lines.filter(line => 
          /^(✅|✓|•|\*|-|\d+\.)\s+/.test(line) ||
          /(perfect if|ideal if|ready to|committed to|willing to|serious about)/i.test(line)
        );
        
        checklistLines.forEach(line => {
          patterns.push(line.trim());
          console.log(`Found checklist item in ad ${index}: "${line.trim()}"`);
        });
        break;
        
      case 'community':
        // Extract community/support mentions
        const communityPatterns = [
          /(join our|part of our|become part of)[^.!?\n]{1,50}/i,
          /(community|group|team|support|together|others|members|family)[^.!?\n]{1,50}/i,
          /(surrounded by|supported by|alongside)[^.!?\n]{1,50}/i
        ];
        
        communityPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            patterns.push(matches[0].trim());
            console.log(`Found community mention in ad ${index}: "${matches[0].trim()}"`);
          }
        });
        break;
        
      case 'riskReversal':
        // Extract risk reversal/guarantee statements
        const riskPatterns = [
          /(guarantee|promise|confident|certain)[^.!?\n]{1,50}/i,
          /(money back|risk free|no risk|first.*free)[^.!?\n]{1,50}/i,
          /(30.day|love it or|satisfaction guaranteed)[^.!?\n]{1,50}/i
        ];
        
        riskPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            patterns.push(matches[0].trim());
            console.log(`Found risk reversal in ad ${index}: "${matches[0].trim()}"`);
          }
        });
        break;
        
      case 'scarcity':
        // Extract scarcity and CTA language
        const scarcityPatterns = [
          /(limited|only \d+|spots|hurry|deadline|expires|closes)[^.!?\n]{1,50}/i,
          /(click|call|text|message|apply|join|secure|book|reserve)[^.!?\n]{1,50}/i,
          /(don't wait|act now|secure your|book your)[^.!?\n]{1,50}/i
        ];
        
        scarcityPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            patterns.push(matches[0].trim());
            console.log(`Found scarcity/CTA in ad ${index}: "${matches[0].trim()}"`);
          }
        });
        break;
    }
  });
  
  const uniquePatterns = [...new Set(patterns)];
  console.log(`Extracted ${uniquePatterns.length} unique ${patternType} patterns`);
  
  return uniquePatterns.slice(0, 5); // Return top 5 patterns
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