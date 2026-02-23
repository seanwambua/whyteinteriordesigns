
"use client";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, MessageSquare, Star, Settings, User, ClipboardList, PlayCircle, CheckCircle2, UserPlus, Users, HardHat, ShieldCheck, Handshake, HeartHandshake, Globe, BarChart3, ShieldAlert, PencilRuler, History, Archive, Building2, Landmark, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isNavActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const managementNav = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { title: "Insights", icon: BarChart3, href: "/admin/insights" },
    { title: "Fiscal Management", icon: Landmark, href: "/admin/management/fiscal" },
    { title: "CRM", icon: HeartHandshake, href: "/admin/crm" },
    { title: "System Onboarding", icon: ShieldAlert, href: "/admin/operations/onboarding" },
    { title: "Legacy Sync", icon: History, href: "/admin/management/legacy-sync" },
    { title: "Master Archives", icon: Archive, href: "/admin/clients?tab=archives" },
  ];

  const siteRegistryNav = [
    { title: "Portfolio", icon: Briefcase, href: "/admin/projects" },
    { title: "Inquiries", icon: MessageSquare, href: "/admin/inquiries" },
    { title: "Feedback", icon: Star, href: "/admin/feedback" },
  ];

  const clientNav = [
    { title: "Client Registry", icon: Users, href: "/admin/clients" },
    { title: "Designer Registry", icon: PencilRuler, href: "/admin/designers" },
    { title: "Steward Registry", icon: Building2, href: "/admin/stewards" },
  ];

  const operationsNav = [
    { title: "Initialization", icon: ClipboardList, href: "/admin/operations/planning" },
    { title: "Implementation", icon: PlayCircle, href: "/admin/operations/implementation" },
    { title: "Handover", icon: Handshake, href: "/admin/operations/handover" },
    { title: "Reconciliation", icon: ShieldCheck, href: "/admin/operations/closing" },
  ];

  const hrNav = [
    { title: "Partners & Trades", icon: Users, href: "/admin/hr" },
  ];

  const NavItem = ({ item }: { item: { title: string, icon: any, href: string } }) => {
    const active = isNavActive(item.href);
    const { setOpen, isMobile, setOpenMobile } = useSidebar();

    const handleClick = () => {
      if (isMobile) {
        setOpenMobile(false);
      }
    };

    return (
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={active} 
          className="px-6 h-12 hover:bg-accent/5 rounded-none" 
          tooltip={item.title}
          onClick={handleClick}
        >
          <Link href={item.href} className="flex items-center gap-4">
            <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-accent' : 'text-muted-foreground'}`} />
            <span className={`text-[13px] uppercase tracking-widest font-bold truncate group-data-[collapsible=icon]:hidden ${active ? 'text-accent' : 'text-muted-foreground'}`}>
              {item.title}
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/10 w-full font-body text-sm">
        <Sidebar collapsible="icon" className="border-r border-accent/10 bg-white">
          <SidebarHeader className="p-6">
            <Link href="/" className="group flex flex-col">
              <span className="text-base font-headline font-bold tracking-[0.2em] text-accent uppercase block truncate">
                Whyte Interiors
              </span>
              <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground truncate group-data-[collapsible=icon]:hidden">Admin Terminal</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-[12px] uppercase tracking-widest text-accent/40 font-bold mb-4 group-data-[collapsible=icon]:hidden">Studio Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {managementNav.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-[12px] uppercase tracking-widest text-accent/40 font-bold mb-4 group-data-[collapsible=icon]:hidden">Site Registry</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {siteRegistryNav.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-[12px] uppercase tracking-widest text-accent/40 font-bold mb-4 group-data-[collapsible=icon]:hidden">Client Lifecycle</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {clientNav.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-[12px] uppercase tracking-widest text-accent/40 font-bold mb-4 group-data-[collapsible=icon]:hidden">Project Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {operationsNav.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-[12px] uppercase tracking-widest text-accent/40 font-bold mb-4 group-data-[collapsible=icon]:hidden">Network Matrix</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {hrNav.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-6 border-t border-accent/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-[11px] font-bold uppercase tracking-widest truncate">Senior Partner</p>
                <p className="text-[9px] text-muted-foreground truncate uppercase">Admin Authorized</p>
              </div>
            </div>
          </div>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-20 flex items-center px-8 border-b border-accent/10 bg-white/50 backdrop-blur-md sticky top-0 z-30 justify-between">
            <SidebarTrigger className="text-accent" />
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Nairobi Studio HQ</span>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
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
