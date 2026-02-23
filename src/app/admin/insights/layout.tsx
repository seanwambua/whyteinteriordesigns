"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo } from "react";
import { 
  Wallet, 
  MousePointer2, 
  Activity, 
  Star,
  Target,
  Zap,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  const { clientProjects, inquiries, feedback } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeProjects = clientProjects.filter(p => p.isActivated && !p.isArchived);
  const totalRevenue = useMemo(() => activeProjects.reduce((sum, p) => sum + (p.totalBudget || 0), 0), [activeProjects]);
  const leadVelocity = inquiries.filter(i => i.status === 'new').length;
  
  const studioEfficiency = useMemo(() => {
    if (activeProjects.length === 0) return 0;
    return Math.round(activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length);
  }, [activeProjects]);

  const npsScore = useMemo(() => {
    const approved = feedback.filter(f => f.isApproved);
    if (!approved.length) return 0;
    const avg = approved.reduce((sum, f) => sum + f.rating, 0) / approved.length;
    return (avg * 20); // Normalize to 100
  }, [feedback]);

  if (!isMounted) return null;

  const stats = [
    { label: "Gross Capital", value: `KES ${(totalRevenue / 1000000).toFixed(1)}M`, sub: "Active Commitment", icon: Wallet, color: "text-accent" },
    { label: "Lead Velocity", value: leadVelocity.toString(), sub: "Awaiting Sync", icon: MousePointer2, color: "text-orange-600" },
    { label: "Efficiency Index", value: `${studioEfficiency}%`, sub: "Operational Speed", icon: Activity, color: "text-green-600" },
    { label: "Brand Equity", value: `${npsScore.toFixed(0)}`, sub: "Sentiment Score", icon: Star, color: "text-amber-500" },
  ];

  const subNav = [
    { title: "Fiscal Terminal", href: "/admin/insights/fiscal", icon: Wallet },
    { title: "Tactical Pipeline", href: "/admin/insights/tactical", icon: Target },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Studio Intelligence</span>
          </div>
          <h1 className="text-5xl font-headline italic">Strategic <span className="not-italic">Insights.</span></h1>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="rounded-none border-accent/10 text-accent/60 uppercase tracking-widest text-[10px] px-4 py-2 bg-white">
            Fiscal Cycle: Q3 2024
          </Badge>
          <Badge className="rounded-none bg-accent text-white uppercase tracking-widest text-[10px] px-4 py-2">
            Audit Verified
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-accent/5 shadow-xl bg-white overflow-hidden group">
              <div className="h-1 w-full bg-accent/5" />
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={cn("h-5 w-5 opacity-40", stat.color)} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline italic">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-12">
        <div className="bg-transparent border-b border-accent/5 w-full flex justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          {subNav.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "rounded-none border-b-2 uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3 transition-all",
                pathname === item.href 
                  ? "border-accent text-accent" 
                  : "border-transparent text-muted-foreground hover:text-accent/60"
              )}
            >
              <item.icon className="h-4 w-4" /> {item.title}
            </Link>
          ))}
        </div>

        <motion.div 
          key={pathname}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </div>

      <div className="p-10 border border-dashed border-accent/20 text-center bg-accent/[0.02]">
        <p className="text-[11px] uppercase tracking-[0.5em] text-accent/40 font-bold italic">
          Insights are strictly synchronized with the master registry. Unauthorized data extraction is logged via Studio Protocol.
        </p>
      </div>
    </div>
  );
}
