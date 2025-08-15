import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [totalAdsGenerated, setTotalAdsGenerated] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchTotalAds();
  }, [user]);

  const fetchTotalAds = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Count total saved ad content for the user
      const { count, error } = await supabase
        .from('saved_ad_content')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching total ads:', error);
        return;
      }

      setTotalAdsGenerated(count || 0);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    totalAdsGenerated,
    isLoading,
    refreshStats: fetchTotalAds
  };
};