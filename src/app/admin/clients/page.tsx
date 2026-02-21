
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink, 
  Mail, 
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/5 shadow-xl hover:shadow-2xl transition-all bg-white group overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className={`w-1.5 shrink-0 ${
                  client.tier === 'Golden' ? 'bg-accent' : 
                  client.tier === 'Deluxe' ? 'bg-accent/60' : 'bg-accent/20'
                }`} />
                
                <div className="flex-1 p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-8 w-full lg:w-auto">
                    <div className="h-16 w-16 rounded-full bg-secondary/30 flex items-center justify-center text-accent/40 font-headline italic text-2xl border border-accent/5">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-headline italic">{client.name}</h3>
                        <Badge variant="outline" className={`rounded-none uppercase tracking-widest text-[8px] font-bold ${getStatusColor(client.status)}`}>
                          {client.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {client.email}</span>
                        <div className="h-1 w-1 bg-accent/20 rounded-full" />
                        <span>Project: {client.project}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-center lg:text-right">
                       <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
                       <div className="flex items-center gap-2 justify-center lg:justify-end">
                         {client.tier === 'Golden' && <Sparkles className="h-3 w-3 text-accent" />}
                         <span className="text-xs font-bold uppercase tracking-widest text-accent">{client.tier}</span>
                       </div>
                    </div>
                    
                    <div className="text-center lg:text-right">
                       <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Sync Status</span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{client.id}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button asChild variant="ghost" className="h-12 w-12 rounded-full border border-accent/5 hover:bg-accent hover:text-white transition-all p-0">
                        <Link href={`/admin/operations/${client.status.toLowerCase().includes('plan') ? 'planning' : client.status.toLowerCase().includes('exec') ? 'implementation' : 'closing'}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" className="h-12 w-12 rounded-full border border-accent/5 group-hover:bg-accent group-hover:text-white transition-all p-0">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
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
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Total Active Revenue</p>
            <p className="text-2xl font-headline italic">{clientProjects.length} Full Commissions</p>
          </div>
          <div className="h-12 w-px bg-accent/10" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Global Sourcing</p>
            <p className="text-2xl font-headline italic">
              {clientProjects.filter(p => p.tier === 'Deluxe').length} Deluxe / {clientProjects.filter(p => p.tier === 'Golden').length} Golden
            </p>
          </div>
        </div>
        <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-[0.2em] text-[10px]">
          <Link href="/admin/clients/add">Initialize New Journey</Link>
        </Button>
      </div>
    </div>
  );
}
