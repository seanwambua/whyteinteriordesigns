
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
  Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function ProjectImplementationPage() {
  const { clientProjects } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const liveProjects = clientProjects.filter(p => 
    p.isActivated && (p.status === 'Execution' || p.status === 'Styling' || p.status === 'Procurement' || p.status === 'Completed')
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Live <span className="not-italic">Implementation.</span></h1>
        </div>
        
        <div className="bg-white border border-accent/5 shadow-xl flex p-1">
          <Button 
            variant={view === 'grid' ? 'secondary' : 'ghost'} 
            className={`rounded-none h-10 px-4 flex gap-2 uppercase tracking-widest text-[9px] font-bold ${view === 'grid' ? 'bg-accent text-white' : ''}`}
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Deployment Grid
          </Button>
          <Button 
            variant={view === 'list' ? 'secondary' : 'ghost'} 
            className={`rounded-none h-10 px-4 flex gap-2 uppercase tracking-widest text-[9px] font-bold ${view === 'list' ? 'bg-accent text-white' : ''}`}
            onClick={() => setView('list')}
          >
            <List className="h-3.5 w-3.5" /> Site Index
          </Button>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02]">
        <Info className="h-4 w-4 text-accent" />
        <AlertTitle className="text-[10px] font-bold uppercase tracking-widest text-accent">Deployment Logic</AlertTitle>
        <AlertDescription className="text-xs font-light italic text-muted-foreground">
          Showing all commissions currently in active site deployment. Granular task management is handled via the individual **Project Terminals**.
        </AlertDescription>
      </Alert>

      {liveProjects.length > 0 ? (
        <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-6"}>
          {liveProjects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="rounded-none border-accent/5 shadow-xl bg-white group hover:shadow-2xl transition-all overflow-hidden">
                <div className="flex flex-col">
                  <div className="bg-accent/5 h-1 w-full" />
                  <CardContent className="p-8 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-headline italic">{p.project}</h3>
                          <Badge variant="outline" className="rounded-none text-[8px] uppercase tracking-widest font-bold">{p.status}</Badge>
                        </div>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Client: {p.name} • {p.id}</p>
                      </div>
                      <Button asChild variant="ghost" className="h-12 w-12 rounded-full border border-accent/5 group-hover:bg-accent group-hover:text-white transition-all">
                        <Link href={`/admin/clients/${p.id}`}><ArrowRight className="h-5 w-5" /></Link>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-accent/40">
                        <span>Implementation Velocity</span>
                        <span>{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1 bg-secondary rounded-none" />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-accent/5">
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                        <PlayCircle className="h-3.5 w-3.5 text-accent/40" /> 
                        {p.tasks?.length || 0} Site Tasks Logged
                      </div>
                      <p className="text-[10px] font-light italic text-accent/60 truncate max-w-[200px]">{p.lastActivity}</p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 space-y-6">
          <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No active implementation projects prioritized</p>
          <Button asChild variant="outline" className="rounded-none uppercase tracking-widest text-[10px]">
            <Link href="/admin/operations/planning">View Planning Briefs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
