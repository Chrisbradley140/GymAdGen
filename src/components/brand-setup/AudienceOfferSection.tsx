
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OnboardingData } from "@/hooks/useBrandSetup";

interface AudienceOfferSectionProps {
  data: OnboardingData;
  isEditing: boolean;
  onUpdate: (field: keyof OnboardingData, value: string | string[]) => void;
}

export const AudienceOfferSection: React.FC<AudienceOfferSectionProps> = ({ 
  data, 
  isEditing, 
  onUpdate 
}) => {
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

  const offerTypes = [
    "Lead Gen",
    "Reactivation", 
    "Launch",
    "Challenge"
  ];

  const campaignTypes = [
    "Evergreen",
    "Launch",
    "Black Friday",
    "New Year",
    "Summer",
    "Back to School"
  ];

  const seasonalOptions = [
    "January",
    "February", 
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "Summer",
    "Winter",
    "Spring",
    "Fall"
  ];

  return (
    <div className="space-y-6">

      <div className="space-y-2">
        <Label>Offer Type</Label>
        {isEditing ? (
          <Select 
            value={data.offer_type} 
            onValueChange={(value) => onUpdate('offer_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select offer type" />
            </SelectTrigger>
            <SelectContent>
              {offerTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-muted-foreground">{data.offer_type || 'Not specified'}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Campaign Types</Label>
        <div className="flex flex-wrap gap-2">
          {data.campaign_types?.map((type, index) => (
            <Badge key={index} variant="secondary">
              {type}
            </Badge>
          )) || <p className="text-muted-foreground">No campaign types selected</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Seasonal Launch Options</Label>
        <div className="flex flex-wrap gap-2">
          {data.seasonal_launch_options?.map((season, index) => (
            <Badge key={index} variant="outline">
              {season}
            </Badge>
          )) || <p className="text-muted-foreground">No seasonal options selected</p>}
        </div>
      </div>
    </div>
  );
};
