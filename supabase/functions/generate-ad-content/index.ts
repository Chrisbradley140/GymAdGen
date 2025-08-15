
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

// Enhanced Brand Data Sanitizer
function sanitizeBrandData(brandData: any) {
  if (!brandData) return brandData;
  
  const sanitizedData = { ...brandData };
  
  // Sanitize text fields for Meta policy violations
  const textFields = ['brand_words', 'words_to_avoid', 'main_problem', 'client_words', 'magic_wand_result'];
  
  textFields.forEach(field => {
    if (sanitizedData[field] && typeof sanitizedData[field] === 'string') {
      sanitizedData[field] = sanitizeText(sanitizedData[field]);
    }
  });
  
  return sanitizedData;
}

// Text sanitizer for brand data
function sanitizeText(text: string): string {
  let sanitized = text;
  
  // Replace problematic terms with compliant alternatives
  const replacements = {
    // Personal attributes
    'fat people': 'people looking to improve their health',
    'overweight people': 'people on a wellness journey',
    'broke people': 'budget-conscious individuals',
    'rich people': 'high-income earners',
    'old people': 'mature individuals',
    'young people': 'younger demographics',
    'men over 30': 'busy professionals',
    'women over 40': 'working parents',
    
    // Body shaming terms
    'ugly belly': 'stubborn midsection',
    'disgusting fat': 'unwanted weight',
    'embarrassing body': 'body confidence issues',
    
    // Unrealistic claims
    'guaranteed weight loss': 'sustainable progress',
    'miracle cure': 'effective solution',
    'instant results': 'quick progress',
    
    // Engagement bait
    'click here': 'learn more',
    'tap below': 'get started',
    'swipe up': 'discover how'
  };
  
  Object.entries(replacements).forEach(([problematic, compliant]) => {
    const regex = new RegExp(problematic, 'gi');
    sanitized = sanitized.replace(regex, compliant);
  });
  
  return sanitized;
}

