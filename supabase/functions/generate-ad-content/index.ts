
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Meta Ads policy violation patterns
const PRIVACY_VIOLATION_PATTERNS = {
  // Personal Attributes Violations
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
  ],
  
  // Health & Wellness Violations
  bodyShaming: [
    /\b(perfect\s+body|ideal\s+body|dream\s+body|body\s+goals)\b/gi,
    /\b(ugly|fat|skinny|flabby|gross|disgusting)\b/gi,
    /\b(hate\s+your\s+body|dissatisfied\s+with|embarrassed\s+about|ashamed\s+of)\b/gi,
    /\b(get\s+rid\s+of\s+fat|melt\s+away\s+fat|blast\s+belly\s+fat)\b/gi,
    /\b(lose\s+weight\s+fast|quick\s+fix|instant\s+results|miracle\s+cure)\b/gi
  ],
  negativeSelfPerception: [
    /\b(not\s+good\s+enough|feel\s+bad\s+about|insecure|self-conscious)\b/gi,
    /\b(fix\s+your|correct\s+your|improve\s+your\s+flaws)\b/gi,
    /\b(summer\s+body|beach\s+ready|bikini\s+body)\b/gi,
    /\b(hide\s+your|cover\s+up|disguise)\b/gi,
    /\b(transform\s+your\s+life|change\s+everything|new\s+you)\b/gi
  ],
  weightLossViolations: [
    /\b(before\s+and\s+after|side.by.side|transformation)\s+(weight\s+loss|diet)/gi,
    /\b(pinch|grab|squeeze|close.up)\s+(fat|belly|skin)/gi,
    /\b(dramatic\s+weight\s+loss|instant\s+weight\s+loss|effortless\s+weight\s+loss)/gi,
    /\b(comparison|before.after)\s+(photo|image|picture)/gi
  ],
  cosmeticViolations: [
    /\b(before\s+and\s+after|side.by.side)\s+(botox|filler|anti.aging|wrinkle|cosmetic)/gi,
    /\b(skin\s+whitening|skin\s+bleaching|lighten\s+skin|whiten\s+skin)/gi,
    /\b(permanent\s+skin\s+color\s+change)/gi,
    /\b(transformation|dramatic\s+change)\s+(cosmetic|surgery|procedure)/gi,
    /\b(comparison|before.after)\s+(treatment|procedure|surgery)/gi
  ],
  adultProducts: [
    /\b(sex\s+toy|erotic|fetish|adult\s+entertainment)\b/gi,
    /\b(strip\s+club|adult\s+cinema|sexual\s+fantasy|tantric)\b/gi,
    /\b(sexual\s+pleasure|sexual\s+enhancement|orgasmic\s+therapy)\b/gi,
    /\b(g.spot|penis\s+enlargement|genital\s+enhancement)\b/gi,
    /\b(adult\s+services|escort|prostitution)\b/gi
  ],
  sexualArousal: [
    /\b(sexual\s+arousal|sexual\s+stimulation|aphrodisiac)\b/gi,
    /\b(enhance\s+pleasure|increase\s+libido|boost\s+performance)\b/gi,
    /\b(erotic\s+novel|sexual\s+costume|fetish\s+item)\b/gi,
    /\b(sexual\s+satisfaction|sexual\s+desire|intimate\s+pleasure)\b/gi
  ],
  ageTargetingHealth: [
    /\b(weight\s+loss|diet|cosmetic|surgery)\b(?!.*\b(18\+|adults?\s+only|over\s+18)\b)/gi,
    /\b(anti.aging|botox|filler|procedure)\b(?!.*\b(18\+|adults?\s+only|over\s+18)\b)/gi
  ],
  
  // Sensational Content Violations
  sensationalContent: [
    /\b(shocking|outrageous|unbelievable|incredible|mind-blowing|jaw-dropping)\b/gi,
    /\b(you\s+won't\s+believe|shocking\s+truth|secret\s+they\s+don't\s+want|doctors\s+hate|exposed)\b/gi,
    /\b(violence|violent|blood|gore|graphic|disturbing|traumatic)\b/gi,
    /\b(fear|panic|terror|horrific|nightmare|disaster|catastrophe)\b/gi,
    /\b(clickbait|sensational|inflammatory|exploitative|manipulative)\b/gi,
    /\b(shocking\s+results|mind-blowing\s+transformation|unbelievable\s+change)\b/gi
  ],
  
  // Restricted Industries
  cryptocurrency: [
    /\b(bitcoin|cryptocurrency|crypto|blockchain|NFT|digital\s+currency|virtual\s+currency)\b/gi,
    /\b(mining|wallet|exchange|trading|investment|profit|gains)\s+(crypto|bitcoin|digital\s+currency)\b/gi,
    /\b(cryptocurrency\s+investment|crypto\s+trading|blockchain\s+technology)\b/gi
  ],
  dating: [
    /\b(dating|match|relationship|romance|love|singles|hookup|affair)\b/gi,
    /\b(find\s+love|meet\s+singles|dating\s+app|dating\s+site|romantic\s+connection)\b/gi,
    /\b(soulmate|perfect\s+match|true\s+love|relationship\s+goals)\b/gi
  ],
  gambling: [
    /\b(gambling|casino|poker|slots|betting|lottery|jackpot|odds)\b/gi,
    /\b(win\s+money|easy\s+money|guaranteed\s+win|betting\s+system|gambling\s+system)\b/gi,
    /\b(online\s+casino|sports\s+betting|poker\s+room|slot\s+machine)\b/gi
  ],
  alcohol: [
    /\b(beer|wine|vodka|whiskey|alcohol|drinking|bar|pub|brewery)\b/gi,
    /\b(get\s+drunk|party|celebration|toast|cocktail|spirits|alcoholic\s+beverage)\b/gi,
    /\b(wine\s+tasting|brewery\s+tour|cocktail\s+hour|happy\s+hour)\b/gi
  ],
  political: [
    /\b(election|vote|candidate|politician|government|policy|political|democracy)\b/gi,
    /\b(liberal|conservative|republican|democrat|politics|campaign|voting)\b/gi,
    /\b(social\s+issues|political\s+activism|government\s+policy)\b/gi
  ],
  addiction: [
    /\b(addiction|rehab|recovery|detox|substance\s+abuse|drug\s+treatment|alcohol\s+treatment)\b/gi,
    /\b(sober|sobriety|withdrawal|addiction\s+recovery|treatment\s+center|rehabilitation)\b/gi,
    /\b(drug\s+addiction|alcohol\s+addiction|substance\s+dependency)\b/gi
  ]
};

