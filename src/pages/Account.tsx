
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Mail, Calendar, LogOut, CreditCard, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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

  const handlePasswordChange = async (values: PasswordFormValues) => {
    setIsChangingPassword(true);
    
    try {
      // First verify the current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: values.currentPassword,
      });

      if (verifyError) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        setIsChangingPassword(false);
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (updateError) {
        toast({
          title: "Error",
          description: updateError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        passwordForm.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
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
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="mb-4">
                    <p className="font-semibold text-lg flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Change Password
                    </p>
                    <p className="text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                  
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter current password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter new password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm new password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={isChangingPassword}
                          variant="outline"
                          className="text-base px-6 py-2"
                        >
                          {isChangingPassword ? "Updating Password..." : "Update Password"}
                        </Button>
                      </div>
                    </form>
                  </Form>
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
