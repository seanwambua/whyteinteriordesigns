
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
      <div className="flex min-h-screen bg-slate-50 w-full font-body">
        <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
          <SidebarHeader className="p-8">
            <Link href="/steward" className="group flex flex-col">
              <span className="text-sm font-headline font-bold tracking-[0.2em] text-slate-900 uppercase block truncate">
                Steward Portal
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 truncate group-data-[collapsible=icon]:hidden">Auditing Workbench</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-4 group-data-[collapsible=icon]:hidden">Reconciliation Hub</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href} 
                        className="px-6 h-12 hover:bg-slate-50 rounded-none relative" 
                        tooltip={item.title}
                      >
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon className={`h-4 w-4 shrink-0 ${pathname === item.href ? 'text-slate-900' : 'text-slate-400'}`} />
                          <span className={`text-[12px] uppercase tracking-widest font-bold truncate group-data-[collapsible=icon]:hidden ${pathname === item.href ? 'text-slate-900' : 'text-slate-400'}`}>
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
          <div className="mt-auto p-8 border-t border-slate-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-none bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                  FS
                </div>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="text-[11px] font-bold uppercase tracking-widest truncate text-slate-900">Financial Steward</p>
                  <p className="text-[9px] text-slate-400 truncate uppercase">Partner Authorized</p>
                </div>
              </div>
              <Link 
                href="/" 
                className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group-data-[collapsible=icon]:hidden"
                onClick={() => localStorage.removeItem("whyte_steward_onboarded")}
              >
                <LogOut className="h-3.5 w-3.5" /> Exit Terminal
              </Link>
            </div>
          </div>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-20 flex items-center px-10 border-b border-slate-200 bg-white sticky top-0 z-30 justify-between">
            <div className="flex items-center gap-6">
              <SidebarTrigger className="text-slate-400 hover:text-slate-900" />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">{financialSteward}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Secure Sync Active</span>
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
