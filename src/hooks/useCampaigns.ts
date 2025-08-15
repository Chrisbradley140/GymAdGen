import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBrandSetup } from './useBrandSetup';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  offer_type?: string;
  tone_style?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignWithContent extends Campaign {
  content: {
    ad_caption?: any;
    headline?: any;
    campaign_name?: any;
    ig_story?: any;
    creative_prompt?: any;
  };
}

export const useCampaigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: brandData } = useBrandSetup();
  const [isLoading, setIsLoading] = useState(false);

  const createCampaign = async (name: string, description?: string) => {
    if (!user || !brandData) {
      toast({
        title: "Error",
        description: "You must be logged in and have brand data to create campaigns.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name,
          description,
          offer_type: brandData.offer_type,
          tone_style: brandData.voice_tone_style
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const getCampaigns = async (filters?: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    offerType?: string;
    toneStyle?: string;
  }) => {
    if (!user) return [];

    setIsLoading(true);
    try {
      let query = supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters?.offerType) {
        query = query.eq('offer_type', filters.offerType);
      }

      if (filters?.toneStyle) {
        query = query.eq('tone_style', filters.toneStyle);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaignWithContent = async (campaignId: string): Promise<CampaignWithContent | null> => {
    if (!user) return null;

    try {
      // Get campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('user_id', user.id)
        .single();

      if (campaignError) throw campaignError;

      // Get associated content
      const { data: content, error: contentError } = await supabase
        .from('saved_ad_content')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id);

      if (contentError) throw contentError;

      // Group content by type
      const groupedContent: any = {};
      content?.forEach((item) => {
        groupedContent[item.content_type] = item;
      });

      return {
        ...campaign,
        content: groupedContent
      };
    } catch (error) {
      console.error('Error fetching campaign with content:', error);
      return null;
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign deleted successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    createCampaign,
    getCampaigns,
    getCampaignWithContent,
    deleteCampaign,
    isLoading
  };
};