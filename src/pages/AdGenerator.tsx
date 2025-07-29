
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

const AdGenerator = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ad Generator</h1>
          <p className="text-muted-foreground">
            Create high-converting fitness ads powered by AI
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Generate Your Next Ad</CardTitle>
            <CardDescription>
              Our AI will use your brand settings and preferences to create scroll-stopping ads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Ready to create ads that convert? The AI generator will be available soon.
              </p>
              <Button size="lg" className="w-full" disabled>
                <Zap className="w-4 h-4 mr-2" />
                Generate Ad (Coming Soon)
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">What you can expect:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Scroll-stopping hooks based on your niche</li>
                <li>• Conversion-focused body copy</li>
                <li>• Multiple CTA variations</li>
                <li>• Brand-consistent messaging</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/brand-setup')}
                className="flex items-center gap-2"
              >
                Update Brand Settings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdGenerator;
