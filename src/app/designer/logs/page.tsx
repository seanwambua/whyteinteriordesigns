"use client";

import { motion } from "framer-motion";
import { useWhyteStore, ClientProject, SiteReport } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ClipboardList, 
  Search, 
  Clock, 
  Briefcase, 
  AlertTriangle,
  History,
  Filter,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type GroupedLog = {
  projectId: string;
  projectName: string;
  report: SiteReport;
};

export default function SiteLogRegistryPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const allLogs = useMemo(() => {
    const logs: GroupedLog[] = [];
    clientProjects.forEach(p => {
      (p.siteReports || []).forEach(r => {
        logs.push({ projectId: p.id, projectName: p.project, report: r });
      });
    });
    // Sort by date (descending - assuming date string format is sortable or simple)
    return logs.sort((a, b) => new Date(b.report.date).getTime() - new Date(a.report.date).getTime());
  }, [clientProjects]);

  const filtered = allLogs.filter(l => 
    l.projectName.toLowerCase().includes(search.toLowerCase()) || 
    l.projectId.toLowerCase().includes(search.toLowerCase()) ||
    l.report.content.toLowerCase().includes(search.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Historical Registry</span>
          </div>
          <h1 className="text-5xl font-headline italic">Deployment <span className="not-italic">Logs.</span></h1>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search logs or dossiers..." 
            className="w-full pl-12 pr-4 rounded-none border border-neutral-200 h-14 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((log, index) => (
          <motion.div key={log.report.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
            <Card className="rounded-none border-neutral-100 bg-white hover:border-accent/20 transition-all group overflow-hidden shadow-sm">
              <div className="flex flex-col md:flex-row">
                <div className={cn(
                  "w-1.5 shrink-0",
                  log.report.urgency === 'Critical' ? 'bg-red-500' : log.report.urgency === 'High' ? 'bg-orange-400' : 'bg-accent/20'
                )} />
                <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent/40">
                        <Briefcase className="h-3 w-3" /> {log.projectId} — {log.projectName}
                      </div>
                      <div className="h-1 w-1 bg-neutral-200 rounded-full" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{log.report.date}</span>
                      <Badge variant="outline" className="rounded-none text-[8px] uppercase tracking-widest border-neutral-100">{log.report.type}</Badge>
                    </div>
                    <p className="text-lg font-light italic leading-relaxed text-accent/80 line-clamp-2">"{log.report.content}"</p>
                  </div>
                  <Link href={`/designer/projects/${log.projectId}`}>
                    <Button variant="ghost" size="sm" className="rounded-none border border-neutral-100 hover:bg-accent hover:text-white hover:border-accent transition-all uppercase tracking-widest text-[10px] font-bold gap-2 group/btn">
                      Open Dossier <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 space-y-4">
            <ClipboardList className="h-12 w-12 text-neutral-200 mx-auto" />
            <p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">
              No deployment logs found matching current synchronization parameters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
