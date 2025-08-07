
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StepTwoProps {
  data: {
    brand_colors: string;
    voice_tone_style: string;
  };
  updateData: (updates: any) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ data, updateData }) => {
  const voiceTones = [
    "Bold",
    "Playful",
    "Premium",
    "Aggressive"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="brand_colors">Brand Colours</Label>
        <Input
          id="brand_colors"
          value={data.brand_colors}
          onChange={(e) => updateData({ brand_colors: e.target.value })}
          placeholder="#FF0000, #00FF00, #0000FF or Red, Green, Blue"
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Enter hex codes or color names separated by commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="voice_tone_style">Voice/Tone Style</Label>
        <Select value={data.voice_tone_style} onValueChange={(value) => updateData({ voice_tone_style: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your brand voice" />
          </SelectTrigger>
          <SelectContent>
            {voiceTones.map((tone) => (
              <SelectItem key={tone} value={tone}>
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StepTwo;
