
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

      <div className="space-y-2">
        <Label htmlFor="instagram_reel_url">Add the URL of your favourite speaking to the camera/talking head style reel</Label>
        <Input
          id="instagram_reel_url"
          type="url"
          value={data.instagram_reel_url}
          onChange={(e) => updateData({ instagram_reel_url: e.target.value })}
          placeholder="https://instagram.com/reel/..."
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          For scanning your tone and generating ads in your voice
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_account">Your instagram/Tik Tok/Facebook @</Label>
        <Input
          id="meta_account"
          value={data.meta_account}
          onChange={(e) => updateData({ meta_account: e.target.value })}
          placeholder="@your-facebook-page or @your-instagram"
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          I suggest adding your strongest platform
        </p>
      </div>

    </div>
  );
};

export default StepFour;
