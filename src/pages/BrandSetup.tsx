
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw } from "lucide-react";

const BrandSetup = () => {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Brand Setup</h1>
        <p className="text-muted-foreground">
          View and update your brand settings to improve ad personalization
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>
                  Your business name, logo, and basic brand details
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Business Name</label>
                <p className="text-muted-foreground">Your Business Name</p>
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <p className="text-muted-foreground">www.yourbusiness.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Brand Colors & Style</CardTitle>
                <CardDescription>
                  Color palette and visual identity preferences
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg"></div>
              <div className="w-12 h-12 bg-green-500 rounded-lg"></div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg"></div>
              <span className="text-sm text-muted-foreground">Primary brand colors</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Target Audience</CardTitle>
                <CardDescription>
                  Your ideal customer demographics and preferences
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Primary Audience</label>
                <p className="text-muted-foreground">Adults 25-45 interested in fitness</p>
              </div>
              <div>
                <label className="text-sm font-medium">Fitness Focus</label>
                <p className="text-muted-foreground">Weight Loss, Strength Training</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Voice & Tone</CardTitle>
                <CardDescription>
                  How your brand communicates with customers
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium">Brand Voice</label>
              <p className="text-muted-foreground">Motivational, supportive, and results-focused</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => navigate('/onboarding')} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retake Onboarding Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandSetup;
