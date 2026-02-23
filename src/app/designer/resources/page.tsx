"use client";

import { motion } from "use-framer-motion";
import { useWhyteStore, Collaborator } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Search, 
  Compass, 
  HardHat, 
  Star, 
  Mail, 
  Phone,
  ShieldCheck,
  BadgeCheck,
  Building2,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PartnerMatrixRegistryPage() {
  const { collaborators } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filtered = collaborators.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.specialty.toLowerCase().includes(search.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Trade Coordination</span>
          </div>
          <h1 className="text-5xl font-headline italic">Partner <span className="not-italic">Matrix.</span></h1>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search specialists..." 
            className="w-full pl-12 pr-4 rounded-none border border-neutral-200 h-14 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((res, index) => (
          <motion.div key={res.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
            <Card className="rounded-none border-neutral-100 bg-white shadow-sm overflow-hidden group">
              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className={cn(
                  "w-1.5 shrink-0 self-stretch",
                  res.category === 'Collaborator' ? 'bg-accent' : 'bg-accent/20'
                )} />
                
                <div className="flex-1 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-8">
                    <div className={cn(
                      "h-16 w-16 rounded-none flex flex-col items-center justify-center shrink-0 border border-neutral-100",
                      res.category === 'Collaborator' ? 'bg-accent text-white' : 'bg-neutral-50 text-accent/40'
                    )}>
                       {res.category === 'Collaborator' ? <Compass className="h-6 w-6" /> : <HardHat className="h-6 w-6" />}
                       <span className="text-[8px] uppercase font-black tracking-widest mt-1">{res.category === 'Collaborator' ? 'BP' : 'TR'}</span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-headline italic text-accent">{res.name}</h3>
                        {res.rating >= 4.8 && <BadgeCheck className="h-4 w-4 text-accent" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground uppercase tracking-widest font-bold">
                        <span>{res.specialty}</span>
                        <div className="h-1 w-1 bg-neutral-200 rounded-full" />
                        <span className="opacity-40">{res.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 justify-between lg:justify-end">
                    <div className="flex flex-col lg:items-end gap-2 text-[12px] uppercase tracking-widest font-bold">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 opacity-40" /> {res.contact}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 opacity-40" /> {res.email}
                      </div>
                    </div>

                    <div className="text-right min-w-[100px]">
                       <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent/30 block mb-1">Integrity</span>
                       <div className="flex items-center gap-1.5 justify-end">
                         <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                         <span className="text-xl font-headline italic">{res.rating.toFixed(1)}</span>
                       </div>
                    </div>

                    <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] font-bold px-3 py-1 bg-green-50 text-green-600 border-green-100">
                      {res.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-32 border border-dashed border-neutral-200 bg-neutral-50 italic text-muted-foreground uppercase tracking-[0.3em] font-light">
            No verified partners found in current matrix
          </div>
        )}
      </div>
    </div>
  );
}
