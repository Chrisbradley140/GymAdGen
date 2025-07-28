
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdCardProps {
  hook: string;
  body: string;
  cta: string;
  label: string;
  performance?: string;
}

const AdCard = ({ hook, body, cta, label, performance }: AdCardProps) => {
  return (
    <Card className="p-6 bg-secondary/50 border-muted hover-lift group">
      <div className="flex justify-between items-start mb-4">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {label}
        </Badge>
        {performance && (
          <Badge className="bg-green-600 text-white">
            {performance}
          </Badge>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-primary text-sm mb-2">HOOK:</h4>
          <p className="font-semibold text-lg leading-tight">{hook}</p>
        </div>
        
        <div>
          <h4 className="font-bold text-primary text-sm mb-2">BODY:</h4>
          <p className="text-muted-foreground leading-relaxed">{body}</p>
        </div>
        
        <div>
          <h4 className="font-bold text-primary text-sm mb-2">CTA:</h4>
          <p className="font-bold text-white bg-primary/20 px-4 py-2 rounded-md border border-primary/30">
            {cta}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AdCard;
