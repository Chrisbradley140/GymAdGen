
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StepSixProps {
  data: {
    main_problem: string;
    failed_solutions: string;
    client_words: string;
    magic_wand_result: string;
  };
  updateData: (updates: any) => void;
}

const StepSix: React.FC<StepSixProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          These psychology insights help create more compelling and converting ads
        </p>
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
