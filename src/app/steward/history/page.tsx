
"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  History, 
  Search, 
  FileCheck, 
  ExternalLink,
  Calendar,
  User,
  Scale,
  FileClock,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AuditHistoryPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const verifiedProjects = useMemo(() => {
    return clientProjects.filter(p => p.financialReportStatus === 'Verified' || p.financialReportStatus === 'Awaiting Admin');
  }, [clientProjects]);

  const filtered = verifiedProjects.filter(p => 
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
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Stewardship Archives</span>
          </div>
          <h1 className="text-6xl font-headline italic">Historical <span className="not-italic">Registry.</span></h1>
        </div>
        
        <div className="relative w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-accent/30" />
          <input 
            placeholder="Search verified dossiers..." 
            className="w-full pl-14 pr-6 rounded-none border border-accent/10 h-16 text-[13px] uppercase tracking-widest bg-white focus:outline-none focus:border-accent shadow-xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {filtered.map((p, index) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-accent/5 bg-white hover:border-accent/40 transition-all group overflow-hidden shadow-xl">
              <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-10 flex-1">
                  <div className={cn(
                    "h-20 w-20 rounded-none border border-accent/10 flex flex-col items-center justify-center transition-all shadow-inner",
                    p.financialReportStatus === 'Verified' ? "bg-green-50 text-green-600 border-green-200" : "bg-accent/[0.02] text-accent/20"
                  )}>
                    {p.financialReportStatus === 'Verified' ? <FileCheck className="h-8 w-8" /> : <FileClock className="h-8 w-8" />}
                    <span className="text-[8px] font-black uppercase mt-1">CERT</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-6">
                      <span className="text-[12px] font-bold text-accent/40 uppercase tracking-[0.4em]">{p.id}</span>
                      <h3 className="text-3xl font-headline italic text-accent leading-tight">{p.project}</h3>
                      <Badge variant="outline" className={cn(
                        "rounded-none uppercase tracking-widest text-[9px] font-bold px-4 py-1.5 shadow-sm border-accent/10",
                        p.financialReportStatus === 'Verified' ? "bg-green-50 text-green-600 border-green-200" : "bg-accent/5 text-accent border-accent/20"
                      )}>
                        {p.financialReportStatus === 'Verified' ? 'Protocol Authorized' : 'Sync Awaiting Auth'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-8 text-[12px] text-muted-foreground uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-2.5"><User className="h-4 w-4 opacity-40" /> Client: {p.name}</span>
                      <div className="h-1.5 w-1.5 bg-accent/10 rounded-full" />
                      <span className="flex items-center gap-2.5"><Calendar className="h-4 w-4 opacity-40" /> Handover: {p.endDate}</span>
                      <div className="h-1.5 w-1.5 bg-accent/10 rounded-full" />
                      <span className="flex items-center gap-2.5 text-accent"><Scale className="h-4 w-4 opacity-40" /> KES {p.totalBudget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 pl-10 border-l border-accent/5">
                  <Link href={`/steward/projects/${p.id}`}>
                    <Button variant="outline" className="rounded-none h-14 px-10 uppercase tracking-widest text-[11px] font-bold border-accent/10 hover:bg-accent hover:text-white transition-all shadow-sm">
                      Dossier Review
                    </Button>
                  </Link>
                  <Link href={`/transparency/${p.id}`} target="_blank">
                    <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full border border-accent/10 text-accent/40 hover:text-accent hover:bg-accent/5 transition-all">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-48 border border-dashed border-accent/10 bg-secondary/5 space-y-6">
            <History className="h-16 w-16 text-accent/10 mx-auto" />
            <p className="text-xl font-light italic text-accent/40 uppercase tracking-[0.4em]">
              The historical stewardship archives are currently empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
