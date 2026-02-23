
"use client";

import { motion } from "framer-motion";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, History, LogOut, Activity, Signature, Scale } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function StewardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { financialSteward, clientProjects } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const isOnboarded = localStorage.getItem("whyte_steward_onboarded") === "true";
    setOnboarded(isOnboarded);

    if (!isOnboarded && pathname !== "/steward/onboarding") {
      router.push("/steward/onboarding");
    }
  }, [pathname, router]);

  if (!isMounted || onboarded === null) return null;

  // Don't show sidebar on onboarding page
  if (pathname === "/steward/onboarding") {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  const pendingWitnessCount = clientProjects.filter(p => 
    p.reorganization?.status === 'Pending_Agreement' && 
    p.reorganization.clientAgreed && 
    !p.reorganization.stewardWitnessed
  ).length;

  const navItems = [
    { title: "Stewardship Workbench", icon: LayoutDashboard, href: "/steward" },
    { 
      title: "Witnessing Terminal", 
      icon: Signature, 
      href: "/steward/agreements",
      badge: pendingWitnessCount > 0 ? pendingWitnessCount : null
    },
    { title: "Audit History", icon: History, href: "/steward/history" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/10 w-full font-body">
        <Sidebar collapsible="icon" className="border-r border-accent/10 bg-white">
          <SidebarHeader className="p-8">
            <Link href="/steward" className="group flex flex-col">
              <span className="text-base font-headline font-bold tracking-[0.2em] text-accent uppercase block truncate">
                Whyte Interiors
              </span>
              <span className="text-[11px] uppercase tracking-[0.4em] text-accent/40 truncate group-data-[collapsible=icon]:hidden">Auditing Terminal</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-[12px] uppercase tracking-[0.3em] text-accent/30 font-bold mb-6 group-data-[collapsible=icon]:hidden">Reconciliation Hub</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href} 
                        className="px-6 h-14 hover:bg-accent/5 rounded-none relative" 
                        tooltip={item.title}
                      >
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon className={`h-5 w-5 shrink-0 ${pathname === item.href ? 'text-accent' : 'text-accent/40'}`} />
                          <span className={`text-[13px] uppercase tracking-[0.2em] font-bold truncate group-data-[collapsible=icon]:hidden ${pathname === item.href ? 'text-accent' : 'text-accent/60'}`}>
                            {item.title}
                          </span>
                          {item.badge && (
                            <Badge className="absolute right-4 bg-orange-600 text-white rounded-none text-[8px] h-4 min-w-4 flex items-center justify-center p-0 group-data-[collapsible=icon]:hidden">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-8 border-t border-accent/5">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-none bg-accent flex items-center justify-center text-white text-[11px] font-bold">
                  FS
                </div>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-[11px] font-bold uppercase tracking-widest truncate text-accent">Financial Steward</p>
                  <p className="text-[9px] text-accent/40 truncate uppercase font-bold">Partner Authorized</p>
                </div>
              </div>
              <Link 
                href="/" 
                className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent transition-colors group-data-[collapsible=icon]:hidden"
                onClick={() => localStorage.removeItem("whyte_steward_onboarded")}
              >
                <LogOut className="h-4 w-4" /> Exit Terminal
              </Link>
            </div>
          </div>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-20 flex items-center px-10 border-b border-accent/10 bg-white/50 backdrop-blur-md sticky top-0 z-30 justify-between">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="text-accent/60 hover:text-accent" />
              <div className="h-4 w-px bg-accent/10" />
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-accent/40" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{financialSteward}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Secure Sync Established</span>
            </div>
          </header>
          <main className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
