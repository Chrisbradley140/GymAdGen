
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StepTwoProps {
  data: {
    brand_colors: string;
    target_market: string;
    voice_tone_style: string;
  };
  updateData: (updates: any) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ data, updateData }) => {
  const targetMarkets = [
    "General Population (Fat Loss & Fitness)",
    "Busy Professionals",
    "Parents / Mums / Dads",
    "Men Over 30",
    "Women Over 30",
    "Menopause / Perimenopause",
    "Pre/Postnatal Women",
    "Beginners (New to Fitness)",
    "Advanced Lifters / Athletes",
    "People with Injuries / Rehab Clients",
    "Over 40s / Over 50s",
    "Transformation Seekers (6–12 Week Programs)",
    "Strength & Performance Clients",
    "Body Confidence / Mental Health Focus",
    "Time-Poor / At-Home Clients",
    "LGBTQ+ Inclusive Fitness",
    "Wedding / Holiday Shred Clients",
    "Ex-Gym Members Returning After a Break",
    "Local Community Members (Geo-Specific)",
    "Other"
  ];

  const voiceTones = [
    "Bold",
    "Playful",
    "Premium",
    "Aggressive"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="brand_colors">Brand Colors</Label>
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
        <Label htmlFor="target_market">Target Market</Label>
        <Select value={data.target_market} onValueChange={(value) => updateData({ target_market: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your target market" />
          </SelectTrigger>
          <SelectContent>
            {targetMarkets.map((market) => (
              <SelectItem key={market} value={market}>
                {market}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {data.target_market === "Other" && (
          <Input
            placeholder="Specify your target market"
            value={data.target_market === "Other" ? "" : data.target_market}
            onChange={(e) => updateData({ target_market: e.target.value })}
            className="mt-2"
          />
        )}
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
