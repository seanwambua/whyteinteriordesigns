
"use client";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, MessageSquare, Star, Settings, User, ClipboardList, PlayCircle, CheckCircle2, UserPlus, Users, HardHat } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const mainNav = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { title: "Portfolio", icon: Briefcase, href: "/admin/projects" },
    { title: "Inquiries", icon: MessageSquare, href: "/admin/inquiries" },
    { title: "Feedback", icon: Star, href: "/admin/feedback" },
  ];

  const clientNav = [
    { title: "Active Journeys", icon: User, href: "/admin/operations/planning" },
    { title: "Initialize Client", icon: UserPlus, href: "/admin/clients/add" },
  ];

  const operationsNav = [
    { title: "Project Planning", icon: ClipboardList, href: "/admin/operations/planning" },
    { title: "Implementation", icon: PlayCircle, href: "/admin/operations/implementation" },
    { title: "Reconciliation", icon: CheckCircle2, href: "/admin/operations/closing" },
  ];

  const hrNav = [
    { title: "Collaborators", icon: Users, href: "/admin/hr" },
    { title: "Vendors & Trades", icon: HardHat, href: "/admin/hr" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/10 w-full font-body">
        <Sidebar className="border-r border-accent/10">
          <SidebarHeader className="p-6">
            <Link href="/" className="group">
              <span className="text-sm font-headline font-bold tracking-[0.2em] text-accent uppercase block">
                Whyte Interiors
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin Terminal</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-[10px] uppercase tracking-widest text-accent/40 font-bold mb-4">Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className="px-6 h-12 hover:bg-accent/5 rounded-none">
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon className={`h-4 w-4 ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span className={`text-[10px] uppercase tracking-widest font-bold ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`}>
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
              <SidebarGroupLabel className="px-6 text-[10px] uppercase tracking-widest text-accent/40 font-bold mb-4">Client Lifecycle</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {clientNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className="px-6 h-12 hover:bg-accent/5 rounded-none">
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon className={`h-4 w-4 ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span className={`text-[10px] uppercase tracking-widest font-bold ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`}>
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
              <SidebarGroupLabel className="px-6 text-[10px] uppercase tracking-widest text-accent/40 font-bold mb-4">Studio Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {operationsNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className="px-6 h-12 hover:bg-accent/5 rounded-none">
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon className={`h-4 w-4 ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span className={`text-[10px] uppercase tracking-widest font-bold ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`}>
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
              <SidebarGroupLabel className="px-6 text-[10px] uppercase tracking-widest text-accent/40 font-bold mb-4">Network & HR</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {hrNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} className="px-6 h-12 hover:bg-accent/5 rounded-none">
                        <Link href={item.href} className="flex items-center gap-4">
                          <item.icon className={`h-4 w-4 ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span className={`text-[10px] uppercase tracking-widest font-bold ${pathname === item.href ? 'text-accent' : 'text-muted-foreground'}`}>
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
          <div className="mt-auto p-6 border-t border-accent/10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest truncate">Admin User</p>
                <p className="text-[8px] text-muted-foreground truncate uppercase">Auth Provisioned</p>
              </div>
            </div>
          </div>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-16 flex items-center px-8 border-b border-accent/10 bg-white/50 backdrop-blur-md sticky top-0 z-30 justify-between">
            <SidebarTrigger className="text-accent" />
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/60">Nairobi HQ</span>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </header>
          <main className="flex-1 p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
