import { GlobalRulesConfig } from '@/hooks/useGlobalRules';

export function validateGeneratedContent(
  content: string, 
  rules: GlobalRulesConfig, 
  contentType: string,
  wordsToAvoid?: string[]
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rules) {
    warnings.push('Global rules not loaded - validation skipped');
    return { isValid: true, errors, warnings };
  }

  // Safety checks
  const safetyRules = rules.safety_rules;
  
  // Check for engagement bait
  const engagementBaitFound = safetyRules.engagement_bait_patterns.some(pattern =>
    content.toLowerCase().includes(pattern.toLowerCase())
  );
  if (engagementBaitFound) {
    errors.push('Content contains engagement bait phrases');
  }

  // Check words to avoid
  if (safetyRules.respect_words_to_avoid && wordsToAvoid) {
    const foundBadWords = wordsToAvoid.filter(word => 
      content.toLowerCase().includes(word.toLowerCase())
    );
    if (foundBadWords.length > 0) {
      errors.push(`Content contains avoided words: ${foundBadWords.join(', ')}`);
    }
  }

  // Formatting checks
  const formattingRules = rules.formatting_rules;
  
  // Emoji count
  const emojiMatches = content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu);
  const emojiCount = emojiMatches ? emojiMatches.length : 0;
  
  if (emojiCount > formattingRules.emoji_limit) {
    errors.push(`Content exceeds emoji limit of ${formattingRules.emoji_limit} (found ${emojiCount})`);
  }

  // Content type specific checks
  if (contentType === 'headline') {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > formattingRules.headline_max_words) {
      errors.push(`Headline exceeds maximum of ${formattingRules.headline_max_words} words (found ${wordCount})`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function generateSystemPromptWithRules(
  basePrompt: string,
  rules: GlobalRulesConfig | null,
  brandVoice?: string,
  wordsToAvoid?: string[]
): string {
  if (!rules) return basePrompt;

  const safetyInstructions = `
CRITICAL SAFETY RULES (MUST FOLLOW):
- NO personal health, ethnicity, or financial status references
- NO before/after claims or testimonials
- NO engagement bait phrases: ${rules.safety_rules.engagement_bait_patterns.join(', ')}
${wordsToAvoid ? `- STRICTLY AVOID these words: ${wordsToAvoid.join(', ')}` : ''}

FORMATTING REQUIREMENTS:
- Headlines: Maximum ${rules.formatting_rules.headline_max_words} words
- Hook: ${rules.formatting_rules.hook_word_range[0]}-${rules.formatting_rules.hook_word_range[1]} words
- Caption structure: ${rules.formatting_rules.caption_structure_order.join(' → ')}
- Maximum ${rules.formatting_rules.emoji_limit} emojis
- Use bullet emojis: ${rules.formatting_rules.allowed_bullet_emojis.join(', ')}

ORIGINALITY REQUIREMENT:
- Do not copy more than ${rules.originality_rules.max_consecutive_words} consecutive words from any existing ad
- Generate unique, original content

${brandVoice ? `TONE: Match this brand voice: ${brandVoice}` : `TONE: Use ${rules.tone_enforcement.fallback_tone}`}
`;

  return `${basePrompt}\n\n${safetyInstructions}`;
}