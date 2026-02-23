
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
    <div className="space-y-12 max-w-7xl mx-auto pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-slate-900" />
            <span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Governance Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Witnessing <span className="not-italic">Terminal.</span></h1>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            placeholder="Search pending agreements..." 
            className="w-full pl-12 pr-4 rounded-none border border-slate-200 h-14 text-[12px] uppercase tracking-widest focus:outline-none focus:border-slate-900 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {filtered.map((p, index) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-slate-200 bg-white hover:border-blue-500/20 transition-all group overflow-hidden shadow-sm">
              <div className="flex flex-col lg:flex-row h-full">
                <div className="p-10 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/30 flex flex-col justify-between min-w-[320px]">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] block">{p.id}</span>
                      <Badge className="bg-blue-600 text-white rounded-none uppercase tracking-widest text-[9px] font-bold py-1.5 px-4">Agreement Pending</Badge>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Client Signature</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Steward Witness</span>
                        <Clock className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-10 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Commitment</p>
                    <p className="text-2xl font-headline italic text-slate-900">KES {p.totalBudget.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex-1 p-10 md:p-12 flex flex-col justify-between">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-headline italic text-slate-900 leading-tight">{p.project}</h3>
                      <p className="text-[12px] uppercase tracking-widest font-bold text-slate-400">Authorized Client: {p.name}</p>
                    </div>
                    
                    <div className="p-6 bg-blue-50/50 border border-blue-100 italic space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600/60">Proposed Terms</p>
                      <p className="text-base font-light leading-relaxed text-slate-700">"{p.reorganization?.terms || "No terms specified."}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Landmark className="h-3 w-3" /> New Payout Framework
                        </p>
                        <div className="space-y-2">
                          {p.reorganization?.proposedInstallments.map((ins, i) => (
                            <div key={i} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-600 pb-2 border-b border-slate-50 last:border-0">
                              <span>{ins.label} ({ins.percentage}%)</span>
                              <span className="text-slate-900">KES {ins.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-center p-8 border border-dashed border-slate-200">
                        <div className="text-center space-y-2">
                          <Signature className="h-8 w-8 text-slate-200 mx-auto" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Awaiting Professional Witness Certification</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-slate-100 mt-12">
                    <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 italic">
                      <ShieldCheck className="h-4 w-4" /> Certification will synchronize the master ledger across all portals.
                    </div>
                    <Button asChild className="h-16 px-12 rounded-none bg-slate-900 text-white uppercase tracking-widest text-[11px] font-bold hover:bg-black transition-all flex gap-3 shadow-xl">
                      <Link href={`/steward/projects/${p.id}`}>Open Witness Workbench <ArrowRight className="h-5 w-5" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-40 border border-dashed border-slate-200 bg-slate-50/50 italic text-[12px] uppercase tracking-[0.3em] font-light space-y-4">
            <PenTool className="h-12 w-12 text-slate-200 mx-auto" />
            <p>No financing agreements currently awaiting professional witnessing</p>
          </div>
        )}
      </div>
    </div>
  );
}
