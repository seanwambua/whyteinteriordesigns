
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Mail, 
  Calendar,
  ChevronRight,
  Sparkles,
  Clock,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";

export default function ActiveJourneysPage() {
  const { clientProjects } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const filteredProjects = clientProjects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.project.toLowerCase().includes(search.toLowerCase())
  );

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
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Client Lifecycle</span>
          </div>
          <h1 className="text-5xl font-headline italic">Active <span className="not-italic">Journeys.</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search Clients..." 
              className="pl-11 rounded-none border-accent/10 h-12 text-xs uppercase tracking-widest bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-none h-12 border-accent/10 px-6 uppercase tracking-widest text-[10px] flex gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {filteredProjects.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/5 shadow-xl hover:shadow-2xl transition-all bg-white group overflow-hidden">
              <div className="flex flex-col lg:flex-row min-h-[220px]">
                <div className={`w-1.5 shrink-0 transition-colors ${
                  client.tier === 'Golden' ? 'bg-accent' : 
                  client.tier === 'Deluxe' ? 'bg-accent/60' : 'bg-accent/20'
                }`} />
                
                <div className="flex-1 p-8 lg:p-10 flex flex-col gap-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                      <div className="h-20 w-20 rounded-full bg-secondary/30 flex items-center justify-center text-accent/40 font-headline italic text-3xl border border-accent/5 shrink-0">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-3xl font-headline italic">{client.name}</h3>
                          <Badge variant="outline" className={`rounded-none uppercase tracking-[0.2em] text-[8px] font-bold px-3 py-1 ${getStatusColor(client.status)}`}>
                            {client.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                          <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 opacity-40" /> {client.email}</span>
                          <div className="h-1 w-1 bg-accent/20 rounded-full" />
                          <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 opacity-40" /> Project: {client.project}</span>
                          <div className="h-1 w-1 bg-accent/20 rounded-full" />
                          <span className="opacity-40">{client.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 justify-between lg:justify-end border-t lg:border-t-0 pt-6 lg:pt-0">
                       <div className="text-center lg:text-right">
                         <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
                         <div className="flex items-center gap-2 justify-center lg:justify-end">
                           {client.tier === 'Golden' && <Sparkles className="h-3.5 w-3.5 text-accent" />}
                           <span className="text-xs font-bold uppercase tracking-widest text-accent">{client.tier}</span>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <Button asChild variant="ghost" className="h-14 w-14 rounded-full border border-accent/5 hover:bg-accent hover:text-white transition-all p-0">
                            <Link href={`/admin/operations/${client.status.toLowerCase().includes('plan') ? 'planning' : client.status.toLowerCase().includes('exec') ? 'implementation' : 'closing'}`}>
                              <ExternalLink className="h-5 w-5" />
                            </Link>
                          </Button>
                          <Button variant="ghost" className="h-14 w-14 rounded-full border border-accent/5 group-hover:bg-accent group-hover:text-white transition-all p-0">
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-end pt-8 border-t border-accent/5">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] font-bold text-accent/60">
                        <span>Implementation Velocity</span>
                        <span>{client.progress}%</span>
                      </div>
                      <Progress value={client.progress} className="h-1 bg-secondary rounded-none" />
                    </div>

                    <div className="flex items-center gap-12 text-[10px] uppercase tracking-widest font-bold">
                       <div className="space-y-1">
                         <span className="text-accent/30 flex items-center gap-2"><Calendar className="h-3 w-3" /> Commenced</span>
                         <span className="text-muted-foreground">{client.startDate}</span>
                       </div>
                       <div className="space-y-1">
                         <span className="text-accent/30 flex items-center gap-2"><Clock className="h-3 w-3" /> Last Sync</span>
                         <span className="text-muted-foreground italic">{client.lastActivity}</span>
                       </div>
                    </div>

                    <div className="text-right">
                       <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Financial Reconciliation</span>
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${
                         client.financialReportStatus === 'Verified' ? 'text-green-600' : 'text-orange-500'
                       }`}>
                         {client.financialReportStatus || 'Internal Audit Only'}
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-accent/10">
            <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No active journeys found matching your search</p>
          </div>
        )}
      </div>

      <div className="p-10 border border-dashed border-accent/20 bg-secondary/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-12">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Total Active Commissions</p>
            <p className="text-3xl font-headline italic">{clientProjects.length} Architectural Journeys</p>
          </div>
          <div className="h-16 w-px bg-accent/10" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Tier Stratification</p>
            <p className="text-lg font-headline italic">
              {clientProjects.filter(p => p.tier === 'Golden').length} Golden • {clientProjects.filter(p => p.tier === 'Deluxe').length} Deluxe • {clientProjects.filter(p => p.tier === 'Premium').length} Premium
            </p>
          </div>
        </div>
        <Button asChild className="bg-accent text-white rounded-none h-16 px-12 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-accent/90 transition-all shadow-xl">
          <Link href="/admin/clients/add">Initialize New Journey</Link>
        </Button>
      </div>
    </div>
  );
}
