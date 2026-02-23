
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, StudioAccount } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Landmark, 
  Wallet, 
  TrendingUp, 
  Scale, 
  FileText, 
  ArrowUpRight, 
  Plus, 
  Building2, 
  ShieldCheck, 
  History, 
  Loader2, 
  ChevronRight, 
  CreditCard,
  Banknote,
  Search,
  MoreVertical,
  Activity,
  Zap,
  Lock,
  Printer,
  FileCheck,
  ArrowRightLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FiscalManagementPage() {
  const { accounts, addAccount, updateAccount, clientProjects, financialSteward } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("treasury");
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isGeneratingStatement, setIsGeneratingStatement] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<string | null>(null);

  const [accountForm, setAccountAccountForm] = useState<Partial<StudioAccount>>({
    name: "",
    provider: "",
    type: "Bank",
    balance: 0,
    currency: "KES",
    status: "Active"
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalLiquidity = useMemo(() => accounts.reduce((sum, acc) => sum + acc.balance, 0), [accounts]);
  const realizedRevenue = useMemo(() => {
    return clientProjects.reduce((sum, p) => {
      const paid = p.installments.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
      return sum + paid;
    }, 0);
  }, [clientProjects]);

  const handleAddAccount = () => {
    if (!accountForm.name || !accountForm.provider) return;
    const newAcc: StudioAccount = {
      id: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
      ...accountForm as StudioAccount
    };
    addAccount(newAcc);
    setIsAddAccountOpen(false);
    setAccountAccountForm({ name: "", provider: "", type: "Bank", balance: 0, currency: "KES", status: "Active" });
    toast({ title: "Account Synchronized", description: `${newAcc.name} added to Treasury Index.` });
  };

  const handleGenerateStatement = (type: string) => {
    setSelectedStatement(type);
    setIsGeneratingStatement(true);
    setTimeout(() => {
      setIsGeneratingStatement(false);
      toast({ title: "Statement Generated", description: `${type} report is ready for professional review.` });
    }, 2000);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Studio Governance</span>
          </div>
          <h1 className="text-5xl font-headline italic">Fiscal <span className="not-italic">Management.</span></h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setIsAddAccountOpen(true)} className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[11px] font-bold flex gap-3 shadow-xl hover:tracking-[0.2em] transition-all">
            <Plus className="h-5 w-5" /> New Treasury Channel
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Global Liquidity", value: `KES ${(totalLiquidity / 1000000).toFixed(1)}M`, sub: "Consolidated Channels", icon: Wallet },
          { label: "Capital Realized", value: `KES ${(realizedRevenue / 1000000).toFixed(1)}M`, sub: "Registry Paid Total", icon: Banknote },
          { label: "Active Channels", value: accounts.length.toString(), sub: "Authorized Protocols", icon: Landmark },
          { label: "Treasury Health", value: "98.2%", sub: "Audit Accuracy", icon: ShieldCheck },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-accent/5 shadow-xl bg-white overflow-hidden group">
              <div className="bg-accent/5 h-1 w-full" />
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-accent opacity-40 group-hover:opacity-100 transition-opacity" />
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="treasury" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Wallet className="h-4 w-4" /> Treasury Index</TabsTrigger>
          <TabsTrigger value="statements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><FileText className="h-4 w-4" /> Statement Protocol</TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Activity className="h-4 w-4" /> Global Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="treasury" className="m-0 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {accounts.map((acc, index) => (
              <motion.div key={acc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="rounded-none border-accent/5 shadow-sm hover:shadow-xl transition-all bg-white overflow-hidden group">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className={cn(
                      "w-1.5 shrink-0 self-stretch",
                      acc.status === 'Active' ? 'bg-green-500' : 'bg-orange-400'
                    )} />
                    <div className="flex-1 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                      <div className="flex items-center gap-8">
                        <div className="h-16 w-16 bg-secondary/30 rounded-none flex items-center justify-center text-accent/40 border border-accent/5">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-headline italic">{acc.name}</h3>
                            <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-widest font-bold border-accent/10">{acc.type}</Badge>
                          </div>
                          <p className="text-[12px] uppercase tracking-widest font-bold text-muted-foreground">{acc.provider} — {acc.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-16 justify-between lg:justify-end">
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/30 block mb-1">Authenticated Balance</span>
                          <p className="text-3xl font-headline italic text-accent">{acc.currency} {acc.balance.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4 pl-8 border-l border-accent/5">
                          <Badge className={cn(
                            "rounded-none uppercase tracking-widest text-[9px] font-bold px-3 py-1.5",
                            acc.status === 'Active' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
                          )}>
                            {acc.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-accent/20 hover:text-accent transition-colors"><MoreVertical className="h-5 w-5" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="statements" className="m-0 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'pnl', title: 'Profit & Loss Statement', description: 'Net capital realization against vendor distributions.', icon: TrendingUp },
              { id: 'balance', title: 'Studio Balance Sheet', description: 'Consolidated treasury assets vs contractual obligations.', icon: Scale },
              { id: 'cashflow', title: 'Cash Flow Protocol', description: 'Real-time liquidity velocity across fiscal periods.', icon: ArrowRightLeft },
            ].map((type) => (
              <Card key={type.id} className="rounded-none border-accent/5 bg-white p-10 space-y-8 shadow-xl group hover:border-accent/20 transition-all">
                <div className="h-14 w-14 bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <type.icon className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-headline italic">{type.title}</h3>
                  <p className="text-[12px] font-light italic text-muted-foreground leading-relaxed">"{type.description}"</p>
                </div>
                <Button 
                  onClick={() => handleGenerateStatement(type.title)} 
                  disabled={isGeneratingStatement && selectedStatement === type.title}
                  variant="outline" 
                  className="w-full rounded-none h-12 border-accent/10 text-[10px] font-bold uppercase tracking-widest flex gap-3 hover:bg-accent hover:text-white transition-all"
                >
                  {isGeneratingStatement && selectedStatement === type.title ? <><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...</> : <><Zap className="h-4 w-4" /> Generate Statement</>}
                </Button>
              </Card>
            ))}
          </div>

          <Card className="rounded-none border-accent/10 bg-black text-white p-12 space-y-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Printer className="h-64 w-64" /></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline italic">Recent Governance Reports</h3>
                <p className="text-[11px] uppercase tracking-widest text-white/40">Verified by {financialSteward}</p>
              </div>
              <Button variant="outline" className="rounded-none border-white/20 text-white hover:bg-white hover:text-black uppercase tracking-widest text-[10px] font-bold h-12 px-8">View Archive</Button>
            </div>
            <div className="divide-y divide-white/5 relative z-10">
              {[
                { date: 'Oct 12, 2024', label: 'Quarterly Audit Sync', type: 'Consolidated', status: 'Verified' },
                { date: 'Sep 30, 2024', label: 'Fiscal Close: Q3', type: 'Treasury Index', status: 'Verified' },
                { date: 'Aug 15, 2024', label: 'Mid-Year Liquidity Review', type: 'Balance Sheet', status: 'Archived' },
              ].map((report, i) => (
                <div key={i} className="py-6 flex items-center justify-between group">
                  <div className="flex items-center gap-8">
                    <span className="text-[11px] font-mono text-white/40">{report.date}</span>
                    <div className="space-y-1">
                      <p className="text-base font-bold uppercase tracking-widest">{report.label}</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">{report.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge variant="outline" className="rounded-none border-white/10 text-white/60 text-[9px] uppercase tracking-widest">{report.status}</Badge>
                    <Button variant="ghost" size="icon" className="text-white/20 hover:text-white transition-all"><FileCheck className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="m-0">
          <div className="bg-white border border-accent/5 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-accent/5 bg-accent/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Search className="h-4 w-4 text-accent/40" />
                <input placeholder="Filter global transactions..." className="bg-transparent border-none focus:ring-0 text-[12px] uppercase tracking-widest w-64" />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="rounded-none text-[10px] font-bold uppercase tracking-widest border-accent/10 h-10 px-6">Export CSV</Button>
                <Button variant="outline" size="sm" className="rounded-none text-[10px] font-bold uppercase tracking-widest border-accent/10 h-10 px-6">Print Ledger</Button>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-accent/10">
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Registry Ref</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Dossier Context</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Transaction Date</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Entity</th>
                  <th className="p-6 text-right text-[11px] font-bold uppercase tracking-[0.3em] text-accent/60">Capital Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/5">
                {clientProjects.flatMap(p => p.installments.filter(i => i.status === 'Paid')).slice(0, 10).map((ins, idx) => (
                  <tr key={idx} className="group hover:bg-accent/[0.01] transition-colors">
                    <td className="p-6">
                      <span className="text-[11px] font-mono text-accent/40">{ins.transactionCode || 'LEGACY-SYNC'}</span>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold uppercase tracking-widest">{ins.label}</p>
                        <p className="text-[10px] font-light italic text-muted-foreground uppercase">Commission Ledger Entry</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[12px] font-bold text-accent/60 uppercase tracking-widest">{ins.date || 'Historical'}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-accent/80">
                        <UserCheck className="h-3.5 w-3.5 opacity-40" /> Verified Registry
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-base font-headline italic text-accent">KES {ins.amount.toLocaleString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ADD ACCOUNT DIALOG */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Landmark className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Treasury Protocol</span></div>
              <DialogTitle className="text-3xl font-headline italic">New Treasury Channel</DialogTitle>
              <DialogDescription className="text-[13px] italic font-light">Authorize a new payment or reserve channel for studio operations.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Account Designation</Label>
                <Input value={accountForm.name} onChange={(e) => setAccountAccountForm({...accountForm, name: e.target.value})} placeholder="E.g., Client Escrow Alpha" className="rounded-none h-12 text-base border-accent/20" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Financial Provider</Label>
                  <Input value={accountForm.provider} onChange={(e) => setAccountAccountForm({...accountForm, provider: e.target.value})} placeholder="NCBA Bank" className="rounded-none h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Channel Type</Label>
                  <Select value={accountForm.type} onValueChange={(v: any) => setAccountAccountForm({...accountForm, type: v})}>
                    <SelectTrigger className="rounded-none h-12"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Bank">Bank Account</SelectItem>
                      <SelectItem value="Escrow">Professional Escrow</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money (Business)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Initial Balance (KES)</Label>
                <Input type="number" value={accountForm.balance} onChange={(e) => setAccountAccountForm({...accountForm, balance: Number(e.target.value)})} className="rounded-none h-12" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAccount} className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl">Authorize Treasury Entry</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-10 border border-dashed border-accent/20 text-center bg-accent/[0.02]">
        <p className="text-[11px] uppercase tracking-[0.5em] text-accent/40 font-bold italic">
          Fiscal data is strictly synchronized with the studio registry. Unauthorized treasury modification is logged.
        </p>
      </div>
    </div>
  );
}

import { UserCheck } from "lucide-react";
