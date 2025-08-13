import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/hooks/useSavedContent';

export interface MetaViolation {
  rule: string;
  reason: string;
  snippet?: string;
}

export interface MetaComplianceResult {
  compliant: boolean;
  fixedText: string;
  violations: MetaViolation[];
}

export interface MetaComplianceCheck {
  content: string;
  contentType: ContentType;
  brandTone?: string;
}

/**
 * Checks and fixes content against Meta's advertising policies
 * @param params - Content, content type, and brand tone information
 * @returns Promise with compliance result
 */
export const checkAndFixForMetaPolicy = async ({
  content,
  contentType,
  brandTone
}: MetaComplianceCheck): Promise<MetaComplianceResult> => {
  try {
    // Call the meta-compliance-check edge function
    const { data, error } = await supabase.functions.invoke('meta-compliance-check', {
      body: {
        content,
        contentType,
        brandTone
      }
    });

    if (error) {
      console.error('Meta compliance check error:', error);
      throw error;
    }

    return data as MetaComplianceResult;
  } catch (error) {
    console.error('Error checking Meta compliance:', error);
    
    // Return a safe fallback that indicates the check failed
    return {
      compliant: false,
      fixedText: '',
      violations: [{
        rule: 'SYSTEM_ERROR',
        reason: 'Unable to perform compliance check due to system error',
        snippet: content.substring(0, 100)
      }]
    };
  }
};

/**
 * Gets compliance check history for the current user
 * @param contentType - Optional filter by content type
 * @returns Promise with compliance check history
 */
export const getComplianceHistory = async (contentType?: ContentType) => {
  try {
    let query = supabase
      .from('compliance_checks')
      .select('*')
      .order('created_at', { ascending: false });

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching compliance history:', error);
    return [];
  }
};