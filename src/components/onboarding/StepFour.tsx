
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StepFourProps {
  data: {
    instagram_reel_url: string;
    meta_account: string;
    competitor_urls: string;
  };
  updateData: (updates: any) => void;
}

const StepFour: React.FC<StepFourProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          These optional enhancers help us create more targeted and effective ads
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram_reel_url">Instagram Reel URL (Optional)</Label>
        <Input
          id="instagram_reel_url"
          type="url"
          value={data.instagram_reel_url}
          onChange={(e) => updateData({ instagram_reel_url: e.target.value })}
          placeholder="https://instagram.com/reel/..."
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          For tone scanning and style analysis
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_account">Meta Account (Optional)</Label>
        <Input
          id="meta_account"
          value={data.meta_account}
          onChange={(e) => updateData({ meta_account: e.target.value })}
          placeholder="@your-facebook-page or @your-instagram"
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Your Facebook or Instagram handle
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="competitor_urls">Competitor URLs or "Ads That Worked" (Optional)</Label>
        <Textarea
          id="competitor_urls"
          value={data.competitor_urls}
          onChange={(e) => updateData({ competitor_urls: e.target.value })}
          placeholder="Enter URLs of competitor ads or successful ads, one per line"
          rows={4}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Help us understand what works in your industry
        </p>
      </div>
    </div>
  );
};

export default StepFour;
