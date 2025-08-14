import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  target_audience: string | null;
  seasonal_timing: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface AdTemplate {
  id: string;
  campaign_template_id: string;
  primary_text: string;
  headline: string | null;
  offer_type: string | null;
  target_market: string | null;
  platform: string;
  objective: string | null;
  tone: string | null;
  hook_type: string | null;
  performance_score: number;
  is_active: boolean;
}

export const useTemplates = () => {
  const [campaignTemplates, setCampaignTemplates] = useState<CampaignTemplate[]>([]);
  const [adTemplates, setAdTemplates] = useState<AdTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);

      // Fetch campaign templates
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (campaignError) throw campaignError;

      // Fetch ad templates
      const { data: adData, error: adError } = await supabase
        .from('ad_templates')
        .select('*')
        .eq('is_active', true)
        .order('performance_score', { ascending: false });

      if (adError) throw adError;

      setCampaignTemplates(campaignData || []);
      setAdTemplates(adData || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaignsByCategory = (category: string) => {
    return campaignTemplates.filter(template => template.category === category);
  };

  const getAdTemplatesForCampaign = (campaignTemplateId: string) => {
    return adTemplates.filter(template => template.campaign_template_id === campaignTemplateId);
  };

  const getMostPopularCampaigns = () => {
    // Return all campaigns since they're all "Most Popular" now, ordered by sort_order
    return campaignTemplates.filter(template => template.category === 'Most Popular');
  };

  return {
    campaignTemplates,
    adTemplates,
    isLoading,
    getCampaignsByCategory,
    getAdTemplatesForCampaign,
    getMostPopularCampaigns,
    refetch: fetchTemplates
  };
};