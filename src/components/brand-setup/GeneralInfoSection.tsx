import { useMemo, useState } from "react";
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
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<number | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const derivedFileName = useMemo(() => {
    if (selectedFileName) return selectedFileName;
    const url = data.logo_url;
    if (!url) return null;
    try {
      const full = url.startsWith('http') ? url : `https://${url}`;
      const u = new URL(full);
      const name = decodeURIComponent(u.pathname.split('/').pop() || url);
      return name || url;
    } catch {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1] || url);
    }
  }, [selectedFileName, data.logo_url]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setSelectedFileSize(file.size);
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
              <a 
                href={data.website_url.startsWith('http') ? data.website_url : `https://${data.website_url}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
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
              {data.logo_url || selectedFileName ? 'Change Logo' : 'Upload Logo'}
            </Button>
            <input
              id="logo_upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {derivedFileName && (
              <span
                className="text-sm text-muted-foreground truncate max-w-[240px]"
                title={selectedFileName ?? data.logo_url}
              >
                {derivedFileName}{selectedFileSize ? ` (${formatBytes(selectedFileSize)})` : ''}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {data.logo_url ? (
              <>
                <Eye className="w-4 h-4" />
                {data.logo_url.startsWith('http') ? (
                  <a
                    href={data.logo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-[240px]"
                    title={data.logo_url}
                  >
                    {derivedFileName || data.logo_url}
                  </a>
                ) : (
                  <span
                    className="text-muted-foreground truncate max-w-[240px]"
                    title={data.logo_url}
                  >
                    {derivedFileName || data.logo_url}
                  </span>
                )}
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
