
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface StepOneProps {
  data: {
    business_name: string;
    logo_url: string;
    website_url: string;
  };
  updateData: (updates: any) => void;
}

const StepOne: React.FC<StepOneProps> = ({ data, updateData }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just store the file name. In a real app, you'd upload to Supabase Storage
      updateData({ logo_url: file.name });
    }
  };

  const handleRemoveLogo = () => {
    updateData({ logo_url: '' });
    // Clear the file input
    const fileInput = document.getElementById('logo_upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="business_name">Business Name *</Label>
        <Input
          id="business_name"
          value={data.business_name}
          onChange={(e) => updateData({ business_name: e.target.value })}
          placeholder="Enter your business name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo_upload">Logo Upload (Optional)</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('logo_upload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Logo
          </Button>
          <input
            id="logo_upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {data.logo_url && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {data.logo_url}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveLogo}
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">Website URL</Label>
        <Input
          id="website_url"
          type="url"
          value={data.website_url}
          onChange={(e) => updateData({ website_url: e.target.value })}
          placeholder="https://your-website.com"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default StepOne;