// Enhanced Meta Policy Compliance Validator
function validateMetaCompliance(content: string) {
  const violations: string[] = [];
  let fixedContent = content;
  let hasViolations = false;
  let complianceScore = 100; // Start with perfect score

  // Enhanced Personal Attributes Check with more patterns
  const personalAttributePatterns = [
    // Direct age/gender references
    /(men|women|guys|girls|ladies)\s+(over|under|age)\s+\d+/gi,
    /(men|women|guys|girls|ladies)\s+(in\s+their\s+)?\d+s/gi,
    /if\s+you'?re\s+(a\s+)?(man|woman|guy|girl|senior|teen)/gi,
    
    // Extended direct personal addressing
    /this\s+is\s+for\s+you/gi,
    /you'?re\s+not\s+alone/gi,
    /you\s+(men|women|guys|girls)/gi,
    /calling\s+all\s+(men|women|guys|girls|ladies)/gi,
    /attention\s+(men|women|guys|girls|ladies)/gi,
    
    // Enhanced health/weight assumptions
    /you'?re\s+(overweight|fat|obese|skinny|underweight|out\s+of\s+shape)/gi,
    /if\s+you'?re\s+(broke|poor|rich|wealthy|struggling\s+financially)/gi,
    /you\s+(have|suffer\s+from|struggle\s+with|deal\s+with)\s+(low\s+energy|depression|anxiety|diabetes|high\s+blood\s+pressure)/gi,
    /tired\s+of\s+being\s+(fat|overweight|out\s+of\s+shape)/gi,
    
    // Extended age-specific targeting
    /for\s+(seniors|elderly|teens|teenagers|young\s+people|millennials|boomers|gen\s+x|gen\s+z)/gi,
    /(seniors|elderly|teens|teenagers|millennials|boomers)\s+(who|that|need|want)/gi,
    /if\s+you'?re\s+(over|under)\s+\d+/gi,
    
    // Enhanced engagement bait phrases
    /(tap\s+to\s+join|tap\s+below|click\s+below|swipe\s+up|comment\s+below|share\s+if\s+you\s+agree)/gi,
    /(like\s+if\s+you|tag\s+someone|double\s+tap|hit\s+follow)/gi,
    
    // Enhanced vague claims
    /(real\s+results|guaranteed\s+results|actual\s+results|proven\s+results)/gi,
    /(works\s+for\s+everyone|never\s+fails|100%\s+effective)/gi,
    
    // Income/financial status assumptions
    /if\s+you'?re\s+(making\s+less\s+than|earning\s+under|broke|wealthy)/gi,
    /for\s+those\s+(who\s+can'?t\s+afford|on\s+a\s+tight\s+budget)/gi
  ];

  personalAttributePatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains personal attribute assumptions or direct targeting");
      hasViolations = true;
      complianceScore -= 20; // Significant penalty for personal attributes
      fixedContent = fixedContent.replace(pattern, (match) => {
        const lowerMatch = match.toLowerCase();
        
        // Enhanced age/gender specific replacements
        if (lowerMatch.includes('men over') || lowerMatch.includes('guys over')) {
          return "busy professionals";
        }
        if (lowerMatch.includes('women over') || lowerMatch.includes('ladies over')) {
          return "working parents";
        }
        if (lowerMatch.includes('millennials') || lowerMatch.includes('gen z')) {
          return "young professionals";
        }
        if (lowerMatch.includes('boomers') || lowerMatch.includes('seniors')) {
          return "experienced individuals";
        }
        
        // Direct targeting replacements
        if (lowerMatch.includes('this is for you')) {
          return "this approach works when";
        }
        if (lowerMatch.includes("you're not alone")) {
          return "many people experience this";
        }
        if (lowerMatch.includes('calling all') || lowerMatch.includes('attention')) {
          return "for people who";
        }
        
        // Enhanced engagement bait replacements
        if (lowerMatch.includes('tap to join') || lowerMatch.includes('tap below')) {
          return "join now";
        }
        if (lowerMatch.includes('click below')) {
          return "start today";
        }
        if (lowerMatch.includes('comment below') || lowerMatch.includes('share if you agree')) {
          return "learn more";
        }
        if (lowerMatch.includes('like if you') || lowerMatch.includes('tag someone')) {
          return "discover how";
        }
        
        // Enhanced vague claims replacements
        if (lowerMatch.includes('real results') || lowerMatch.includes('actual results')) {
          return "tangible improvements";
        }
        if (lowerMatch.includes('guaranteed results') || lowerMatch.includes('proven results')) {
          return "sustainable progress";
        }
        if (lowerMatch.includes('works for everyone') || lowerMatch.includes('never fails')) {
          return "effective approach";
        }
        if (lowerMatch.includes('100% effective')) {
          return "highly effective";
        }
        
        // Enhanced health/weight assumptions
        if (lowerMatch.includes('overweight') || lowerMatch.includes('fat') || lowerMatch.includes('out of shape')) {
          return "looking to improve your health";
        }
        if (lowerMatch.includes('tired of being')) {
          return "ready to change your";
        }
        
        // Financial status assumptions
        if (lowerMatch.includes('broke') || lowerMatch.includes('poor') || lowerMatch.includes('tight budget')) {
          return "budget-conscious";
        }
        if (lowerMatch.includes('making less than') || lowerMatch.includes('earning under')) {
          return "looking to improve your situation";
        }
        
        // Health condition assumptions
        if (lowerMatch.includes('low energy') || lowerMatch.includes('depression') || lowerMatch.includes('anxiety')) {
          return "wellness goals";
        }
        
        // Default fallback
        return "ready to make a change";
      });
    }
  });

  // Enhanced Body Shaming Check
  const bodyShamingPatterns = [
    /ugly\s+(belly|fat|body|stomach|arms|legs)/gi,
    /disgusting\s+(fat|body|belly|weight)/gi,
    /embarrassing\s+(belly|fat|body|weight|appearance)/gi,
    /get\s+rid\s+of\s+your\s+(ugly|gross|disgusting|embarrassing)/gi,
    /hate\s+your\s+(body|belly|fat|appearance)/gi,
    /sick\s+of\s+your\s+(fat|belly|body)/gi,
    /ashamed\s+of\s+your\s+(body|weight|appearance)/gi,
    /(flabby|jiggly|saggy)\s+(arms|belly|thighs)/gi,
    /lose\s+that\s+(ugly|disgusting|embarrassing)\s+(fat|belly)/gi
  ];

  bodyShamingPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains body-shaming language");
      hasViolations = true;
      complianceScore -= 25; // Heavy penalty for body shaming
      fixedContent = fixedContent.replace(pattern, (match) => {
        const lowerMatch = match.toLowerCase();
        
        if (lowerMatch.includes('hate your') || lowerMatch.includes('sick of your')) {
          return "want to improve your";
        }
        if (lowerMatch.includes('ashamed of')) {
          return "ready to transform your";
        }
        if (lowerMatch.includes('get rid of your')) {
          return "transform your";
        }
        if (lowerMatch.includes('flabby') || lowerMatch.includes('jiggly') || lowerMatch.includes('saggy')) {
          return "tone your";
        }
        
        return "improve your";
      });
    }
  });

  // Enhanced Unrealistic Claims Check
  const unrealisticClaimsPatterns = [
    /lose\s+\d+\s+(lbs?|pounds?|kg)\s+in\s+\d+\s+(days?|weeks?)/gi,
    /guaranteed\s+(results?|weight\s+loss|success|transformation)/gi,
    /miracle\s+(cure|solution|results?|formula|method)/gi,
    /instant\s+(results?|weight\s+loss|transformation|success)/gi,
    /overnight\s+(results?|transformation|success)/gi,
    /lose\s+weight\s+without\s+(diet|exercise|effort)/gi,
    /eat\s+whatever\s+you\s+want\s+and\s+still\s+lose\s+weight/gi,
    /melt\s+fat\s+(overnight|instantly|while\s+you\s+sleep)/gi,
    /turn\s+your\s+body\s+into\s+a\s+fat[- ]burning\s+machine/gi,
    /lose\s+belly\s+fat\s+in\s+\d+\s+(days?|weeks?)/gi
  ];

  unrealisticClaimsPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains unrealistic or impossible claims");
      hasViolations = true;
      complianceScore -= 30; // Heavy penalty for unrealistic claims
      fixedContent = fixedContent.replace(pattern, (match) => {
        const lowerMatch = match.toLowerCase();
        
        if (lowerMatch.includes('guaranteed')) {
          return "sustainable";
        }
        if (lowerMatch.includes('miracle')) {
          return "effective";
        }
        if (lowerMatch.includes('instant') || lowerMatch.includes('overnight')) {
          return "quick";
        }
        if (lowerMatch.includes('without diet') || lowerMatch.includes('without exercise')) {
          return "with a simple approach";
        }
        if (lowerMatch.includes('eat whatever you want')) {
          return "enjoy your favorite foods in moderation";
        }
        if (lowerMatch.includes('melt fat')) {
          return "burn calories";
        }
        if (lowerMatch.includes('fat-burning machine')) {
          return "more efficient metabolism";
        }
        
        return "achieve sustainable results";
      });
    }
  });

  // Enhanced Sensational Content Check
  const sensationalPatterns = [
    /doctors?\s+hate\s+this/gi,
    /shocking\s+(truth|secret|discovery|revelation)/gi,
    /this\s+(weird|strange|bizarre)\s+trick/gi,
    /you\s+won't\s+believe/gi,
    /(industry|experts|professionals)\s+(don't\s+want\s+you\s+to\s+know|are\s+hiding)/gi,
    /secret\s+(that\s+)?(doctors|experts|trainers)\s+(don't\s+want\s+you\s+to\s+know|hate)/gi,
    /the\s+(shocking|disturbing|scary)\s+truth\s+about/gi,
    /what\s+the\s+(fitness|diet|health)\s+industry\s+doesn't\s+want\s+you\s+to\s+know/gi,
    /exposed[:!]\s+(the\s+)?(truth|lies|scam)/gi,
    /this\s+will\s+(shock|amaze|astound)\s+you/gi
  ];

  sensationalPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains sensational, conspiracy, or fear-based claims");
      hasViolations = true;
      complianceScore -= 15; // Moderate penalty for sensational content
      fixedContent = fixedContent.replace(pattern, (match) => {
        const lowerMatch = match.toLowerCase();
        
        if (lowerMatch.includes('doctors hate')) {
          return "this effective approach";
        }
        if (lowerMatch.includes('shocking') || lowerMatch.includes('disturbing')) {
          return "important facts about";
        }
        if (lowerMatch.includes('weird trick') || lowerMatch.includes('strange trick')) {
          return "simple method";
        }
        if (lowerMatch.includes("you won't believe")) {
          return "here's how";
        }
        if (lowerMatch.includes("don't want you to know") || lowerMatch.includes('are hiding')) {
          return "overlooked approach";
        }
        if (lowerMatch.includes('exposed')) {
          return "discover";
        }
        if (lowerMatch.includes('will shock') || lowerMatch.includes('will amaze')) {
          return "might interest";
        }
        
        return "discover this approach";
      });
    }
  });

  // Enhanced Generic AI Phrases Check (Prohibited Formats)
  const genericAIPatterns = [
    // Direct prohibited phrases
    /sound\s+familiar\?/gi,
    /let'?s\s+be\s+real[.…]/gi,
    /struggling\s+with\s+[^?]+\?/gi,
    /with\s+just\s+a\s+few\s+clicks[.…]/gi,
    /here'?s\s+the\s+thing[.…]/gi,
    /the\s+truth\s+is[.…]/gi,
    /i\s+get\s+it[.…]/gi,
    /look[,.]?\s+i\s+get\s+it/gi,
    
    // Enhanced GPT-style rhetorical patterns
    /^(but\s+)?what\s+if\s+i\s+told\s+you[.…]/gi,
    /^(the\s+)?truth\s+is[.…]/gi,
    /^(the\s+)?bottom\s+line\s+is[.…]/gi,
    /^at\s+the\s+end\s+of\s+the\s+day[.…]/gi,
    /^here'?s\s+what\s+i\s+know[.…]/gi,
    /^picture\s+this[:.]?/gi,
    /^imagine\s+if\s+you\s+could[.…]/gi,
    
    // Business jargon and overused marketing terms
    /game[- ]changer/gi,
    /unlock\s+the\s+secrets?/gi,
    /transform\s+your\s+life/gi,
    /take\s+your\s+\w+\s+to\s+the\s+next\s+level/gi,
    /revolutionary\s+(approach|method|system)/gi,
    /cutting[- ]edge\s+(technology|solution|approach)/gi,
    /industry[- ](leading|best)\s+/gi,
    /world[- ]class\s+/gi,
    /state[- ]of[- ]the[- ]art/gi,
    
    // Overused fitness/diet marketing phrases
    /melt\s+away\s+(fat|pounds)/gi,
    /torch\s+(calories|fat)/gi,
    /shred\s+(fat|weight)/gi,
    /blast\s+(belly\s+)?fat/gi,
    /supercharge\s+your\s+metabolism/gi,
    
    // AI-generated transition phrases
    /but\s+wait[,.]?\s+there'?s\s+more/gi,
    /and\s+that'?s\s+not\s+all/gi,
    /now[,.]?\s+you\s+might\s+be\s+(thinking|wondering)/gi,
    /so\s+what\s+does\s+this\s+mean\s+for\s+you\?/gi,
    
    // Double hyphen and em dash patterns (backup check)
    /--/g,
    /—/g
  ];

  const genericReplacements = {
    'sound familiar?': 'this might resonate',
    "let's be real": 'honestly',
    'struggling with': 'dealing with',
    'with just a few clicks': 'quickly and easily',
    "here's the thing": 'what matters is',
    'the truth is': 'fact is',
    'i get it': 'this is common',
    'look, i get it': 'this is understandable',
    'what if i told you': 'consider this',
    'bottom line is': 'what matters is',
    'at the end of the day': 'ultimately',
    "here's what i know": 'what works is',
    'picture this': 'imagine',
    'imagine if you could': 'what if you could',
    'game-changer': 'difference maker',
    'unlock the secrets': 'learn the methods',
    'transform your life': 'improve your routine',
    'take your': 'improve your',
    'revolutionary approach': 'effective method',
    'cutting-edge': 'modern',
    'industry-leading': 'top-quality',
    'world-class': 'high-quality',
    'state-of-the-art': 'advanced',
    'melt away': 'reduce',
    'torch calories': 'burn calories',
    'shred fat': 'lose weight',
    'blast fat': 'reduce weight',
    'supercharge your metabolism': 'boost your metabolism',
    'but wait, there\'s more': 'additionally',
    'and that\'s not all': 'plus',
    'now you might be thinking': 'you might wonder',
    'so what does this mean for you?': 'how does this help?',
    '--': '-',
    '—': '-'
  };

  genericAIPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains generic AI phrases or prohibited formats");
      hasViolations = true;
      complianceScore -= 10; // Penalty for generic AI phrases
      
      // Log detection for debugging
      console.log(`Detected generic AI phrase: ${content.match(pattern)?.[0]}`);
      
      fixedContent = fixedContent.replace(pattern, (match) => {
        const lowerMatch = match.toLowerCase().trim();
        
        // Find appropriate replacement
        for (const [phrase, replacement] of Object.entries(genericReplacements)) {
          if (lowerMatch.includes(phrase.toLowerCase())) {
            console.log(`Replacing "${match}" with "${replacement}"`);
            return replacement;
          }
        }
        
        // Enhanced fallback replacements for patterns
        if (lowerMatch.includes('struggling with')) {
          return match.replace(/struggling\s+with/gi, 'dealing with');
        }
        if (lowerMatch.includes('to the next level')) {
          return match.replace(/to\s+the\s+next\s+level/gi, 'further');
        }
        if (lowerMatch.includes('melt away') || lowerMatch.includes('torch') || lowerMatch.includes('blast')) {
          return 'reduce';
        }
        if (lowerMatch.includes('revolutionary') || lowerMatch.includes('cutting-edge')) {
          return 'effective';
        }
        if (lowerMatch.includes('supercharge')) {
          return 'boost';
        }
        
        // Default fallback
        console.log(`Using default replacement for: ${match}`);
        return "improve your approach";
      });
    }
  });

  // Determine status with compliance scoring
  let status: 'PASS' | 'FIXED' | 'FAIL';
  const confidenceThreshold = 70; // Minimum compliance score to pass
  
  if (violations.length === 0) {
    status = 'PASS';
  } else if (hasViolations && fixedContent !== content && complianceScore >= confidenceThreshold) {
    status = 'FIXED';
  } else {
    status = 'FAIL';
  }

  // Log compliance details for debugging
  console.log(`Compliance validation: ${violations.length} violations, score: ${complianceScore}/100, status: ${status}`);

  return {
    status,
    violations,
    complianceScore,
    originalText: hasViolations ? content : undefined,
    fixedText: hasViolations ? fixedContent : undefined,
    suggestions: violations.length > 0 ? [
      "Consider reviewing brand data for potentially problematic terms",
      "Use more specific, benefit-focused language",
      "Avoid direct personal attributes or assumptions",
      "Focus on outcomes rather than guarantees"
    ] : []
  };
}

