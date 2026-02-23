"use client";

import { useWhyteStore } from "@/store/use-whyte-store";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MousePointer2, Layers } from "lucide-react";

export default function TacticalPipelinePage() {
  const { clientProjects, inquiries } = useWhyteStore();
  const activeProjects = clientProjects.filter(p => p.isActivated && !p.isArchived);
  const conversionRate = inquiries.length ? (activeProjects.length / inquiries.length) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent"><MousePointer2 className="h-5 w-5" /></div>
          <div className="space-y-1">
            <h3 className="text-xl font-headline italic">Conversion Protocol</h3>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Inquiry to Active Journey Synergy</p>
          </div>
        </div>
        <div className="text-center py-10 space-y-4">
          <p className="text-6xl font-headline italic text-accent">{conversionRate.toFixed(1)}%</p>
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent/40 font-bold">Conversion Velocity</p>
        </div>
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-accent/5">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-40">Total Leads</p>
            <p className="text-xl font-headline italic">{inquiries.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-40">Activated</p>
            <p className="text-xl font-headline italic">{activeProjects.length}</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent"><Layers className="h-5 w-5" /></div>
          <div className="space-y-1">
            <h3 className="text-xl font-headline italic">Lead Classification</h3>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Inquiry Distribution by Service</p>
          </div>
        </div>
        <div className="space-y-6">
          {[
            { label: "New Business", count: inquiries.filter(i => i.type === 'new_business').length, color: "bg-accent" },
            { label: "Project Support", count: inquiries.filter(i => i.type === 'project_support').length, color: "bg-accent/60" },
            { label: "Resolution/Other", count: inquiries.filter(i => i.type !== 'new_business' && i.type !== 'project_support').length, color: "bg-accent/20" },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                <span className="text-accent/60">{item.label}</span>
                <span className="text-accent">{item.count}</span>
              </div>
              <Progress value={(item.count / Math.max(1, inquiries.length)) * 100} className="h-1.5 bg-secondary rounded-none" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
