
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

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
    <Sidebar className="border-r border-border w-64">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/c4cf7462-6a0c-4f7b-ac89-546cd215771a.png" 
            alt="FitnessAds.AI Logo" 
            className="w-10 h-10"
          />
          {state === "expanded" && (
            <span className="text-xl font-bold text-foreground">FITNESSADS.AI</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActivePath(item.path)}
                    className="h-12 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50"
                  >
                    <button
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-3 w-full text-left ${
                        isActivePath(item.path) 
                          ? 'bg-primary text-primary-foreground font-medium' 
                          : 'text-foreground hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {state === "expanded" && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="default"
                className="flex items-center gap-3 w-full justify-start h-12 px-3 rounded-lg"
              >
                <User className="w-5 h-5 flex-shrink-0" />
                {state === "expanded" && (
                  <>
                    <span className="truncate text-sm font-medium">{user.email}</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </>
                )}
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
                onClick={handleSignOut}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
