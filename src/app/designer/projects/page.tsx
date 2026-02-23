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
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SiteDossierRegistryPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeDossiers = useMemo(() => 
    clientProjects.filter(p => !p.isArchived && p.isActivated),
    [clientProjects]
  );

  const filtered = activeDossiers.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Site Registry</span>
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

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((p, index) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-neutral-100 bg-white hover:border-accent/40 transition-all group overflow-hidden shadow-sm">
              <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8 flex-1">
                  <div className="h-16 w-16 rounded-none border border-neutral-100 flex items-center justify-center bg-neutral-50 text-accent/40 group-hover:bg-accent group-hover:text-white transition-all">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{p.id}</span>
                      <h3 className="text-2xl font-headline italic text-accent leading-tight">{p.project}</h3>
                      <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-widest border-neutral-100">{p.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-2">Client: {p.name}</span>
                      <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 opacity-40" /> Target: {p.endDate}</span>
                      <div className="flex items-center gap-4 w-40">
                        <span className="text-[10px] text-accent/60">{p.progress}%</span>
                        <Progress value={p.progress} className="h-1 bg-neutral-100 flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/designer/projects/${p.id}`}>
                    <Button variant="outline" className="rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-bold border-neutral-200 hover:bg-accent hover:text-white hover:border-accent transition-all">
                      Open Workbench
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 italic text-[12px] uppercase tracking-widest text-muted-foreground font-light">
            No deployment dossiers available in the current registry
          </div>
        )}
      </div>
    </div>
  );
}
