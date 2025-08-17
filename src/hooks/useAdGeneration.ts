
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useBrandSetup } from './useBrandSetup';

export const useAdGeneration = () => {
  const { user } = useAuth();
  const { data: brandData } = useBrandSetup();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (adType: string, systemPrompt: string, campaignCanonicalName?: string, topPerformingAds?: any[]) => {
    if (!user || !brandData) {
      throw new Error('User not authenticated or brand data not available');
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ad-content', {
        body: {
          adType,
          systemPrompt,
          campaignCanonicalName,
          topPerformingAds,
          brandData: {
            business_name: brandData.business_name,
            business_type: brandData.business_type,
            business_city: brandData.business_city,
            target_market: brandData.target_market,
            voice_tone_style: brandData.voice_tone_style,
            words_to_avoid: brandData.words_to_avoid,
            coaching_style: brandData.coaching_style,
            brand_words: brandData.brand_words,
            main_problem: brandData.main_problem,
            failed_solutions: brandData.failed_solutions,
            client_words: brandData.client_words,
            magic_wand_result: brandData.magic_wand_result,
            website_tone_scan: brandData.website_tone_scan
          }
        }
      });

      if (error) {
        throw error;
      }

      return data.generatedContent;
    } catch (error) {
      console.error('Error generating ad content:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateContent, isGenerating };
};
