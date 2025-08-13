
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Save, Zap, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSavedContent, ContentType } from "@/hooks/useSavedContent";
import { checkAndFixForMetaPolicy, ComplianceResult } from "@/lib/metaCompliance";
import { useBrandSetup } from "@/hooks/useBrandSetup";

interface AdBlockProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerate: () => Promise<string>;
  placeholder?: string;
  contentType: ContentType;
  campaignId?: string;
  onCampaignCreate?: () => Promise<string | null>;
}

export function AdBlock({ title, description, icon, onGenerate, placeholder, contentType, campaignId, onCampaignCreate }: AdBlockProps) {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
  const { toast } = useToast();
  const { saveContent, isSaving } = useSavedContent();
  const { data: brandData } = useBrandSetup();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setComplianceResult(null);
    try {
      const result = await onGenerate();
      setContent(result);
      
      // Automatically run compliance check after generation
      const complianceCheck = await checkAndFixForMetaPolicy(
        result,
        contentType,
        brandData?.voice_tone_style
      );
      setComplianceResult(complianceCheck);
      
      // Show appropriate toast based on compliance result
      if (complianceCheck.isCompliant) {
        toast({
          title: "✅ Policy-Safe Content Generated",
          description: `${title} generated and complies with Meta policies!`,
        });
      } else if (complianceCheck.complianceStatus === 'fixed') {
        toast({
          title: "⚠️ Content Updated for Compliance",
          description: `Found ${complianceCheck.violations.length} violation(s) and provided a compliant version.`,
        });
        // Auto-update with fixed content
        if (complianceCheck.fixedText) {
          setContent(complianceCheck.fixedText);
        }
      } else {
        toast({
          title: "❌ Policy Violations Found",
          description: `Found ${complianceCheck.violations.length} violation(s) that cannot be auto-fixed.`,
          variant: "destructive",
        });
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

  const handleComplianceCheck = async () => {
    if (!content.trim()) return;
    
    setIsCheckingCompliance(true);
    try {
      const result = await checkAndFixForMetaPolicy(
        content,
        contentType,
        brandData?.voice_tone_style
      );
      
      setComplianceResult(result);
      
      // If content was fixed, show option to use fixed version
      if (result.fixedText && result.complianceStatus === 'fixed') {
        toast({
          title: "Content Fixed",
          description: `Found ${result.violations.length} violation(s) and provided a compliant version.`,
        });
      } else if (result.isCompliant) {
        toast({
          title: "Compliant",
          description: "Content follows Meta advertising policies!",
        });
      } else {
        toast({
          title: "Policy Violations",
          description: `Found ${result.violations.length} violation(s) that cannot be auto-fixed.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking compliance:", error);
      toast({
        title: "Error",
        description: "Failed to check compliance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingCompliance(false);
    }
  };

  const handleUseFix = () => {
    if (complianceResult?.fixedText) {
      setContent(complianceResult.fixedText);
      setComplianceResult({
        ...complianceResult,
        complianceStatus: 'passed',
        isCompliant: true,
        violations: []
      });
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    
    let finalCampaignId = campaignId;
    
    // Create campaign if needed
    if (!finalCampaignId && onCampaignCreate) {
      finalCampaignId = await onCampaignCreate();
    }
    
    const metadata = {
      generatedAt: new Date().toISOString(),
      complianceCheck: complianceResult ? {
        status: complianceResult.complianceStatus,
        violations: complianceResult.violations,
        checkId: complianceResult.checkId
      } : undefined
    };
    
    await saveContent(
      contentType,
      title,
      content,
      metadata,
      finalCampaignId || undefined
    );
  };

  const handleRegenerate = () => {
    if (content) {
      setComplianceResult(null); // Clear compliance result when regenerating
      handleGenerate();
    }
  };

  const getComplianceIcon = () => {
    if (!complianceResult) return null;
    
    switch (complianceResult.complianceStatus) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fixed':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
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

        {content && (
          <div className="space-y-3 animate-fade-in">
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setComplianceResult(null); // Clear compliance when content changes
                }}
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

            {/* Compliance Status */}
            {complianceResult && (
              <div className={`p-3 rounded-lg border ${
                complianceResult.complianceStatus === 'passed' 
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                  : complianceResult.complianceStatus === 'fixed'
                  ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {getComplianceIcon()}
                  <span className="font-medium text-sm">
                    {complianceResult.complianceStatus === 'passed' && '✅ Policy-Safe'}
                    {complianceResult.complianceStatus === 'fixed' && '⚠️ Updated for Meta Policy Compliance'}
                    {complianceResult.complianceStatus === 'failed' && '❌ Policy Violations Found'}
                  </span>
                </div>
                
                {complianceResult.violations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Violations found:</p>
                    <ul className="list-disc list-inside text-xs space-y-0.5">
                      {complianceResult.violations.map((violation, index) => (
                        <li key={index} className="text-muted-foreground">{violation}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {complianceResult.complianceStatus === 'failed' && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="text-xs"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                )}
              </div>
            )}
            
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
                onClick={handleComplianceCheck}
                disabled={isCheckingCompliance || !content.trim()}
                className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
              >
                {isCheckingCompliance ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                Check Meta Policy
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
