
"use client";

import { motion } from "framer-motion";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Wallet, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  FileText,
  AlertCircle,
  TrendingUp,
  Landmark,
  BadgeCheck,
  Loader2,
  RefreshCcw,
  Banknote,
  Activity,
  ClipboardList,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function StewardDashboardPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [activeStewardId, setActiveStewardId] = useState<string | null>(null);
  const router = useRouter();

  // AUTOMATED ONBOARDING INITIALIZATION
  useEffect(() => {
    setIsMounted(true);
    const onboarded = localStorage.getItem("whyte_steward_onboarded") === "true";
    if (isMounted && !onboarded) {
      router.replace("/steward/onboarding");
    }
    setActiveStewardId(localStorage.getItem("whyte_active_steward_id"));
  }, [isMounted, router]);

  const projects = useMemo(() => {
    const activation = clientProjects.filter(p => 
      !p.isArchived && !p.isActivated && p.pendingActivationData
    );
    
    const live = clientProjects.filter(p => 
      !p.isArchived && p.isActivated && p.status === 'Execution' && p.assignedStewardId === activeStewardId
    );

    const audit = clientProjects.filter(p => 
      !p.isArchived && p.isActivated && p.handoverStatus === 'Passed' && p.financialReportStatus !== 'Verified'
    );

    return { activation, live, audit };
  }, [clientProjects, activeStewardId]);

  const filteredActivation = projects.activation.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLive = projects.live.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAudit = projects.audit.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center py-48 space-y-6">
        <Loader2 className="h-10 w-10 text-accent/20 animate-spin" />
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Synchronizing Audit Terminal...</p>
      </div>
    );
  }

  const stats = [
    { label: "Activation Requests", value: projects.activation.length.toString(), icon: Banknote, sub: "Forensic Queue" },
    { label: "Active Commissions", value: projects.live.length.toString(), icon: Activity, sub: "Ongoing Oversight" },
    { label: "Final Reconciliations", value: projects.audit.length.toString(), icon: Scale, sub: "Closing Phase" },
  ];

  const ProjectTable = ({ data, emptyMessage, actionLabel }: { data: ClientProject[], emptyMessage: string, actionLabel: string }) => (
    <div className="bg-white border border-accent/5 shadow-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-accent/[0.02] border-b border-accent/10">
            <th className="p-8 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Dossier ID</th>
            <th className="p-8 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Project Context</th>
            <th className="p-8 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Capital Plan</th>
            <th className="p-8 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Lifecycle</th>
            <th className="p-8 text-right text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Protocol</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-accent/5">
          {data.map((p) => (
            <tr key={p.id} className="group hover:bg-accent/[0.01] transition-colors">
              <td className="p-8">
                <span className="text-[13px] font-bold text-accent/60 uppercase tracking-widest">{p.id}</span>
              </td>
              <td className="p-8">
                <div className="space-y-1">
                  <p className="text-xl font-headline italic text-accent">{p.project}</p>
                  <p className="text-[11px] uppercase font-bold text-muted-foreground/60">{p.name}</p>
                </div>
              </td>
              <td className="p-8">
                <div className="space-y-1">
                  <p className="text-[14px] font-bold text-accent">KES {p.totalBudget.toLocaleString()}</p>
                  <p className="text-[10px] text-accent/40 uppercase font-bold tracking-widest">Tier: {p.tier}</p>
                </div>
              </td>
              <td className="p-8">
                <Badge variant="outline" className={cn(
                  "rounded-none uppercase tracking-widest text-[9px] font-bold px-4 py-1.5 border-accent/10",
                  p.status === 'Planning' ? "bg-orange-50 text-orange-600 border-orange-200" :
                  p.status === 'Execution' ? "bg-accent/5 text-accent border-accent/20" :
                  "bg-green-50 text-green-600 border-green-200"
                )}>
                  {p.status}
                </Badge>
              </td>
              <td className="p-8 text-right">
                <Button asChild variant="ghost" size="sm" className="rounded-none border border-accent/5 hover:bg-accent hover:text-white transition-all uppercase tracking-widest text-[10px] font-bold gap-3 h-12 px-6">
                  <Link href={`/steward/projects/${p.id}`}>
                    {actionLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="p-32 text-center text-accent/30 italic text-[13px] uppercase tracking-[0.4em] font-light">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Audit Terminal</span>
          </div>
          <h1 className="text-6xl font-headline italic">Financial <span className="not-italic">Stewardship.</span></h1>
        </div>
        
        <div className="relative w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-accent/30" />
          <input 
            placeholder="Search Master Registry..." 
            className="w-full pl-14 pr-6 rounded-none border border-accent/10 h-16 text-[13px] uppercase tracking-widest bg-white focus:outline-none focus:border-accent/40 shadow-xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-accent/5 bg-white shadow-xl overflow-hidden group">
              <div className="h-1 w-full bg-accent/5" />
              <CardContent className="p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-6 w-6 text-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-5xl font-headline italic text-accent leading-none">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="activation" className="space-y-12">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-16 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="activation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-6 px-0 flex gap-3">
            <Banknote className="h-4.5 w-4.5" /> Activations ({projects.activation.length})
          </TabsTrigger>
          <TabsTrigger value="live" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-6 px-0 flex gap-3">
            <Activity className="h-4.5 w-4.5" /> Active Portfolio ({projects.live.length})
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-6 px-0 flex gap-3">
            <Scale className="h-4.5 w-4.5" /> Reconciliations ({projects.audit.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activation" className="m-0">
          <ProjectTable 
            data={filteredActivation} 
            emptyMessage="No pending activation requests prioritized." 
            actionLabel="Certify Activation"
          />
        </TabsContent>

        <TabsContent value="live" className="m-0">
          <ProjectTable 
            data={filteredLive} 
            emptyMessage="No live execution dossiers assigned." 
            actionLabel="Operation Terminal"
          />
        </TabsContent>

        <TabsContent value="audit" className="m-0">
          <ProjectTable 
            data={filteredAudit} 
            emptyMessage="No dossiers awaiting final reconciliation." 
            actionLabel="Execute Audit"
          />
        </TabsContent>
      </Tabs>

      <div className="p-16 border border-dashed border-accent/20 text-center bg-accent/[0.01]">
        <p className="text-[12px] uppercase tracking-[0.5em] text-accent/30 font-bold italic leading-relaxed max-w-2xl mx-auto">
          "Professional Stewardship — Continuous forensic oversight throughout the architectural commission lifecycle."
        </p>
      </div>
    </div>
  );
}
