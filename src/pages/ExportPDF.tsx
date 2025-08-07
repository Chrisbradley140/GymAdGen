
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const ExportPDF = () => {
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-klein font-extrabold text-white mb-2">Export PDF</h1>
          <p className="text-muted-foreground">
            Export your ad campaigns as professional PDF documents
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">PDF Export</CardTitle>
            <CardDescription>
              Generate professional PDF reports of your ad campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Export functionality will be available once you have generated ads.
              </p>
              <Button size="lg" className="w-full" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export PDF (Coming Soon)
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">What will be included:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete ad copy with hooks and CTAs</li>
                <li>• Performance metrics and recommendations</li>
                <li>• Brand guidelines and visual elements</li>
                <li>• Campaign optimization suggestions</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/generate')}
              >
                Generate Your First Ad
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportPDF;
