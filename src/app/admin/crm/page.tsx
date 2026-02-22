"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  HeartHandshake, 
  MessageSquare, 
  TrendingUp, 
  Zap, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Phone, 
  Clock, 
  Star,
  Activity,
  Briefcase,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RelationshipIntelligencePage() {
  const { clientProjects, inquiries, collaborators } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const activeInquiries = inquiries.filter(i => i.status !== 'closed');
  const activeClients = clientProjects.filter(p => p.isActivated && !p.isArchived);
  
  const stats = [
    { label: "Lead Velocity", value: inquiries.filter(i => i.status === 'new').length.toString(), sub: "Awaiting Sync", icon: Zap },
    { label: "Client Base", value: activeClients.length.toString(), sub: "Authorized Journeys", icon: Users },
    { label: "Partner Network", value: collaborators.length.toString(), sub: "Verified Trades", icon: HeartHandshake },
    { label: "Engagement", value: "94%", sub: "Response Integrity", icon: Activity },
  ];

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
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Studio Management</span>
          </div>
          <h1 className="text-5xl font-headline italic">Relationship <span className="not-italic">Intelligence.</span></h1>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search leads or partners..." 
              className="pl-11 pr-4 h-14 bg-white border border-accent/10 w-72 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent/40 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold shadow-xl hover:tracking-[0.2em] transition-all">
            <Link href="/admin/clients/add"><UserPlus className="h-5 w-5" /> New Lead</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-none border-accent/5 shadow-lg bg-white overflow-hidden group">
              <div className="bg-accent/5 h-1 w-full" />
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-accent opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-headline italic">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="pipeline" className="space-y-10">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="pipeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Zap className="h-4 w-4" /> Lead Pipeline</TabsTrigger>
          <TabsTrigger value="clients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Users className="h-4 w-4" /> Active Journeys</TabsTrigger>
          <TabsTrigger value="partners" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><HeartHandshake className="h-4 w-4" /> Network Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-8 m-0">
          <div className="grid grid-cols-1 gap-4">
            {activeInquiries.length > 0 ? (
              activeInquiries.map((inq, i) => (
                <Card key={inq.id} className="rounded-none border-accent/5 shadow-sm hover:shadow-xl transition-all bg-white overflow-hidden group">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className={cn(
                      "w-1.5 shrink-0 self-stretch",
                      inq.urgency === 'critical' ? 'bg-destructive' : inq.urgency === 'high' ? 'bg-orange-400' : 'bg-accent/20'
                    )} />
                    <div className="flex-1 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-4">
                          <h3 className="text-2xl font-headline italic">{inq.name}</h3>
                          <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-widest border-accent/10">{inq.serviceType}</Badge>
                          <span className="text-[10px] font-bold text-accent/20 uppercase tracking-widest">{inq.id}</span>
                        </div>
                        <p className="text-[13px] font-light italic text-accent/60 line-clamp-1">"{inq.message}"</p>
                        <div className="flex items-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                          <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {inq.date}</span>
                          <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {inq.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button asChild variant="outline" className="rounded-none h-12 px-8 border-accent/10 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-white transition-all">
                          <Link href="/admin/inquiries">Manage Lead</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-24 border border-dashed border-accent/10 bg-secondary/5 italic text-muted-foreground uppercase tracking-[0.3em] font-light">No leads awaiting synchronization</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-8 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeClients.map((client) => (
              <Card key={client.id} className="rounded-none border-accent/5 shadow-xl bg-white group hover:shadow-2xl transition-all overflow-hidden">
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.4em]">{client.id}</span>
                      <h3 className="text-2xl font-headline italic">{client.project}</h3>
                      <p className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">{client.name}</p>
                    </div>
                    <Badge className="rounded-none uppercase tracking-widest text-[9px] bg-accent text-white">{client.tier}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-accent/40">
                      <span>Implementation Velocity</span>
                      <span>{client.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-secondary">
                      <div className="h-full bg-accent" style={{ width: `${client.progress}%` }} />
                    </div>
                  </div>
                  <Button asChild variant="ghost" className="w-full rounded-none border border-accent/5 h-12 uppercase tracking-widest text-[10px] font-bold group">
                    <Link href={`/admin/clients/${client.id}`} className="flex items-center justify-center gap-2">
                      Enter Workspace <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-8 m-0">
          <div className="bg-white border border-accent/5 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-accent/5 border-b border-accent/10">
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Entity Identity</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Core Specialty</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Integrity Score</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Status</th>
                  <th className="p-6 text-right text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/5">
                {collaborators.map((res) => (
                  <tr key={res.id} className="group hover:bg-accent/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-base font-headline italic text-accent">{res.name}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground/60">{res.id}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[12px] uppercase tracking-widest font-bold text-accent/60">{res.specialty}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-base font-headline italic">{res.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest font-bold border-accent/10 text-accent">
                        {res.status}
                      </Badge>
                    </td>
                    <td className="p-6 text-right">
                      <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-accent hover:text-white transition-all">
                        <Link href="/admin/hr"><ChevronRight className="h-5 w-5" /></Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-10 border border-dashed border-accent/20 text-center bg-accent/[0.02]">
        <p className="text-[11px] uppercase tracking-[0.5em] text-accent/40 font-bold italic">
          Relationship data is strictly synchronized with the master registry. unauthorized dossier access is logged.
        </p>
      </div>
    </div>
  );
}
