"use client";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, MessageSquare, Star, Settings, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function DashboardSidebar() {
  const pathname = usePathname();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();

  const navItems = [
    { title: "My Workspace", icon: LayoutDashboard, href: "/dashboard" },
    { title: "Active Projects", icon: Briefcase, href: "/dashboard/projects" },
    { title: "Consultations", icon: MessageSquare, href: "/dashboard/consultations" },
    { title: "Submit Review", icon: Star, href: "/dashboard/submit-review" },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-accent/10">
      <SidebarHeader className="p-8">
        <Link href="/" className="group flex flex-col">
          <span className="text-sm font-headline font-bold tracking-[0.2em] text-accent uppercase block truncate">
            Whyte Interiors
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-accent/40 block mt-1 group-data-[collapsible=icon]:hidden">Client Portal</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] uppercase tracking-[0.3em] text-accent/30 font-bold mb-6 group-data-[collapsible=icon]:hidden">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href} 
                    className="px-4 h-14 hover:bg-accent/5 rounded-none transition-all" 
                    tooltip={item.title}
                    onClick={handleNavClick}
                  >
                    <Link href={item.href} className="flex items-center gap-4">
                      <item.icon className={`h-5 w-5 shrink-0 ${pathname === item.href ? 'text-accent' : 'text-accent/40'}`} />
                      <span className={`text-xs uppercase tracking-[0.2em] font-bold truncate ${pathname === item.href ? 'text-accent' : 'text-accent/60'}`}>
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
      <div className="mt-auto p-8 border-t border-accent/5">
        <Link href="/" className="flex items-center gap-3 group text-accent/60 hover:text-accent transition-colors">
          <Home className="h-5 w-5 shrink-0" />
          <span className="text-xs uppercase tracking-widest font-bold truncate group-data-[collapsible=icon]:hidden">Exit to Site</span>
        </Link>
      </div>
    </Sidebar>
  );
}

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/10 w-full font-body">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-20 flex items-center px-8 lg:px-12 border-b border-accent/5 bg-white/40 backdrop-blur-xl sticky top-0 z-30 justify-between">
            <SidebarTrigger className="text-accent" />
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Valued Client</p>
                <p className="text-[9px] text-accent/40 uppercase tracking-[0.3em]">Nairobi Residency</p>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-full border border-accent/10 flex items-center justify-center bg-white text-accent text-xs font-bold">
                VC
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 lg:p-12">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}