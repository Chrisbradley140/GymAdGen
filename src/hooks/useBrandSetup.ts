
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OnboardingData {
  id?: string;
  business_name: string;
  logo_url: string;
  website_url: string;
  brand_colors: string;
  target_market: string;
  voice_tone_style: string;
  offer_type: string;
  campaign_types: string[];
  seasonal_launch_options: string[];
  instagram_reel_url: string;
  meta_account: string;
  competitor_urls: string;
  brand_words: string;
  words_to_avoid: string;
  main_problem: string;
  failed_solutions: string;
  client_words: string;
  magic_wand_result: string;
}

export const useBrandSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOnboardingData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching onboarding data for user:', user.id);
      
      // Use maybeSingle() instead of single() to handle cases where no data exists
      const { data: onboardingData, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching onboarding data:', error);
        toast({
          title: "Error",
          description: "Failed to load brand setup data",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched onboarding data:', onboardingData);

      if (onboardingData) {
        setData({
          id: onboardingData.id,
          business_name: onboardingData.business_name || '',
          logo_url: onboardingData.logo_url || '',
          website_url: onboardingData.website_url || '',
          brand_colors: onboardingData.brand_colors || '',
          target_market: onboardingData.target_market || '',
          voice_tone_style: onboardingData.voice_tone_style || '',
          offer_type: onboardingData.offer_type || '',
          campaign_types: onboardingData.campaign_types || [],
          seasonal_launch_options: onboardingData.seasonal_launch_options || [],
          instagram_reel_url: onboardingData.instagram_reel_url || '',
          meta_account: onboardingData.meta_account || '',
          competitor_urls: onboardingData.competitor_urls || '',
          brand_words: onboardingData.brand_words || '',
          words_to_avoid: onboardingData.words_to_avoid || '',
          main_problem: onboardingData.main_problem || '',
          failed_solutions: onboardingData.failed_solutions || '',
          client_words: onboardingData.client_words || '',
          magic_wand_result: onboardingData.magic_wand_result || ''
        });
      } else {
        console.log('No onboarding data found for user');
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      toast({
        title: "Error",
        description: "Failed to load brand setup data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOnboardingData = async (updatedData: OnboardingData) => {
    if (!user || !data?.id) {
      console.error('Cannot update: missing user or data ID');
      return false;
    }

    try {
      setSaving(true);
      console.log('Updating onboarding data:', updatedData);
      
      const { error } = await supabase
        .from('user_onboarding')
        .update({
          business_name: updatedData.business_name,
          logo_url: updatedData.logo_url,
          website_url: updatedData.website_url,
          brand_colors: updatedData.brand_colors,
          target_market: updatedData.target_market,
          voice_tone_style: updatedData.voice_tone_style,
          offer_type: updatedData.offer_type,
          campaign_types: updatedData.campaign_types,
          seasonal_launch_options: updatedData.seasonal_launch_options,
          instagram_reel_url: updatedData.instagram_reel_url,
          meta_account: updatedData.meta_account,
          competitor_urls: updatedData.competitor_urls,
          brand_words: updatedData.brand_words,
          words_to_avoid: updatedData.words_to_avoid,
          main_problem: updatedData.main_problem,
          failed_solutions: updatedData.failed_solutions,
          client_words: updatedData.client_words,
          magic_wand_result: updatedData.magic_wand_result,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) {
        console.error('Error updating onboarding data:', error);
        toast({
          title: "Error",
          description: "Failed to update brand setup data",
          variant: "destructive"
        });
        return false;
      }

      setData(updatedData);
      toast({
        title: "Success",
        description: "Brand setup data updated successfully"
      });
      return true;
    } catch (error) {
      console.error('Error updating onboarding data:', error);
      toast({
        title: "Error",
        description: "Failed to update brand setup data",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchOnboardingData();
  }, [user]);

  return {
    data,
    loading,
    saving,
    updateOnboardingData,
    refetch: fetchOnboardingData
  };
};
