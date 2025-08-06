
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Eye } from "lucide-react";
import { OnboardingData } from "@/hooks/useBrandSetup";

interface GeneralInfoSectionProps {
  data: OnboardingData;
  isEditing: boolean;
  onUpdate: (field: keyof OnboardingData, value: string) => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ 
  data, 
  isEditing, 
  onUpdate 
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just store the file name. In a real app, you'd upload to Supabase Storage
      onUpdate('logo_url', file.name);
    }
  };

  const renderBrandColors = () => {
    if (!data.brand_colors) return null;
    
    const colors = data.brand_colors.split(',').map(c => c.trim());
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-lg border border-gray-200"
            style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}
            title={color}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Business Name</Label>
        {isEditing ? (
          <Input
            value={data.business_name}
            onChange={(e) => onUpdate('business_name', e.target.value)}
            placeholder="Enter your business name"
          />
        ) : (
          <p className="text-muted-foreground">{data.business_name || 'Not provided'}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Website URL</Label>
        {isEditing ? (
          <Input
            value={data.website_url}
            onChange={(e) => onUpdate('website_url', e.target.value)}
            placeholder="https://your-website.com"
          />
        ) : (
          <p className="text-muted-foreground">
            {data.website_url ? (
              <a href={data.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {data.website_url}
              </a>
            ) : (
              'Not provided'
            )}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Logo</Label>
        {isEditing ? (
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
              <span className="text-sm text-muted-foreground">{data.logo_url}</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {data.logo_url ? (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-muted-foreground">{data.logo_url}</span>
              </>
            ) : (
              <p className="text-muted-foreground">No logo uploaded</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Brand Colors</Label>
        {isEditing ? (
          <Input
            value={data.brand_colors}
            onChange={(e) => onUpdate('brand_colors', e.target.value)}
            placeholder="#FF0000, #00FF00, #0000FF or Red, Green, Blue"
          />
        ) : (
          <div className="flex items-center gap-4">
            {renderBrandColors()}
            <span className="text-sm text-muted-foreground">
              {data.brand_colors || 'No colors specified'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