// Comprehensive validation for ad captions
function validateAdCaptionStructure(content: string) {
  const errors = [];
  const warnings = [];
  let fixedContent = content;

  // Check for required sections
  const requiredSections = ['HOOK:', 'PAIN MIRROR:', 'BELIEF BREAKER:', 'CTA:'];
  const missingSections = requiredSections.filter(section => !content.includes(section));
  
  if (missingSections.length > 0) {
    errors.push(`Missing required sections: ${missingSections.join(', ')}`);
    return { isValid: false, errors, warnings, fixedContent };
  }

  // Extract sections for word count validation
  const sections = {};
  const sectionPattern = /(HOOK:|PAIN MIRROR:|BELIEF BREAKER:|CTA:)(.*?)(?=(?:HOOK:|PAIN MIRROR:|BELIEF BREAKER:|CTA:)|$)/gs;
  let match;
  
  while ((match = sectionPattern.exec(content)) !== null) {
    const sectionName = match[1].replace(':', '').trim();
    const sectionContent = match[2].trim();
    sections[sectionName] = sectionContent;
  }

  // Validate word counts for each section
  const wordCountLimits = {
    'HOOK': { min: 8, max: 15 },
    'PAIN MIRROR': { min: 20, max: 45 },
    'BELIEF BREAKER': { min: 20, max: 45 },
    'CTA': { min: 5, max: 20 }
  };

  Object.entries(sections).forEach(([sectionName, sectionContent]) => {
    const wordCount = sectionContent.split(/\s+/).filter(word => word.length > 0).length;
    const limits = wordCountLimits[sectionName];
    
    if (limits) {
      if (wordCount < limits.min) {
        errors.push(`${sectionName} too short: ${wordCount} words (minimum ${limits.min})`);
      } else if (wordCount > limits.max) {
        errors.push(`${sectionName} too long: ${wordCount} words (maximum ${limits.max})`);
      }
    }
  });

  // Count emojis (max 1 allowed)
  const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 1) {
    errors.push(`Too many emojis: ${emojiCount} found (maximum 1 allowed)`);
  }

  // Check for proper formatting (sections should be clearly labeled)
  const properlyFormattedSections = content.match(/^(HOOK:|PAIN MIRROR:|BELIEF BREAKER:|CTA:)/gm) || [];
  if (properlyFormattedSections.length !== 4) {
    warnings.push('Sections may not be properly formatted with clear labels');
  }

  // Validate language quality (basic checks)
  const complexWords = content.match(/\b\w{12,}\b/g) || [];
  if (complexWords.length > 3) {
    warnings.push(`Consider simplifying language: found ${complexWords.length} complex words`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    fixedContent,
    sections,
    wordCounts: Object.entries(sections).reduce((acc, [name, content]) => {
      acc[name] = content.split(/\s+/).filter(word => word.length > 0).length;
      return acc;
    }, {})
  };
}

