
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Save, Zap, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { useSavedContent, ContentType } from "@/hooks/useSavedContent";

interface MetaCompliance {
  status: 'PASS' | 'FIXED' | 'FAIL';
  violations: string[];
  originalText?: string;
  fixedText?: string;
}

interface AdBlockProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerate: () => Promise<string | { generatedContent: string; metaCompliance: MetaCompliance }>;
  placeholder?: string;
  contentType: ContentType;
  campaignId?: string;
  onCampaignCreate?: () => Promise<string | null>;
}

export function AdBlock({ title, description, icon, onGenerate, placeholder, contentType, campaignId, onCampaignCreate }: AdBlockProps) {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [metaCompliance, setMetaCompliance] = useState<MetaCompliance | null>(null);
  const { toast } = useToast();
  const { saveContent, isSaving } = useSavedContent();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMetaCompliance(null);
    try {
      const result = await onGenerate();
      
      if (typeof result === 'string') {
        // Legacy format - just content
        setContent(result);
        setMetaCompliance({ status: 'PASS', violations: [] });
      } else {
        // New format with compliance data
        const { generatedContent, metaCompliance: compliance } = result;
        
        if (compliance.status === 'FAIL') {
          setContent("");
          setMetaCompliance(compliance);
          toast({
            title: "Content Blocked",
            description: "Generated content violates Meta advertising policies. Please regenerate.",
            variant: "destructive",
          });
          return;
        }
        
        setContent(generatedContent);
        setMetaCompliance(compliance);
        
        if (compliance.status === 'FIXED') {
          toast({
            title: "Content Updated",
            description: "Content was automatically updated for Meta policy compliance.",
          });
        } else {
          toast({
            title: "Success",
            description: `${title} generated successfully!`,
          });
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied",
        description: "Content copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    
    let finalCampaignId = campaignId;
    
    // Create campaign only when saving content for the first time
    if (!finalCampaignId && onCampaignCreate) {
      finalCampaignId = await onCampaignCreate();
    }
    
    await saveContent(
      contentType,
      title,
      content,
      { generatedAt: new Date().toISOString() },
      finalCampaignId || undefined
    );
  };

  const handleRegenerate = () => {
    if (content) {
      handleGenerate();
    }
  };

  return (
    <Card className="h-full border-2 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            {icon}
          </div>
          {title}
        </CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center gap-2 text-base py-3 relative overflow-hidden"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" className="text-primary-foreground" />
              <span className="animate-pulse">Generating</span>
              <span className="animate-pulse animation-delay-100">.</span>
              <span className="animate-pulse animation-delay-200">.</span>
              <span className="animate-pulse animation-delay-300">.</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Generate
            </>
          )}
        </Button>

        {(content || metaCompliance?.status === 'FAIL') && (
          <div className="space-y-3 animate-fade-in">
            {/* Meta Compliance Status */}
            {metaCompliance && (
              <div className="flex items-center gap-2 mb-3">
                {metaCompliance.status === 'PASS' && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Policy-Safe
                  </Badge>
                )}
                {metaCompliance.status === 'FIXED' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Updated for Meta Policy Compliance
                  </Badge>
                )}
                {metaCompliance.status === 'FAIL' && (
                  <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Policy Violations Detected
                  </Badge>
                )}
              </div>
            )}

            {/* Violations Display for FAIL status */}
            {metaCompliance?.status === 'FAIL' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-red-800">Policy Violations Found:</h4>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {metaCompliance.violations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
                <p className="text-sm text-red-600 mt-3">
                  Please regenerate content to get a policy-compliant version.
                </p>
              </div>
            )}

            {/* Content Textarea - only show if content exists */}
            {content && (
              <div className="relative">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  placeholder={placeholder}
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md">
                    <div className="flex flex-col items-center gap-2">
                      <LoadingSpinner size="lg" className="text-primary" />
                      <span className="text-sm text-muted-foreground">Creating your content...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Action Buttons - only show if content exists */}
            {content && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !content.trim()}
                  className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  {isSaving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save
                </Button>
              </div>
            )}
          </div>
        )}
        
        {!content && placeholder && (
          <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
            {placeholder}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
