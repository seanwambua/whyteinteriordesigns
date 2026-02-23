"use client";

import { useWhyteStore } from "@/store/use-whyte-store";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function OperationalHealthPage() {
  const { clientProjects, collaborators } = useWhyteStore();
  const activeProjects = clientProjects.filter(p => p.isActivated && !p.isArchived);
  
  const studioEfficiency = useMemo(() => {
    if (activeProjects.length === 0) return 0;
    return Math.round(activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length);
  }, [activeProjects]);

  return (
    <Card className="rounded-none border-accent/5 shadow-2xl bg-white p-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-headline italic">Implementation Velocity</h3>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Cross-Commission Protocol Efficiency</p>
        </div>
        <div className="flex gap-12">
          <div className="text-right">
            <p className="text-3xl font-headline italic text-green-600">{studioEfficiency}%</p>
            <p className="text-[10px] uppercase tracking-widest text-accent/40 font-bold">Studio Average</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-headline italic text-accent">{collaborators.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-accent/40 font-bold">Active Trades</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-accent/5">
        <div className="space-y-6">
          <h4 className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent/40">Resource Utilization</h4>
          <div className="p-8 bg-secondary/10 border border-accent/5 space-y-4">
            <TrendingUp className="h-6 w-6 text-accent opacity-20" />
            <p className="text-sm font-light italic leading-relaxed text-accent/80">"94% of verified trades are currently synchronized with active dossiers, indicating peak capacity."</p>
          </div>
        </div>
        <div className="md:col-span-2 space-y-8">
          <h4 className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent/40">Bottleneck Analysis</h4>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-1 w-full bg-accent/5 rounded-none overflow-hidden"><div className="h-full bg-orange-400 w-[12%]" /></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 shrink-0">Procurement Delay (Low)</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-1 w-full bg-accent/5 rounded-none overflow-hidden"><div className="h-full bg-green-500 w-[85%]" /></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 shrink-0">Site Access (Optimal)</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-1 w-full bg-accent/5 rounded-none overflow-hidden"><div className="h-full bg-accent w-[45%]" /></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent shrink-0">QA Synchronization (Steady)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
