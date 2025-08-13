import { supabase } from "@/integrations/supabase/client";

export interface ComplianceResult {
  isCompliant: boolean;
  violations: string[];
  fixedText?: string;
  canBeSaved: boolean;
  complianceStatus: 'passed' | 'fixed' | 'failed';
  checkId?: string;
}

export interface ComplianceCheck {
  id: string;
  content_type: string;
  original_text: string;
  fixed_text?: string;
  compliance_status: string;
  violations: string[];
  created_at: string;
}

export const checkAndFixForMetaPolicy = async (
  content: string,
  contentType: string,
  brandTone?: string
): Promise<ComplianceResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('meta-compliance-check', {
      body: {
        content,
        contentType,
        brandTone
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error checking Meta compliance:', error);
    throw new Error('Failed to check Meta compliance. Please try again.');
  }
};

export const getComplianceHistory = async (contentType?: string): Promise<ComplianceCheck[]> => {
  try {
    // Note: Using any type for now since compliance_checks may not be in generated types yet
    let query = (supabase as any)
      .from('compliance_checks')
      .select('*')
      .order('created_at', { ascending: false });

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching compliance history:', error);
    return [];
  }
};

export const getMetaPolicyRulesExplanation = (): Record<string, string> => {
  return {
    'personal_attributes': 'Ads must not directly or indirectly claim to know personal details like age, race, religion, or health conditions.',
    'body_shaming': 'Ads must not promote unrealistic body ideals or create negative self-perception about appearance.',
    'shocking_content': 'Avoid fear tactics, exaggerated claims, or unsafe suggestions that could mislead users.',
    'misleading_claims': 'All claims must be realistic and verifiable, without promising impossible results.',
    'adult_content': 'Ads must not promote sexual content or adult entertainment services.',
    'prohibited_content': 'No profanity, hate speech, dangerous activities, or misinformation allowed.'
  };
};