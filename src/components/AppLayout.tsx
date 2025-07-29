
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppNavigation from "@/components/AppNavigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Top Navigation Bar */}
      <AppNavigation />
      
      {/* Sidebar Layout */}
      <SidebarProvider>
        <div className="flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <main className="flex-1 p-6 pt-4">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
