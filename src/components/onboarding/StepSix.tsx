
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface StepSixProps {
  data: {
    target_market: string;
    main_problem: string;
    failed_solutions: string;
    client_words: string;
    magic_wand_result: string;
  };
  updateData: (updates: any) => void;
}

const StepSix: React.FC<StepSixProps> = ({ data, updateData }) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          These psychology insights help create more compelling and converting ads
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
        <Label htmlFor="main_problem">What's the #1 problem you solve? *</Label>
        <Textarea
          id="main_problem"
          value={data.main_problem}
          onChange={(e) => updateData({ main_problem: e.target.value })}
          placeholder="Busy professionals who want to lose weight but don't have time for 2-hour gym sessions..."
          rows={3}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="failed_solutions">What's something clients tried before that didn't work? *</Label>
        <Textarea
          id="failed_solutions"
          value={data.failed_solutions}
          onChange={(e) => updateData({ failed_solutions: e.target.value })}
          placeholder="Extreme diets, expensive gym memberships they never used, complicated workout plans..."
          rows={3}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_words">What exact words do clients say before signing up? *</Label>
        <Textarea
          id="client_words"
          value={data.client_words}
          onChange={(e) => updateData({ client_words: e.target.value })}
          placeholder="I need something that fits my schedule, I'm tired of starting over, I want to feel confident again..."
          rows={3}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="magic_wand_result">If they had a magic wand, what result would they wish for? *</Label>
        <Textarea
          id="magic_wand_result"
          value={data.magic_wand_result}
          onChange={(e) => updateData({ magic_wand_result: e.target.value })}
          placeholder="Wake up feeling energized, fit into their favorite clothes, feel confident at the beach..."
          rows={3}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default StepSix;
