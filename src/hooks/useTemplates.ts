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
  canonical_name: string;
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

export interface TopPerformingAd {
  id: string;
  campaign_canonical_name: string;
  primary_text: string;
  headline: string | null;
  insights: string | null;
  tone: string | null;
  hook_type: string | null;
  platform: string[] | null;
  target_market: string | null;
  target_location: string | null;
  result: string | null;
  cost_per_result: string | null;
  media_url: string | null;
  content_hash: string;
  created_at: string;
}

export const useTemplates = () => {
  const [campaignTemplates, setCampaignTemplates] = useState<CampaignTemplate[]>([]);
  const [adTemplates, setAdTemplates] = useState<AdTemplate[]>([]);
  const [topPerformingAds, setTopPerformingAds] = useState<TopPerformingAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchTemplates();
  }, [refreshKey]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);

      // Fetch both campaign and ad templates in parallel for better performance
      const [campaignResult, adResult] = await Promise.all([
        supabase
          .from('campaign_templates')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('ad_templates')
          .select('*')
          .eq('is_active', true)
          .order('performance_score', { ascending: false })
      ]);

      if (campaignResult.error) throw campaignResult.error;
      if (adResult.error) throw adResult.error;

      setCampaignTemplates(campaignResult.data || []);
      setAdTemplates(adResult.data || []);
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

  const getTopPerformingAds = async (campaignCanonicalName: string): Promise<TopPerformingAd[]> => {
    try {
      const { data, error } = await supabase
        .from('top_performing_ads')
        .select('*')
        .eq('campaign_canonical_name', campaignCanonicalName)
        .order('result', { ascending: false })
        .order('cost_per_result', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching top performing ads:', error);
      return [];
    }
  };

  const getCampaignByCanonicalName = (canonicalName: string) => {
    return campaignTemplates.find(template => template.canonical_name === canonicalName);
  };

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return {
    campaignTemplates,
    adTemplates,
    topPerformingAds,
    isLoading,
    getCampaignsByCategory,
    getAdTemplatesForCampaign,
    getMostPopularCampaigns,
    getTopPerformingAds,
    getCampaignByCanonicalName,
    refetch: fetchTemplates,
    forceRefresh
  };
};