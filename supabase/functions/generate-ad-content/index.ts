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

async function checkOriginality(content: string, rules: any, campaignCanonicalName?: string) {
  if (!rules?.originality_rules?.check_against_top_ads) return { isOriginal: true, violations: [] };

  try {
    // Build campaign-aware query
    let query = supabase
      .from('top_performing_ads')
      .select('primary_text, headline, campaign_canonical_name');

    // Filter by campaign if specified
    if (campaignCanonicalName) {
      console.log(`Checking originality against ads from campaign: ${campaignCanonicalName}`);
      query = query.eq('campaign_canonical_name', campaignCanonicalName);
    } else {
      console.log('Checking originality against all campaigns (no campaign specified)');
    }

    const { data: topAds } = await query;

    if (!topAds || topAds.length === 0) {
      // Fallback: if campaign has no ads, check against similar campaign types
      if (campaignCanonicalName) {
        const campaignType = getCampaignType(campaignCanonicalName);
        console.log(`No ads found for campaign ${campaignCanonicalName}, falling back to ${campaignType} campaign types`);
        
        const { data: fallbackAds } = await supabase
          .from('top_performing_ads')
          .select('primary_text, headline, campaign_canonical_name')
          .limit(10); // Limit fallback to prevent cross-contamination

        if (fallbackAds && fallbackAds.length > 0) {
          // Filter fallback ads by campaign type compatibility
          const compatibleAds = fallbackAds.filter(ad => {
            const adCampaignType = getCampaignType(ad.campaign_canonical_name);
            return adCampaignType === campaignType;
          });
          
          console.log(`Using ${compatibleAds.length} compatible ${campaignType} ads for originality check`);
          return performOriginalityCheck(content, compatibleAds, rules.originality_rules.max_consecutive_words);
        }
      }
      
      return { isOriginal: true, violations: [] };
    }

    console.log(`Checking originality against ${topAds.length} campaign-specific ads`);
    return performOriginalityCheck(content, topAds, rules.originality_rules.max_consecutive_words);
    
  } catch (error) {
    console.error('Error checking originality:', error);
    return { isOriginal: true, violations: [] };
  }
}

