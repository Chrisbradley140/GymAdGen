
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
    /(seniors|elderly|teens|teenagers)\s+(who|that)/gi,
    
    // Engagement bait phrases
    /(tap\s+to\s+join|tap\s+below|click\s+below|swipe\s+up)/gi,
    
    // Vague claims
    /(real\s+results|guaranteed\s+results|actual\s+results)/gi
  ];

  personalAttributePatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains personal attribute assumptions or direct targeting");
      hasViolations = true;
      fixedContent = fixedContent.replace(pattern, (match) => {
        // Age/gender specific replacements
        if (match.toLowerCase().includes('men over') || match.toLowerCase().includes('guys over')) {
          return "busy professionals";
        }
        if (match.toLowerCase().includes('women over') || match.toLowerCase().includes('ladies over')) {
          return "working parents";
        }
        if (match.toLowerCase().includes('this is for you')) {
          return "this approach works when";
        }
        if (match.toLowerCase().includes("you're not alone")) {
          return "many people experience this";
        }
        // Engagement bait replacements
        if (match.toLowerCase().includes('tap to join') || match.toLowerCase().includes('tap below')) {
          return "join now";
        }
        if (match.toLowerCase().includes('click below')) {
          return "start today";
        }
        // Vague claims replacements
        if (match.toLowerCase().includes('real results')) {
          return "more energy and consistency";
        }
        if (match.toLowerCase().includes('guaranteed results')) {
          return "sustainable progress";
        }
        if (match.toLowerCase().includes('actual results')) {
          return "tangible improvements";
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

  // Generic AI Phrases Check (Prohibited Formats)
  const genericAIPatterns = [
    // Direct prohibited phrases
    /sound\s+familiar\?/gi,
    /let'?s\s+be\s+real[.…]/gi,
    /struggling\s+with\s+[^?]+\?/gi,
    /with\s+just\s+a\s+few\s+clicks[.…]/gi,
    /here'?s\s+the\s+thing[.…]/gi,
    
    // GPT-style rhetorical patterns
    /^(but\s+)?what\s+if\s+i\s+told\s+you[.…]/gi,
    /^(the\s+)?truth\s+is[.…]/gi,
    /^(the\s+)?bottom\s+line\s+is[.…]/gi,
    /^at\s+the\s+end\s+of\s+the\s+day[.…]/gi,
    /game[- ]changer/gi,
    /unlock\s+the\s+secrets?/gi,
    /transform\s+your\s+life/gi,
    /take\s+your\s+\w+\s+to\s+the\s+next\s+level/gi,
    
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
    'what if i told you': 'consider this',
    'truth is': 'fact is',
    'bottom line is': 'what matters is',
    'at the end of the day': 'ultimately',
    'game-changer': 'difference maker',
    'unlock the secrets': 'learn the methods',
    'transform your life': 'improve your routine',
    'take your': 'improve your',
    '--': '-',
    '—': '-'
  };

  genericAIPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      violations.push("Contains generic AI phrases or prohibited formats");
      hasViolations = true;
      
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
        
        // Fallback replacements for patterns
        if (lowerMatch.includes('struggling with')) {
          return match.replace(/struggling\s+with/gi, 'dealing with');
        }
        if (lowerMatch.includes('to the next level')) {
          return match.replace(/to\s+the\s+next\s+level/gi, 'further');
        }
        
        // Default fallback
        console.log(`Using default replacement for: ${match}`);
        return "improve your approach";
      });
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

// Auto-regeneration function with validation
async function generateWithValidation(adType: string, systemPrompt: string, brandData: any, campaignContext: string, inspirationSection: string, maxAttempts = 3) {
  let attempts = 0;
  let bestAttempt = null;
  let bestValidation = null;

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Generation attempt ${attempts}/${maxAttempts} for ${adType}`);

    try {
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
- Use the specified Tone Style: ${brandData.voice_tone_style}
- Naturally weave in these Brand Words: ${brandData.brand_words}
- STRICTLY AVOID these words/phrases: ${brandData.words_to_avoid}
- Content must sound like the actual business owner wrote it, NOT an AI or agency
- Use plain, conversational language (8th grade reading level)
- Write in first or second person as fits the brand voice
- Focus on benefits, transformation, and emotional connection

META ADVERTISING POLICY COMPLIANCE - ABSOLUTELY FORBIDDEN:
❌ PERSONAL ATTRIBUTES: Never directly state or imply personal attributes about the reader such as age ("Men over 30"), gender, health status ("You're overweight"), race, religion, or financial status
❌ DIRECT TARGETING LANGUAGE: Avoid phrases like "this is for you", "you're not alone"
❌ ENGAGEMENT BAIT: No "Tap to join", "Tap below", "Click below", "Swipe up"
❌ VAGUE CLAIMS: No "real results", "guaranteed results", "actual results" - use specific, believable benefits
❌ UNREALISTIC CLAIMS: No impossible timeframes or guarantees
❌ BODY SHAMING: No negative language about appearance or self-worth
❌ SENSATIONAL CONTENT: No shocking claims or fear-based tactics

FORBIDDEN ELEMENTS:
- NO em dashes (—) or double hyphens (--) - ABSOLUTELY FORBIDDEN
- NO generic AI phrases like: "Sound familiar?", "Here's the thing…", "game-changer", "unlock the secrets", "transform your life"
- NO corporate marketing speak or buzzwords
- NO overly polished agency-style copy

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

      // Meta compliance validation
      const metaCompliance = validateMetaCompliance(generatedContent);
      console.log(`Meta compliance for attempt ${attempts}:`, metaCompliance.status);

      // Use fixed content if available
      if (metaCompliance.status === 'FIXED') {
        generatedContent = metaCompliance.fixedText;
      }

      // Check if this attempt passes all validations
      const isValid = structureValidation.isValid && metaCompliance.status !== 'FAIL';
      
      if (isValid) {
        console.log(`✅ Generation successful on attempt ${attempts}`);
        return {
          generatedContent,
          structureValidation,
          metaCompliance,
          attempts,
          success: true
        };
      }

      // Save best attempt (prioritize structure over meta compliance)
      if (!bestAttempt || (structureValidation.isValid && !bestValidation?.structureValidation?.isValid)) {
        bestAttempt = generatedContent;
        bestValidation = { structureValidation, metaCompliance };
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

// Comprehensive validation for headlines
function validateHeadlineStructure(content: string) {
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
    
    // Validate word count (5-9 words for readability)
    if (wordCount < 5) {
      errors.push(`Headline ${index + 1} too short: ${wordCount} words (minimum 5)`);
    } else if (wordCount > 9) {
      errors.push(`Headline ${index + 1} too long: ${wordCount} words (maximum 9)`);
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
    
    // Check for explanatory text (should be Title Case without explanations)
    if (headline.includes('(') || headline.includes('[') || headline.includes(':')) {
      warnings.push(`Headline ${index + 1} may contain explanatory text - should be clean headline only`);
    }
  });
  
  // Validate variety of angles (check for different types)
  const headlineTypes = {
    question: headlines.filter(h => h.text.includes('?')).length,
    transformation: headlines.filter(h => h.text.toLowerCase().includes('transform') || h.text.toLowerCase().includes('become') || h.text.toLowerCase().includes('get')).length,
    urgency: headlines.filter(h => h.text.toLowerCase().includes('now') || h.text.toLowerCase().includes('today') || h.text.toLowerCase().includes('limited') || h.text.toLowerCase().includes('spots')).length
  };
  
  if (headlineTypes.question === 0) {
    warnings.push('Missing question-based headline for curiosity hook');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    headlines,
    varietyCheck: headlineTypes
  };
}

// Enhanced headline generation with validation and variety requirements
async function generateHeadlinesWithValidation(systemPrompt: string, brandData: any, campaignContext: string, inspirationSection: string, maxAttempts = 3) {
  let attempts = 0;
  let bestAttempt = null;
  let bestValidation = null;

  // Enhanced system prompt for headlines with variety requirements
  const enhancedSystemPrompt = `CRITICAL HEADLINE REQUIREMENTS - MANDATORY:

✅ LENGTH & PUNCH:
- Each headline MUST be 5-9 words maximum for fast readability
- Use active language and high-impact verbs
- Keep punchy and scannable

✅ VARIETY OF ANGLES (MUST include all 5 types in each set):
1. Question-based headline (curiosity hook - use "?" to create intrigue)
2. Benefit-focused headline (specific, tangible benefit - what they get)
3. Urgency/scarcity headline (limited spots, deadlines, seasonal tie-in)
4. Problem/solution headline (calls out pain point + offers fix)
5. Transformation headline (believable, positive outcome)

✅ COMPLIANCE & RULES:
- Must comply with Meta ad policies (no personal attributes, no body shaming, no unrealistic promises)
- Avoid forbidden brand words: ${brandData.words_to_avoid}
- Avoid corporate buzzwords and clichés
- Use brand-specific words: ${brandData.brand_words}

✅ BRAND PERSONALIZATION:
- Naturally weave in the brand's tone: ${brandData.voice_tone_style}
- Keep brand personality consistent with campaign type
- Match the business voice and terminology

✅ TOP-PERFORMER INSPIRATION:
- Use the pacing, emotional hooks, and concise style from top performing ads
- Maintain freshness so repeated generations don't feel formulaic
- Focus on what makes headlines convert, not just what sounds good

✅ FORMATTING:
- Output as a numbered list (1., 2., 3., 4., 5.)
- Each headline in Title Case
- NO explanations, NO emojis, NO hashtags
- Clean, scannable format only

${systemPrompt}

CRITICAL: Generate exactly 5 headlines that cover all required variety angles. Each must be 5-9 words and follow the brand voice while being Meta-compliant.`;

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
✅ EACH HEADLINE 5-9 words maximum
✅ VARIETY REQUIRED - Must include:
   1x Question-based (curiosity) - use "?" 
   1x Benefit-focused (tangible result)
   1x Urgency/scarcity (time/spots limited)
   1x Problem/solution (pain + fix)
   1x Transformation (believable outcome)

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
      const headlineValidation = validateHeadlineStructure(generatedContent);
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