// Comprehensive content classification patterns
const CONTENT_CLASSIFICATION_PATTERNS = {
  // Health & Wellness
  weightLoss: [
    /\b(weight\s+loss|diet|lose\s+weight|slim|slimming|fat\s+burn|metabolism)\b/gi,
    /\b(supplements?|pills?|diet\s+plan|nutrition|calories)\b/gi
  ],
  cosmetic: [
    /\b(cosmetic|surgery|procedure|botox|filler|anti.aging|wrinkle)\b/gi,
    /\b(breast|nose|face|skin|laser|injection|enhancement)\b/gi,
    /\b(augmentation|reduction|lift|tuck|rejuvenation)\b/gi
  ],
  reproductiveHealth: [
    /\b(contraceptive|condom|birth\s+control|family\s+planning|fertility)\b/gi,
    /\b(reproductive|sexual\s+health|erectile|premature|menopause)\b/gi,
    /\b(ivf|vasectomy|circumcision|vaginoplasty)\b/gi
  ],
  adultProducts: [
    /\b(adult|sexual|erotic|intimate|pleasure)\b/gi,
    /\b(toy|enhancement|arousal|stimulation)\b/gi
  ],
  
  // Restricted Industries
  cryptocurrency: [
    /\b(bitcoin|cryptocurrency|crypto|blockchain|NFT|digital\s+currency|virtual\s+currency)\b/gi,
    /\b(mining|wallet|exchange|trading|investment)\s+(crypto|bitcoin|digital\s+currency)\b/gi
  ],
  dating: [
    /\b(dating|match|relationship|romance|love|singles|hookup)\b/gi,
    /\b(find\s+love|meet\s+singles|dating\s+app|dating\s+site)\b/gi
  ],
  gambling: [
    /\b(gambling|casino|poker|slots|betting|lottery|jackpot)\b/gi,
    /\b(win\s+money|easy\s+money|guaranteed\s+win|betting\s+system)\b/gi
  ],
  alcohol: [
    /\b(beer|wine|vodka|whiskey|alcohol|drinking|bar|pub|brewery)\b/gi,
    /\b(alcoholic\s+beverage|wine\s+tasting|brewery\s+tour)\b/gi
  ],
  political: [
    /\b(election|vote|candidate|politician|government|policy|political)\b/gi,
    /\b(liberal|conservative|republican|democrat|politics|campaign)\b/gi
  ],
  addiction: [
    /\b(addiction|rehab|recovery|detox|substance\s+abuse|drug\s+treatment)\b/gi,
    /\b(sober|sobriety|withdrawal|addiction\s+recovery|treatment\s+center)\b/gi
  ]
};

