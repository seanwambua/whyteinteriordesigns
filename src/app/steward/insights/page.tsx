"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Landmark, 
  History,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity
} from "lucide-react";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  Cell,
  Pie,
  PieChart
} from "recharts";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function StewardFiscalInsightsPage() {
  const { clientProjects, financialSteward } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const verifiedAudits = useMemo(() => clientProjects.filter(p => p.financialReportStatus === 'Verified'), [clientProjects]);
  const pendingAudits = useMemo(() => clientProjects.filter(p => p.handoverStatus === 'Passed' && p.financialReportStatus !== 'Verified'), [clientProjects]);

  const totalAuditedValue = useMemo(() => verifiedAudits.reduce((sum, p) => sum + p.totalBudget, 0), [verifiedAudits]);
  const activeQueueValue = useMemo(() => pendingAudits.reduce((sum, p) => sum + p.totalBudget, 0), [pendingAudits]);

  const auditDistributionData = useMemo(() => [
    { name: 'Verified', value: verifiedAudits.length, fill: '#0f172a' },
    { name: 'Awaiting', value: pendingAudits.length, fill: '#94a3b8' },
  ], [verifiedAudits, pendingAudits]);

  const stats = [
    { label: "Authorized Capital", value: `KES ${(totalAuditedValue / 1000000).toFixed(1)}M`, icon: ShieldCheck, sub: "Historical Integrity" },
    { label: "Queue Value", value: `KES ${(activeQueueValue / 1000000).toFixed(1)}M`, icon: Landmark, sub: "Pending Verification" },
    { label: "Reconciliation Rate", value: `${clientProjects.length ? Math.round((verifiedAudits.length / clientProjects.length) * 100) : 0}%`, icon: Scale, sub: "Portfolio Velocity" },
    { label: "Integrity Score", value: "99.8%", icon: CheckCircle2, sub: "Audit Variance" },
  ];

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-slate-900" />
            <span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Analytics</span>
          </div>
          <h1 className="text-5xl font-headline italic">Fiscal <span className="not-italic">Insights.</span></h1>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="rounded-none border-slate-200 text-slate-400 uppercase tracking-widest text-[10px] px-4 py-2 bg-white">
            Audit Entity: {financialSteward}
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-slate-200 shadow-xl bg-white overflow-hidden group">
              <div className="h-1 w-full bg-slate-100" />
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline italic text-slate-900">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold opacity-60">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Card className="lg:col-span-8 rounded-none border-slate-200 shadow-2xl bg-white p-12 space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-headline italic">Capital Authorization History</h3>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Verified Audit Volume — Historical Dossiers</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-headline italic text-slate-900">{verifiedAudits.length} Projects</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Audits Finalized</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verifiedAudits.slice(0, 6)}>
                <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis hide />
                <RechartsTooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-slate-200 p-4 shadow-2xl rounded-none">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{payload[0].payload.id}</p>
                        <p className="text-sm font-headline italic text-slate-900">KES {payload[0].value?.toLocaleString()}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="totalBudget" fill="#0f172a" radius={[0, 0, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Activity className="h-5 w-5 text-slate-400" />
              <p className="text-[11px] font-light italic text-slate-500 leading-relaxed max-w-md">
                "Authorization history reflects dossiers that have cleared both technical handover and primary financial audit protocols."
              </p>
            </div>
            <Badge className="rounded-none bg-slate-900 text-white uppercase tracking-widest text-[9px] py-2 px-6">Verified Archives Only</Badge>
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-12">
          <Card className="rounded-none border-slate-200 shadow-xl bg-white p-10 space-y-10">
            <div className="space-y-1">
              <h3 className="text-xl font-headline italic text-slate-900">Audit Status</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Protocol Distribution</p>
            </div>
            <div className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={auditDistributionData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {auditDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                <span className="text-slate-900">Verified Protocols</span>
                <span className="text-slate-900">{verifiedAudits.length}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                <span className="text-slate-400">Awaiting Reconciliation</span>
                <span className="text-slate-400">{pendingAudits.length}</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-none border-slate-900 bg-slate-900 p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BarChart3 className="h-32 w-32" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-400 relative z-10">Audit Directive</h3>
            <div className="space-y-6 relative z-10">
              <p className="text-lg font-light italic leading-relaxed text-slate-300 border-l-2 border-slate-700 pl-6">
                "Stewardship impact is measured by the total value of authorized capital reconciled against technical site protocols."
              </p>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  <span>Reconciliation Efficiency</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-1 bg-slate-800" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="p-10 border border-dashed border-slate-200 text-center bg-slate-50">
        <p className="text-[11px] uppercase tracking-[0.5em] text-slate-400 font-bold italic">
          Authorized auditing intelligence — data is strictly synchronized with the master registry.
        </p>
      </div>
    </div>
  );
}
