
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Zap, 
  Library, 
  Settings, 
  FileText, 
  User,
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const [userLogo, setUserLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserLogo = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('user_onboarding')
        .select('logo_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.logo_url) {
        setUserLogo(data.logo_url);
      }
    };

    fetchUserLogo();
  }, [user]);

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Ad Generator", path: "/generate", icon: Zap },
    { name: "Campaign Library", path: "/library", icon: Library },
    { name: "Brand Setup", path: "/brand-setup", icon: Settings },
    
    { name: "Account", path: "/account", icon: User },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border" collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/c4cf7462-6a0c-4f7b-ac89-546cd215771a.png" 
            alt="FitnessAds.AI Logo" 
            className="w-10 h-10"
          />
          {state === "expanded" && (
            <span className="text-xl font-bold">FITNESSADS.AI</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActivePath(item.path)}
                    size="lg"
                  >
                    <button
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-4 w-full h-12 px-4 text-base font-medium rounded-lg transition-all ${
                        isActivePath(item.path) 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
                      {state === "expanded" && <span className="text-base">{item.name}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {userLogo && state === "expanded" && (
          <div className="flex justify-center p-3">
            <img 
              src={userLogo} 
              alt="Logo" 
              className="h-auto w-auto max-h-24 max-w-[160px] object-contain rounded-lg border ring-1 ring-border shadow-md p-2"
            />
          </div>
        )}
        {userLogo && state === "collapsed" && (
          <div className="flex justify-center">
            <img 
              src={userLogo} 
              alt="Logo" 
              className="h-auto w-auto max-h-10 max-w-10 object-contain rounded-lg border ring-1 ring-border shadow"
            />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
