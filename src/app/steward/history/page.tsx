
"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { 
  History, 
  Search, 
  FileCheck, 
  ExternalLink,
  Calendar,
  User,
  Scale
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

export default function AuditHistoryPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const verifiedProjects = useMemo(() => {
    return clientProjects.filter(p => p.financialReportStatus === 'Verified');
  }, [clientProjects]);

  const filtered = verifiedProjects.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-slate-900" />
            <span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Historical Archives</span>
          </div>
          <h1 className="text-5xl font-headline italic">Audit <span className="not-italic">Registry.</span></h1>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            placeholder="Filter archives..." 
            className="w-full pl-12 pr-4 rounded-none border border-slate-200 h-14 text-[12px] uppercase tracking-widest focus:outline-none focus:border-slate-900 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((p, index) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-slate-200 bg-white hover:border-slate-900 transition-all group overflow-hidden">
              <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8 flex-1">
                  <div className="h-16 w-16 rounded-none border border-slate-100 flex items-center justify-center bg-slate-50 text-slate-400">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{p.id}</span>
                      <h3 className="text-2xl font-headline italic text-slate-900">{p.project}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> {p.name}</span>
                      <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Verified: {p.auditDetails?.submissionDate || 'N/A'}</span>
                      <span className="flex items-center gap-2 text-slate-900"><Scale className="h-3.5 w-3.5" /> Capital: KES {p.totalBudget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/steward/projects/${p.id}`}>
                    <Button variant="outline" className="rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-bold border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
                      Review Audit
                    </Button>
                  </Link>
                  <Link href={`/transparency/${p.id}`} target="_blank">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none border border-slate-100 text-slate-400 hover:text-slate-900">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-32 border border-dashed border-slate-200 bg-slate-50 space-y-4">
            <History className="h-12 w-12 text-slate-200 mx-auto" />
            <p className="text-[13px] font-light italic text-slate-400 uppercase tracking-[0.3em]">
              The historical audit archives are currently empty or restricted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
