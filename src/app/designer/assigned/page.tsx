"use client";

import { motion } from "framer-motion";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Search, 
  ArrowRight, 
  Clock, 
  Activity,
  MapPin,
  Loader2,
  Calendar,
  ClipboardList
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function DesignerAssignedProjectsPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [activeDesignerId, setActiveDesignerId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const onboarded = localStorage.getItem("whyte_designer_onboarded") === "true";
    if (!onboarded) {
      router.replace("/designer/onboarding");
      return;
    }
    setActiveDesignerId(localStorage.getItem("whyte_active_designer_id"));
  }, [router]);

  const assignedProjects = useMemo(() => {
    return clientProjects.filter(p => 
      p.assignedDesignerId === activeDesignerId && 
      !p.isArchived && 
      p.isActivated && 
      p.status === 'Execution'
    );
  }, [clientProjects, activeDesignerId]);

  const filtered = assignedProjects.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Designer Terminal</span>
          </div>
          <h1 className="text-5xl font-headline italic">My <span className="not-italic">Assignments.</span></h1>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search active assignments..." 
            className="w-full pl-12 pr-4 rounded-none border border-neutral-200 h-14 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {filtered.map((p, index) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-neutral-100 bg-white hover:border-accent/40 transition-all group overflow-hidden shadow-sm">
              <div className="flex flex-col lg:flex-row h-full">
                <div className="p-10 border-b lg:border-b-0 lg:border-r border-neutral-50 bg-neutral-50/30 flex flex-col justify-between min-w-[300px]">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-accent/40 uppercase tracking-[0.4em] block">{p.id}</span>
                      <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[10px] font-bold py-1.5 px-4">{p.tier} Tier</Badge>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                      <p className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.3em]">Temporal Goal</p>
                      <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 opacity-40" /> Handover: {p.endDate}
                      </div>
                    </div>
                  </div>
                  <div className="pt-10">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-accent/40 mb-2">
                      <span>Implementation Velocity</span>
                      <span>{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-1 bg-neutral-100 rounded-none" />
                  </div>
                </div>

                <div className="flex-1 p-10 md:p-12 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-4xl font-headline italic leading-tight text-accent">{p.project}</h3>
                      <p className="text-[12px] uppercase tracking-widest font-bold text-muted-foreground opacity-60">Client: {p.name}</p>
                    </div>
                    <p className="text-base font-light italic text-accent/60 leading-relaxed border-l-2 border-accent/10 pl-8 max-w-2xl line-clamp-2">
                      "{p.description || p.workScope || "No brief synchronized."}"
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-neutral-50 mt-12">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
                        <ClipboardList className="h-4 w-4 text-accent/20" /> 
                        {p.tasks?.length || 0} Site Protocols
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
                        <Activity className="h-4 w-4 text-accent/20" /> 
                        Latest: "{p.lastActivity || 'Sync Estabished'}"
                      </div>
                    </div>
                    <Button asChild className="h-16 px-12 rounded-none bg-accent text-white uppercase tracking-widest text-[11px] font-bold hover:bg-accent/90 transition-all flex gap-3 shadow-xl">
                      <Link href={`/designer/projects/${p.id}`}>Open Workbench <ArrowRight className="h-5 w-5" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-40 border border-dashed border-neutral-200 bg-neutral-50/50 italic text-[12px] uppercase tracking-[0.3em] font-light">
            No active implementation dossiers currently assigned to your identity
          </div>
        )}
      </div>
    </div>
  );
}
