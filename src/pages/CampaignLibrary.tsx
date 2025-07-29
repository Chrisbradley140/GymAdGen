
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Library, Eye, Download, Zap } from "lucide-react";

const CampaignLibrary = () => {
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

  // Mock data for now
  const mockCampaigns = [
    {
      id: 1,
      title: "Weight Loss Transformation",
      hook: "Stop Counting Calories. Start Dropping Pounds.",
      performance: "+284% CTR",
      createdAt: "2 days ago",
      status: "Active"
    },
    {
      id: 2,
      title: "Strength Training for Beginners",
      hook: "Weak at 40? This Changes Everything.",
      performance: "+195% Leads",
      createdAt: "1 week ago",
      status: "Paused"
    },
    {
      id: 3,
      title: "Flexible Dieting Guide",
      hook: "Eat Pizza. Lose Weight. (Here's How)",
      performance: "+312% ROAS",
      createdAt: "2 weeks ago",
      status: "Active"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Campaign Library</h1>
          <p className="text-muted-foreground">
            View and manage all your generated ad campaigns
          </p>
        </div>

        <div className="grid gap-6">
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <CardDescription className="text-lg font-medium mt-1">
                      "{campaign.hook}"
                    </CardDescription>
                  </div>
                  <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {campaign.performance}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Created {campaign.createdAt}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockCampaigns.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Library className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <CardTitle className="mb-2">No campaigns yet</CardTitle>
              <CardDescription className="mb-4">
                Generate your first ad to start building your campaign library
              </CardDescription>
              <Button onClick={() => navigate('/generate')}>
                <Zap className="w-4 h-4 mr-2" />
                Generate First Ad
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CampaignLibrary;
