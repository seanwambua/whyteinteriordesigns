"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Mail, 
  Calendar,
  ChevronRight,
  Sparkles,
  Clock,
  Activity,
  UserPlus,
  Users,
  Info,
  Archive,
  ShieldAlert,
  Trash2,
  RefreshCcw,
  MoreVertical,
  XCircle,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  AlertDialogTrigger,
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
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ClientDirectoryPage() {
  const { clientProjects, removeClientProject, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const filteredProjects = clientProjects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.project.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  // LIFECYCLE FILTERS
  const archivedProjects = filteredProjects.filter(p => p.isArchived);
  const totalActiveRegistry = filteredProjects.filter(p => !p.isArchived);
  
  const activeProjects = totalActiveRegistry.filter(p => p.isActivated && p.status !== 'Termination' && p.status !== 'Completion');
  const pendingProjects = totalActiveRegistry.filter(p => !p.isActivated && p.status === 'Planning');
  const dissolutionProjects = totalActiveRegistry.filter(p => p.status === 'Termination');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Termination': return "bg-destructive text-white border-destructive shadow-sm";
      case 'Terminated': return "bg-black text-white border-black";
      case 'Execution': return "bg-green-500/10 text-green-600 border-green-500/20";
      case 'Planning': return "bg-accent/10 text-accent border-accent/20";
      case 'Completion': return "bg-primary text-white";
      case 'Styling': return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default: return "bg-secondary text-muted-foreground border-border";
    }
  };

  const handleToggleArchive = (id: string, currentStatus: boolean) => {
    updateClientProject(id, { isArchived: !currentStatus });
    toast({
      title: !currentStatus ? "Commission Archived" : "Commission Restored",
      description: `Project ${id} has been ${!currentStatus ? 'transferred to historical records' : 'restored to the active registry'}.`,
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    removeClientProject(deleteId);
    toast({
      title: "Dossier Purged",
      description: `Project brief ${deleteId} has been permanently removed from the studio archives.`,
      variant: "destructive"
    });
    setDeleteId(null);
  };

  const ClientCard = ({ client }: { client: any }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className={`rounded-none border-accent/5 shadow-xl hover:shadow-2xl transition-all bg-white dark:bg-zinc-900 group overflow-hidden ${client.isArchived ? 'opacity-70 grayscale-[0.5]' : ''}`}>
        <div className="flex flex-col lg:flex-row min-h-[200px]">
          <div className={`w-1.5 shrink-0 transition-colors ${
            client.isArchived ? 'bg-black' :
            client.status === 'Termination' ? 'bg-destructive' :
            client.tier === 'Golden' ? 'bg-accent' : 
            client.tier === 'Deluxe' ? 'bg-accent/60' : 'bg-accent/20'
          }`} />
          
          <div className="flex-1 p-8 flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-secondary/30 dark:bg-zinc-800 flex items-center justify-center text-accent/40 font-headline italic text-2xl border border-accent/5 shrink-0">
                  {client.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-headline italic">{client.name}</h3>
                    <Badge variant="outline" className={`rounded-none uppercase tracking-[0.2em] text-[10px] font-bold px-3 py-1 ${getStatusColor(client.status)}`}>
                      {client.status}
                    </Badge>
                    {client.isArchived && (
                      <Badge className="bg-black text-white rounded-none uppercase tracking-widest text-[10px] font-bold px-2 py-1 flex gap-1.5">
                        <Archive className="h-3 w-3" /> Archived
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 opacity-40" /> {client.email}</span>
                    <div className="h-1.5 w-1.5 bg-accent/20 rounded-full" />
                    <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 opacity-40" /> {client.project}</span>
                    <div className="h-1.5 w-1.5 bg-accent/20 rounded-full" />
                    <span className="opacity-40">{client.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                 <div className="text-right">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
                   <div className="flex items-center gap-2 justify-end">
                     {client.tier === 'Golden' && <Sparkles className="h-3.5 w-3.5 text-accent" />}
                     <span className="text-sm font-bold uppercase tracking-widest text-accent">{client.tier}</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" className="h-12 w-12 rounded-full border border-accent/5 group-hover:bg-accent group-hover:text-white transition-all p-0">
                      <Link href={`/admin/clients/${client.id}`}>
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-full"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-accent/10 w-48">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest opacity-40">Tactical Control</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="text-xs uppercase tracking-widest font-bold py-3 cursor-pointer">
                          <Link href={`/admin/clients/${client.id}`} className="flex gap-2"><FileText className="h-3.5 w-3.5" /> Project Terminal</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleArchive(client.id, client.isArchived)}
                          className="text-xs uppercase tracking-widest font-bold py-3 cursor-pointer flex gap-2"
                        >
                          {client.isArchived ? <><RefreshCcw className="h-3.5 w-3.5" /> Restore Registry</> : <><Archive className="h-3.5 w-3.5" /> Move to Archive</>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeleteId(client.id)}
                          className="text-xs uppercase tracking-widest font-bold py-3 cursor-pointer text-destructive focus:text-destructive flex gap-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Purge Dossier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end pt-6 border-t border-accent/5">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] font-bold text-accent/60">
                  <span>Implementation Velocity</span>
                  <span>{client.progress}%</span>
                </div>
                <Progress value={client.progress} className="h-1 bg-secondary rounded-none" />
              </div>

              <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold">
                 <div className="space-y-1.5">
                   <span className="text-accent/30 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Registered</span>
                   <span className="text-muted-foreground">{client.startDate}</span>
                 </div>
                 <div className="space-y-1.5">
                   <span className="text-accent/30 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Sync Activity</span>
                   <span className="text-muted-foreground italic truncate max-w-[140px] inline-block">{client.lastActivity}</span>
                 </div>
              </div>

              <div className="text-right">
                 {client.isArchived ? (
                   <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">Commission Retired</span>
                 ) : client.status === 'Termination' ? (
                   <Badge className="bg-destructive text-white rounded-none text-[10px] uppercase tracking-widest px-4 py-1.5 animate-pulse">
                     Dissolution Active
                   </Badge>
                 ) : !client.isActivated ? (
                   <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 rounded-none text-[10px] uppercase tracking-widest px-4 py-1.5">
                     Briefing Awaiting Funds
                   </Badge>
                 ) : (
                   <Badge className="bg-green-600/10 text-green-600 border-green-500/20 rounded-none text-[10px] uppercase tracking-widest px-4 py-1.5">
                     Active Journey
                   </Badge>
                 )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
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
            <span className="text-accent text-xs font-bold uppercase tracking-[0.4em]">Master Registry</span>
          </div>
          <h1 className="text-5xl font-headline italic">Client <span className="not-italic">Directory.</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search Identity..." 
              className="w-full pl-11 pr-4 rounded-none border border-accent/10 h-12 text-xs uppercase tracking-widest bg-white dark:bg-zinc-900 focus:outline-none focus:border-accent/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button asChild className="bg-accent text-white rounded-none h-12 px-8 uppercase tracking-widest text-[11px] flex gap-2">
            <Link href="/admin/clients/add"><UserPlus className="h-4 w-4" /> New Registration</Link>
          </Button>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02]">
        <Info className="h-4 w-4 text-accent" />
        <AlertTitle className="text-[11px] font-bold uppercase tracking-widest text-accent">Registration Intelligence</AlertTitle>
        <AlertDescription className="text-sm font-light italic text-muted-foreground">
          Showing active commissions and project briefings. Successfully reconciled projects are transitioned to the **Master Archives**.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-10">
          <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0">Active Registry ({totalActiveRegistry.length})</TabsTrigger>
          <TabsTrigger value="active" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0">Active Journeys ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0">Pending Briefings ({pendingProjects.length})</TabsTrigger>
          <TabsTrigger value="dissolution" className="rounded-none border-b-2 border-transparent data-[state=active]:border-destructive data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0 flex gap-2 text-destructive/60 data-[state=active]:text-destructive">
            <ShieldAlert className="h-4 w-4" /> Dissolution Protocol ({dissolutionProjects.length})
          </TabsTrigger>
          <TabsTrigger value="archives" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0 flex gap-2">
            <Archive className="h-4 w-4" /> Project Archives ({archivedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {totalActiveRegistry.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {totalActiveRegistry.length === 0 && (
              <div className="text-center py-24 border border-dashed border-accent/10">
                <p className="text-base font-light italic text-muted-foreground uppercase tracking-[0.3em]">No active studio registrations found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {activeProjects.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {activeProjects.length === 0 && (
              <div className="text-center py-24 border border-dashed border-accent/10">
                <p className="text-base font-light italic text-muted-foreground uppercase tracking-[0.3em]">No financially activated journeys in standard implementation</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {pendingProjects.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {pendingProjects.length === 0 && (
              <div className="text-center py-24 border border-dashed border-accent/10">
                <p className="text-base font-light italic text-muted-foreground uppercase tracking-[0.3em]">All project briefings have transitioned to active states</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dissolution" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {dissolutionProjects.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {dissolutionProjects.length === 0 && (
              <div className="text-center py-24 border border-dashed border-destructive/10 bg-destructive/[0.02]">
                <p className="text-base font-light italic text-muted-foreground uppercase tracking-[0.3em]">No commissions currently in dissolution protocol</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="archives" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {archivedProjects.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {archivedProjects.length === 0 && (
              <div className="text-center py-24 border border-dashed border-accent/10">
                <p className="text-base font-light italic text-muted-foreground uppercase tracking-[0.3em]">No commissions have been transitioned to the master archives</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive text-[10px] font-bold uppercase tracking-[0.3em]">Critical Protocol</span>
            </div>
            <AlertDialogTitle className="text-2xl font-headline italic text-destructive">Confirm Permanent Purge?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed">
              This will permanently remove client dossier **{deleteId}** and all associated site logs from the studio registry. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[10px] font-bold h-12 border-accent/10">Abort Cancellation</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12 hover:bg-destructive/90"
            >
              Authorize Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
