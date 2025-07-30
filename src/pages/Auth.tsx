import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const checkOnboardingStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('completed_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking onboarding status:', error);
      return false;
    }

    return data?.completed_at !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          });
          
          // Check if user has completed onboarding
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const hasCompletedOnboarding = await checkOnboardingStatus(user.id);
            if (!hasCompletedOnboarding) {
              navigate('/onboarding');
            } else {
              navigate('/dashboard');
            }
          }
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Account created!",
            description: "Welcome! You'll now be taken to the onboarding wizard.",
          });
          
          // For new signups, immediately redirect to onboarding
          // Small delay to ensure the toast is visible
          setTimeout(() => {
            navigate('/onboarding');
          }, 1000);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-muted-foreground/20"></div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          {/* Logo */}
          <div className="flex items-center mb-16">
            <div className="w-12 h-12 flex items-center justify-center mr-3">
              <img 
                src="/lovable-uploads/1b22bfb8-d910-46a5-bc37-d85de327a193.png" 
                alt="FitnessAds.ai Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-foreground">FITNESSADS.AI</span>
          </div>
          
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-foreground leading-tight mb-6">
              Your Brand. Your Voice. AI Generated Campaigns That{' '}
              <span className="text-primary">Perform</span>
            </h1>
            
            {/* Decorative Lines */}
            <div className="flex items-center space-x-4 mt-8">
              <div className="h-1 w-16 bg-primary"></div>
              <div className="h-1 w-8 bg-primary/60"></div>
              <div className="h-1 w-4 bg-primary/30"></div>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md">
          {/* Mobile Back Button */}
          <button
            onClick={() => navigate('/')}
            className="lg:hidden flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          {/* Form Container with Glass Effect */}
          <div className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl p-8 hover:bg-gray-600/20 transition-all duration-300">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="text-sm text-muted-foreground mb-2">
                {isLogin ? 'WELCOME BACK' : 'GET STARTED'}
              </div>
              <h2 className="text-3xl font-bold text-card-foreground">
                {isLogin ? 'Log in to FitnessAds.ai' : 'Create your account'}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-card-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                    className="h-12 bg-background/50 backdrop-blur-sm border-border/50"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johnsondoe@nomail.com"
                  required
                  className="h-12 bg-background/50 backdrop-blur-sm border-border/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    required
                    className="h-12 bg-background/50 backdrop-blur-sm border-border/50 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-left">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="bg-destructive/20 backdrop-blur-sm border-destructive/30">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-primary/90 backdrop-blur-sm hover:bg-primary"
                disabled={loading}
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Sign up')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-muted-foreground text-sm">
                {isLogin ? "New User? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setFullName('');
                }}
                className="text-primary hover:underline font-medium text-sm"
              >
                {isLogin ? "SIGN UP HERE" : "SIGN IN HERE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