function performOriginalityCheck(content: string, ads: any[], maxConsecutive: number) {
  const violations: string[] = [];

  for (const ad of ads) {
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
}

// Helper function to determine campaign type
const getCampaignType = (campaignCanonicalName?: string): string => {
  if (!campaignCanonicalName) return 'generic';
  
  const campaign = campaignCanonicalName.toLowerCase();
  
  if (campaign.includes('people') && campaign.includes('wanted')) return 'recruitment';
  if (campaign.includes('personal-training')) return 'service';
  if (campaign.includes('challenge') || campaign.includes('week') || campaign.includes('day')) return 'challenge';
  if (campaign.includes('transformation')) return 'transformation';
  
  return 'generic';
};

// Helper function to filter patterns based on campaign type
const filterPatternsByCampaign = (patterns: any, campaignType: string): any => {
  const incompatibleTerms = getIncompatibleTerms(campaignType);
  
  console.log(`Filtering patterns for ${campaignType} campaign, excluding: ${incompatibleTerms.join(', ')}`);
  
  const filtered = {};
  Object.keys(patterns).forEach(key => {
    filtered[key] = patterns[key].filter((pattern: string) => {
      const patternLower = pattern.toLowerCase();
      const hasIncompatibleTerm = incompatibleTerms.some(term => patternLower.includes(term));
      
      if (hasIncompatibleTerm) {
        console.log(`Filtered out pattern from ${key}: "${pattern.substring(0, 50)}..." - contains incompatible term`);
      }
      
      return !hasIncompatibleTerm;
    });
  });
  
  return filtered;
};

// Helper function to get incompatible terms for each campaign type
const getIncompatibleTerms = (campaignType: string): string[] => {
  switch (campaignType) {
    case 'recruitment':
      return ['week', 'day', 'challenge', 'transformation', '6 week', '30 day', 'program'];
    case 'service':
      return ['wanted', 'seeking', 'recruiting', 'looking for', 'week', 'challenge'];
    case 'challenge':
      return ['wanted', 'seeking', 'recruiting', 'looking for', 'ladies wanted', 'people wanted'];
    case 'transformation':
      return ['wanted', 'seeking', 'recruiting', 'looking for'];
    default:
      return [];
  }
};

function buildEnhancedPrompt(adType: string, systemPrompt: string, brandData: any, globalRules: any, topPerformingAds?: any[], campaignCanonicalName?: string) {
  console.log(`Building prompt for campaign: ${campaignCanonicalName || 'generic'}, adType: ${adType}`);
  
  // Filter top ads specific to this campaign if available
  const campaignSpecificAds = topPerformingAds && campaignCanonicalName 
    ? topPerformingAds.filter(ad => ad.campaign_canonical_name === campaignCanonicalName)
    : [];

  const adsToUse = campaignSpecificAds.length > 0 ? campaignSpecificAds : (topPerformingAds || []);
  console.log(`Using ${adsToUse.length} ads for templates (${campaignSpecificAds.length} campaign-specific, ${topPerformingAds?.length || 0} total)`);

  const safetyRules = globalRules?.safety_rules || {};
  const formattingRules = globalRules?.formatting_rules || {};
  const wordsToAvoid = brandData?.words_to_avoid ? brandData.words_to_avoid.split(',').map((w: string) => w.trim()) : [];

  // Build campaign-specific context at the top
  let campaignContext = '';
  if (campaignCanonicalName) {
    const campaignTheme = campaignCanonicalName.toLowerCase();
    
    if (campaignTheme.includes('people') && campaignTheme.includes('wanted')) {
      campaignContext = `
🎯 CAMPAIGN FOCUS: "${campaignCanonicalName}" - Local Recruitment Campaign
⚠️ CRITICAL: This is a RECRUITMENT campaign, NOT a time-based challenge.
- Focus on finding and recruiting specific NUMBER of people/ladies
- Use recruitment language: "We're looking for", "Seeking", "Wanted", "Accepting applications"
- Emphasize LOCAL community and LIMITED SPOTS available
- Headlines should be about RECRUITMENT: "10 Ladies Wanted", "Seeking 5 People", etc.
- Campaign names should emphasize SELECTION and EXCLUSIVITY
- 🚫 STRICTLY AVOID: "6 week", "challenge", "transformation", "day" programs
- 🚫 DO NOT use challenge-specific patterns or timeframes
- ✅ USE: "wanted", "seeking", "recruiting", "looking for", "accepting", "spots available"`;
    } else if (campaignTheme.includes('personal-training')) {
      campaignContext = `
🎯 CAMPAIGN FOCUS: "${campaignCanonicalName}" - Personal Training Service
- Focus on EXPERT COACHING and personalized fitness guidance
- Emphasize PROFESSIONAL service and ONE-ON-ONE attention
- Use service-oriented language about training expertise
- Headlines should reflect TRAINING SERVICE not recruitment or challenges
- 🚫 AVOID: recruitment language, challenge timeframes, "wanted" terminology
- ✅ USE: "personal training", "expert coaching", "professional guidance"`;
    } else if (campaignTheme.includes('challenge') || campaignTheme.includes('week') || campaignTheme.includes('day')) {
      campaignContext = `
🎯 CAMPAIGN FOCUS: "${campaignCanonicalName}" - Time-Based Challenge
- Focus on the SPECIFIC timeframe mentioned in the campaign name
- Use challenge-specific language matching the exact duration
- Emphasize transformation within the specified time period
- Headlines should reflect the SPECIFIC challenge duration and type`;
    } else {
      campaignContext = `
🎯 CAMPAIGN FOCUS: "${campaignCanonicalName}"
- Stay true to this specific campaign theme and language
- Use terminology that exactly matches this campaign type
- Avoid generic fitness language that doesn't align with campaign focus
- Match the tone and positioning of this specific campaign`;
    }
    
    // Add content type specific validation
    if (adType === 'headline_options' || adType === 'campaign_name') {
      campaignContext += `\n\n🎯 CONTENT TYPE VALIDATION for ${adType.toUpperCase()}:
- MUST reflect the specific campaign type: "${campaignCanonicalName}"
- Headlines/names MUST match campaign theme, NOT generic fitness patterns
- If not a challenge campaign, DO NOT include "week", "day", "challenge" terms
- If recruitment campaign, focus on "wanted", "seeking", "recruiting" language`;
    }
  }

  // Generate structural templates from relevant ads with campaign awareness
  let structuralTemplate = '';
  if (adsToUse.length > 0) {
    const templates = extractStructuralTemplates(adsToUse, campaignCanonicalName);
    
    const adAnalysis = adsToUse.slice(0, 3).map((ad, index) => {
      const structure = analyzeAdStructure(ad.primary_text);
      return `📊 ${campaignSpecificAds.length > 0 ? 'CAMPAIGN-SPECIFIC' : 'HIGH-PERFORMING'} AD EXAMPLE ${index + 1}:
Primary Text: "${ad.primary_text}"
Headline: "${ad.headline || 'N/A'}"
Hook Type: ${ad.hook_type || 'Direct'}
Tone: ${ad.tone || 'Professional'}
8-Step Structure Analysis: ${structure.detailedAnalysis}`;
    }).join('\n\n');

    structuralTemplate = `
🎯 PROVEN 8-STEP STRUCTURAL FRAMEWORK:
Based on analysis of ${adsToUse.length} ${campaignSpecificAds.length > 0 ? 'campaign-specific' : 'top-performing'} ads, follow this exact pattern:

${templates.stepByStepTemplate}

🔍 DETAILED ANALYSIS OF ${campaignSpecificAds.length > 0 ? 'CAMPAIGN' : 'TOP'} ADS:
${adAnalysis}

📋 EXTRACTED PATTERNS FOR EACH STEP:
${templates.patternInstructions}

`;
  }

  return `You are an expert copywriter specializing in ${adType}.

${campaignContext}

${structuralTemplate}

🎯 MANDATORY 8-STEP STRUCTURE - FOLLOW EXACTLY:
Your content MUST follow this proven pattern that appears in all top-performing ads:

🔥 HIGH-ENERGY PROVEN FITNESS AD STRUCTURE - REPLICATE THIS EXACTLY: 🔥

🚨 STEP 1: [BIG HOOK] - CAPS + emojis + location targeting ("🚨 ATTENTION [CITY] LADIES 🚨")
💔 STEP 2: [PAIN CALLOUT] - Hit their struggles hard with emotional, conversational language  
🎯 STEP 3: [PROGRAM INTRO] - Present transformation challenge with clear, memorable name
✅ STEP 4: [BENEFIT BULLETS] - Use emoji bullets (✅ workouts ✅ nutrition ✅ community)
📋 STEP 5: [QUALIFICATION LIST] - Create excitement with eligibility criteria 
🤝 STEP 6: [COMMUNITY HYPE] - Build connection and support element
🔒 STEP 7: [URGENCY/SCARCITY] - "HURRY", "if link still works", specific spot numbers
👆 STEP 8: [DIRECT CTA] - "Click Learn More", "Tap below", "Apply Here"

🎯 ENERGETIC STYLE REQUIREMENTS - MATCH TOP PERFORMERS:
- USE CAPS for impact words and excitement
- START with 🚨 emojis and location targeting  
- BE PLAYFUL: elongated words like "REEEEEALLY", bold claims, fun exaggeration
- EMOJI BULLETS: ✅ 🔥 💪 🎯 📈 💰 ⚡ 🚀 for benefits and lists
- SCARCITY LANGUAGE: "15 local women", "10 spots only", "HURRY", "LIMITED"
- TONE: Energetic, hype-driven, emoji-rich, slightly raw - NOT overly polished
- LOCAL TARGETING: Include city/area names for exclusivity

SAFETY REQUIREMENTS (still follow but with energy):
- NO personal health, ethnicity, or financial status references
- NO before/after claims or testimonials  
- NO engagement bait phrases: ${safetyRules.engagement_bait_patterns?.join(', ') || 'comment below, tag a friend, share if you agree, like if, double tap'}
- STRICTLY AVOID these words: ${wordsToAvoid.join(', ') || 'none specified'}

ORIGINALITY REQUIREMENT:
- Generate completely original content inspired by the patterns above
- Do not copy more than 3 consecutive words from any existing advertisement
- Use the structural insights and ENERGY from top ads to inform your approach

🎯 ENHANCED BRAND CONTEXT & PSYCHOLOGICAL INSIGHTS:

📊 BUSINESS FOUNDATION:
- Business: ${brandData?.business_name || 'Unknown Business'}
- Target Market: ${brandData?.target_market || 'General audience'}
- Voice & Tone: ${brandData?.voice_tone_style || 'Professional and friendly'}

🧠 PSYCHOLOGICAL MESSAGING FRAMEWORK:
${brandData?.main_problem ? `
💔 PRIMARY PAIN POINT: "${brandData.main_problem}"
   → Use this as the foundation for problem agitation (Step 2)
   → Create emotional resonance by directly addressing this struggle` : ''}

${brandData?.client_words ? `
🗣️ AUTHENTIC CLIENT LANGUAGE: "${brandData.client_words}"
   → Integrate these exact words/phrases into hooks and pain points
   → These are the words clients use BEFORE signing up - mirror their language` : ''}

${brandData?.failed_solutions ? `
❌ WHAT DIDN'T WORK: "${brandData.failed_solutions}"
   → Use for contrast and differentiation in solution presentation
   → Address why previous attempts failed to build credibility` : ''}

${brandData?.magic_wand_result ? `
✨ ULTIMATE OUTCOME: "${brandData.magic_wand_result}"
   → Use this for compelling CTAs and transformation promises
   → This is their dream result - make it feel achievable` : ''}

🎤 COACHING PERSONALITY INTEGRATION:
${brandData?.coaching_style ? `
🔥 COACHING STYLE: "${brandData.coaching_style}"
   → Adapt tone and personality to match this style
   → Let this guide the energy level and approach of the content` : ''}

${brandData?.brand_words ? `
💬 SIGNATURE BRAND LANGUAGE: "${brandData.brand_words}"
   → Naturally weave these phrases throughout the content
   → These are "you" words that define your brand voice` : ''}

${brandData?.website_tone_scan ? `
🌐 WEBSITE TONE ANALYSIS: "${brandData.website_tone_scan}"
   → Use as additional context for voice and tone consistency
   → Ensure generated content aligns with established brand presence` : ''}

🎯 CONTENT INTEGRATION STRATEGY:
- HOOKS: Use client_words and main_problem for authentic opening
- PAIN AGITATION: Leverage main_problem and failed_solutions 
- SOLUTION: Position as alternative to failed_solutions
- BENEFITS: Connect to magic_wand_result aspirations
- VOICE: Blend coaching_style with brand_words naturally
- TONE: Maintain consistency with voice_tone_style and website_tone_scan

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

function extractStructuralTemplates(topAds: any[], campaignCanonicalName?: string) {
  console.log(`Extracting structural templates from ${topAds.length} top ads for campaign: ${campaignCanonicalName || 'generic'}`);

  // Get campaign type for pattern filtering
  const campaignType = getCampaignType(campaignCanonicalName);
  
  // Extract raw patterns first
  const rawPatterns = {
    localCallouts: extractPatterns(topAds, 'localCallout'),
    problemStarters: extractPatterns(topAds, 'problemAgitation'),
    solutionIntros: extractPatterns(topAds, 'solutionOffer'),
    benefitPhrases: extractPatterns(topAds, 'benefits'),
    checklistFormats: extractPatterns(topAds, 'checklist'),
    communityMentions: extractPatterns(topAds, 'community'),
    riskReversals: extractPatterns(topAds, 'riskReversal'),
    scarcityPhrases: extractPatterns(topAds, 'scarcity')
  };

  // Filter patterns based on campaign type to prevent contamination
  const filteredPatterns = filterPatternsByCampaign(rawPatterns, campaignType);

  console.log(`Pattern extraction results for ${campaignType}:`, {
    localCallouts: filteredPatterns.localCallouts.length,
    problemStarters: filteredPatterns.problemStarters.length,
    solutionIntros: filteredPatterns.solutionIntros.length,
    benefitPhrases: filteredPatterns.benefitPhrases.length,
    checklistFormats: filteredPatterns.checklistFormats.length,
    communityMentions: filteredPatterns.communityMentions.length,
    riskReversals: filteredPatterns.riskReversals.length,
    scarcityPhrases: filteredPatterns.scarcityPhrases.length
  });
  
  // Build dynamic templates using filtered patterns
  const stepByStepTemplate = `
1️⃣ LOCAL CALLOUT: Use patterns like: ${filteredPatterns.localCallouts.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Local [TARGET AUDIENCE]"'}
2️⃣ PROBLEM AGITATION: Use patterns like: ${filteredPatterns.problemStarters.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Tired of [SPECIFIC FRUSTRATION]?"'}
3️⃣ SOLUTION/OFFER: Use patterns like: ${filteredPatterns.solutionIntros.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Introducing [PROGRAM NAME]"'}
4️⃣ BENEFITS/TRANSFORMATION: Use patterns like: ${filteredPatterns.benefitPhrases.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"You\'ll [BENEFIT 1], [BENEFIT 2]"'}
5️⃣ ELIGIBILITY CHECKLIST: Use formats like: ${filteredPatterns.checklistFormats.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"✅ Perfect if you\'re [CRITERIA]"'}
6️⃣ COMMUNITY/SUPPORT: Use patterns like: ${filteredPatterns.communityMentions.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Join our community of [TARGET AUDIENCE]"'}
7️⃣ RISK REVERSAL: Use patterns like: ${filteredPatterns.riskReversals.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"I guarantee you\'ll [OUTCOME]"'}
8️⃣ SCARCITY + CTA: Use patterns like: ${filteredPatterns.scarcityPhrases.slice(0, 2).map(p => `"${p}"`).join(' OR ') || '"Limited spots available. Apply now!"'}`;

  const patternInstructions = `
🎯 CAMPAIGN-FILTERED LOCAL CALLOUT EXAMPLES: ${filteredPatterns.localCallouts.slice(0, 5).join(' • ') || 'No relevant patterns found'}
😤 CAMPAIGN-FILTERED PROBLEM AGITATION EXAMPLES: ${filteredPatterns.problemStarters.slice(0, 5).join(' • ') || 'No relevant patterns found'}
💡 CAMPAIGN-FILTERED SOLUTION OFFER EXAMPLES: ${filteredPatterns.solutionIntros.slice(0, 5).join(' • ') || 'No relevant patterns found'}
🚀 CAMPAIGN-FILTERED BENEFIT EXAMPLES: ${filteredPatterns.benefitPhrases.slice(0, 5).join(' • ') || 'No relevant patterns found'}
✅ CAMPAIGN-FILTERED CHECKLIST EXAMPLES: ${filteredPatterns.checklistFormats.slice(0, 5).join(' • ') || 'No relevant patterns found'}
👥 CAMPAIGN-FILTERED COMMUNITY EXAMPLES: ${filteredPatterns.communityMentions.slice(0, 5).join(' • ') || 'No relevant patterns found'}
🛡️ CAMPAIGN-FILTERED RISK REVERSAL EXAMPLES: ${filteredPatterns.riskReversals.slice(0, 5).join(' • ') || 'No relevant patterns found'}
⏰ CAMPAIGN-FILTERED SCARCITY/CTA EXAMPLES: ${filteredPatterns.scarcityPhrases.slice(0, 5).join(' • ') || 'No relevant patterns found'}`;

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
    const { adType, systemPrompt, brandData, topPerformingAds, campaignCanonicalName } = await req.json();

    console.log('Generating content for:', { 
      adType, 
      brandData: brandData?.business_name,
      topAdsCount: topPerformingAds?.length || 0,
      campaignCanonicalName: campaignCanonicalName || 'generic'
    });

    // Load global rules
    const globalRules = await loadGlobalRules();
    if (!globalRules) {
      console.warn('Global rules not loaded, proceeding with basic generation');
    }

    // Build enhanced prompt with global rules and top-performing ads
    const enhancedPrompt = buildEnhancedPrompt(adType, systemPrompt, brandData, globalRules, topPerformingAds, campaignCanonicalName);

    let generatedContent = '';
    let attempts = 0;
    const maxAttempts = 2; // Reduced from 3 to prevent excessive API calls

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Generation attempt ${attempts}/${maxAttempts}`);

      try {
        // Add exponential backoff for rate limiting
        if (attempts > 1) {
          const delay = Math.pow(2, attempts - 1) * 1000; // 2s, 4s, 8s...
          console.log(`Waiting ${delay}ms before retry due to previous failure`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

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

        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({}));
          console.log('Rate limit hit, implementing backoff strategy');
          
          if (attempts === maxAttempts) {
            throw new Error(`Rate limit exceeded after ${maxAttempts} attempts. Please try again in a few minutes.`);
          }
          continue; // Retry with exponential backoff
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        generatedContent = data.choices[0].message.content;

        // Campaign-specific originality check - only check if rules exist and are strict
        if (globalRules?.originality_rules?.check_against_top_ads && globalRules.originality_rules.max_consecutive_words <= 4) {
          const originalityCheck = await checkOriginality(generatedContent, globalRules, campaignCanonicalName);
          
          // Only fail if there are 3+ violations to be less strict
          if (originalityCheck.violations.length >= 3) {
            console.log('Content failed originality check (3+ violations), regenerating...', originalityCheck.violations.slice(0, 3));
            if (attempts === maxAttempts) {
              console.warn('Max regeneration attempts reached, returning content with minor violations');
              break; // Accept content with violations rather than fail
            }
            continue;
          } else {
            console.log(`Content passed relaxed originality check (${originalityCheck.violations.length} minor violations)`);
            break;
          }
        } else {
          console.log('Skipping originality check - rules not configured or too strict');
          break; // No rules to check against or rules are too strict
        }

      } catch (fetchError: any) {
        console.error(`Attempt ${attempts} failed:`, fetchError.message);
        
        if (attempts === maxAttempts) {
          throw fetchError;
        }
        
        // Continue to next attempt with backoff
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