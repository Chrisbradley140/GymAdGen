
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Ad Generator", path: "/generate" },
    { name: "Campaign Library", path: "/library" },
    { name: "Brand Setup", path: "/brand-setup" },
    
    { name: "Account", path: "/account" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Top Header with Hamburger Menu and User Profile */}
          <header className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Mobile Hamburger Menu */}
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="md:hidden flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/c4cf7462-6a0c-4f7b-ac89-546cd215771a.png" 
                    alt="FitnessAds.AI Logo" 
                    className="w-8 h-8"
                  />
                  <span className="text-lg font-bold">FITNESSADS.AI</span>
                </div>
              </div>
              {/* User Profile Dropdown */}
              <div className="flex justify-end">
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                      >
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
                          className="flex items-center gap-3 cursor-pointer h-10 px-3"
                        >
                          <span className="text-sm">{item.name}</span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="flex items-center gap-3 cursor-pointer text-destructive focus:text-destructive h-10 px-3"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
