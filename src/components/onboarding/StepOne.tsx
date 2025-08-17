
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface StepOneProps {
  data: {
    business_name: string;
    logo_url: string;
    website_url: string;
    business_type: string;
    business_city: string;
  };
  updateData: (updates: any) => void;
}

const StepOne: React.FC<StepOneProps> = ({ data, updateData }) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      const { error } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          upsert: true,
        });

      if (error) {
        toast.error('Failed to upload logo');
        console.error('Upload error:', error);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      updateData({ logo_url: publicUrl });
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
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

      <div className="space-y-4">
        <Label>Is your business primarily: *</Label>
        <RadioGroup
          value={data.business_type}
          onValueChange={(value) => updateData({ business_type: value })}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Online</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-person" id="in-person" />
            <Label htmlFor="in-person">In person</Label>
          </div>
        </RadioGroup>
      </div>

      {data.business_type === 'in-person' && (
        <div className="space-y-2">
          <Label htmlFor="business_city">What city are you based in? *</Label>
          <Input
            id="business_city"
            value={data.business_city}
            onChange={(e) => updateData({ business_city: e.target.value })}
            placeholder="Enter your city"
            className="w-full"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="logo_upload">Logo Upload (Optional)</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('logo_upload')?.click()}
            className="flex items-center gap-2"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? 'Uploading...' : 'Upload Logo'}
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
              <img 
                src={data.logo_url} 
                alt="Uploaded logo" 
                className="w-8 h-8 object-contain border rounded"
              />
              <span className="text-sm text-muted-foreground">
                Logo uploaded
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
