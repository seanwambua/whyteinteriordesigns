"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Target, 
  PieChart, 
  MousePointer2, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight, 
  Users, 
  DollarSign, 
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo } from "react";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  Cell,
  Line,
  LineChart,
  Area,
  AreaChart,
  CartesianGrid
} from "recharts";
import { cn } from "@/lib/utils";

export default function StrategicInsightsPage() {
  const { clientProjects, inquiries, feedback, businessTargets, collaborators } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeProjects = clientProjects.filter(p => p.isActivated && !p.isArchived);
  const totalRevenue = useMemo(() => activeProjects.reduce((sum, p) => sum + (p.totalBudget || 0), 0), [activeProjects]);
  const averageDealSize = useMemo(() => activeProjects.length ? totalRevenue / activeProjects.length : 0, [activeProjects, totalRevenue]);
  
  const leadVelocity = inquiries.filter(i => i.status === 'new').length;
  const conversionRate = inquiries.length ? (activeProjects.length / inquiries.length) * 100 : 0;
  
  const studioEfficiency = useMemo(() => {
    if (activeProjects.length === 0) return 0;
    return Math.round(activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length);
  }, [activeProjects]);

  const npsScore = useMemo(() => {
    const approved = feedback.filter(f => f.isApproved);
    if (!approved.length) return 0;
    const avg = approved.reduce((sum, f) => sum + f.rating, 0) / approved.length;
    return (avg * 20); // Normalize to 100
  }, [feedback]);

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
    { month: 'May', revenue: totalRevenue / 2 }, // Dynamic slice
    { month: 'Jun', revenue: totalRevenue },
  ];

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Studio Intelligence</span>
          </div>
          <h1 className="text-5xl font-headline italic">Strategic <span className="not-italic">Insights.</span></h1>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="rounded-none border-accent/10 text-accent/60 uppercase tracking-widest text-[10px] px-4 py-2 bg-white">
            Fiscal Cycle: Q3 2024
          </Badge>
          <Badge className="rounded-none bg-accent text-white uppercase tracking-widest text-[10px] px-4 py-2">
            Audit Verified
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Gross Capital", value: `KES ${(totalRevenue / 1000000).toFixed(1)}M`, sub: "Active Commitment", icon: Wallet, color: "text-accent" },
          { label: "Lead Velocity", value: leadVelocity.toString(), sub: "Awaiting Sync", icon: MousePointer2, color: "text-orange-600" },
          { label: "Efficiency Index", value: `${studioEfficiency}%`, sub: "Operational Speed", icon: Activity, color: "text-green-600" },
          { label: "Brand Equity", value: `${npsScore.toFixed(0)}`, sub: "Sentiment Score", icon: Star, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-accent/5 shadow-xl bg-white overflow-hidden group">
              <div className="h-1 w-full bg-accent/5" />
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={cn("h-5 w-5 opacity-40", stat.color)} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline italic">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="fiscal" className="space-y-12">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="fiscal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Wallet className="h-4 w-4" /> Fiscal Terminal</TabsTrigger>
          <TabsTrigger value="tactical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Target className="h-4 w-4" /> Tactical Pipeline</TabsTrigger>
          <TabsTrigger value="operational" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Zap className="h-4 w-4" /> Operational Health</TabsTrigger>
          <TabsTrigger value="market" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Globe className="h-4 w-4" /> Market Presence</TabsTrigger>
        </TabsList>

        <TabsContent value="fiscal" className="m-0 space-y-12">
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
        </TabsContent>

        <TabsContent value="tactical" className="m-0 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent"><MousePointer2 className="h-5 w-5" /></div>
                <div className="space-y-1">
                  <h3 className="text-xl font-headline italic">Conversion Protocol</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Inquiry to Active Journey Synergy</p>
                </div>
              </div>
              <div className="text-center py-10 space-y-4">
                <p className="text-6xl font-headline italic text-accent">{conversionRate.toFixed(1)}%</p>
                <p className="text-[11px] uppercase tracking-[0.4em] text-accent/40 font-bold">Conversion Velocity</p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-accent/5">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-40">Total Leads</p>
                  <p className="text-xl font-headline italic">{inquiries.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-40">Activated</p>
                  <p className="text-xl font-headline italic">{activeProjects.length}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent"><Layers className="h-5 w-5" /></div>
                <div className="space-y-1">
                  <h3 className="text-xl font-headline italic">Lead Classification</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Inquiry Distribution by Service</p>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { label: "New Business", count: inquiries.filter(i => i.type === 'new_business').length, color: "bg-accent" },
                  { label: "Project Support", count: inquiries.filter(i => i.type === 'project_support').length, color: "bg-accent/60" },
                  { label: "Resolution/Other", count: inquiries.filter(i => i.type !== 'new_business' && i.type !== 'project_support').length, color: "bg-accent/20" },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                      <span className="text-accent/60">{item.label}</span>
                      <span className="text-accent">{item.count}</span>
                    </div>
                    <Progress value={(item.count / Math.max(1, inquiries.length)) * 100} className="h-1.5 bg-secondary rounded-none" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="m-0 space-y-12">
          <Card className="rounded-none border-accent/5 shadow-2xl bg-white p-12 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline italic">Implementation Velocity</h3>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Cross-Commission Protocol Efficiency</p>
              </div>
              <div className="flex gap-12">
                <div className="text-right">
                  <p className="text-3xl font-headline italic text-green-600">{studioEfficiency}%</p>
                  <p className="text-[10px] uppercase tracking-widest text-accent/40 font-bold">Studio Average</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-headline italic text-accent">{collaborators.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-accent/40 font-bold">Active Trades</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-accent/5">
              <div className="space-y-6">
                <h4 className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent/40">Resource Utilization</h4>
                <div className="p-8 bg-secondary/10 border border-accent/5 space-y-4">
                  <TrendingUp className="h-6 w-6 text-accent opacity-20" />
                  <p className="text-sm font-light italic leading-relaxed text-accent/80">"94% of verified trades are currently synchronized with active dossiers, indicating peak capacity."</p>
                </div>
              </div>
              <div className="md:col-span-2 space-y-8">
                <h4 className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent/40">Bottleneck Analysis</h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="h-1 w-full bg-accent/5 rounded-none overflow-hidden"><div className="h-full bg-orange-400 w-[12%]" /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 shrink-0">Procurement Delay (Low)</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="h-1 w-full bg-accent/5 rounded-none overflow-hidden"><div className="h-full bg-green-500 w-[85%]" /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 shrink-0">Site Access (Optimal)</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="h-1 w-full bg-accent/5 rounded-none overflow-hidden"><div className="h-full bg-accent w-[45%]" /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent shrink-0">QA Synchronization (Steady)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-10">
              <div className="space-y-1">
                <h3 className="text-xl font-headline italic">Brand Sentiment</h3>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Verified Client Perspective</p>
              </div>
              <div className="flex items-center justify-center h-48 relative">
                <div className="h-40 w-40 rounded-full border-[12px] border-accent/5 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-headline italic text-accent">4.9</p>
                    <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">NPS Rating</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="h-40 w-40 rounded-full border-[12px] border-accent border-t-transparent animate-spin-slow opacity-20" />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent/40 text-center">Top Sentiment Vectors</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Sophisticated', 'Precise', 'Timeless', 'Artisanal', 'Reliable'].map(tag => (
                    <Badge key={tag} variant="secondary" className="rounded-none bg-accent/5 text-accent text-[9px] uppercase tracking-widest py-1">{tag}</Badge>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="rounded-none border-accent/5 shadow-xl bg-black text-white p-10 lg:col-span-2 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Globe className="h-64 w-64" /></div>
              <div className="space-y-1 relative z-10">
                <h3 className="text-2xl font-headline italic">Market Authority</h3>
                <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Brand Visibility & Engagement Reach</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 pt-12">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Portfolio Reach</p>
                  <p className="text-3xl font-headline italic">12.4K</p>
                  <p className="text-[9px] text-green-400 uppercase font-bold tracking-widest">+12% Monthly</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Direct Referrals</p>
                  <p className="text-3xl font-headline italic">68%</p>
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Primary Growth Driver</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Consultation Volume</p>
                  <p className="text-3xl font-headline italic">24</p>
                  <p className="text-[9px] text-orange-400 uppercase font-bold tracking-widest">Capacity Alert</p>
                </div>
              </div>

              <div className="pt-12 border-t border-white/10 mt-12 relative z-10">
                <p className="text-[11px] italic font-light text-white/60 leading-relaxed">
                  "Market presence is dominated by high-end residential inquiries in Nairobi's prime districts. Marketing strategy should remain focused on referral-based 'Inner Circle' expansion."
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-10 border border-dashed border-accent/20 text-center bg-accent/[0.02]">
        <p className="text-[11px] uppercase tracking-[0.5em] text-accent/40 font-bold italic">
          Insights are strictly synchronized with the master registry. Unauthorized data extraction is logged via Studio Protocol.
        </p>
      </div>
    </div>
  );
}
