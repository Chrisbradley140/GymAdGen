
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Save, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AdBlockProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerate: () => Promise<string>;
  placeholder?: string;
}

export function AdBlock({ title, description, icon, onGenerate, placeholder }: AdBlockProps) {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await onGenerate();
      setContent(result);
      toast({
        title: "Success",
        description: `${title} generated successfully!`,
      });
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

  const handleSave = () => {
    // Placeholder for save functionality
    toast({
      title: "Saved",
      description: `${title} saved to your library!`,
    });
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
          className="w-full flex items-center gap-2 text-base py-3"
        >
          <Zap className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate"}
        </Button>

        {content && (
          <div className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              placeholder={placeholder}
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
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
