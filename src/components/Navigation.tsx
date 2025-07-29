
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown, LayoutDashboard, Zap, Library, Settings, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const handleLogoClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Ad Generator", path: "/generate", icon: Zap },
    { name: "Campaign Library", path: "/library", icon: Library },
    { name: "Brand Setup", path: "/brand-setup", icon: Settings },
    { name: "Export PDF", path: "/export", icon: FileText },
    { name: "Account", path: "/account", icon: User },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-muted z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img 
            src="/lovable-uploads/c4cf7462-6a0c-4f7b-ac89-546cd215771a.png" 
            alt="FitnessAds.AI Logo" 
            className="w-8 h-8"
          />
          <span className="text-xl font-bold">FITNESSADS.AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuLabel className="text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navigationItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleAuthAction}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="default"
              onClick={handleAuthAction}
              className="flex items-center gap-2"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
