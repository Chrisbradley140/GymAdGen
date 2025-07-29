
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/hooks/useBrandSetup";

interface PsychologySectionProps {
  data: OnboardingData;
  isEditing: boolean;
  onUpdate: (field: keyof OnboardingData, value: string) => void;
}

export const PsychologySection: React.FC<PsychologySectionProps> = ({ 
  data, 
  isEditing, 
  onUpdate 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>What's the #1 problem you solve?</Label>
        {isEditing ? (
          <Textarea
            value={data.main_problem}
            onChange={(e) => onUpdate('main_problem', e.target.value)}
            placeholder="Busy professionals who want to lose weight but don't have time for 2-hour gym sessions..."
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {data.main_problem || 'Not provided'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>What's something clients tried before that didn't work?</Label>
        {isEditing ? (
          <Textarea
            value={data.failed_solutions}
            onChange={(e) => onUpdate('failed_solutions', e.target.value)}
            placeholder="Extreme diets, expensive gym memberships they never used, complicated workout plans..."
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {data.failed_solutions || 'Not provided'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>What exact words do clients say before signing up?</Label>
        {isEditing ? (
          <Textarea
            value={data.client_words}
            onChange={(e) => onUpdate('client_words', e.target.value)}
            placeholder="I need something that fits my schedule, I'm tired of starting over, I want to feel confident again..."
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {data.client_words || 'Not provided'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>If they had a magic wand, what result would they wish for?</Label>
        {isEditing ? (
          <Textarea
            value={data.magic_wand_result}
            onChange={(e) => onUpdate('magic_wand_result', e.target.value)}
            placeholder="Wake up feeling energized, fit into their favorite clothes, feel confident at the beach..."
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {data.magic_wand_result || 'Not provided'}
          </p>
        )}
      </div>
    </div>
  );
};
