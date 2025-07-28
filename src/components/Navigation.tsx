
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-muted z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/f2e23576-ebce-4361-9bb7-ddb8fe6c5fc5.png" 
            alt="FitnessAds.AI Logo" 
            className="w-8 h-8"
          />
          <span className="text-xl font-bold">FITNESSADS.AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="default"
            onClick={handleAuthAction}
            className="flex items-center gap-2"
          >
            {user ? (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
