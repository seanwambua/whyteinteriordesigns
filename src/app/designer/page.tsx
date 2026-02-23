
"use client";

import { motion } from "framer-motion";
import { useWhyteStore, ClientProject, ProjectTask } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PencilRuler, 
  Briefcase, 
  ClipboardList, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  Zap,
  MapPin,
  FilePlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DesignerDashboardPage() {
  const { clientProjects } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeDossiers = useMemo(() => 
    clientProjects.filter(p => !p.isArchived && p.isActivated && p.status === 'Execution'),
    [clientProjects]
  );

  const pendingBriefs = useMemo(() =>
    clientProjects.filter(p => p.status === 'Planning' && p.initializedBy === 'Designer'),
    [clientProjects]
  );

  const urgentTasks = useMemo(() => {
    const tasks: { projectId: string, projectName: string, task: ProjectTask }[] = [];
    activeDossiers.forEach(p => {
      (p.tasks || []).forEach(t => {
        if (t.status !== 'Done' && t.priority === 'High') {
          tasks.push({ projectId: p.id, projectName: p.project, task: t });
        }
      });
    });
    return tasks.slice(0, 5);
  }, [activeDossiers]);

  if (!isMounted) return null;

  const stats = [
    { label: "Active Site Protocols", value: activeDossiers.length.toString(), icon: Briefcase, sub: "Synchronized Dossiers" },
    { label: "Pending Briefs", value: pendingBriefs.length.toString(), icon: FilePlus, sub: "Awaiting Admin Auth" },
    { label: "Deployment Velocity", value: "92%", icon: Activity, sub: "Across Commissions" },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Creative Workbench</span>
          </div>
          <h1 className="text-5xl font-headline italic">Lead <span className="not-italic">Execution.</span></h1>
        </div>
        <div className="flex gap-4">
          <Button asChild className="bg-accent text-white rounded-none h-12 uppercase tracking-widest text-[10px] font-bold px-8 shadow-xl hover:tracking-[0.2em] transition-all">
            <Link href="/designer/initialize" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" /> Initialize New Brief
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none border-accent/10 text-accent h-12 uppercase tracking-widest text-[10px] font-bold px-8 shadow-sm">
            <Link href="/designer/logs">View All Site Logs</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-neutral-200 bg-white shadow-sm overflow-hidden group">
              <div className="h-1 w-full bg-accent/5" />
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-accent/40 group-hover:text-accent transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline italic text-accent">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Active Site Dossiers */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Briefcase className="h-5 w-5 text-accent/40" />
              <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent">Active Site Dossiers</h2>
            </div>
            <Link href="/designer/projects" className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">View Full Registry</Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {activeDossiers.map((p, index) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="rounded-none border-neutral-200 bg-white hover:border-accent/40 transition-all group shadow-sm overflow-hidden">
                  <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8 flex-1">
                      <div className="h-16 w-16 rounded-none border border-neutral-100 flex flex-col items-center justify-center bg-neutral-50 text-accent/40 group-hover:bg-accent group-hover:text-white transition-all">
                        <PencilRuler className="h-6 w-6" />
                        <span className="text-[8px] font-black uppercase mt-1">EXEC</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{p.id}</span>
                          <h3 className="text-2xl font-headline italic text-accent leading-tight">{p.project}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                          <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 opacity-40" /> Target: {p.endDate}</span>
                          <div className="flex items-center gap-4 w-40">
                            <span className="text-[10px] text-accent/60">{p.progress}%</span>
                            <Progress value={p.progress} className="h-1 bg-neutral-100 flex-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-accent hover:text-white transition-all border border-transparent hover:border-accent">
                      <Link href={`/designer/projects/${p.id}`}><ArrowRight className="h-5 w-5" /></Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
            {activeDossiers.length === 0 && (
              <div className="py-20 text-center border border-dashed border-neutral-200 bg-neutral-50 italic text-[12px] uppercase tracking-widest text-muted-foreground font-light">
                No active implementation dossiers assigned
              </div>
            )}
          </div>
        </div>

        {/* Urgent Protocols Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-none border-neutral-900 bg-accent text-white p-10 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-32 w-32" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 relative z-10">Urgent Site Protocols</h3>
            
            <div className="space-y-8 relative z-10">
              {urgentTasks.map((item, i) => (
                <div key={i} className="space-y-2 group cursor-pointer">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{item.projectId}</span>
                    <Badge variant="outline" className="rounded-none text-[8px] border-white/20 text-white uppercase px-2">High Priority</Badge>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest leading-tight group-hover:underline">{item.task.title}</p>
                  <p className="text-[10px] text-white/60 italic font-light">Dossier: {item.projectName}</p>
                </div>
              ))}
              {urgentTasks.length === 0 && (
                <p className="text-[11px] text-white/40 italic uppercase tracking-widest">No critical site protocols outstanding</p>
              )}
            </div>

            <Button asChild variant="outline" className="w-full h-14 bg-white/5 border-white/20 text-white hover:bg-white hover:text-accent rounded-none uppercase tracking-widest text-[10px] font-bold transition-all mt-8">
              <Link href="/designer/logs">Open Deployment Log</Link>
            </Button>
          </Card>

          <div className="p-10 border border-dashed border-neutral-200 bg-neutral-50 text-center space-y-6">
            <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground/60 leading-relaxed italic">
              "Every architectural detail is a signature of our studio's uncompromising pursuit of excellence."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
