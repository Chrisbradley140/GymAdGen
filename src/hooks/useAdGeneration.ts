
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
            target_market: brandData.target_market,
            voice_tone_style: brandData.voice_tone_style,
            words_to_avoid: brandData.words_to_avoid
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
