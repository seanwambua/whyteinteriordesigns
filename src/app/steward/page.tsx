
"use client";

import { motion } from "framer-motion";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Wallet, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  FileText,
  AlertCircle,
  TrendingUp,
  Landmark,
  BadgeCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StewardDashboardPage() {
  const { clientProjects } = useWhyteStore();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const relevantProjects = useMemo(() => {
    // Stewards see projects in Completion phase or Termination Pending
    return clientProjects.filter(p => 
      !p.isArchived && 
      p.isActivated && 
      (p.status === 'Completion' || p.status === 'Termination')
    );
  }, [clientProjects]);

  const filtered = relevantProjects.filter(p => 
    p.project.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCapitalUnderReview = relevantProjects.reduce((sum, p) => sum + p.totalBudget, 0);
  const pendingAuditsCount = relevantProjects.filter(p => p.financialReportStatus !== 'Verified').length;

  if (!isMounted) return null;

  const stats = [
    { label: "Dossiers in Queue", value: pendingAuditsCount.toString(), icon: Clock, sub: "Requires Verification" },
    { label: "Capital Under Review", value: `KES ${(totalCapitalUnderReview / 1000000).toFixed(1)}M`, icon: Landmark, sub: "Total Commitment" },
    { label: "Audit Accuracy", value: "99.8%", icon: BadgeCheck, sub: "Stewardship Integrity" },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-slate-900" />
            <span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Audit Terminal</span>
          </div>
          <h1 className="text-5xl font-headline italic">Financial <span className="not-italic">Stewardship.</span></h1>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            placeholder="Search Dossier ID or Client..." 
            className="w-full pl-12 pr-4 rounded-none border border-slate-200 h-14 text-[12px] uppercase tracking-widest bg-white focus:outline-none focus:border-slate-900 shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden group">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline italic text-slate-900">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Scale className="h-5 w-5 text-slate-400" />
          <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">Pending Reconciliation Protocols</h2>
        </div>

        <div className="bg-white border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Dossier ID</th>
                <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Project Context</th>
                <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Capital Commitment</th>
                <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Audit Status</th>
                <th className="p-6 text-right text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <span className="text-[12px] font-bold text-slate-900 uppercase tracking-widest">{p.id}</span>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <p className="text-base font-headline italic text-slate-900">{p.project}</p>
                      <p className="text-[11px] uppercase font-bold text-slate-400">{p.name}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <p className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">KES {p.totalBudget.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Tier: {p.tier}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <Badge variant="outline" className={cn(
                      "rounded-none uppercase tracking-widest text-[9px] font-bold py-1 px-3",
                      p.financialReportStatus === 'Verified' ? "bg-green-50 text-green-600 border-green-200" : "bg-orange-50 text-orange-600 border-orange-200"
                    )}>
                      {p.financialReportStatus || 'Awaiting Review'}
                    </Badge>
                  </td>
                  <td className="p-6 text-right">
                    <Button asChild variant="ghost" size="sm" className="rounded-none border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-widest text-[10px] font-bold gap-2">
                      <Link href={`/steward/projects/${p.id}`}>
                        Perform Audit <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400 italic text-[13px] uppercase tracking-widest">
                    No active dossiers prioritized for financial reconciliation
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-10 border border-dashed border-slate-200 text-center bg-white/50">
        <p className="text-[11px] uppercase tracking-[0.5em] text-slate-400 font-bold italic leading-relaxed">
          Authorized auditing protocol — All actions are logged and synchronized with the master registry.
        </p>
      </div>
    </div>
  );
}
