
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
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";

export default function ClientDirectoryPage() {
  const { clientProjects } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const filteredProjects = clientProjects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.project.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  // STRICT LIFECYCLE: Active means activated via deposit. Pending means planned but awaiting funds.
  const activeProjects = filteredProjects.filter(p => p.isActivated);
  const pendingProjects = filteredProjects.filter(p => !p.isActivated);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Termination Pending': return "bg-destructive/10 text-destructive border-destructive/20";
      case 'Terminated': return "bg-destructive text-white border-destructive";
      case 'Execution': return "bg-green-500/10 text-green-600 border-green-500/20";
      case 'Planning': return "bg-accent/10 text-accent border-accent/20";
      case 'Completed': return "bg-primary text-white";
      case 'Styling': return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default: return "bg-secondary text-muted-foreground border-border";
    }
  };

  const ClientCard = ({ client }: { client: any }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="rounded-none border-accent/5 shadow-xl hover:shadow-2xl transition-all bg-white group overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[200px]">
          <div className={`w-1.5 shrink-0 transition-colors ${
            client.tier === 'Golden' ? 'bg-accent' : 
            client.tier === 'Deluxe' ? 'bg-accent/60' : 'bg-accent/20'
          }`} />
          
          <div className="flex-1 p-8 flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-secondary/30 flex items-center justify-center text-accent/40 font-headline italic text-2xl border border-accent/5 shrink-0">
                  {client.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-headline italic">{client.name}</h3>
                    <Badge variant="outline" className={`rounded-none uppercase tracking-[0.2em] text-[8px] font-bold px-3 py-1 ${getStatusColor(client.status)}`}>
                      {client.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 opacity-40" /> {client.email}</span>
                    <div className="h-1 w-1 bg-accent/20 rounded-full" />
                    <span className="flex items-center gap-1.5"><Activity className="h-3 w-3 opacity-40" /> {client.project}</span>
                    <div className="h-1 w-1 bg-accent/20 rounded-full" />
                    <span className="opacity-40">{client.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                 <div className="text-right">
                   <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
                   <div className="flex items-center gap-2 justify-end">
                     {client.tier === 'Golden' && <Sparkles className="h-3 w-3 text-accent" />}
                     <span className="text-xs font-bold uppercase tracking-widest text-accent">{client.tier}</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" className="h-12 w-12 rounded-full border border-accent/5 group-hover:bg-accent group-hover:text-white transition-all p-0">
                      <Link href={`/admin/clients/${client.id}`}>
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </Button>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end pt-6 border-t border-accent/5">
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] uppercase tracking-[0.4em] font-bold text-accent/60">
                  <span>Implementation Velocity</span>
                  <span>{client.progress}%</span>
                </div>
                <Progress value={client.progress} className="h-1 bg-secondary rounded-none" />
              </div>

              <div className="flex items-center gap-8 text-[9px] uppercase tracking-widest font-bold">
                 <div className="space-y-1">
                   <span className="text-accent/30 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Registered</span>
                   <span className="text-muted-foreground">{client.startDate}</span>
                 </div>
                 <div className="space-y-1">
                   <span className="text-accent/30 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Sync Activity</span>
                   <span className="text-muted-foreground italic truncate max-w-[120px] inline-block">{client.lastActivity}</span>
                 </div>
              </div>

              <div className="text-right">
                 {!client.isActivated ? (
                   <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 rounded-none text-[8px] uppercase tracking-widest px-3 py-1">
                     Briefing Awaiting Funds
                   </Badge>
                 ) : (
                   <Badge className="bg-green-600/10 text-green-600 border-green-600/20 rounded-none text-[8px] uppercase tracking-widest px-3 py-1">
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
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Master Registry</span>
          </div>
          <h1 className="text-5xl font-headline italic">Client <span className="not-italic">Directory.</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search Identity..." 
              className="pl-11 rounded-none border-accent/10 h-12 text-xs uppercase tracking-widest bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button asChild className="bg-accent text-white rounded-none h-12 px-6 uppercase tracking-widest text-[10px] flex gap-2">
            <Link href="/admin/clients/add"><UserPlus className="h-4 w-4" /> New Registration</Link>
          </Button>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02]">
        <Info className="h-4 w-4 text-accent" />
        <AlertTitle className="text-[10px] font-bold uppercase tracking-widest text-accent">Registration Intelligence</AlertTitle>
        <AlertDescription className="text-xs font-light italic text-muted-foreground">
          All journeys originate from client registrations. **Pending Briefings** represent planned commissions awaiting financial activation.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-8">
          <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0">Total Registry ({filteredProjects.length})</TabsTrigger>
          <TabsTrigger value="active" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0">Active Journeys ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0">Pending Briefings ({pendingProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {filteredProjects.length === 0 && (
              <div className="text-center py-20 border border-dashed border-accent/10">
                <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No studio registrations found</p>
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
              <div className="text-center py-20 border border-dashed border-accent/10">
                <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No financially activated journeys in implementation</p>
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
              <div className="text-center py-20 border border-dashed border-accent/10">
                <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">All project briefings have transitioned to active states</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
