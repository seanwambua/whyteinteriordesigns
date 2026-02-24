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
  LockKeyhole,
  Mail,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GroupedClient = {
  name: string;
  email: string;
  projects: ClientProject[];
};

export default function SiteDossierRegistryPage() {
  const { clientProjects, designers } = useWhyteStore();
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

  const groupProjects = (projects: ClientProject[]) => {
    const filtered = projects.filter(p => 
      p.project.toLowerCase().includes(search.toLowerCase()) || 
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    
    const grouped = filtered.reduce((acc, p) => {
      if (!acc[p.email]) {
        acc[p.email] = { name: p.name, email: p.email, projects: [] };
      }
      acc[p.email].projects.push(p);
      return acc;
    }, {} as Record<string, GroupedClient>);
    
    return Object.values(grouped);
  };

  const assignedGroups = useMemo(() => groupProjects(dossiers.assigned), [dossiers.assigned, search]);
  const studioGroups = useMemo(() => groupProjects(dossiers.studioWide), [dossiers.studioWide, search]);
  const archivedGroups = useMemo(() => groupProjects(dossiers.archived), [dossiers.archived, search]);

  if (!isMounted) return null;

  const DossierCard = ({ p, isArchived, isStudioWide }: { p: ClientProject, isArchived?: boolean, isStudioWide?: boolean }) => {
    const assignedDesigner = designers.find(d => d.id === p.assignedDesignerId);
    
    return (
      <div className={cn(
        "p-6 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-none",
        isArchived && "opacity-80"
      )}>
        <div className="flex items-center gap-8 flex-1">
          <div className={cn(
            "h-14 w-14 rounded-none border border-neutral-100 flex flex-col items-center justify-center transition-none",
            isArchived ? "bg-neutral-50 text-neutral-400" : isStudioWide ? "bg-orange-50 text-orange-400" : "bg-neutral-50 text-accent/40 group-hover:bg-accent group-hover:text-white"
          )}>
            {isArchived ? <Archive className="h-5 w-5" /> : isStudioWide ? <LockKeyhole className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
            <span className="text-[7px] font-black uppercase mt-1">{isArchived ? 'HIST' : isStudioWide ? 'READ' : 'ACTV'}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">{p.id}</span>
              <h3 className="text-xl font-headline italic text-accent leading-tight">{p.project}</h3>
              <Badge variant="outline" className={cn("rounded-none text-[8px] uppercase tracking-widest border-neutral-100", isStudioWide && "border-orange-200 text-orange-600 bg-orange-50")}>
                {isStudioWide ? "Observation Only" : p.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2 text-accent/60">
                <PencilRuler className="h-3 w-3 opacity-40" /> Lead: {assignedDesigner ? assignedDesigner.name : "Unassigned"}
              </span>
              <span className="flex items-center gap-2"><Clock className="h-3 w-3 opacity-40" /> {isArchived ? 'Handover' : 'Target'}: {p.endDate}</span>
              {!isArchived && (
                <div className="flex items-center gap-4 w-32">
                  <span className="text-[9px] text-accent/60">{p.progress}%</span>
                  <Progress value={p.progress} className="h-0.5 bg-neutral-100 flex-1" />
                </div>
              )}
            </div>
          </div>
        </div>
        <Link href={`/designer/projects/${p.id}`}>
          <Button variant="outline" className={cn(
            "rounded-none h-10 px-6 uppercase tracking-widest text-[9px] font-bold border-neutral-200 transition-none",
            isStudioWide ? "hover:bg-orange-600 hover:text-white hover:border-orange-600" : "hover:bg-accent hover:text-white hover:border-accent"
          )}>
            {isArchived ? 'Archives' : isStudioWide ? 'Observe' : 'Workbench'}
          </Button>
        </Link>
      </div>
    );
  };

  const ClientGroup = ({ group, isArchived, isStudioWide }: { group: GroupedClient, isArchived?: boolean, isStudioWide?: boolean }) => (
    <Card className="rounded-none border-neutral-100 bg-white shadow-sm overflow-hidden mb-8">
      <div className="p-6 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-neutral-200 text-accent font-headline italic">
            {group.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-headline italic text-accent leading-none">{group.name}</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{group.email}</p>
          </div>
        </div>
        <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[9px] border-neutral-200 text-neutral-400">
          {group.projects.length} Linked Dossier(s)
        </Badge>
      </div>
      <div className="divide-y divide-neutral-50">
        {group.projects.map(p => <DossierCard key={p.id} p={p} isArchived={isArchived} isStudioWide={isStudioWide} />)}
      </div>
    </Card>
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
            placeholder="Search Registry..." 
            className="w-full pl-12 pr-4 rounded-none border border-neutral-200 h-14 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent shadow-sm transition-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <Tabs defaultValue="assigned" className="space-y-10">
        <TabsList className="bg-transparent border-b border-neutral-200 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="assigned" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0">My Assignments ({dossiers.assigned.length})</TabsTrigger>
          <TabsTrigger value="studio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Globe className="h-4 w-4" /> Studio-wide Registry ({dossiers.studioWide.length})</TabsTrigger>
          <TabsTrigger value="archived" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Archive className="h-4 w-4" /> Master Archive ({dossiers.archived.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="m-0">
          {assignedGroups.map((g) => <ClientGroup key={g.email} group={g} />)}
          {assignedGroups.length === 0 && (
            <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 italic text-[12px] uppercase tracking-[0.3em] font-light">
              No implementation dossiers currently assigned to your identity
            </div>
          )}
        </TabsContent>

        <TabsContent value="studio" className="m-0">
          {studioGroups.map((g) => <ClientGroup key={g.email} group={g} isStudioWide />)}
          {studioGroups.length === 0 && (
            <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 italic text-[12px] uppercase tracking-[0.3em] font-light">
              No external implementation dossiers synchronized in current cycle
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="m-0">
          {archivedGroups.map((g) => <ClientGroup key={g.email} group={g} isArchived />)}
          {archivedGroups.length === 0 && (
            <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 italic text-[12px] uppercase tracking-[0.3em] font-light">
              The historical archives are currently empty
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
