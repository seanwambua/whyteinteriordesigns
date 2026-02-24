"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Mail, 
  Calendar,
  ChevronRight,
  Sparkles,
  Clock,
  Activity,
  UserPlus,
  Archive,
  Trash2,
  RefreshCcw,
  MoreVertical,
  XCircle,
  FileText,
  Info,
  Lock,
  Settings2,
  FolderOpen,
  PencilRuler,
  Eye,
  FileClock,
  Loader2,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useRouter, useSearchParams } from "next/navigation";

type GroupedClient = {
  name: string;
  email: string;
  projects: ClientProject[];
};

function ClientRegistryContent() {
  const { clientProjects, designers, removeClientProject, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const defaultTab = searchParams.get('tab') || "active";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredProjects = useMemo(() => {
    return clientProjects.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.project.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [clientProjects, search]);

  const groupProjects = (projects: ClientProject[]) => {
    const grouped = projects.reduce((acc, p) => {
      if (!acc[p.email]) {
        acc[p.email] = { name: p.name, email: p.email, projects: [] };
      }
      acc[p.email].projects.push(p);
      return acc;
    }, {} as Record<string, GroupedClient>);
    return Object.values(grouped);
  };

  const activeCommissions = useMemo(() => 
    groupProjects(filteredProjects.filter(p => p.isActivated && !p.isArchived)), 
    [filteredProjects]
  );
  
  const pendingProjects = useMemo(() => 
    groupProjects(filteredProjects.filter(p => !p.isActivated && p.status === 'Planning' && !p.isArchived)), 
    [filteredProjects]
  );
  
  const archivedProjects = useMemo(() => 
    groupProjects(filteredProjects.filter(p => p.isArchived)), 
    [filteredProjects]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Termination': return "bg-destructive text-white border-destructive";
      case 'Terminated': return "bg-black text-white border-black";
      case 'Execution': return "bg-green-500/10 text-green-600 border-green-500/20";
      case 'Planning': return "bg-accent/10 text-accent border-accent/20";
      case 'Completion': return "bg-primary text-white";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  const handleReviewArchive = (id: string) => {
    updateClientProject(id, { 
      isArchived: false,
      status: 'Completion',
      handoverStatus: 'Pending',
      financialReportStatus: 'Pending',
      lastActivity: "Historical Dossier Re-opened for Mandatory Review Protocol."
    });
    toast({ 
      title: "Archive Protocol Initialized", 
      description: `Dossier ${id} has been transmitted to the Handover pipeline.`,
    });
    router.push("/admin/operations/handover");
  };

  const handleToggleArchive = (id: string, currentStatus: boolean) => {
    if (currentStatus) {
      handleReviewArchive(id);
    } else {
      updateClientProject(id, { isArchived: true });
      toast({
        title: "Commission Archived",
        description: `Project ${id} has been transitioned to historical records.`,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    removeClientProject(deleteId);
    toast({ title: "Dossier Purged", variant: "destructive" });
    setDeleteId(null);
  };

  const ClientDossierCard = ({ client, isArchivedView }: { client: GroupedClient, isArchivedView?: boolean }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={cn("rounded-none border-accent/5 shadow-xl bg-white overflow-hidden", isArchivedView && "opacity-90")}>
        <div className={cn("p-8 border-b border-accent/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6", isArchivedView ? "bg-slate-50" : "bg-accent/5")}>
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-accent font-headline italic text-xl border border-accent/10 shadow-sm">
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-headline italic text-accent">{client.name}</h3>
              <div className="flex items-center gap-4 text-[12px] text-muted-foreground uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 opacity-40" /> {client.email}</span>
                <div className="h-1 w-1 bg-accent/20 rounded-full" />
                <span className="text-accent/40">{client.projects.length} {isArchivedView ? 'Archived' : 'Linked'} Dossier(s)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isArchivedView && (
              <Button asChild variant="outline" className="rounded-none border-accent/10 h-10 px-4 text-[10px] font-bold uppercase tracking-widest bg-white hover:bg-accent hover:text-white transition-none shadow-sm flex gap-2">
                <Link href={`/admin/clients/add?email=${encodeURIComponent(client.email)}`}>
                  <Plus className="h-3 w-3" /> Add Dossier
                </Link>
              </Button>
            )}
            <Badge variant="outline" className="rounded-none uppercase tracking-[0.3em] text-[10px] border-accent/20 text-accent/60 h-fit py-1.5 px-4 bg-white/50">
              {isArchivedView ? 'Historical Records' : 'Verified Account Portfolio'}
            </Badge>
          </div>
        </div>

        <div className="divide-y divide-accent/5">
          {client.projects.map((project) => {
            const assignedDesigner = designers.find(d => d.id === project.assignedDesignerId);
            
            return (
              <div key={project.id} className="p-8 hover:bg-accent/[0.01] transition-none group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-accent/40 uppercase tracking-[0.4em]">{project.id}</span>
                      <h4 className="text-xl font-headline italic text-accent/80">{project.project}</h4>
                      <Badge variant="outline" className={cn("rounded-none uppercase tracking-widest text-[9px] font-bold px-2 py-0.5", getStatusColor(project.status))}>
                        {isArchivedView ? 'Retired' : project.status}
                      </Badge>
                      {project.financialReportStatus === 'Verified' && (
                        <Lock className="h-3.5 w-3.5 text-green-600 opacity-60" title="Audit Verified" />
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-end">
                      <div className="space-y-3 lg:col-span-1">
                        <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40">
                          <span>{isArchivedView ? 'Final Handover Value' : 'Implementation Velocity'}</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1 bg-secondary rounded-none" />
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-accent/40 flex items-center gap-2">
                          <PencilRuler className="h-3 w-3" /> {isArchivedView ? 'Historical Lead' : 'Creative Lead'}
                        </span>
                        <span className="text-[12px] uppercase tracking-widest font-bold text-accent/80">
                          {assignedDesigner ? assignedDesigner.name : "Unassigned"}
                        </span>
                      </div>

                      <div className="flex items-center gap-8 text-[11px] uppercase tracking-widest font-bold text-muted-foreground/60">
                        <div className="space-y-1">
                          <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 opacity-40" /> {isArchivedView ? 'Closed On' : 'Registered'}</span>
                          <span className="text-accent/60 font-medium">{isArchivedView ? project.endDate : project.startDate}</span>
                        </div>
                        {!isArchivedView && (
                          <div className="space-y-1">
                            <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 opacity-40" /> Latest Sync</span>
                            <span className="text-accent/60 font-medium truncate max-w-[140px] block italic">"{project.lastActivity}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-8 lg:border-l border-accent/5">
                    {isArchivedView ? (
                      <Button 
                        onClick={() => handleReviewArchive(project.id)}
                        variant="outline" 
                        className="rounded-none h-12 px-8 border-slate-200 text-[10px] font-bold uppercase tracking-widest flex gap-3 hover:bg-slate-900 hover:text-white transition-none shadow-sm"
                      >
                        <FileClock className="h-4 w-4" /> Review Dossier
                      </Button>
                    ) : (
                      <Button asChild variant="ghost" className="h-12 w-12 rounded-full border border-accent/5 hover:bg-accent hover:text-white transition-none p-0 shadow-sm">
                        <Link href={`/admin/clients/${project.id}`}><ChevronRight className="h-5 w-5" /></Link>
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-accent/5"><MoreVertical className="h-5 w-5 text-accent/20" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-accent/10 w-64 p-2">
                        <DropdownMenuLabel className="text-[11px] uppercase tracking-widest opacity-40 mb-2 px-3">Tactical Control</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="text-[12px] uppercase tracking-widest font-bold py-3 px-3 cursor-pointer focus:bg-accent focus:text-white mb-1">
                          <Link href={`/admin/clients/${project.id}`} className="flex gap-3"><FileText className="h-4 w-4" /> Project Terminal</Link>
                        </DropdownMenuItem>
                        
                        {!project.isActivated && (
                          <DropdownMenuItem asChild className="text-[12px] uppercase tracking-widest font-bold py-3 px-3 cursor-pointer focus:bg-accent focus:text-white mb-1">
                            <Link href="/admin/operations/planning" className="flex gap-3"><Settings2 className="h-4 w-4" /> Comprehensive Edit</Link>
                          </DropdownMenuItem>
                        )}

                        {project.isActivated && (
                          <DropdownMenuItem onClick={() => handleToggleArchive(project.id, !!project.isArchived)} className="text-[12px] uppercase tracking-widest font-bold py-3 px-3 cursor-pointer flex gap-3 focus:bg-accent focus:text-white mb-1">
                            {project.isArchived ? <><RefreshCcw className="h-4 w-4" /> Restore Registry</> : <><Archive className="h-4 w-4" /> Move to Archive</>}
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="my-2 bg-accent/5" />
                        <DropdownMenuItem onClick={() => setDeleteId(project.id)} className="text-[12px] uppercase tracking-widest font-bold py-3 px-3 cursor-pointer text-destructive focus:bg-destructive focus:text-white flex gap-3">
                          <Trash2 className="h-4 w-4" /> Purge Dossier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Master Registry</span>
          </div>
          <h1 className="text-5xl font-headline italic">Client <span className="not-italic">Registry.</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            <input 
              placeholder="Search Identity or ID..." 
              className="w-full pl-12 pr-4 rounded-none border border-accent/10 h-14 text-[13px] uppercase tracking-widest bg-white focus:outline-none focus:border-accent/40 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold flex gap-3 shadow-xl hover:bg-accent/90 transition-none">
            <Link href="/admin/clients/add"><UserPlus className="h-5 w-5" /> New Commission</Link>
          </Button>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-6">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-accent mb-1">Dossier Consolidation Protocol</AlertTitle>
        <AlertDescription className="text-base font-light italic text-muted-foreground leading-relaxed">
          Concurrent projects are synchronized under a unified **Client Dossier**. Reviewing historical items from the Master Archives will transmit them back to the Handover pipeline for re-verification.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue={defaultTab} className="space-y-10">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="active" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0">Active Portfolios ({activeCommissions.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0">Pending Briefings ({pendingProjects.length})</TabsTrigger>
          <TabsTrigger value="archives" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Archive className="h-4.5 w-4.5" /> Master Archives ({archivedProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-10 m-0">
          {activeCommissions.map((client) => <ClientDossierCard key={client.email} client={client} />)}
          {activeCommissions.length === 0 && <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 italic text-muted-foreground uppercase tracking-[0.3em] font-light">No active portfolios prioritized in current cycle</div>}
        </TabsContent>

        <TabsContent value="pending" className="space-y-10 m-0">
          {pendingProjects.map((client) => <ClientDossierCard key={client.email} client={client} />)}
          {pendingProjects.length === 0 && <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 italic text-muted-foreground uppercase tracking-[0.3em] font-light">No pending project briefings awaiting synchronization</div>}
        </TabsContent>

        <TabsContent value="archives" className="space-y-10 m-0">
          {archivedProjects.map((client) => <ClientDossierCard key={client.email} client={client} isArchivedView />)}
          {archivedProjects.length === 0 && <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 italic text-muted-foreground uppercase tracking-[0.3em] font-light">The historical archives are currently empty</div>}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body p-10 bg-white">
          <AlertDialogHeader className="space-y-6">
            <div className="flex items-center gap-3"><XCircle className="h-6 w-6 text-destructive" /><span className="text-destructive text-[13px] font-bold uppercase tracking-[0.3em]">Critical Protocol</span></div>
            <AlertDialogTitle className="text-3xl font-headline italic text-destructive">Confirm Permanent Purge?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-lg italic">This will permanently remove dossier **{deleteId}** and all associated site logs. This action cannot be reversed within the studio registry.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-10">
            <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-8 border-accent/10">Abort Cancellation</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-10 hover:bg-destructive/90 shadow-xl transition-none">Authorize Purge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ClientRegistryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>}>
      <ClientRegistryContent />
    </Suspense>
  );
}
