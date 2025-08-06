
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
      <div className="flex items-center gap-3 flex-wrap">
        {colors.map((color, index) => {
          // Handle both hex colors (#FF0000) and color names (red)
          const isHex = color.startsWith('#');
          const colorValue = isHex ? color : color.toLowerCase();
          
          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg border-2 border-muted shadow-sm ring-1 ring-black/10"
                style={{ 
                  backgroundColor: isHex ? color : colorValue,
                  // Fallback for invalid colors
                  background: isHex ? color : `var(--${colorValue}, ${colorValue})`
                }}
                title={color}
              />
              <span className="text-xs text-muted-foreground font-mono">
                {color}
              </span>
            </div>
          );
        })}
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
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-primary" />
                <a 
                  href={data.logo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  {data.logo_url}
                  <span className="text-xs text-muted-foreground">(click to view)</span>
                </a>
              </div>
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
          <div className="space-y-3">
            {data.brand_colors ? (
              <>
                {renderBrandColors()}
                <p className="text-sm text-muted-foreground">
                  {data.brand_colors}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No colors specified</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