// Enhanced auto-regeneration function with multi-layer validation
async function generateWithValidation(adType: string, systemPrompt: string, brandData: any, campaignContext: string, inspirationSection: string, maxAttempts = 3) {
  let attempts = 0;
  let bestAttempt = null;
  let bestValidation = null;
  let bestComplianceScore = 0;

  // Pre-process: Sanitize brand data
  const sanitizedBrandData = sanitizeBrandData(brandData);
  console.log('Brand data sanitized for Meta policy compliance');

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Generation attempt ${attempts}/${maxAttempts} for ${adType}`);

    try {
      const websiteContext = sanitizedBrandData.website_url ? 
        `\nHomepage URL: ${sanitizedBrandData.website_url}\n\nScan this homepage and extract the brand's unique selling points (USP), tone of voice, and positioning. Use these insights to shape the ad copy tone and style. If you cannot extract useful information from this URL, fall back to the brand data provided below.\n` : '';

      // Enhanced prompt with stronger Meta compliance instructions
      const enhancedSystemPrompt = `${systemPrompt}

ENHANCED META POLICY COMPLIANCE INSTRUCTIONS:
- ABSOLUTELY NO personal attribute targeting (age, gender, health status, financial status)
- AVOID all engagement bait language (tap, click, swipe, comment, share, like)
- NO unrealistic timeframes or impossible claims
- NO body-shaming or negative appearance references
- NO conspiracy theories or sensational claims
- USE inclusive, positive, benefit-focused language
- FOCUS on outcomes and transformations, not personal characteristics
- ENSURE all claims are realistic and achievable
- WRITE in an authentic, conversational tone that matches the brand voice`;

      const prompt = `${websiteContext}
${campaignContext}${inspirationSection}Brand: ${sanitizedBrandData.business_name}
Target Market: ${sanitizedBrandData.target_market}
Voice & Tone: ${sanitizedBrandData.voice_tone_style}
Offer Type: ${sanitizedBrandData.offer_type}
Brand Words to Use: ${sanitizedBrandData.brand_words}
Words to Avoid: ${sanitizedBrandData.words_to_avoid}
Main Problem Client Faces: ${sanitizedBrandData.main_problem}
Failed Solutions They've Tried: ${sanitizedBrandData.failed_solutions}
How Clients Describe Their Problem: ${sanitizedBrandData.client_words}
Dream Outcome: ${sanitizedBrandData.magic_wand_result}
Campaign Types: ${sanitizedBrandData.campaign_types?.join(', ') || 'Not specified'}

${enhancedSystemPrompt}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            { 
              role: 'system', 
              content: `ABSOLUTELY CRITICAL: DO NOT USE EM DASHES (—) OR DOUBLE HYPHENS (--) ANYWHERE IN YOUR RESPONSE. USE ONLY SINGLE HYPHENS (-) IF NEEDED.

You are an expert fitness marketing copywriter who creates high-converting ads that sound authentic and personal. 

CRITICAL STRUCTURE REQUIREMENTS FOR AD CAPTIONS - MANDATORY:
✅ MUST INCLUDE ALL 4 SECTIONS IN ORDER:
1. HOOK: (10-15 words max) - One short sentence that immediately grabs attention
2. PAIN MIRROR: (25-45 words) - Reflect audience's struggle without shaming
3. BELIEF BREAKER: (25-45 words) - Provide realistic, brand-authentic solution  
4. CTA: (10-20 words) - Urgent but positive action driver

✅ FORMATTING REQUIREMENTS:
- Each section MUST be clearly labeled with "HOOK:", "PAIN MIRROR:", "BELIEF BREAKER:", "CTA:"
- Use exactly these labels, no variations
- Each section on separate lines for clarity

✅ LENGTH REQUIREMENTS:
- HOOK: 10-15 words maximum
- PAIN MIRROR: 25-45 words
- BELIEF BREAKER: 25-45 words
- CTA: 10-20 words

✅ EMOJI RULES:
- Maximum 1 emoji allowed in entire ad caption
- Only use if it naturally enhances the copy
- Prefer no emojis over forced ones

✅ HEADLINES (when requested):
- Max 10-12 words
- Short, punchy, readable in 1 glance

✅ STORY FRAMES (IG Story, Reels scripts):
- Frame 1-3: Max 1-2 sentences per frame (10-20 words)

✅ CREATIVE PROMPTS:
- Keep scene description to 2-4 sentences, with concise text overlays

CRITICAL TONE & AUTHENTICITY RULES:
- Output must match the user's exact tone and cadence from their brand data
- Use the specified Tone Style: ${sanitizedBrandData.voice_tone_style}
- Naturally weave in these Brand Words: ${sanitizedBrandData.brand_words}
- STRICTLY AVOID these words/phrases: ${sanitizedBrandData.words_to_avoid}
- Content must sound like the actual business owner wrote it, NOT an AI or agency
- Use plain, conversational language (8th grade reading level)
- Write in first or second person as fits the brand voice
- Focus on benefits, transformation, and emotional connection

ENHANCED META ADVERTISING POLICY COMPLIANCE - ABSOLUTELY FORBIDDEN:
❌ PERSONAL ATTRIBUTES: Never directly state or imply personal attributes about the reader such as age ("Men over 30", "Millennials", "Boomers"), gender, health status ("You're overweight", "out of shape"), race, religion, or financial status ("broke", "wealthy")
❌ DIRECT TARGETING LANGUAGE: Avoid phrases like "this is for you", "you're not alone", "calling all men/women", "attention ladies/guys"
❌ ENGAGEMENT BAIT: No "Tap to join", "Tap below", "Click below", "Swipe up", "Comment below", "Share if you agree", "Like if you", "Tag someone"
❌ VAGUE CLAIMS: No "real results", "guaranteed results", "actual results", "proven results", "works for everyone", "never fails", "100% effective"
❌ UNREALISTIC CLAIMS: No impossible timeframes ("lose 30 lbs in 10 days"), guarantees, "overnight results", "instant transformation", "miracle solutions"
❌ BODY SHAMING: No negative language about appearance ("ugly belly", "disgusting fat", "embarrassing body", "hate your body", "flabby arms")
❌ SENSATIONAL CONTENT: No shocking claims ("doctors hate this"), conspiracy theories ("industry secrets", "what they don't want you to know"), fear-based tactics
❌ GENERIC AI PHRASES: No "Sound familiar?", "Here's the thing…", "Let's be real…", "I get it…", "game-changer", "unlock the secrets", "transform your life", "revolutionary approach", "cutting-edge"

FORBIDDEN ELEMENTS:
- NO em dashes (—) or double hyphens (--) - ABSOLUTELY FORBIDDEN
- NO overused fitness marketing terms: "melt fat", "torch calories", "shred weight", "blast belly fat", "supercharge metabolism"
- NO corporate marketing speak or buzzwords
- NO overly polished agency-style copy
- NO AI transition phrases: "but wait, there's more", "and that's not all", "now you might be thinking"

COMPLIANCE VALIDATION:
- Before finalizing, mentally check each sentence for Meta policy violations
- Ensure no direct personal attribute assumptions
- Verify all claims are realistic and achievable
- Confirm language is inclusive and positive
- Replace any prohibited phrases with compliant alternatives

Create compelling, conversion-focused copy that strictly follows the 4-section structure with proper labeling and word counts while maintaining complete authenticity to the brand voice AND full Meta policy compliance.`
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

      // Post-processing: Remove em dashes and double hyphens
      generatedContent = generatedContent
        .replace(/—/g, '-')
        .replace(/--/g, '-');

      // Validate structure (only for ad captions)
      let structureValidation = { isValid: true, errors: [], warnings: [] };
      if (adType === 'ad_caption') {
        structureValidation = validateAdCaptionStructure(generatedContent);
        console.log(`Structure validation for attempt ${attempts}:`, structureValidation);
      }

      // Enhanced Meta compliance validation with multi-layer checking
      const metaCompliance = validateMetaCompliance(generatedContent);
      console.log(`Meta compliance for attempt ${attempts}:`, metaCompliance.status, `Score: ${metaCompliance.complianceScore}/100`);

      // Use fixed content if available and score is acceptable
      if (metaCompliance.status === 'FIXED' && metaCompliance.complianceScore >= 70) {
        generatedContent = metaCompliance.fixedText;
        console.log('Using auto-fixed content with acceptable compliance score');
      }

      // Enhanced validation scoring
      const structureScore = structureValidation.isValid ? 100 : 0;
      const totalScore = (metaCompliance.complianceScore + structureScore) / 2;
      
      // Check if this attempt passes all validations
      const isValid = structureValidation.isValid && metaCompliance.status !== 'FAIL';
      
      if (isValid && totalScore >= 85) {
        console.log(`✅ High-quality content generated on attempt ${attempts} with score: ${totalScore}`);
        return {
          generatedContent,
          structureValidation,
          metaCompliance,
          attempts,
          success: true,
          qualityScore: totalScore
        };
      }

      // Store this attempt if it's the best so far (higher compliance score wins)
      if (!bestAttempt || metaCompliance.complianceScore > bestComplianceScore) {
        bestAttempt = generatedContent;
        bestValidation = { structureValidation, metaCompliance };
        bestComplianceScore = metaCompliance.complianceScore;
        console.log(`New best attempt with compliance score: ${bestComplianceScore}`);
      }

      console.log(`❌ Attempt ${attempts} failed validation, trying again...`);
      
    } catch (error) {
      console.error(`Error on attempt ${attempts}:`, error);
    }
  }

  // Return best attempt if no perfect match found
  console.log(`⚠️ Using best attempt after ${maxAttempts} tries`);
  return {
    generatedContent: bestAttempt,
    structureValidation: bestValidation?.structureValidation,
    metaCompliance: bestValidation?.metaCompliance,
    attempts: maxAttempts,
    success: false
  };
}

// Comprehensive validation for headlines with enhanced variety and brand keyword checks
function validateHeadlineStructure(content: string, brandData: any) {
  const errors = [];
  const warnings = [];
  const headlines = [];
  
  // Extract numbered headlines (1., 2., 3., etc.)
  const headlineMatches = content.match(/^\d+\.\s*(.+)$/gm);
  
  if (!headlineMatches || headlineMatches.length !== 5) {
    errors.push(`Expected exactly 5 headlines, found ${headlineMatches?.length || 0}`);
    return { isValid: false, errors, warnings, headlines };
  }
  
  // Process each headline
  headlineMatches.forEach((match, index) => {
    const headline = match.replace(/^\d+\.\s*/, '').trim();
    const wordCount = headline.split(/\s+/).filter(word => word.length > 0).length;
    
    headlines.push({ text: headline, wordCount, index: index + 1 });
    
    // Validate word count (under 12 words as specified)
    if (wordCount > 12) {
      errors.push(`Headline ${index + 1} too long: ${wordCount} words (maximum 12)`);
    }
    
    // Check for emojis (not allowed in headlines)
    const emojiCount = (headline.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
    if (emojiCount > 0) {
      errors.push(`Headline ${index + 1} contains emojis (not allowed in headlines)`);
    }
    
    // Check for hashtags (not allowed)
    if (headline.includes('#')) {
      errors.push(`Headline ${index + 1} contains hashtags (not allowed)`);
    }
    
    // Check for broken formatting (incomplete sentences, dangling words)
    if (headline.includes('dealing with') && headline.toLowerCase().includes('challenge helps')) {
      errors.push(`Headline ${index + 1} has broken formatting: "${headline}"`);
    }
    
    // Check for meta policy violations
    const metaViolations = [
      /proven results/gi, /guaranteed/gi, /men over \d+/gi, /women over \d+/gi,
      /tap now/gi, /click below/gi, /swipe up/gi
    ];
    
    metaViolations.forEach(pattern => {
      if (pattern.test(headline)) {
        errors.push(`Headline ${index + 1} contains Meta policy violation: "${headline}"`);
      }
    });
    
    // Check for explanatory text (should be clean headlines only)
    if (headline.includes('(') || headline.includes('[') || headline.includes(':')) {
      warnings.push(`Headline ${index + 1} may contain explanatory text - should be clean headline only`);
    }
  });
  
  // Count brand keyword usage
  const brandWords = brandData.brand_words ? brandData.brand_words.toLowerCase().split(',').map(w => w.trim()) : [];
  const commonBrandKeywords = ['diet', 'fitness', 'workout', 'nutrition', 'challenge'];
  const allBrandKeywords = [...brandWords, ...commonBrandKeywords];
  
  let brandWordUsage = 0;
  headlines.forEach(h => {
    const headlineLower = h.text.toLowerCase();
    allBrandKeywords.forEach(keyword => {
      if (headlineLower.includes(keyword)) {
        brandWordUsage++;
      }
    });
  });
  
  if (brandWordUsage > 2) {
    warnings.push(`Too many headlines use brand keywords (${brandWordUsage}/5, max recommended: 2)`);
  }
  
  // Enhanced variety validation - must include all 5 types
  const varietyCheck = {
    curiosity: headlines.filter(h => h.text.includes('?') || h.text.toLowerCase().includes('ready') || h.text.toLowerCase().includes('have you')).length,
    benefit: headlines.filter(h => 
      h.text.toLowerCase().includes('energy') || h.text.toLowerCase().includes('boost') || 
      h.text.toLowerCase().includes('feel') || h.text.toLowerCase().includes('get')
    ).length,
    urgency: headlines.filter(h => 
      h.text.toLowerCase().includes('limited') || h.text.toLowerCase().includes('spots') || 
      h.text.toLowerCase().includes('now') || h.text.toLowerCase().includes('today') ||
      h.text.toLowerCase().includes('only')
    ).length,
    problemSolution: headlines.filter(h => 
      h.text.toLowerCase().includes('tired') || h.text.toLowerCase().includes('struggling') ||
      h.text.toLowerCase().includes('dealing with') || h.text.toLowerCase().includes('frustrated')
    ).length,
    transformation: headlines.filter(h => 
      h.text.toLowerCase().includes('imagine') || h.text.toLowerCase().includes('picture') ||
      h.text.toLowerCase().includes('become') || h.text.toLowerCase().includes('transform')
    ).length
  };
  
  // Check for missing variety types
  if (varietyCheck.curiosity === 0) {
    warnings.push('Missing curiosity hook headline');
  }
  if (varietyCheck.benefit === 0) {
    warnings.push('Missing clear benefit-focused headline');
  }
  if (varietyCheck.urgency === 0) {
    warnings.push('Missing urgency/scarcity headline');
  }
  if (varietyCheck.problemSolution === 0) {
    warnings.push('Missing problem/solution headline');
  }
  if (varietyCheck.transformation === 0) {
    warnings.push('Missing transformation/lifestyle vision headline');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    headlines,
    varietyCheck,
    brandWordUsage
  };
}

// Enhanced headline generation with validation and variety requirements
async function generateHeadlinesWithValidation(systemPrompt: string, brandData: any, campaignContext: string, inspirationSection: string, maxAttempts = 3) {
  let attempts = 0;
  let bestAttempt = null;
  let bestValidation = null;

  // Enhanced system prompt for headlines with all new requirements
  const enhancedSystemPrompt = `CRITICAL HEADLINE REQUIREMENTS - MANDATORY:

✅ LENGTH & CONCISENESS:
- Each headline MUST be under 12 words for maximum impact
- Use active language and high-impact verbs
- Keep punchy and scannable

✅ REDUCE REPETITION & APPLY BRAND VOCABULARY:
- Avoid using the same keyword (e.g., "Diet") more than TWICE in the set of 5 headlines
- Use synonyms from brand_words: ${brandData.brand_words || 'nutrition plan, meal reset, fuel system, eating strategy'}
- Replace generic fitness phrases with client's brand-specific language
- Apply their unique voice instead of generic fitness terminology

✅ VARIETY OF ANGLES (MUST include all 5 types - one of each):
1. CURIOSITY HOOK: Question-based headline that sparks interest (use "?" or "Ready for...")
2. URGENCY/SCARCITY: Limited spots hook with soft language ("Spots are limited", "Only X left")
3. DIRECT BENEFIT: Clear energy/consistency/lifestyle benefit headline
4. CHALLENGE/PROBLEM-SOLUTION: Address frustration + position campaign as fix
5. LIFESTYLE VISION: End result feeling or identity transformation

✅ META-SAFE WORDING:
- NO exaggerated claims ("Proven results", "Guaranteed outcomes")
- NO personal attributes ("men over 30", "women who...")
- NO spammy CTAs ("Tap now", "Click below")
- Use realistic, believable language throughout

✅ FORMATTING & GRAMMAR:
- All headlines must be grammatically correct and complete
- NO broken lines like "dealing with Diet Challenge Helps"
- Title Case for each headline
- NO explanations, emojis, hashtags, or parentheses

✅ BRAND VOICE MATCHING:
- Match the client's voice_tone_style: ${brandData.voice_tone_style}
- Sound like something they would naturally say out loud
- Use their specific terminology and energy level
- Apply their brand words strategically across headlines

✅ COMPLIANCE & RULES:
- Must comply with Meta ad policies completely
- Avoid forbidden words: ${brandData.words_to_avoid}
- Avoid corporate buzzwords and generic fitness clichés
- Each headline should feel authentic to their specific brand

✅ FORMATTING OUTPUT:
- Numbered list (1., 2., 3., 4., 5.)
- Clean, scannable format only
- NO explanations or descriptions after headlines

${systemPrompt}

CRITICAL: Generate exactly 5 headlines covering all required variety angles. Keep under 12 words each, limit brand keyword repetition to max 2 headlines, and ensure each sounds authentically like the business owner wrote it.`;

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Headlines generation attempt ${attempts}/${maxAttempts}`);

    try {
      const websiteContext = brandData.website_url ? 
        `\nHomepage URL: ${brandData.website_url}\n\nScan this homepage and extract the brand's unique selling points (USP), tone of voice, and positioning. Use these insights to shape the headline tone and style. If you cannot extract useful information from this URL, fall back to the brand data provided below.\n` : '';

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

${enhancedSystemPrompt}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            { 
              role: 'system', 
              content: `ABSOLUTELY CRITICAL: DO NOT USE EM DASHES (—) OR DOUBLE HYPHENS (--) ANYWHERE IN YOUR RESPONSE. USE ONLY SINGLE HYPHENS (-) IF NEEDED.

You are an expert headline copywriter who creates scroll-stopping, high-converting headlines that drive clicks and engagement.

CRITICAL HEADLINE STRUCTURE REQUIREMENTS - MANDATORY:
✅ EXACTLY 5 HEADLINES in numbered format (1., 2., 3., 4., 5.)
✅ EACH HEADLINE under 12 words maximum for impact
✅ VARIETY REQUIRED - Must include all 5 types (one of each):
   1x CURIOSITY HOOK: Question-based or "Ready for..." that sparks interest
   2x URGENCY/SCARCITY: Limited spots with soft language ("Spots are limited")
   3x DIRECT BENEFIT: Clear energy/consistency/lifestyle benefit
   4x CHALLENGE/PROBLEM-SOLUTION: Address frustration + position campaign as fix
   5x LIFESTYLE VISION: End result feeling or identity transformation

✅ REDUCE REPETITION:
- Avoid using same keyword (e.g., "Diet") more than TWICE in 5 headlines
- Use brand-specific synonyms from brand_words instead of generic terms
- Apply unique brand vocabulary throughout

✅ FORMATTING REQUIREMENTS:
- Title Case for each headline
- NO explanations or descriptions
- NO emojis or hashtags
- NO parentheses or brackets
- Clean numbered list format only

✅ BRAND VOICE INTEGRATION:
- Use brand tone: ${brandData.voice_tone_style}
- Include brand words: ${brandData.brand_words}
- Avoid: ${brandData.words_to_avoid}
- Sound like the business owner, not generic copy

META ADVERTISING POLICY COMPLIANCE - ABSOLUTELY FORBIDDEN:
❌ PERSONAL ATTRIBUTES: No age, gender, health status assumptions
❌ UNREALISTIC CLAIMS: No impossible promises or timeframes
❌ BODY SHAMING: No negative appearance language
❌ ENGAGEMENT BAIT: No "click here" or similar phrases
❌ SENSATIONAL CLAIMS: No shock tactics or fear-mongering

FORBIDDEN ELEMENTS:
- NO em dashes (—) or double hyphens (--)
- NO generic phrases like "game-changer", "unlock secrets"
- NO corporate buzzwords
- NO overly polished agency-style copy

Create 5 headlines that are authentic to the brand voice, Meta-compliant, and strategically diverse to maximize appeal across different psychological triggers.`
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      let generatedContent = data.choices[0].message.content;

      // Post-processing: Remove em dashes and double hyphens
      generatedContent = generatedContent
        .replace(/—/g, '-')
        .replace(/--/g, '-');

      // Validate headline structure
      const headlineValidation = validateHeadlineStructure(generatedContent, brandData);
      console.log(`Headline validation for attempt ${attempts}:`, headlineValidation);

      // Meta compliance validation
      const metaCompliance = validateMetaCompliance(generatedContent);
      console.log(`Meta compliance for attempt ${attempts}:`, metaCompliance.status);

      // Use fixed content if available
      if (metaCompliance.status === 'FIXED') {
        generatedContent = metaCompliance.fixedText;
      }

      // Check if this attempt passes all validations
      const isValid = headlineValidation.isValid && metaCompliance.status !== 'FAIL';
      
      if (isValid) {
        console.log(`✅ Headlines generation successful on attempt ${attempts}`);
        return {
          generatedContent,
          headlineValidation,
          metaCompliance,
          attempts,
          success: true
        };
      }

      // Save best attempt (prioritize structure over meta compliance)
      if (!bestAttempt || (headlineValidation.isValid && !bestValidation?.headlineValidation?.isValid)) {
        bestAttempt = generatedContent;
        bestValidation = { headlineValidation, metaCompliance };
      }

      console.log(`❌ Headlines attempt ${attempts} failed validation, trying again...`);
      
    } catch (error) {
      console.error(`Error on headlines attempt ${attempts}:`, error);
    }
  }

  // Return best attempt if no perfect match found
  console.log(`⚠️ Using best headlines attempt after ${maxAttempts} tries`);
  return {
    generatedContent: bestAttempt,
    headlineValidation: bestValidation?.headlineValidation,
    metaCompliance: bestValidation?.metaCompliance,
    attempts: maxAttempts,
    success: false
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

    // Use enhanced generation with validation for ad captions
    if (adType === 'ad_caption') {
      const result = await generateWithValidation(adType, systemPrompt, brandData, campaignContext, inspirationSection);
      
      console.log(`Generation completed after ${result.attempts} attempts. Success: ${result.success}`);
      
      return new Response(JSON.stringify({ 
        generatedContent: result.generatedContent,
        metaCompliance: result.metaCompliance,
        structureValidation: result.structureValidation,
        validationAttempts: result.attempts,
        generationSuccess: result.success
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use enhanced generation with validation for headline options
    if (adType === 'headline_options') {
      const result = await generateHeadlinesWithValidation(systemPrompt, brandData, campaignContext, inspirationSection);
      
      console.log(`Headlines generation completed after ${result.attempts} attempts. Success: ${result.success}`);
      
      return new Response(JSON.stringify({ 
        generatedContent: result.generatedContent,
        metaCompliance: result.metaCompliance,
        headlineValidation: result.headlineValidation,
        validationAttempts: result.attempts,
        generationSuccess: result.success
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fallback to original generation for other content types
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

CRITICAL LENGTH REQUIREMENTS - MANDATORY:
✅ AD CAPTIONS:
- Hook: 1-2 short sentences (aim for ~15-25 words total)
- Pain Mirror: 2-3 sentences (~30-45 words)
- Belief Breaker: 2-3 sentences (~30-45 words)
- CTA: 1 sentence or short phrase (5-12 words)

✅ HEADLINES:
- Max ~10-12 words
- Short, punchy, readable in 1 glance

✅ STORY FRAMES (IG Story, Reels scripts):
- Frame 1-3: Max 1-2 sentences per frame (~10-20 words)

✅ CREATIVE PROMPTS:
- Keep scene description to 2-4 sentences, with concise text overlays

CRITICAL TONE & AUTHENTICITY RULES:
- Output must match the user's exact tone and cadence from their brand data
- Use the specified Tone Style: ${brandData.voice_tone_style}
- Naturally weave in these Brand Words: ${brandData.brand_words}
- STRICTLY AVOID these words/phrases: ${brandData.words_to_avoid}
- Sentence style should match their voice (short/punchy vs. longer explanatory)
- Content must sound like the actual business owner wrote it, NOT an AI or agency

CRITICAL AD CAPTION ADJUSTMENTS - MANDATORY:
✅ DEMOGRAPHIC REFERENCES: Remove or rewrite direct references like "Men over 30" or "Guys" to be implied, not stated (e.g., "Built for busy professionals")
✅ SPECIFIC BENEFITS: Replace vague claims like "real results" with specific, believable benefits tied to energy, routine, or lifestyle (e.g., "feel more energetic and consistent in your workouts")
✅ SAFE CTAS: Avoid "Tap to join", "Tap below" or similar engagement-bait phrases. Use safe CTAs like "Join now", "Start today", "Learn more today", or "Get started now"
✅ LOWERCASE DIET: Always lowercase "diet" unless the brand voice rules say it's capitalized
✅ UNIQUE LANGUAGE: Replace generic fitness phrases like "cardio gets old" with unique language that reflects the client's brand_words input
✅ STRUCTURE: Keep the HOOK → PAIN MIRROR → BELIEF BREAKER → CTA structure intact, but ensure each section reads like something the user would naturally say out loud

META ADVERTISING POLICY COMPLIANCE - ABSOLUTELY FORBIDDEN:
❌ PERSONAL ATTRIBUTES: Never directly state or imply personal attributes about the reader such as age ("Men over 30", "Guys over 30"), gender, health status ("You're overweight"), race, religion, or financial status ("If you're broke")
❌ DIRECT TARGETING LANGUAGE: Avoid phrases like "this is for you", "you're not alone", or any language that assumes personal characteristics
❌ ENGAGEMENT BAIT: No "Tap to join", "Tap below", "Click below", "Swipe up" or similar engagement-bait phrases
❌ VAGUE CLAIMS: No "real results", "guaranteed results", "actual results" - use specific, believable benefits instead
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
