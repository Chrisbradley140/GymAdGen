
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface StepThreeProps {
  data: {
    offer_type: string;
    campaign_types: string[];
    seasonal_launch_options: string[];
  };
  updateData: (updates: any) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ data, updateData }) => {
  const offerTypes = [
    "Lead Gen",
    "Launch",
    "Challenge",
    "Course",
    "Coaching",
    "Supplement",
    "Equipment",
    "Other"
  ];

  const campaignTypes = [
    "Evergreen Lead Gen",
    "Seasonal Launch",
    "Reactivation",
    "Time-Sensitive Promo",
    "New Offer",
    "Other"
  ];

  const seasonalOptions = [
    "January/New Year",
    "Summer",
    "Back to School",
    "Black Friday",
    "Christmas",
    "Other"
  ];

  const handleCampaignTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      updateData({ campaign_types: [...data.campaign_types, type] });
    } else {
      updateData({ campaign_types: data.campaign_types.filter(t => t !== type) });
    }
  };

  const handleSeasonalOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      updateData({ seasonal_launch_options: [...data.seasonal_launch_options, option] });
    } else {
      updateData({ seasonal_launch_options: data.seasonal_launch_options.filter(o => o !== option) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="offer_type">Offer Type</Label>
        <Select value={data.offer_type} onValueChange={(value) => updateData({ offer_type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your offer type" />
          </SelectTrigger>
          <SelectContent>
            {offerTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Campaign Type (select all that apply)</Label>
        <div className="grid grid-cols-1 gap-3">
          {campaignTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={data.campaign_types.includes(type)}
                onCheckedChange={(checked) => handleCampaignTypeChange(type, checked as boolean)}
              />
              <Label htmlFor={type} className="text-sm font-normal">
                {type}
              </Label>
            </div>
          ))}
        </div>
        
        {data.campaign_types.includes("Other") && (
          <Input
            placeholder="Specify other campaign type"
            className="mt-2"
          />
        )}
      </div>

      {data.campaign_types.includes("Seasonal Launch") && (
        <div className="space-y-4">
          <Label>Seasonal Launch Options</Label>
          <div className="grid grid-cols-1 gap-3">
            {seasonalOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={data.seasonal_launch_options.includes(option)}
                  onCheckedChange={(checked) => handleSeasonalOptionChange(option, checked as boolean)}
                />
                <Label htmlFor={option} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
          
          {data.seasonal_launch_options.includes("Other") && (
            <Input
              placeholder="Specify other seasonal option"
              className="mt-2"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StepThree;