// Comprehensive content classification helper
const classifyAdContent = (content: string): { 
  contentTypes: string[];
  restrictedIndustries: string[];
  approvalRequired: string[];
  recommendations: string[];
} => {
  const contentTypes: string[] = [];
  const restrictedIndustries: string[] = [];
  const approvalRequired: string[] = [];
  const recommendations: string[] = [];
  
  Object.entries(CONTENT_CLASSIFICATION_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        if (!contentTypes.includes(category)) {
          contentTypes.push(category);
          
          // Add industry-specific recommendations and approval requirements
          switch (category) {
            case 'cryptocurrency':
              restrictedIndustries.push(category);
              approvalRequired.push('Requires special authorization from Meta');
              recommendations.push('Focus on educational content rather than investment opportunities');
              break;
            case 'dating':
              restrictedIndustries.push(category);
              approvalRequired.push('Must comply with dating service policies');
              recommendations.push('Avoid personal attribute targeting and focus on general relationship benefits');
              break;
            case 'gambling':
              restrictedIndustries.push(category);
              approvalRequired.push('Requires gambling advertising authorization');
              recommendations.push('Must include responsible gambling messaging and age restrictions');
              break;
            case 'alcohol':
              restrictedIndustries.push(category);
              approvalRequired.push('Must target 21+ and follow alcohol advertising guidelines');
              recommendations.push('Focus on taste, craftsmanship, and social aspects rather than intoxication');
              break;
            case 'political':
              restrictedIndustries.push(category);
              approvalRequired.push('Requires authorization for social issues, elections or politics');
              recommendations.push('Must include disclaimer about who paid for the ad');
              break;
            case 'addiction':
              restrictedIndustries.push(category);
              approvalRequired.push('Requires authorization for addiction treatment services');
              recommendations.push('Focus on hope, recovery, and professional treatment options');
              break;
            case 'weightLoss':
            case 'cosmetic':
            case 'reproductiveHealth':
            case 'adultProducts':
              approvalRequired.push('Must target 18+ audiences for health and wellness content');
              recommendations.push('Emphasize health benefits and realistic expectations');
              break;
          }
        }
      }
    });
  });
  
  return {
    contentTypes,
    restrictedIndustries,
    approvalRequired,
    recommendations
  };
};

