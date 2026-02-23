"use client";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, Camera, ClipboardList, Users, Compass, PencilRuler, LogOut, Home, Activity, FilePlus, UserCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DesignerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const isOnboarded = localStorage.getItem("whyte_designer_onboarded") === "true";
    setOnboarded(isOnboarded);

    if (!isOnboarded && pathname !== "/designer/onboarding") {
      router.push("/designer/onboarding");
    }
  }, [pathname, router]);

  if (!isMounted || onboarded === null) return null;

  // Don't show sidebar on onboarding page
  if (pathname === "/designer/onboarding") {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  const navItems = [
    { title: "Workbench", icon: LayoutDashboard, href: "/designer" },
    { title: "My Assignments", icon: UserCheck, href: "/designer/assigned" },
    { title: "Initialize Brief", icon: FilePlus, href: "/designer/initialize" },
    { title: "Studio Registry", icon: Briefcase, href: "/designer/projects" },
    { title: "Site Log Registry", icon: ClipboardList, href: "/designer/logs" },
  ];

  const resourceNav = [
    { title: "Partner Matrix", icon: Users, href: "/designer/resources" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-neutral-50/50 w-full font-body">
        <Sidebar collapsible="icon" className="border-r border-neutral-200 bg-white">
          <SidebarHeader className="p-8">
            <Link href="/designer" className="group flex flex-col">
              <span className="text-sm font-headline font-bold tracking-[0.2em] text-accent uppercase block truncate">
                Designer Portal
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground truncate group-data-[collapsible=icon]:hidden">Creative Execution</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-4 group-data-[collapsible=icon]:hidden">Deployment Hub</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href} 
                        className="px-6 h-12 hover:bg-neutral-50 rounded-none" 
                        tooltip={item.title}
                      >
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon className={`h-4 w-4 shrink-0 ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span className={`text-[12px] uppercase tracking-widest font-bold truncate group-data-[collapsible=icon]:hidden ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-4 group-data-[collapsible=icon]:hidden">Resources</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {resourceNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href} 
                        className="px-6 h-12 hover:bg-neutral-50 rounded-none" 
                        tooltip={item.title}
                      >
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon className={`h-4 w-4 shrink-0 ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span className={`text-[12px] uppercase tracking-widest font-bold truncate group-data-[collapsible=icon]:hidden ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <div className="mt-auto p-8 border-t border-neutral-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-none bg-accent flex items-center justify-center text-white text-[10px] font-bold">
                  DL
                </div>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-[11px] font-bold uppercase tracking-widest truncate text-accent">Design Lead</p>
                  <p className="text-[9px] text-muted-foreground truncate uppercase">Execution Authorized</p>
                </div>
              </div>
              <Link 
                href="/" 
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors group-data-[collapsible=icon]:hidden"
                onClick={() => {
                  localStorage.removeItem("whyte_designer_onboarded");
                  localStorage.removeItem("whyte_active_designer_id");
                }}
              >
                <LogOut className="h-3.5 w-3.5" /> Exit Portal
              </Link>
            </div>
          </div>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-20 flex items-center px-10 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 justify-between">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="text-muted-foreground hover:text-accent" />
              <div className="h-4 w-px bg-neutral-200" />
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-accent/40" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Deployment Mode Active</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Studio Sync Established</span>
            </div>
          </header>
          <main className="flex-1 p-10 lg:p-16 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
