"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  ArrowUpRight, 
  RefreshCcw, 
  ShieldAlert, 
  Archive, 
  CheckCircle2, 
  Target, 
  BarChart3, 
  ArrowRight,
  Settings2,
  Lock,
  Zap,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useWhyteStore } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { clientProjects, inquiries, feedback, clearAllData, businessTargets, updateBusinessTargets } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isTargetDialogOpen, setIsTargetDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [targets, setTargets] = useState({
    monthlyRevenueGoal: businessTargets.monthlyRevenueGoal,
    projectVolumeGoal: businessTargets.projectVolumeGoal,
    efficiencyTarget: businessTargets.efficiencyTarget
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeJourneys = clientProjects.filter(p => p.isActivated && !p.isArchived);
  const archivedJourneys = clientProjects.filter(p => p.isArchived);

  // Business Insights Calculations
  const currentRevenue = useMemo(() => 
    activeJourneys.reduce((sum, p) => sum + (p.totalBudget || 0), 0), 
    [activeJourneys]
  );

  const projectEfficiency = useMemo(() => {
    if (activeJourneys.length === 0) return 0;
    const avgProgress = activeJourneys.reduce((sum, p) => sum + p.progress, 0) / activeJourneys.length;
    return Math.round(avgProgress);
  }, [activeJourneys]);

  const stats = [
    { title: "Active Journeys", value: activeJourneys.length.toString(), icon: Briefcase, color: "text-accent" },
    { title: "Archived Projects", value: archivedJourneys.length.toString(), icon: Archive, color: "text-muted-foreground" },
    { title: "Open Inquiries", value: inquiries.filter(i => i.status === 'new').length.toString(), icon: MessageSquare, color: "text-accent" },
    { title: "Client Sentiment", value: feedback.length.toString(), icon: Star, color: "text-amber-500" },
  ];

  const handleUpdateTargets = () => {
    setIsSyncing(true);
    setTimeout(() => {
      updateBusinessTargets(targets);
      setIsSyncing(false);
      setIsTargetDialogOpen(false);
      toast({ title: "Strategic Targets Synchronized" });
    }, 1200);
  };

  const handleReset = () => {
    clearAllData();
    toast({
      title: "Digital Vault Purged",
      description: "All studio local state has been synchronized to empty.",
    });
  };

  const revenueProgress = Math.min(100, Math.round((currentRevenue / businessTargets.monthlyRevenueGoal) * 100));
  const volumeProgress = Math.min(100, Math.round((activeJourneys.length / businessTargets.projectVolumeGoal) * 100));

  const chartData = [
    { name: "Target", value: businessTargets.monthlyRevenueGoal, fill: "hsl(var(--accent) / 0.1)" },
    { name: "Realized", value: currentRevenue, fill: "hsl(var(--accent))" },
  ];

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Studio Intelligence</span>
          </div>
          <h1 className="text-5xl font-headline italic">Command Center.</h1>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setIsTargetDialogOpen(true)} variant="outline" className="rounded-none border-accent/10 text-accent hover:bg-accent/5 h-12 uppercase tracking-widest text-[11px] font-bold flex gap-3">
            <Target className="h-4 w-4" /> Strategic Targets
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="rounded-none text-destructive/40 hover:text-destructive hover:bg-destructive/5 h-12 uppercase tracking-widest text-[11px] font-bold flex gap-2">
                <RefreshCcw className="h-3.5 w-3.5" /> Purge System
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none border-accent/20 font-body">
              <AlertDialogHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  <span className="text-destructive text-[12px] font-bold uppercase tracking-[0.3em]">Critical Protocol</span>
                </div>
                <AlertDialogTitle className="text-2xl font-headline italic text-destructive">Confirm Digital Purge?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-base italic">
                  This will permanently remove all locally persisted studio data, including active journeys and inquiries. This action cannot be reversed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="pt-6">
                <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[11px] font-bold h-12">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleReset}
                  className="bg-destructive text-white rounded-none uppercase tracking-widest text-[11px] font-bold h-12 hover:bg-destructive/90"
                >
                  Confirm Purge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/10 shadow-xl hover:border-accent/30 transition-all group bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-headline italic">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Strategic Intelligence Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-accent/20" />
          <h2 className="text-[13px] font-bold uppercase tracking-[0.4em] text-accent/60">Business Intelligence & Strategic Goals</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="rounded-none border-accent/5 shadow-2xl bg-white lg:col-span-2 overflow-hidden flex flex-col">
            <div className="bg-accent/5 h-1.5 w-full" />
            <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline italic flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-accent/40" /> Revenue Realization
                </CardTitle>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Authorized Capital vs Strategic Target</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-headline italic text-accent">KES {currentRevenue.toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Target Month Cycle</p>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-0 flex-1 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: 'hsl(var(--accent) / 0.4)' }} />
                    <YAxis hide />
                    <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="md:col-span-5 space-y-8 border-l border-accent/5 pl-12">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-accent/40">Fiscal Realization</span>
                    <span className="text-xl font-headline italic">{revenueProgress}%</span>
                  </div>
                  <Progress value={revenueProgress} className="h-1 bg-accent/5 rounded-none" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent/30">Gap to Target</p>
                  <p className="text-xl font-headline italic text-orange-600">KES {Math.max(0, businessTargets.monthlyRevenueGoal - currentRevenue).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-accent/5 shadow-2xl bg-white p-10 space-y-10">
            <div className="space-y-1">
              <CardTitle className="text-xl font-headline italic flex items-center gap-3">
                <Zap className="h-4 w-4 text-accent/40" /> Implementation Index
              </CardTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Operational Delivery Metrics</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-accent/60">
                  <span>Project Volume Goal</span>
                  <span>{activeJourneys.length} / {businessTargets.projectVolumeGoal}</span>
                </div>
                <Progress value={volumeProgress} className="h-1 bg-accent/5 rounded-none" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-accent/60">
                  <span>Studio Efficiency</span>
                  <span>{projectEfficiency}%</span>
                </div>
                <Progress value={projectEfficiency} className="h-1 bg-accent/5 rounded-none" />
                <p className="text-[9px] text-muted-foreground italic uppercase tracking-widest">Average implementation velocity across active dossiers</p>
              </div>

              <div className="pt-6 border-t border-accent/5">
                <div className="p-6 bg-accent/[0.02] border border-accent/5 italic text-sm text-accent/60 leading-relaxed">
                  "Target realization depends on synchronized activation of pending briefs."
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
            <div className="bg-accent h-1 w-full" />
            <CardHeader className="flex flex-row items-center justify-between p-8">
              <CardTitle className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent">Recent Inquiries</CardTitle>
              <Link href="/admin/inquiries" className="text-[11px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent flex items-center gap-2 transition-colors">
                View All Pipeline <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-4">
                {inquiries.slice(0, 3).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-6 border border-accent/5 hover:border-accent/10 transition-all bg-secondary/10 group cursor-pointer">
                    <div className="space-y-1">
                      <p className="text-base font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{inquiry.name}</p>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-light italic">
                        {inquiry.date} — {inquiry.serviceType}
                      </p>
                    </div>
                    <div className={`text-[10px] font-bold border px-4 py-1.5 uppercase tracking-widest ${
                      inquiry.status === 'new' ? 'text-accent border-accent/20 bg-accent/5' : 'text-muted-foreground border-border'
                    }`}>
                      {inquiry.status}
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <div className="text-center py-12 text-[11px] uppercase tracking-widest text-muted-foreground italic">
                    No active pipeline entries
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-accent/10 shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-3">
                <Archive className="h-4 w-4 opacity-40" /> Recently Retired Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archivedJourneys.slice(0, 4).map((p) => (
                  <Link key={p.id} href={`/admin/clients/${p.id}`} className="group p-6 border border-accent/5 hover:border-accent/20 bg-secondary/5 flex flex-col justify-between h-36 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.4em]">{p.id}</span>
                      <Badge className="bg-black text-white rounded-none text-[9px] uppercase tracking-widest px-2 py-0.5">Retired</Badge>
                    </div>
                    <h4 className="text-xl font-headline italic text-accent/80 group-hover:text-accent transition-colors">{p.project}</h4>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">{p.name}</p>
                  </Link>
                ))}
                {archivedJourneys.length === 0 && (
                  <div className="col-span-full py-8 text-center border border-dashed border-accent/10">
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground italic">No commissions in the master archives yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-accent/10 shadow-xl bg-white p-8">
            <CardTitle className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Client Sentiment</CardTitle>
            <div className="space-y-8">
              {feedback.filter(fb => fb.isApproved).slice(0, 1).map(fb => (
                <div key={fb.id} className="p-6 bg-accent/5 border-l-2 border-accent italic">
                  <p className="text-base font-light text-accent/80 leading-relaxed mb-4">
                    "{fb.comment}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-accent">{fb.name}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= fb.rating ? 'fill-accent text-accent' : 'text-accent/10'}`} />)}
                    </div>
                  </div>
                </div>
              ))}
              {feedback.filter(fb => fb.isApproved).length === 0 && (
                <div className="text-center py-6 text-[11px] uppercase tracking-widest text-muted-foreground italic">
                  No approved testimonials
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-none border-accent/10 shadow-xl bg-secondary/10 p-8 border-dashed">
            <h4 className="text-[12px] uppercase tracking-[0.4em] font-bold text-accent/40 mb-4">System Log</h4>
            <ul className="space-y-4">
              <li className="text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" /> {activeJourneys.length} active journeys
              </li>
              <li className="text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                <div className="h-1.5 w-1.5 bg-black rounded-full" /> {archivedJourneys.length} commissions retired
              </li>
              <li className="text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                <div className="h-1.5 w-1.5 bg-accent rounded-full" /> {inquiries.length} inquiries logged
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Dialog open={isTargetDialogOpen} onOpenChange={setIsTargetDialogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Settings2 className="h-5 w-5 text-accent" />
                <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Strategic Calibration</span>
              </div>
              <DialogTitle className="text-3xl font-headline italic">Update Studio Goals</DialogTitle>
              <DialogDescription className="text-[13px] italic font-light leading-relaxed">
                Configure current targets for revenue realization and implementation capacity.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Monthly Revenue Goal (KES)</Label>
                <Input 
                  type="number" 
                  value={targets.monthlyRevenueGoal} 
                  onChange={(e) => setTargets({...targets, monthlyRevenueGoal: Number(e.target.value)})}
                  className="rounded-none h-14 text-lg border-accent/20 focus:ring-accent" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Project Volume</Label>
                  <Input 
                    type="number" 
                    value={targets.projectVolumeGoal} 
                    onChange={(e) => setTargets({...targets, projectVolumeGoal: Number(e.target.value)})}
                    className="rounded-none h-12 text-base border-accent/20 focus:ring-accent" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Efficiency %</Label>
                  <Input 
                    type="number" 
                    value={targets.efficiencyTarget} 
                    onChange={(e) => setTargets({...targets, efficiencyTarget: Number(e.target.value)})}
                    className="rounded-none h-12 text-base border-accent/20 focus:ring-accent" 
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl transition-all" 
                onClick={handleUpdateTargets} 
                disabled={isSyncing}
              >
                {isSyncing ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...</span> : "Authorize Calibration"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
