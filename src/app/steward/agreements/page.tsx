
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Signature, 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  FileSearch,
  Scale,
  ShieldCheck,
  AlertCircle,
  FileEdit,
  Landmark,
  PenTool,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function WitnessingTerminalPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pendingAgreements = useMemo(() => {
    return clientProjects.filter(p => 
      p.reorganization?.status === 'Pending_Agreement' && 
      p.reorganization.clientAgreed &&
      !p.reorganization.stewardWitnessed
    );
  }, [clientProjects]);

  const filtered = pendingAgreements.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Governance Protocol</span>
          </div>
          <h1 className="text-6xl font-headline italic">Witnessing <span className="not-italic">Terminal.</span></h1>
        </div>
        
        <div className="relative w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-accent/30" />
          <input 
            placeholder="Search pending agreements..." 
            className="w-full pl-14 pr-6 rounded-none border border-accent/10 h-16 text-[13px] uppercase tracking-widest bg-white focus:outline-none focus:border-accent shadow-xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-10">
        {filtered.map((p, index) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-accent/5 bg-white hover:border-accent/40 transition-all group overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row h-full items-stretch">
                <div className="p-12 border-b lg:border-b-0 lg:border-r border-accent/5 bg-secondary/10 flex flex-col justify-between min-w-[350px]">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-accent/40 uppercase tracking-[0.5em] block">{p.id}</span>
                      <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[10px] font-bold py-2 px-6 shadow-lg">AGREEMENT PENDING</Badge>
                    </div>
                    <div className="space-y-6 pt-8 border-t border-accent/10">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-accent/60">
                        <span>Client Signature</span>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-accent/60">
                        <span>Steward Witness</span>
                        <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-12 space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Total Capital Plan</p>
                    <p className="text-4xl font-headline italic text-accent leading-none">KES {p.totalBudget.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex-1 p-12 lg:p-16 flex flex-col justify-between">
                  <div className="space-y-12">
                    <div className="space-y-2">
                      <h3 className="text-4xl font-headline italic text-accent leading-tight">{p.project}</h3>
                      <p className="text-[13px] uppercase tracking-widest font-bold text-muted-foreground/60">Lead Client: {p.name}</p>
                    </div>
                    
                    <div className="p-10 bg-accent/[0.02] border-l-4 border-accent italic space-y-4 shadow-inner">
                      <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Agreement Rationale</p>
                      <p className="text-xl font-light leading-relaxed text-accent/80">"{p.reorganization?.terms || "No terms specified."}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40 flex items-center gap-3">
                          <Landmark className="h-4 w-4" /> Proposed Framework
                        </p>
                        <div className="space-y-4">
                          {p.reorganization?.proposedInstallments.map((ins, i) => (
                            <div key={i} className="flex justify-between items-center text-[12px] font-bold uppercase tracking-widest text-accent/80 pb-4 border-b border-accent/5 last:border-0 last:pb-0">
                              <span>{ins.label} ({ins.percentage}%)</span>
                              <span className="text-accent">KES {ins.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-10 border border-dashed border-accent/10 bg-secondary/5 rounded-none space-y-4">
                        <Signature className="h-12 w-12 text-accent/10" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/30 text-center leading-relaxed">
                          Awaiting Professional <br />Witness Certification
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 pt-12 border-t border-accent/5 mt-16">
                    <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-accent/40 italic">
                      <ShieldCheck className="h-5 w-5 text-green-600/40" /> 
                      Certification will synchronize the master commission ledger across all portals.
                    </div>
                    <Button asChild className="h-20 px-16 rounded-none bg-accent text-white uppercase tracking-[0.3em] text-[12px] font-bold hover:bg-accent/90 transition-all flex gap-4 shadow-2xl hover:tracking-[0.4em]">
                      <Link href={`/steward/projects/${p.id}`} className="flex items-center gap-4">
                        Open Witness Workbench <ArrowRight className="h-6 w-6" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-48 border border-dashed border-accent/10 bg-secondary/5 space-y-8">
            <div className="h-24 w-24 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
              <PenTool className="h-12 w-12 text-accent/10" />
            </div>
            <p className="text-xl font-light italic text-accent/40 uppercase tracking-[0.4em]">
              No financing agreements currently awaiting professional witness certification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
