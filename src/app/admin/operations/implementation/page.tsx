"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  ClipboardList,
  Search,
  Timer,
  AlertCircle,
  MoreVertical
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectImplementationPage() {
  const { clientProjects } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // IMPLEMENTATION: Only activated, non-archived projects in implementation phases
  const liveProjects = useMemo(() => {
    return clientProjects.filter(p => 
      !p.isArchived && 
      p.isActivated && 
      (p.status === 'Execution' || p.status === 'Planning' || p.status === 'Completion')
    );
  }, [clientProjects]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return liveProjects;
    const q = searchQuery.toLowerCase();
    return liveProjects.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.project.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q)
    );
  }, [liveProjects, searchQuery]);

  if (!isMounted) return null;

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
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/20" />
            <input 
              type="text"
              placeholder="Search site dossiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-accent/10 h-14 pl-12 pr-4 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent/40 shadow-sm"
            />
          </div>
          <div className="bg-white border border-accent/10 shadow-sm flex p-1">
            <Button 
              variant="ghost" 
              className={cn(
                "rounded-none h-12 px-6 flex gap-3 uppercase tracking-widest text-[11px] font-bold transition-all",
                view === 'grid' ? 'bg-accent text-white shadow-md' : 'text-accent/40'
              )}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" /> Grid
            </Button>
            <Button 
              variant="ghost" 
              className={cn(
                "rounded-none h-12 px-6 flex gap-3 uppercase tracking-widest text-[11px] font-bold transition-all",
                view === 'list' ? 'bg-accent text-white shadow-md' : 'text-accent/40'
              )}
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" /> Index
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          view === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {filteredProjects.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-none border-accent/5 shadow-xl bg-white group hover:shadow-2xl transition-all overflow-hidden h-full flex flex-col">
                    <div className={cn(
                      "h-1.5 w-full",
                      p.status === 'Execution' ? 'bg-green-500' : 'bg-accent/20'
                    )} />
                    <CardContent className="p-10 space-y-10 flex-1 flex flex-col">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <span className="text-[12px] font-bold text-accent/40 uppercase tracking-[0.4em]">{p.id}</span>
                            <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest font-bold py-1 px-3 border-accent/10 text-accent bg-accent/5">
                              {p.status}
                            </Badge>
                          </div>
                          <h3 className="text-3xl font-headline italic leading-tight">{p.project}</h3>
                          <p className="text-[12px] text-muted-foreground uppercase tracking-widest font-bold">Client: {p.name}</p>
                        </div>
                        <Button asChild variant="ghost" className="h-14 w-14 rounded-full border border-accent/5 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                          <Link href={`/admin/clients/${p.id}`}><ArrowRight className="h-6 w-6" /></Link>
                        </Button>
                      </div>

                      <div className="space-y-5 flex-1">
                        <div className="flex justify-between text-[12px] uppercase tracking-[0.4em] font-bold text-accent/60">
                          <span>Implementation Velocity</span>
                          <span>{p.progress}%</span>
                        </div>
                        <Progress value={p.progress} className="h-1.5 bg-secondary rounded-none" />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-accent/5 gap-6">
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2.5 text-[12px] uppercase tracking-widest text-muted-foreground font-bold" title="Site Protocols">
                            <ClipboardList className="h-4 w-4 text-accent/40" /> 
                            {p.tasks?.length || 0} Protocols
                          </div>
                          <div className="flex items-center gap-2.5 text-[12px] uppercase tracking-widest text-muted-foreground font-bold" title="Timeline Target">
                            <Clock className="h-4 w-4 text-accent/40" /> 
                            {p.endDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 max-w-[240px]">
                          <Activity className="h-3.5 w-3.5 text-accent/20 shrink-0" />
                          <p className="text-[12px] font-light italic text-accent/60 truncate" title={p.lastActivity}>
                            "{p.lastActivity || 'Sync initialized.'}"
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="bg-white border border-accent/5 shadow-2xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-accent/5 border-b border-accent/10">
                      <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Dossier ID</th>
                      <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Project & Client</th>
                      <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Lifecycle Status</th>
                      <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Site Velocity</th>
                      <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Target Deadline</th>
                      <th className="p-6 text-right text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent/5">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="group hover:bg-accent/[0.02] transition-colors">
                        <td className="p-6">
                          <span className="text-[12px] font-bold text-accent uppercase tracking-widest">{p.id}</span>
                        </td>
                        <td className="p-6">
                          <div className="space-y-1">
                            <p className="text-base font-headline italic text-accent">{p.project}</p>
                            <p className="text-[12px] uppercase font-bold text-muted-foreground/60">{p.name}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest font-bold border-accent/10 text-accent">
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-4 w-40">
                            <span className="text-[13px] font-bold text-accent/60 min-w-[32px]">{p.progress}%</span>
                            <Progress value={p.progress} className="h-1 bg-secondary rounded-none flex-1" />
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                            <Timer className="h-3.5 w-3.5 opacity-40" /> {p.endDate}
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-accent hover:text-white transition-all">
                            <Link href={`/admin/clients/${p.id}`}><ChevronRight className="h-5 w-5" /></Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-40 border border-dashed border-accent/10 bg-secondary/5 space-y-8"
          >
            <div className="h-20 w-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
              {searchQuery ? <AlertCircle className="h-10 w-10 text-accent/20" /> : <PlayCircle className="h-10 w-10 text-accent/20" />}
            </div>
            <div className="space-y-2">
              <p className="text-lg font-light italic text-muted-foreground uppercase tracking-[0.3em]">
                {searchQuery ? `No site dossiers matching "${searchQuery}"` : "No active implementation projects prioritized"}
              </p>
              {searchQuery && <Button variant="link" onClick={() => setSearchQuery("")} className="text-accent text-[12px] uppercase tracking-widest font-bold">Clear Search Protocol</Button>}
            </div>
            {!searchQuery && (
              <Button asChild variant="outline" className="rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold shadow-sm border-accent/20 hover:bg-accent hover:text-white transition-all">
                <Link href="/admin/operations/planning">Synchronize Planning Briefs</Link>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
