"use client";

import { useWhyteStore } from "@/store/use-whyte-store";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  Cell,
  Area,
  AreaChart
} from "recharts";

export default function FiscalTerminalPage() {
  const { clientProjects, businessTargets } = useWhyteStore();
  const activeProjects = clientProjects.filter(p => p.isActivated && !p.isArchived);
  const totalRevenue = useMemo(() => activeProjects.reduce((sum, p) => sum + (p.totalBudget || 0), 0), [activeProjects]);
  const averageDealSize = useMemo(() => activeProjects.length ? totalRevenue / activeProjects.length : 0, [activeProjects, totalRevenue]);

  const tierData = useMemo(() => [
    { name: 'Premium', value: clientProjects.filter(p => p.tier === 'Premium').length, fill: 'hsl(var(--accent) / 0.4)' },
    { name: 'Deluxe', value: clientProjects.filter(p => p.tier === 'Deluxe').length, fill: 'hsl(var(--accent) / 0.7)' },
    { name: 'Golden', value: clientProjects.filter(p => p.tier === 'Golden').length, fill: 'hsl(var(--accent))' },
  ], [clientProjects]);

  const revenueHistory = [
    { month: 'Jan', revenue: 12000000 },
    { month: 'Feb', revenue: 18000000 },
    { month: 'Mar', revenue: 15000000 },
    { month: 'Apr', revenue: 22000000 },
    { month: 'May', revenue: totalRevenue / 2 },
    { month: 'Jun', revenue: totalRevenue },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="rounded-none border-accent/5 shadow-2xl bg-white lg:col-span-2 p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-headline italic">Revenue Realization</h3>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Authorized Capital Growth — 6 Month Projection</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-headline italic text-accent">KES {totalRevenue.toLocaleString()}</p>
            <p className="text-[9px] uppercase tracking-widest text-accent/40 font-bold">Total Committed</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueHistory}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: 'hsl(var(--accent) / 0.4)' }} />
              <YAxis hide />
              <RechartsTooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-accent/10 p-4 shadow-2xl rounded-none">
                      <p className="text-[10px] uppercase font-bold text-accent/40 mb-1">{payload[0].payload.month}</p>
                      <p className="text-sm font-headline italic text-accent">KES {payload[0].value?.toLocaleString()}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-none border-accent/5 shadow-2xl bg-white p-10 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl font-headline italic">Tier Distribution</h3>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Portfolio Concentration by Tier</p>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: 'hsl(var(--accent) / 0.6)' }} width={80} />
                <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-6 pt-10 border-t border-accent/5">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-accent/40">Average Deal Size</span>
              <span className="text-accent">KES {(averageDealSize / 1000000).toFixed(1)}M</span>
            </div>
            <Progress value={70} className="h-1 bg-accent/5" />
          </div>
          <p className="text-[10px] italic text-muted-foreground leading-relaxed uppercase tracking-widest">High-concentration in Golden tier commissions indicates stable brand authority.</p>
        </div>
      </Card>
    </div>
  );
}
