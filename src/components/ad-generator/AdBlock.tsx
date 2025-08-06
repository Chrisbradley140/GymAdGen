
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
    <Card className="group h-full border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover-lift relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl group-hover:text-primary transition-colors duration-300">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 group-hover:scale-110">
            {icon}
          </div>
          <span className="font-bold">{title}</span>
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center gap-2 text-base py-4 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 relative overflow-hidden group/btn"
        >
          {/* Button shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
          
          <Zap className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? "Generating..." : "Generate"}
        </Button>

        {content && (
          <div className="space-y-4 animate-fade-in">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 rounded-lg shadow-inner"
              placeholder={placeholder}
            />
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2 bg-background/50 border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-background/50 border-accent/20 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-2 bg-background/50 border-muted-foreground/20 hover:border-muted-foreground/50 hover:bg-muted/20 transition-all duration-300"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>
        )}
        
        {!content && placeholder && (
          <div className="text-sm text-muted-foreground p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-dashed border-muted-foreground/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
              {placeholder}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
