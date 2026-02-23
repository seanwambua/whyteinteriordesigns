
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, StudioAccount, ClientProject, Installment, AuditAllocation } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Landmark, 
  Wallet, 
  TrendingUp, 
  Scale, 
  FileText, 
  Plus, 
  Building2, 
  ShieldCheck, 
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
  ArrowRightLeft,
  Settings2,
  Trash2,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  History,
  TrendingDown,
  LayoutGrid
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
import { Textarea } from "@/components/ui/textarea";

export default function StewardFiscalManagementPage() {
  const { accounts, addAccount, updateAccount, clientProjects, updateClientProject, financialSteward } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("treasury");
  
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [isGeneratingStatement, setIsGeneratingStatement] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<string | null>(null);

  const [searchProject, setSearchProject] = useState("");
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);

  const [accountForm, setAccountForm] = useState<Partial<StudioAccount>>({
    name: "",
    provider: "",
    type: "Bank",
    balance: 0,
    currency: "KES",
    status: "Active"
  });

  const [adjustmentForm, setAdjustmentForm] = useState({
    type: 'Installment' as 'Installment' | 'Expense',
    label: "",
    amount: 0,
    reason: ""
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
    setAccountForm({ name: "", provider: "", type: "Bank", balance: 0, currency: "KES", status: "Active" });
    toast({ title: "Account Synchronized", description: `${newAcc.name} added to Treasury Index.` });
  };

  const handleUpdateBalance = (accId: string, newBalance: number) => {
    updateAccount(accId, { balance: newBalance });
    toast({ title: "Treasury Revalued", description: "Account balance updated in studio registry." });
  };

  const handleApplyAdjustment = () => {
    if (!selectedProject || !adjustmentForm.label || adjustmentForm.amount <= 0 || !adjustmentForm.reason) return;
    
    if (adjustmentForm.type === 'Installment') {
      const newIns: Installment = {
        label: `[Steward ADJ] ${adjustmentForm.label}`,
        amount: adjustmentForm.amount,
        percentage: Math.round((adjustmentForm.amount / selectedProject.totalBudget) * 100),
        status: 'Paid',
        date: new Date().toLocaleDateString(),
        transactionCode: `ADJ-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      };
      updateClientProject(selectedProject.id, {
        installments: [...selectedProject.installments, newIns],
        lastActivity: `Fiscal Adjustment: Installment added by ${financialSteward}`
      });
    } else {
      const newAlloc: AuditAllocation = {
        id: `AL-ADJ-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        category: "Adjustment",
        amount: adjustmentForm.amount,
        description: adjustmentForm.label,
        isVerified: true,
        amendment: adjustmentForm.reason
      };
      const existingAudit = selectedProject.auditDetails || { totalReceived: 0, allocations: [], refundAmount: 0, stewardComments: "", isVerified: false };
      updateClientProject(selectedProject.id, {
        auditDetails: {
          ...existingAudit,
          allocations: [...(existingAudit.allocations || []), newAlloc]
        },
        lastActivity: `Fiscal Adjustment: Allocation added by ${financialSteward}`
      });
    }

    setIsAdjustmentOpen(false);
    setSelectedProject(null);
    setAdjustmentForm({ type: 'Installment', label: "", amount: 0, reason: "" });
    toast({ title: "Adjustment Authorized", description: "Dossier registry updated with forensic adjustment." });
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
            <div className="h-px w-8 bg-slate-900" />
            <span className="text-slate-900 text-[13px] font-bold uppercase tracking-[0.4em]">Audit & Governance</span>
          </div>
          <h1 className="text-5xl font-headline italic">Fiscal <span className="not-italic">Management.</span></h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setIsAdjustmentOpen(true)} className="bg-slate-900 text-white rounded-none h-14 px-10 uppercase tracking-widest text-[11px] font-bold flex gap-3 shadow-xl hover:bg-black transition-all">
            <Settings2 className="h-5 w-5" /> Comprehensive Adjustment
          </Button>
          <Button onClick={() => setIsAddAccountOpen(true)} variant="outline" className="border-slate-200 text-slate-900 rounded-none h-14 px-10 uppercase tracking-widest text-[11px] font-bold flex gap-3 shadow-sm hover:bg-slate-50 transition-all">
            <Plus className="h-5 w-5" /> New Treasury Channel
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Global Liquidity", value: `KES ${(totalLiquidity / 1000000).toFixed(1)}M`, sub: "Consolidated Channels", icon: Wallet },
          { label: "Capital Realized", value: `KES ${(realizedRevenue / 1000000).toFixed(1)}M`, sub: "Registry Paid Total", icon: Banknote },
          { label: "Account Matrix", value: accounts.length.toString(), sub: "Authorized Protocols", icon: Landmark },
          { label: "Audit Accuracy", value: "99.8%", sub: "Forensic Integrity", icon: ShieldCheck },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-slate-200 shadow-xl bg-white overflow-hidden group">
              <div className="bg-slate-100 h-1 w-full" />
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-opacity" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-headline italic text-slate-900">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold opacity-60">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
        <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="treasury" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Wallet className="h-4 w-4" /> Treasury Index</TabsTrigger>
          <TabsTrigger value="manipulation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><RotateCcw className="h-4 w-4" /> Registry Adjustments</TabsTrigger>
          <TabsTrigger value="statements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><FileText className="h-4 w-4" /> Statement Protocol</TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-3"><Activity className="h-4 w-4" /> Global Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="treasury" className="m-0 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {accounts.map((acc, index) => (
              <motion.div key={acc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="rounded-none border-slate-200 shadow-sm hover:shadow-xl transition-all bg-white overflow-hidden group">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className={cn(
                      "w-1.5 shrink-0 self-stretch",
                      acc.status === 'Active' ? 'bg-green-600' : 'bg-orange-400'
                    )} />
                    <div className="flex-1 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                      <div className="flex items-center gap-8">
                        <div className="h-16 w-16 bg-slate-50 rounded-none flex items-center justify-center text-slate-400 border border-slate-100">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-headline italic text-slate-900">{acc.name}</h3>
                            <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-widest font-bold border-slate-100">{acc.type}</Badge>
                          </div>
                          <p className="text-[12px] uppercase tracking-widest font-bold text-slate-400">{acc.provider} — {acc.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-16 justify-between lg:justify-end">
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block mb-1">Steward Verified Balance</span>
                          <div className="flex items-center gap-4 justify-end">
                            <p className="text-3xl font-headline italic text-slate-900">{acc.currency} {acc.balance.toLocaleString()}</p>
                            <Button 
                              onClick={() => {
                                const newBal = prompt("Enter verified revaluation balance:", acc.balance.toString());
                                if (newBal && !isNaN(Number(newBal))) handleUpdateBalance(acc.id, Number(newBal));
                              }}
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 text-slate-300 hover:text-slate-900"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
                          <Badge className={cn(
                            "rounded-none uppercase tracking-widest text-[9px] font-bold px-3 py-1.5",
                            acc.status === 'Active' ? "bg-green-600 text-white" : "bg-orange-500 text-white"
                          )}>
                            {acc.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical className="h-5 w-5" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manipulation" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <Card className="lg:col-span-1 rounded-none border-slate-200 bg-white p-10 space-y-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-slate-400" />
                  <h3 className="text-xl font-headline italic text-slate-900">Search Dossier</h3>
                </div>
                <Input 
                  placeholder="Enter Project ID (e.g., WP-0082)" 
                  value={searchProject} 
                  onChange={(e) => setSearchProject(e.target.value)}
                  className="rounded-none h-14 uppercase tracking-widest font-bold border-slate-200"
                />
                <Button 
                  onClick={() => {
                    const found = clientProjects.find(p => p.id.toUpperCase() === searchProject.toUpperCase());
                    if (found) setSelectedProject(found);
                    else toast({ title: "Dossier Not Found", variant: "destructive" });
                  }}
                  className="w-full bg-slate-900 text-white rounded-none h-14 uppercase tracking-widest text-[10px] font-bold"
                >
                  Locate Dossier
                </Button>
              </div>

              {selectedProject && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Active Focus</p>
                    <p className="text-lg font-headline italic text-slate-900">{selectedProject.project}</p>
                    <p className="text-[11px] text-slate-400 uppercase font-bold">{selectedProject.id} — {selectedProject.name}</p>
                  </div>
                  <div className="p-6 bg-slate-50 border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <span>Total Realized</span>
                      <span className="text-slate-900">KES {selectedProject.installments.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0).toLocaleString()}</span>
                    </div>
                    <Progress value={selectedProject.progress} className="h-1 bg-slate-200" />
                  </div>
                </motion.div>
              )}
            </Card>

            <Card className="lg:col-span-2 rounded-none border-slate-200 bg-white p-10 space-y-10 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <Settings2 className="h-6 w-6 text-slate-400" />
                  <h3 className="text-2xl font-headline italic text-slate-900">Registry Adjustment Protocol</h3>
                </div>
                <Badge className="bg-slate-100 text-slate-600 rounded-none text-[10px] uppercase tracking-widest font-bold px-4 py-1">Steward Authorized</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Adjustment Classification</Label>
                    <Select value={adjustmentForm.type} onValueChange={(v: any) => setAdjustmentForm({...adjustmentForm, type: v})}>
                      <SelectTrigger className="rounded-none h-12 border-slate-200"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="Installment">Installment Re-assignment (Income)</SelectItem>
                        <SelectItem value="Expense">Site Allocation Injection (Expense)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Registry Label</Label>
                    <Input 
                      value={adjustmentForm.label} 
                      onChange={(e) => setAdjustmentForm({...adjustmentForm, label: e.target.value})}
                      placeholder="E.g., Forensic Audit Adjustment" 
                      className="rounded-none h-12 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Capital Value (KES)</Label>
                    <Input 
                      type="number"
                      value={adjustmentForm.amount} 
                      onChange={(e) => setAdjustmentForm({...adjustmentForm, amount: Number(e.target.value)})}
                      className="rounded-none h-12 border-slate-200 text-lg font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Reason for Adjustment (Forensic Log)</Label>
                    <Textarea 
                      value={adjustmentForm.reason} 
                      onChange={(e) => setAdjustmentForm({...adjustmentForm, reason: e.target.value})}
                      placeholder="Detailed justification for manual registry modification..." 
                      className="min-h-[185px] rounded-none border-slate-200 p-6 font-light italic text-sm focus:ring-slate-900 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <Button 
                  onClick={handleApplyAdjustment}
                  disabled={!selectedProject || !adjustmentForm.reason || adjustmentForm.amount <= 0}
                  className="bg-slate-900 text-white rounded-none h-16 px-16 uppercase tracking-widest text-[11px] font-bold shadow-2xl hover:bg-black transition-all flex gap-3"
                >
                  <ShieldCheck className="h-5 w-5" /> Authorize & Apply Adjustment
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statements" className="m-0 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'pnl', title: 'Profit & Loss Statement', description: 'Net capital realization against site distributions.', icon: TrendingUp },
              { id: 'balance', title: 'Studio Balance Sheet', description: 'Consolidated assets vs contractual obligations.', icon: Scale },
              { id: 'cashflow', title: 'Cash Flow Protocol', description: 'Real-time liquidity velocity across fiscal periods.', icon: ArrowRightLeft },
            ].map((type) => (
              <Card key={type.id} className="rounded-none border-slate-200 bg-white p-10 space-y-8 shadow-xl group hover:border-slate-900 transition-all">
                <div className="h-14 w-14 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <type.icon className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-headline italic text-slate-900">{type.title}</h3>
                  <p className="text-[12px] font-light italic text-slate-400 leading-relaxed">"{type.description}"</p>
                </div>
                <Button 
                  onClick={() => handleGenerateStatement(type.title)} 
                  disabled={isGeneratingStatement && selectedStatement === type.title}
                  variant="outline" 
                  className="w-full rounded-none h-12 border-slate-200 text-[10px] font-bold uppercase tracking-widest flex gap-3 hover:bg-slate-900 hover:text-white transition-all"
                >
                  {isGeneratingStatement && selectedStatement === type.title ? <><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...</> : <><Zap className="h-4 w-4" /> Generate Statement</>}
                </Button>
              </Card>
            ))}
          </div>

          <Card className="rounded-none border-slate-200 bg-slate-900 text-white p-12 space-y-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Printer className="h-64 w-64" /></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline italic">Recent Stewardship Reports</h3>
                <p className="text-[11px] uppercase tracking-widest text-slate-400">Verified by {financialSteward}</p>
              </div>
              <Button variant="outline" className="rounded-none border-white/20 text-white hover:bg-white hover:text-black uppercase tracking-widest text-[10px] font-bold h-12 px-8">View Archive</Button>
            </div>
            <div className="divide-y divide-white/5 relative z-10">
              {[
                { date: 'Oct 12, 2024', label: 'Quarterly Audit Sync', type: 'Consolidated', status: 'Verified' },
                { date: 'Sep 30, 2024', label: 'Fiscal Close: Q3', type: 'Treasury Index', status: 'Verified' },
                { date: 'Aug 15, 2024', label: 'Forensic Registry Review', type: 'Adjustments', status: 'Archived' },
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
          <div className="bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Search className="h-4 w-4 text-slate-400" />
                <input placeholder="Filter global transactions..." className="bg-transparent border-none focus:ring-0 text-[12px] uppercase tracking-widest w-64" />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="rounded-none text-[10px] font-bold uppercase tracking-widest border-slate-200 h-10 px-6">Export Ledger</Button>
                <Button variant="outline" size="sm" className="rounded-none text-[10px] font-bold uppercase tracking-widest border-slate-200 h-10 px-6">Print Statements</Button>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Registry Ref</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Dossier Context</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Recognition Date</th>
                  <th className="p-6 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Integrity</th>
                  <th className="p-6 text-right text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Capital Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientProjects.flatMap(p => p.installments.filter(i => i.status === 'Paid')).slice(0, 15).map((ins, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-6">
                      <span className="text-[11px] font-mono text-slate-400">{ins.transactionCode || 'LEGACY-SYNC'}</span>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-900">{ins.label}</p>
                        <p className="text-[10px] font-light italic text-slate-400 uppercase">Forensic Registry Entry</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[12px] font-bold text-slate-600 uppercase tracking-widest">{ins.date || 'Historical'}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Certified
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-base font-headline italic text-slate-900">KES {ins.amount.toLocaleString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="rounded-none border-slate-200 font-body sm:max-w-md p-0 overflow-hidden bg-white shadow-2xl">
          <div className="bg-slate-900 h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Landmark className="h-5 w-5 text-slate-900" /><span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Treasury Protocol</span></div>
              <DialogTitle className="text-3xl font-headline italic">New Treasury Channel</DialogTitle>
              <DialogDescription className="text-[13px] italic font-light">Authorize a new professional payment or reserve channel for studio operations.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Account Designation</Label>
                <Input value={accountForm.name} onChange={(e) => setAccountForm({...accountForm, name: e.target.value})} placeholder="E.g., NCBA Escrow Terminal" className="rounded-none h-12 text-base border-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Financial Provider</Label>
                  <Input value={accountForm.provider} onChange={(e) => setAccountForm({...accountForm, provider: e.target.value})} placeholder="NCBA Bank" className="rounded-none h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Channel Type</Label>
                  <Select value={accountForm.type} onValueChange={(v: any) => setAccountForm({...accountForm, type: v})}>
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
                <Input type="number" value={accountForm.balance} onChange={(e) => setAccountForm({...accountForm, balance: Number(e.target.value)})} className="rounded-none h-12" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAccount} className="w-full bg-slate-900 text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl">Authorize Treasury Entry</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-10 border border-dashed border-slate-200 text-center bg-slate-50/50">
        <div className="flex justify-center mb-4"><ShieldAlert className="h-8 w-8 text-slate-300" /></div>
        <p className="text-[11px] uppercase tracking-[0.5em] text-slate-400 font-bold italic leading-relaxed">
          Comprehensive fiscal data is strictly synchronized with the master registry. Unauthorized modifications are flagged via forensic audit protocol.
        </p>
      </div>
    </div>
  );
}
