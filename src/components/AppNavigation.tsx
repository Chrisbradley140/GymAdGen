
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Zap, 
  Library, 
  Settings, 
  FileText, 
  User,
  Menu,
  X,
  ChevronDown,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppNavigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Ad Generator", path: "/generate", icon: Zap },
    { name: "Campaign Library", path: "/library", icon: Library },
    { name: "Brand Setup", path: "/brand-setup", icon: Settings },
    { name: "Export PDF", path: "/export", icon: FileText },
    { name: "Account", path: "/account", icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/dashboard')}
          >
            <div className="relative">
              <img 
                src="/lovable-uploads/c4cf7462-6a0c-4f7b-ac89-546cd215771a.png" 
                alt="FitnessAds.AI Logo" 
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              FITNESSADS.AI
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center bg-muted/30 rounded-2xl p-2 backdrop-blur-sm">
              {navigationItems.map((item, index) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                    transition-all duration-300 ease-out group
                    ${isActivePath(item.path) 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/80 hover:shadow-md'
                    }
                    ${index < navigationItems.length - 1 ? 'mr-1' : ''}
                  `}
                >
                  <item.icon className={`w-4 h-4 transition-transform duration-300 ${
                    isActivePath(item.path) ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="whitespace-nowrap">{item.name}</span>
                  
                  {/* Active tab indicator */}
                  {isActivePath(item.path) && (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl animate-pulse"></div>
                  )}
                  
                  {/* Hover underline effect */}
                  <div className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary rounded-full
                    transition-all duration-300 ease-out
                    ${isActivePath(item.path) ? 'w-full' : 'w-0 group-hover:w-3/4'}
                  `}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop User Profile */}
          <div className="hidden lg:flex items-center">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-3 h-12 px-4 rounded-2xl border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-sm max-w-32 truncate">{user.email}</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-popover/95 backdrop-blur-lg border-border/50 rounded-2xl shadow-2xl p-2">
                  <DropdownMenuLabel className="text-muted-foreground px-4 py-3 text-xs uppercase tracking-wide font-semibold">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  
                  {navigationItems.map((item) => (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl mx-1 hover:bg-accent/80 transition-all duration-200"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator className="bg-border/50 my-2" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-3 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 rounded-xl mx-1 font-medium transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden w-12 h-12 rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 py-6 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center gap-4 px-4 py-4 rounded-2xl text-left font-semibold transition-all duration-300
                    ${isActivePath(item.path)
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/80'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* Mobile User Info & Logout */}
              <div className="border-t border-border/50 pt-6 mt-6">
                {user && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 px-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xs">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium">{user.email}</span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 h-12 rounded-2xl border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive font-semibold transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavigation;
