
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingData } from "@/hooks/useBrandSetup";

interface BrandVoiceSectionProps {
  data: OnboardingData;
  isEditing: boolean;
  onUpdate: (field: keyof OnboardingData, value: string) => void;
}

export const BrandVoiceSection: React.FC<BrandVoiceSectionProps> = ({ 
  data, 
  isEditing, 
  onUpdate 
}) => {
  const voiceTones = [
    "Bold",
    "Playful",
    "Premium", 
    "Aggressive"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Voice/Tone Style</Label>
        {isEditing ? (
          <Select 
            value={data.voice_tone_style} 
            onValueChange={(value) => onUpdate('voice_tone_style', value)}
          >
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
        ) : (
          <p className="text-muted-foreground">{data.voice_tone_style || 'Not specified'}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Instagram Reel URL</Label>
        {isEditing ? (
          <Input
            value={data.instagram_reel_url}
            onChange={(e) => onUpdate('instagram_reel_url', e.target.value)}
            placeholder="https://instagram.com/reel/..."
          />
        ) : (
          <p className="text-muted-foreground">
            {data.instagram_reel_url ? (
              <a href={data.instagram_reel_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {data.instagram_reel_url}
              </a>
            ) : (
              'Not provided'
            )}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Meta Account</Label>
        {isEditing ? (
          <Input
            value={data.meta_account}
            onChange={(e) => onUpdate('meta_account', e.target.value)}
            placeholder="@your-facebook-page or @your-instagram"
          />
        ) : (
          <p className="text-muted-foreground">{data.meta_account || 'Not provided'}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Competitor URLs or Past Ads</Label>
        {isEditing ? (
          <Textarea
            value={data.competitor_urls}
            onChange={(e) => onUpdate('competitor_urls', e.target.value)}
            placeholder="Enter URLs of competitor ads or successful ads, one per line"
            rows={4}
          />
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {data.competitor_urls || 'Not provided'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Words/Phrases You Always Use</Label>
        {isEditing ? (
          <Textarea
            value={data.brand_words}
            onChange={(e) => onUpdate('brand_words', e.target.value)}
            placeholder="Transform your body, beast mode, unleash your potential..."
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {data.brand_words || 'Not provided'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Things to Avoid</Label>
        {isEditing ? (
          <Textarea
            value={data.words_to_avoid}
            onChange={(e) => onUpdate('words_to_avoid', e.target.value)}
            placeholder="Diet, skinny, quick fix, magic pill..."
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {data.words_to_avoid || 'Not provided'}
          </p>
        )}
      </div>
    </div>
  );
};
