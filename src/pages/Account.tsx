
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, LogOut, Trash2, CreditCard } from "lucide-react";

const Account = () => {
  const { user, loading, signOut } = useAuth();
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Account Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your profile and account preferences
          </p>
        </div>

        <div className="grid gap-8 max-w-5xl">
          <Card className="border-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="w-6 h-6 text-primary" />
                </div>
                Profile Information
              </CardTitle>
              <CardDescription className="text-base">
                Your basic account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-base font-semibold flex items-center gap-2 text-foreground">
                    <Mail className="w-5 h-5 text-primary" />
                    Email Address
                  </label>
                  <p className="text-muted-foreground text-base pl-7">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-base font-semibold flex items-center gap-2 text-foreground">
                    <Calendar className="w-5 h-5 text-primary" />
                    Member Since
                  </label>
                  <p className="text-muted-foreground text-base pl-7">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                Subscription
              </CardTitle>
              <CardDescription className="text-base">
                Your current plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-semibold text-lg">Free Plan</p>
                  <p className="text-muted-foreground">
                    Limited ad generations per month
                  </p>
                </div>
                <Badge variant="outline" className="text-base px-4 py-2">Free</Badge>
              </div>
              <div className="mt-6">
                <Button variant="outline" disabled className="text-base px-6 py-2">
                  Upgrade Plan (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Account Actions</CardTitle>
              <CardDescription className="text-base">
                Manage your account settings and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-semibold text-lg">Sign Out</p>
                  <p className="text-muted-foreground">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button variant="outline" onClick={handleSignOut} className="text-base px-6 py-2">
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex justify-between items-center p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div>
                    <p className="font-semibold text-lg text-destructive">Delete Account</p>
                    <p className="text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" disabled className="text-base px-6 py-2">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
