
"use client";

import { motion } from "framer-motion";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  PencilRuler,
  MapPin,
  Activity,
  Archive,
  Lock,
  FileCheck,
  Globe,
  LockKeyhole
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SiteDossierRegistryPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [activeDesignerId, setActiveDesignerId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setActiveDesignerId(localStorage.getItem("whyte_active_designer_id"));
  }, []);

  const dossiers = useMemo(() => {
    // Assigned to current designer
    const assigned = clientProjects.filter(p => 
      p.assignedDesignerId === activeDesignerId && 
      !p.isArchived && 
      p.isActivated && 
      p.status === 'Execution'
    );
    // Studio wide: Active but not assigned to current designer
    const studioWide = clientProjects.filter(p => 
      p.assignedDesignerId !== activeDesignerId && 
      !p.isArchived && 
      p.isActivated && 
      p.status === 'Execution'
    );
    // Archived for Designer: Formally archived OR in Completion phase (Handover Passed)
    const archived = clientProjects.filter(p => 
      p.isArchived || 
      p.status === 'Completion' || 
      p.status === 'Terminated'
    );
    return { assigned, studioWide, archived };
  }, [clientProjects, activeDesignerId]);

  const filterList = (list: ClientProject[]) => list.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const assignedFiltered = filterList(dossiers.assigned);
  const studioFiltered = filterList(dossiers.studioWide);
  const archivedFiltered = filterList(dossiers.archived);

  if (!isMounted) return null;

  const DossierCard = ({ p, isArchived, isStudioWide }: { p: ClientProject, isArchived?: boolean, isStudioWide?: boolean }) => (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
      <Card className={cn(
        "rounded-none border-neutral-100 bg-white hover:border-accent/40 transition-all group overflow-hidden shadow-sm",
        isArchived && "opacity-80"
      )}>
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8 flex-1">
            <div className={cn(
              "h-16 w-16 rounded-none border border-neutral-100 flex flex-col items-center justify-center transition-all",
              isArchived ? "bg-neutral-50 text-neutral-400" : isStudioWide ? "bg-orange-50 text-orange-400" : "bg-neutral-50 text-accent/40 group-hover:bg-accent group-hover:text-white"
            )}>
              {isArchived ? <Archive className="h-6 w-6" /> : isStudioWide ? <LockKeyhole className="h-6 w-6" /> : <Briefcase className="h-6 w-6" />}
              <span className="text-[8px] font-black uppercase mt-1">{isArchived ? 'HIST' : isStudioWide ? 'READ' : 'ACTV'}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{p.id}</span>
                <h3 className="text-2xl font-headline italic text-accent leading-tight">{p.project}</h3>
                <Badge variant="outline" className={cn("rounded-none text-[9px] uppercase tracking-widest border-neutral-100", isStudioWide && "border-orange-200 text-orange-600 bg-orange-50")}>
                  {isStudioWide ? "Observation Only" : p.status}
                </Badge>
                {p.financialReportStatus === 'Verified' && <Lock className="h-3.5 w-3.5 text-green-600 opacity-60" title="Audit Verified" />}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                <span className="flex items-center gap-2">Client: {p.name}</span>
                <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 opacity-40" /> {isArchived ? 'Handover' : 'Target'}: {p.endDate}</span>
                {!isArchived && (
                  <div className="flex items-center gap-4 w-40">
                    <span className="text-[10px] text-accent/60">{p.progress}%</span>
                    <Progress value={p.progress} className="h-1 bg-neutral-100 flex-1" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/designer/projects/${p.id}`}>
              <Button variant="outline" className={cn(
                "rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-bold border-neutral-200 transition-all",
                isStudioWide ? "hover:bg-orange-600 hover:text-white hover:border-orange-600" : "hover:bg-accent hover:text-white hover:border-accent"
              )}>
                {isArchived ? 'View Archives' : isStudioWide ? 'Enter Observation' : 'Open Workbench'}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Implementation Registry</span>
          </div>
          <h1 className="text-5xl font-headline italic">Deployment <span className="not-italic">Dossiers.</span></h1>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search IDs or commissions..." 
            className="w-full pl-12 pr-4 rounded-none border border-neutral-200 h-14 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <Tabs defaultValue="assigned" className="space-y-10">
        <TabsList className="bg-transparent border-b border-neutral-200 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="assigned" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0">My Assignments ({assignedFiltered.length})</TabsTrigger>
          <TabsTrigger value="studio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Globe className="h-4 w-4" /> Studio-wide Registry ({studioFiltered.length})</TabsTrigger>
          <TabsTrigger value="archived" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Archive className="h-4 w-4" /> Master Archive ({archivedFiltered.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="m-0 space-y-6">
          {assignedFiltered.map((p) => <DossierCard key={p.id} p={p} />)}
          {assignedFiltered.length === 0 && (
            <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 italic text-[12px] uppercase tracking-widest text-muted-foreground font-light">
              No implementation dossiers currently assigned to your identity
            </div>
          )}
        </TabsContent>

        <TabsContent value="studio" className="m-0 space-y-6">
          {studioFiltered.map((p) => <DossierCard key={p.id} p={p} isStudioWide />)}
          {studioFiltered.length === 0 && (
            <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 italic text-[12px] uppercase tracking-widest text-muted-foreground font-light">
              No external implementation dossiers synchronized in current cycle
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="m-0 space-y-6">
          {archivedFiltered.map((p) => <DossierCard key={p.id} p={p} isArchived />)}
          {archivedFiltered.length === 0 && (
            <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 italic text-[12px] uppercase tracking-widest text-muted-foreground font-light">
              The historical archives are currently empty
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
