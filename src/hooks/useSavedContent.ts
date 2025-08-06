import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ContentType = 'ad_caption' | 'headline' | 'campaign_name' | 'ig_story' | 'creative_prompt';

export interface SavedContent {
  id: string;
  content_type: ContentType;
  title: string;
  content: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useSavedContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const saveContent = async (
    contentType: ContentType,
    title: string,
    content: string,
    metadata: any = {}
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save content.",
        variant: "destructive",
      });
      return null;
    }

    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('saved_ad_content')
        .insert({
          user_id: user.id,
          content_type: contentType,
          title,
          content,
          metadata
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content saved to your library!",
      });

      return data;
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const getSavedContent = async (contentType?: ContentType) => {
    if (!user) return [];

    try {
      let query = supabase
        .from('saved_ad_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching saved content:', error);
      return [];
    }
  };

  return {
    saveContent,
    getSavedContent,
    isSaving
  };
};