// Enhanced comprehensive policy compliance checker
const checkMetaAdsCompliance = (content: string): { 
  isCompliant: boolean; 
  violations: string[]; 
  contentClassification: {
    contentTypes: string[];
    restrictedIndustries: string[];
    approvalRequired: string[];
    recommendations: string[];
  };
  suggestions: string[];
} => {
  const violations: string[] = [];
  const suggestions: string[] = [];
  const contentClassification = classifyAdContent(content);
  
  // Check for policy violations
  Object.entries(PRIVACY_VIOLATION_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        violations.push(`${category}: "${matches[0]}" - violates Meta Ads policy`);
        
        // Add category-specific suggestions
        switch (category) {
          case 'bodyShaming':
          case 'negativeSelfPerception':
            suggestions.push('Replace with body-positive language focusing on health benefits and realistic outcomes');
            break;
          case 'weightLossViolations':
            suggestions.push('Remove before/after comparisons and focus on the journey and process instead');
            break;
          case 'cosmeticViolations':
            suggestions.push('Emphasize health benefits and realistic expectations without dramatic comparisons');
            break;
          case 'adultProducts':
          case 'sexualArousal':
            suggestions.push('Focus on health and medical benefits rather than pleasure or enhancement');
            break;
          case 'ageTargetingHealth':
            suggestions.push('Ensure proper age targeting (18+) for health and wellness products');
            break;
          case 'sensationalContent':
            suggestions.push('Use factual, non-sensational language that doesn\'t rely on shock value');
            break;
          case 'cryptocurrency':
            suggestions.push('Focus on educational content and obtain proper authorization from Meta');
            break;
          case 'dating':
            suggestions.push('Avoid personal attribute targeting and focus on general relationship benefits');
            break;
          case 'gambling':
            suggestions.push('Include responsible gambling messaging and ensure proper licensing');
            break;
          case 'alcohol':
            suggestions.push('Target appropriate age groups (21+) and focus on taste/craftsmanship');
            break;
          case 'political':
            suggestions.push('Include proper disclaimers and obtain authorization for political content');
            break;
          case 'addiction':
            suggestions.push('Focus on hope, recovery, and professional treatment with proper authorization');
            break;
          default:
            suggestions.push('Review content to ensure compliance with Meta Ads policies');
        }
      }
    });
  });
  
  // Add general suggestions for restricted industries
  if (contentClassification.restrictedIndustries.length > 0) {
    suggestions.push('This content appears to be in a restricted industry. Special approval may be required.');
    contentClassification.recommendations.forEach(rec => {
      if (!suggestions.includes(rec)) {
        suggestions.push(rec);
      }
    });
  }
  
  return {
    isCompliant: violations.length === 0,
    violations,
    contentClassification,
    suggestions
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

    // Pre-generation comprehensive compliance check on brand data
    const brandDataText = `${brandData.target_market} ${brandData.main_problem} ${brandData.client_words} ${brandData.magic_wand_result}`;
    const preCheck = checkMetaAdsCompliance(brandDataText);
    
    if (!preCheck.isCompliant) {
      console.warn('Brand data contains potential policy violations:', preCheck.violations);
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

HEALTH & WELLNESS POLICY COMPLIANCE - ABSOLUTELY CRITICAL:
- BODY POSITIVE MESSAGING: Never use body-shaming language or promote "perfect body" ideals
- NO NEGATIVE SELF-PERCEPTION: Avoid phrases like "hate your body", "fix your flaws", "embarrassed about"
- WEIGHT LOSS RESTRICTIONS: No before/after comparisons, no fat-pinching imagery, no "instant results" claims
- COSMETIC PROCEDURE RESTRICTIONS: No dramatic transformation comparisons, no skin whitening/bleaching
- AGE TARGETING: All health/wellness content must target 18+ audiences
- ADULT PRODUCTS: Focus on health benefits, not sexual pleasure or enhancement
- REALISTIC EXPECTATIONS: Emphasize health benefits and realistic timelines, not dramatic transformations
- POSITIVE ALTERNATIVES: Use empowering, health-focused language that builds confidence

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

    // Post-generation comprehensive compliance check
    const postCheck = checkMetaAdsCompliance(generatedContent);
    
    if (!postCheck.isCompliant) {
      console.error('Generated content violates Meta Ads policy:', postCheck.violations);
      
      // Enhanced retry with comprehensive compliance prompts
      const stricterPrompt = `${prompt}

CRITICAL: The previous generation contained Meta Ads policy violations. 
REGENERATE ensuring ZERO violations across all policy areas:
- NO personal attribute assertions or implications
- NO sensational, shocking, or clickbait language
- NO restricted industry content without proper compliance
- Focus ONLY on product benefits and general audience needs.

SPECIFIC VIOLATIONS TO AVOID: ${postCheck.violations.join(', ')}
COMPLIANCE SUGGESTIONS: ${postCheck.suggestions.join(', ')}`;

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

COMPREHENSIVE META ADS POLICY COMPLIANCE - ABSOLUTELY CRITICAL:
- PERSONAL ATTRIBUTES: NEVER assert or imply personal attributes about the audience
- SENSATIONAL CONTENT: Avoid shocking, sensational, inflammatory or excessively violent content
- HEALTH & WELLNESS: Use body-positive language, realistic expectations, age-appropriate targeting (18+)
- RESTRICTED INDUSTRIES: Follow special requirements for crypto, dating, gambling, alcohol, political content
- FOCUS ON: Product benefits, general audience needs, factual information without violations

FORBIDDEN ELEMENTS:
- NO em dashes (—) or double hyphens (--) - ABSOLUTELY FORBIDDEN
- NO personal attribute assertions ("Are you [condition]?", "Meet [demographic] singles")
- NO sensational language ("shocking", "unbelievable", "mind-blowing")
- NO body-shaming or negative self-perception language
- NO before/after comparisons for weight loss or cosmetic procedures
- NO generic AI phrases or corporate marketing speak

AUTHENTICITY REQUIREMENTS:
- Write in first person when appropriate (I, we, my, our)
- Use the exact language and terminology the business owner would use
- Match their energy level and personality
- Include specific details about their offer and approach
- Sound conversational and genuine, not scripted
- Reflect their actual expertise and experience

Create compelling, conversion-focused copy that speaks directly to the target audience while maintaining complete compliance with ALL Meta Ads policies.` 
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
        
        // Final comprehensive compliance check
        const finalCheck = checkMetaAdsCompliance(generatedContent);
        if (!finalCheck.isCompliant) {
          console.error('Retry still contains violations:', finalCheck.violations);
          return new Response(JSON.stringify({ 
            error: 'Generated content still violates Meta Ads policies after retry. Please review brand data and try again.',
            violations: finalCheck.violations,
            suggestions: finalCheck.suggestions,
            contentClassification: finalCheck.contentClassification
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          console.log('Successfully regenerated compliant content after retry');
        }
      }
    }

    // Post-processing: Remove em dashes and double hyphens as a safety net
    generatedContent = generatedContent
      .replace(/—/g, '-')  // Replace em dashes with regular hyphens
      .replace(/--/g, '-'); // Replace double hyphens with single hyphens

    console.log(`Successfully generated ${adType} content - Meta Ads compliant: ${postCheck.isCompliant}`);
    console.log('Content classification:', postCheck.contentClassification);

    return new Response(JSON.stringify({ 
      generatedContent,
      isCompliant: postCheck.isCompliant,
      violations: postCheck.violations,
      contentClassification: postCheck.contentClassification,
      suggestions: postCheck.suggestions
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
