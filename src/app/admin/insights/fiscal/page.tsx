"use client";

import { useWhyteStore } from "@/store/use-whyte-store";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
import { 
  Settings2, 
  Target, 
  Building2, 
  Loader2, 
  ChevronRight, 
  Users,
  CircleDollarSign,
  TrendingUp
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function FiscalTerminalPage() {
  const { clientProjects, businessTargets, updateBusinessTargets, financialSteward, setFinancialSteward } = useWhyteStore();
  const { toast } = useToast();
  
  const [isTargetDialogOpen, setIsTargetDialogOpen] = useState(false);
  const [isStewardDialogOpen, setIsStewardDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [targets, setTargets] = useState({
    monthlyRevenueGoal: businessTargets.monthlyRevenueGoal,
    projectVolumeGoal: businessTargets.projectVolumeGoal,
    efficiencyTarget: businessTargets.efficiencyTarget
  });

  const [newSteward, setNewSteward] = useState(financialSteward);

  const activeProjects = clientProjects.filter(p => p.isActivated && !p.isArchived);
  const totalRevenue = useMemo(() => activeProjects.reduce((sum, p) => sum + (p.totalBudget || 0), 0), [activeProjects]);
  const averageDealSize = useMemo(() => activeProjects.length ? totalRevenue / activeProjects.length : 0, [activeProjects, totalRevenue]);

  const handleUpdateTargets = () => {
    setIsSyncing(true);
    setTimeout(() => {
      updateBusinessTargets(targets);
      setIsSyncing(false);
      setIsTargetDialogOpen(false);
      toast({ title: "Strategic Calibration Synchronized" });
    }, 1200);
  };

  const handleUpdateSteward = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setFinancialSteward(newSteward);
      setIsSyncing(false);
      setIsStewardDialogOpen(false);
      toast({ title: "Financial Protocol Updated" });
    }, 1200);
  };

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

  const revenueProgress = Math.min(100, Math.round((totalRevenue / businessTargets.monthlyRevenueGoal) * 100));

  return (
    <div className="space-y-12">
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

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="rounded-none border-accent/5 bg-white p-10 space-y-8 shadow-xl">
          <div className="flex items-center gap-4">
            <Target className="h-5 w-5 text-accent/40" />
            <h4 className="text-[12px] font-bold uppercase tracking-[0.3em]">Strategic Calibration</h4>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-accent/40">
                <span>Monthly Target</span>
                <span>{revenueProgress}%</span>
              </div>
              <Progress value={revenueProgress} className="h-1 bg-accent/5" />
            </div>
            <Button onClick={() => setIsTargetDialogOpen(true)} variant="outline" className="w-full rounded-none h-12 border-accent/10 text-[10px] font-bold uppercase tracking-widest flex gap-3 hover:bg-accent hover:text-white transition-all">
              <Settings2 className="h-4 w-4" /> Calibrate Targets
            </Button>
          </div>
        </Card>

        <Card className="rounded-none border-accent/5 bg-white p-10 space-y-8 shadow-xl">
          <div className="flex items-center gap-4">
            <Building2 className="h-5 w-5 text-accent/40" />
            <h4 className="text-[12px] font-bold uppercase tracking-[0.3em]">Financial Stewardship</h4>
          </div>
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-accent/60">Current Assigned Entity:</p>
            <p className="text-lg font-headline italic text-accent">{financialSteward}</p>
            <Button onClick={() => setIsStewardDialogOpen(true)} variant="outline" className="w-full rounded-none h-12 border-accent/10 text-[10px] font-bold uppercase tracking-widest flex gap-3 hover:bg-accent hover:text-white transition-all mt-4">
              <Settings2 className="h-4 w-4" /> Update Steward
            </Button>
          </div>
        </Card>

        <Card className="rounded-none border-accent/5 bg-accent p-10 space-y-8 shadow-xl text-white">
          <div className="flex items-center gap-4">
            <CircleDollarSign className="h-5 w-5 text-white/40" />
            <h4 className="text-[12px] font-bold uppercase tracking-[0.3em]">Registry Access</h4>
          </div>
          <div className="space-y-6">
            <p className="text-[11px] font-light italic text-white/60">Access individual commission ledgers and structural dossiers via the master registry.</p>
            <Button asChild className="w-full rounded-none h-14 bg-white text-accent hover:bg-white/90 text-[10px] font-bold uppercase tracking-widest flex gap-3 shadow-2xl">
              <Link href="/admin/clients">Open Master Registry <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* TARGETS DIALOG */}
      <Dialog open={isTargetDialogOpen} onOpenChange={setIsTargetDialogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Target className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Strategic Calibration</span></div>
              <DialogTitle className="text-3xl font-headline italic">Update Studio Goals</DialogTitle>
              <DialogDescription className="text-[13px] italic font-light">Configure current targets for revenue realization and implementation capacity.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Monthly Revenue Goal (KES)</Label>
                <Input type="number" value={targets.monthlyRevenueGoal} onChange={(e) => setTargets({...targets, monthlyRevenueGoal: Number(e.target.value)})} className="rounded-none h-14 text-lg border-accent/20" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Project Volume</Label>
                  <Input type="number" value={targets.projectVolumeGoal} onChange={(e) => setTargets({...targets, projectVolumeGoal: Number(e.target.value)})} className="rounded-none h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Efficiency %</Label>
                  <Input type="number" value={targets.efficiencyTarget} onChange={(e) => setTargets({...targets, efficiencyTarget: Number(e.target.value)})} className="rounded-none h-12" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl" onClick={handleUpdateTargets} disabled={isSyncing}>{isSyncing ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Syncing...</span> : "Authorize Calibration"}</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* STEWARD DIALOG */}
      <Dialog open={isStewardDialogOpen} onOpenChange={setIsStewardDialogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Protocol</span></div>
              <DialogTitle className="text-3xl font-headline italic">Update Steward</DialogTitle>
              <DialogDescription className="text-[13px] italic font-light">Assign the entity responsible for audit verification and financial reconciliation.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Entity Identity</Label>
              <Input value={newSteward} onChange={(e) => setNewSteward(e.target.value)} className="rounded-none h-14 text-lg border-accent/20" />
            </div>
            <DialogFooter>
              <Button className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl" onClick={handleUpdateSteward} disabled={isSyncing}>{isSyncing ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Syncing...</span> : "Authorize Update"}</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
