
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StepFiveProps {
  data: {
    brand_words: string;
    words_to_avoid: string;
  };
  updateData: (updates: any) => void;
}

const StepFive: React.FC<StepFiveProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Help us understand your brand language and voice
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand_words">Words/Phrases You Always Use (Optional)</Label>
        <Textarea
          id="brand_words"
          value={data.brand_words}
          onChange={(e) => updateData({ brand_words: e.target.value })}
          placeholder="Transform your body, beast mode, unleash your potential..."
          rows={4}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Enter key phrases, catchphrases, or words that define your brand
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="words_to_avoid">Anything to Avoid (Optional)</Label>
        <Textarea
          id="words_to_avoid"
          value={data.words_to_avoid}
          onChange={(e) => updateData({ words_to_avoid: e.target.value })}
          placeholder="Diet, skinny, quick fix, magic pill..."
          rows={4}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          Words or phrases that don't align with your brand or that you want to avoid
        </p>
      </div>
    </div>
  );
};

export default StepFive;
