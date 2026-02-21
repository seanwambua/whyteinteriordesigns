
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  Activity, 
  ArrowRight,
  LayoutGrid,
  List,
  ChevronRight,
  Info,
  Clock,
  ClipboardList
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectImplementationPage() {
  const { clientProjects } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // IMPLEMENTATION: Only activated, non-archived projects in implementation phases
  const liveProjects = clientProjects.filter(p => 
    !p.isArchived && p.isActivated && (p.status === 'Execution' || p.status === 'Planning' || p.status === 'Completion')
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Live <span className="not-italic">Implementation.</span></h1>
        </div>
        
        <div className="bg-white border border-accent/10 shadow-xl flex p-1.5">
          <Button 
            variant={view === 'grid' ? 'secondary' : 'ghost'} 
            className={cn(
              "rounded-none h-12 px-6 flex gap-3 uppercase tracking-widest text-[12px] font-bold transition-all",
              view === 'grid' ? 'bg-accent text-white shadow-lg' : 'text-accent/40'
            )}
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="h-4.5 w-4.5" /> Deployment Grid
          </Button>
          <Button 
            variant={view === 'list' ? 'secondary' : 'ghost'} 
            className={cn(
              "rounded-none h-12 px-6 flex gap-3 uppercase tracking-widest text-[12px] font-bold transition-all",
              view === 'list' ? 'bg-accent text-white shadow-lg' : 'text-accent/40'
            )}
            onClick={() => setView('list')}
          >
            <List className="h-4.5 w-4.5" /> Site Index
          </Button>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-6">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-accent mb-1">Deployment Logic Protocol</AlertTitle>
        <AlertDescription className="text-[13px] font-light italic text-muted-foreground leading-relaxed">
          Showing all commissions currently in active site deployment or finalized implementation. Archived projects and pending briefings are strictly filtered from this tactile operational view.
        </AlertDescription>
      </Alert>

      {liveProjects.length > 0 ? (
        <div className={cn(
          view === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "flex flex-col gap-6"
        )}>
          {liveProjects.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="rounded-none border-accent/5 shadow-xl bg-white group hover:shadow-2xl transition-all overflow-hidden">
                <div className="flex flex-col">
                  <div className={cn(
                    "h-1.5 w-full",
                    p.status === 'Execution' ? 'bg-green-500' : 'bg-accent/20'
                  )} />
                  <CardContent className="p-10 space-y-10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <span className="text-[12px] font-bold text-accent/40 uppercase tracking-[0.4em]">{p.id}</span>
                          <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest font-bold py-1 px-3 border-accent/10 text-accent bg-accent/5">
                            {p.status}
                          </Badge>
                        </div>
                        <h3 className="text-3xl font-headline italic leading-tight">{p.project}</h3>
                        <p className="text-[13px] text-muted-foreground uppercase tracking-widest font-bold">Client: {p.name}</p>
                      </div>
                      <Button asChild variant="ghost" className="h-14 w-14 rounded-full border border-accent/5 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                        <Link href={`/admin/clients/${p.id}`}><ArrowRight className="h-6 w-6" /></Link>
                      </Button>
                    </div>

                    <div className="space-y-5">
                      <div className="flex justify-between text-[12px] uppercase tracking-[0.4em] font-bold text-accent/60">
                        <span>Implementation Velocity</span>
                        <span>{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1.5 bg-secondary rounded-none" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-accent/5 gap-6">
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2.5 text-[12px] uppercase tracking-widest text-muted-foreground font-bold">
                          <ClipboardList className="h-4.5 w-4.5 text-accent/40" /> 
                          {p.tasks?.length || 0} Protocols Logged
                        </div>
                        <div className="flex items-center gap-2.5 text-[12px] uppercase tracking-widest text-muted-foreground font-bold">
                          <Clock className="h-4.5 w-4.5 text-accent/40" /> 
                          Target: {p.endDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 max-w-[240px]">
                        <Activity className="h-4 w-4 text-accent/20 shrink-0" />
                        <p className="text-[12px] font-light italic text-accent/60 truncate" title={p.lastActivity}>
                          "{p.lastActivity || 'Sync initialized.'}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 border border-dashed border-accent/10 bg-secondary/5 space-y-8">
          <div className="h-20 w-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
            <PlayCircle className="h-10 w-10 text-accent/20" />
          </div>
          <p className="text-lg font-light italic text-muted-foreground uppercase tracking-[0.3em]">
            No active implementation projects prioritized in current cycle
          </p>
          <Button asChild variant="outline" className="rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold shadow-sm border-accent/20 hover:bg-accent hover:text-white transition-all">
            <Link href="/admin/operations/planning">Synchronize Planning Briefs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
