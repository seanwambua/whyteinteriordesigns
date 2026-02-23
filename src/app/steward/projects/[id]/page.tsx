
"use client";

import { use, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, AuditAllocation, AuditIncoming, FinancialAudit, ReorganizationDetails } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Loader2, 
  Scale, 
  Banknote, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Info,
  ExternalLink,
  Lock,
  Wallet,
  RefreshCcw,
  Zap,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Check,
  ShieldAlert,
  ClipboardList,
  MessageSquare,
  FileCheck,
  ChevronRight,
  Handshake,
  FileSearch,
  Signature
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StewardAuditWorkbench({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject, financialSteward } = useWhyteStore();
  const { toast } = useToast();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingRegistry, setIsSyncingRegistry] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string | null>(null);

  const [isWitnessingReorg, setIsWitnessingReorg] = useState(false);
  const [isSyncingWitness, setIsSyncingWitness] = useState(false);

  const project = clientProjects.find(p => p.id === id);

  const [allocations, setAllocations] = useState<AuditAllocation[]>([]);
  const [incomingFunds, setIncomingFunds] = useState<AuditIncoming[]>([]);
  const [stewardComments, setStewardComments] = useState("");
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    if (project) {
      const existing = project.auditDetails || project.termination?.audit;
      if (existing) {
        setAllocations(existing.allocations || []);
        setIncomingFunds(existing.incomingFunds || []);
        setStewardComments(existing.stewardComments || "");
        setRefundAmount(existing.refundAmount || 0);
        setLastSyncTimestamp(existing.submissionDate || null);
      }
    }
  }, [project]);

  const totalRegistryPaid = useMemo(() => {
    if (!project) return 0;
    return project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  }, [project]);

  const totalIncomingLogged = useMemo(() => {
    return incomingFunds.reduce((sum, f) => sum + f.amount, 0);
  }, [incomingFunds]);

  const totalAllocated = useMemo(() => {
    return allocations.reduce((sum, a) => sum + a.amount, 0);
  }, [allocations]);

  const remainingBalance = totalIncomingLogged - totalAllocated - refundAmount;
  const hasDiscrepancy = remainingBalance < 0;
  
  const allFundsVerified = incomingFunds.length > 0 && incomingFunds.every(f => f.isVerified);
  const allAllocationsVerified = allocations.length > 0 && allocations.every(a => a.isVerified);
  
  const hasSyncDiscrepancy = lastSyncTimestamp && Math.abs(totalIncomingLogged - totalRegistryPaid) > 1;

  if (!isMounted || !project) return null;

  const isVerified = project.financialReportStatus === 'Verified' || project.financialReportStatus === 'Awaiting Admin';

  const handleRunSyncCheck = () => {
    setIsSyncingRegistry(true);
    setTimeout(() => {
      setIsSyncingRegistry(false);
      setLastSyncTimestamp(new Date().toLocaleTimeString());
      const registryTotal = project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
      if (Math.abs(totalIncomingLogged - registryTotal) > 1) {
        toast({ variant: "destructive", title: "Registry Discrepancy Identified" });
      } else {
        toast({ title: "Registry Sync Established" });
      }
    }, 1500);
  };

  const handleWitnessReorg = () => {
    if (!project.reorganization || !project.reorganization.clientAgreed) return;
    setIsSyncingWitness(true);
    setTimeout(() => {
      updateClientProject(project.id, {
        installments: project.reorganization!.proposedInstallments,
        reorganization: {
          ...project.reorganization!,
          status: 'Authorized',
          stewardWitnessed: true,
          finalizedDate: format(new Date(), "MMM dd, yyyy")
        },
        lastActivity: `Financing Protocol Authorized: Custom Payout Plan Witnessed by ${financialSteward}`
      });
      setIsSyncingWitness(false);
      setIsWitnessingReorg(false);
      toast({ title: "Reorganization Witnessed", description: "The project master ledger has been synchronized with the new terms." });
    }, 2000);
  };

  const handleAddIncoming = () => {
    if (isVerified) return;
    setIncomingFunds([...incomingFunds, { id: `INC-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, label: "", amount: 0, reference: "", date: format(new Date(), "MMM dd, yyyy"), isVerified: false }]);
  };

  const updateIncoming = (id: string, field: keyof AuditIncoming, value: any) => {
    if (isVerified) return;
    setIncomingFunds(incomingFunds.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleToggleVerifyIncoming = (id: string) => {
    if (isVerified) return;
    setIncomingFunds(incomingFunds.map(f => f.id === id ? { ...f, isVerified: !f.isVerified } : f));
  };

  const handleAddAllocation = () => {
    if (isVerified) return;
    setAllocations([...allocations, { id: `AL-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, category: "", amount: 0, description: "", isVerified: false }]);
  };

  const updateAllocation = (id: string, field: keyof AuditAllocation, value: any) => {
    if (isVerified) return;
    setAllocations(allocations.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleToggleVerifyAllocation = (id: string) => {
    if (isVerified) return;
    setAllocations(allocations.map(a => a.id === id ? { ...a, isVerified: !a.isVerified } : a));
  };

  const handleAuthorizeAudit = () => {
    if (isVerified || !lastSyncTimestamp || hasSyncDiscrepancy || !allFundsVerified || !allAllocationsVerified) return;
    setIsSubmitting(true);
    const finalAudit: FinancialAudit = { totalReceived: totalIncomingLogged, incomingFunds, allocations, refundAmount, stewardComments, isVerified: true, submissionDate: format(new Date(), "MMM dd, yyyy") };
    setTimeout(() => {
      updateClientProject(project.id, { financialReportStatus: 'Awaiting Admin', auditDetails: finalAudit, lastActivity: `Financial Audit Submitted by ${financialSteward}` });
      setIsSubmitting(false);
      toast({ title: "Audit Transmitted" });
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/steward" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Back to Terminal Registry</span>
        </Link>

        {project.reorganization?.status === 'Pending_Agreement' && (
          <Alert className="rounded-none border-blue-500/20 bg-blue-50 p-8 shadow-xl">
            <Signature className="h-6 w-6 text-blue-600" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full ml-4">
              <div className="space-y-1">
                <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-blue-600">Financing Witness Protocol Required</AlertTitle>
                <AlertDescription className="text-[13px] font-light italic text-blue-600/80">
                  {project.reorganization.clientAgreed 
                    ? "The client has authorized the reorganization. Your professional witness certification is required to synchronize the ledger."
                    : "A reorganization proposal is active. Witnessing is restricted until the Client formally authorizes the terms."}
                </AlertDescription>
              </div>
              <Button 
                onClick={() => setIsWitnessingReorg(true)}
                disabled={!project.reorganization.clientAgreed}
                className={cn(
                  "rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-bold flex gap-3 shadow-lg transition-all",
                  project.reorganization.clientAgreed ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-200 text-blue-800 cursor-default"
                )}
              >
                <FileSearch className="h-4 w-4" /> {project.reorganization.clientAgreed ? "Witness Agreement" : "Awaiting Client Sign-off"}
              </Button>
            </div>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4"><Scale className="h-5 w-5 text-slate-900" /><span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Workbench</span></div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex items-center gap-6 text-[12px] text-slate-400 uppercase tracking-widest font-bold"><span>Ref: {project.id}</span><div className="h-1 w-1 bg-slate-200 rounded-full" /><span>Client: {project.name}</span></div>
          </div>
          <Badge className={cn("rounded-none uppercase tracking-[0.3em] text-[11px] font-bold py-2 px-6", project.financialReportStatus === 'Verified' ? "bg-green-600 text-white" : project.financialReportStatus === 'Awaiting Admin' ? "bg-accent/60 text-white" : "bg-slate-900 text-white")}>
            {project.financialReportStatus === 'Verified' ? "PROTOCOL VERIFIED" : project.financialReportStatus === 'Awaiting Admin' ? "AWAITING ADMIN" : "PENDING AUTHORIZATION"}
          </Badge>
        </div>
      </motion.div>

      {!isVerified && (
        <Alert className={cn("rounded-none p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border-dashed transition-all shadow-sm", hasSyncDiscrepancy ? "bg-red-50 border-red-200" : lastSyncTimestamp ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")}>
          <div className="flex gap-4 items-start">
            {hasSyncDiscrepancy ? <AlertTriangle className="h-6 w-6 text-red-600 mt-1" /> : lastSyncTimestamp ? <ShieldCheck className="h-6 w-6 text-green-600 mt-1" /> : <RefreshCcw className="h-6 w-6 text-slate-400 mt-1" />}
            <div className="space-y-1"><AlertTitle className="text-[12px] font-bold uppercase tracking-widest">Protocol Sync Check</AlertTitle><AlertDescription className="text-[13px] font-light italic text-muted-foreground leading-relaxed">{hasSyncDiscrepancy ? `Critical Discrepancy Identified. Authorization locked.` : lastSyncTimestamp ? `Synchronization established at ${lastSyncTimestamp}.` : "Establishing a sync check is mandatory before authorizing final capital reconciliation."}</AlertDescription></div>
          </div>
          <Button onClick={handleRunSyncCheck} disabled={isSyncingRegistry || isVerified} className="rounded-none h-12 px-8 bg-slate-900 text-white hover:bg-black uppercase tracking-widest text-[10px] font-bold flex gap-3 shadow-lg transition-all">{isSyncingRegistry ? <><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...</> : <><RefreshCcw className="h-4 w-4" /> Run Sync Check</>}</Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div className="flex items-center gap-4"><TrendingUp className="h-5 w-5 text-slate-400" /><h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">Incoming Funds Registry</h2></div>{!isVerified && <Button onClick={handleAddIncoming} variant="ghost" size="sm" className="rounded-none text-slate-400 hover:text-slate-900 uppercase tracking-widest text-[10px] font-bold gap-2"><Plus className="h-3.5 w-3.5" /> Log Payment</Button>}</div>
            <div className="space-y-6">
              {incomingFunds.map((entry) => (
                <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className={cn("rounded-none border transition-all group relative overflow-hidden", entry.isVerified ? "border-green-600/30 bg-green-600/[0.02]" : "border-slate-200 bg-white")}>
                    <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                        <div className="md:col-span-3 space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Payment Label</Label><Input value={entry.label} onChange={(e) => updateIncoming(entry.id, 'label', e.target.value)} readOnly={isVerified || entry.isVerified} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-slate-100 focus:ring-slate-900" /></div>
                        <div className="md:col-span-3 space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Amount (KES)</Label><Input type="number" value={entry.amount} onChange={(e) => updateIncoming(entry.id, 'amount', Number(e.target.value))} readOnly={isVerified || entry.isVerified} className="rounded-none h-12 text-sm font-bold border-slate-100 focus:ring-slate-900" /></div>
                        <div className="md:col-span-3 space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Ref Code</Label><Input value={entry.reference} onChange={(e) => updateIncoming(entry.id, 'reference', e.target.value)} readOnly={isVerified || entry.isVerified} className="rounded-none h-12 text-sm font-mono border-slate-100 focus:ring-slate-900" /></div>
                        <div className="md:col-span-3 space-y-2"><Button variant={entry.isVerified ? "default" : "outline"} disabled={isVerified} onClick={() => handleToggleVerifyIncoming(entry.id)} className={cn("h-12 w-full rounded-none uppercase tracking-widest text-[10px] font-bold flex gap-3", entry.isVerified ? "bg-green-600 text-white" : "border-slate-200 text-slate-400")}>{entry.isVerified ? "Certified" : "Certify"}</Button></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div className="flex items-center gap-4"><TrendingDown className="h-5 w-5 text-slate-400" /><h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">Site Cost Allocations (Expenses)</h2></div>{!isVerified && <Button onClick={handleAddAllocation} variant="ghost" size="sm" className="rounded-none text-slate-400 hover:text-slate-900 uppercase tracking-widest text-[10px] font-bold gap-2"><Plus className="h-3.5 w-3.5" /> Log Allocation</Button>}</div>
            <div className="space-y-6">
              {allocations.map((alloc) => (
                <motion.div key={alloc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className={cn("rounded-none border transition-all group relative overflow-hidden", alloc.isVerified ? "border-green-600/30 bg-green-600/[0.02]" : "border-slate-200 bg-white")}>
                    <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                        <div className="md:col-span-3 space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Classification</Label><Input value={alloc.category} onChange={(e) => updateAllocation(alloc.id, 'category', e.target.value)} readOnly={isVerified || alloc.isVerified} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-slate-100 focus:ring-slate-900" /></div>
                        <div className="md:col-span-3 space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Amount (KES)</Label><Input type="number" value={alloc.amount} onChange={(e) => updateAllocation(alloc.id, 'amount', Number(e.target.value))} readOnly={isVerified || alloc.isVerified} className="rounded-none h-12 text-sm font-bold border-slate-100 focus:ring-slate-900" /></div>
                        <div className="md:col-span-3 space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Breakdown</Label><Input value={alloc.description} onChange={(e) => updateAllocation(alloc.id, 'description', e.target.value)} readOnly={isVerified || alloc.isVerified} className="rounded-none h-12 text-sm italic border-slate-100 focus:ring-slate-900" /></div>
                        <div className="md:col-span-3 space-y-2"><Button variant={alloc.isVerified ? "default" : "outline"} disabled={isVerified} onClick={() => handleToggleVerifyAllocation(alloc.id)} className={cn("h-12 w-full rounded-none uppercase tracking-widest text-[10px] font-bold flex gap-3", alloc.isVerified ? "bg-green-600 text-white" : "border-slate-200 text-slate-400")}>{alloc.isVerified ? "Certified" : "Certify"}</Button></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Stewardship findings & resolution</Label>
            <Textarea value={stewardComments} onChange={(e) => setStewardComments(e.target.value)} readOnly={isVerified} placeholder="Provide professional summary..." className="min-h-[180px] rounded-none border-slate-200 p-8 font-light italic text-lg focus:ring-slate-900 bg-white shadow-sm" />
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-slate-900 bg-slate-900 text-white p-10 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Scale className="h-40 w-40" /></div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 relative z-10">Reconciliation Logic</h3>
            <div className="space-y-10 relative z-10">
              <div className="space-y-1"><p className="text-[10px] uppercase tracking-widest text-slate-400">Verified Incoming Funds</p><p className="text-3xl font-headline italic text-green-400">KES {totalIncomingLogged.toLocaleString()}</p></div>
              <div className="space-y-1"><p className="text-[10px] uppercase tracking-widest text-slate-400">Verified Site Costs</p><p className="text-3xl font-headline italic text-orange-400">KES {totalAllocated.toLocaleString()}</p></div>
              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="space-y-1"><p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Authorized Refund</p><Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value))} readOnly={isVerified} className="bg-white/5 border-white/10 text-2xl font-headline italic text-white rounded-none h-14" /></div>
                <div className="pt-4 flex justify-between items-center border-t border-white/5 mt-4"><span className="text-[10px] uppercase tracking-widest text-slate-400">Escrow Balance</span><span className={cn("text-xl font-headline italic", hasDiscrepancy ? "text-red-400" : "text-white")}>KES {remainingBalance.toLocaleString()}</span></div>
              </div>
            </div>
            {!isVerified && <Button onClick={handleAuthorizeAudit} disabled={isSubmitting || totalIncomingLogged === 0 || !lastSyncTimestamp || hasDiscrepancy || hasSyncDiscrepancy || !allFundsVerified || !allAllocationsVerified} className="w-full h-16 rounded-none bg-white text-slate-900 uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all flex gap-4 items-center justify-center">{isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Transmitting...</> : <><ShieldCheck className="h-6 w-6" /> Transmit to Admin</>}</Button>}
          </Card>
        </div>
      </div>

      <Dialog open={isWitnessingReorg} onOpenChange={setIsWitnessingReorg}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-3xl p-0 overflow-hidden bg-white max-h-[90vh] flex flex-col">
          <div className="bg-blue-600 h-1.5 w-full" />
          <div className="p-12 space-y-10 overflow-y-auto custom-scrollbar flex-1">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Signature className="h-5 w-5 text-blue-600" /><span className="text-blue-600 text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Witness Terminal</span></div>
              <DialogTitle className="text-4xl font-headline italic">Witness Financing Agreement</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">Your professional witnessing certifies that the custom payout plan has been authorized by the Client and Senior Partners. This will programmatically update the master project ledger.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={cn("p-6 border flex items-center justify-between", project.reorganization?.clientAgreed ? "bg-green-50 border-green-200" : "bg-slate-50")}>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Client Authorization</p>
                  <p className="text-sm font-bold text-accent">{project.reorganization?.clientAgreed ? "Authorized & Signed" : "Awaiting Client"}</p>
                </div>
                {project.reorganization?.clientAgreed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </div>
              <div className="p-6 border border-blue-100 bg-blue-50/50 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Steward Witness</p>
                  <p className="text-sm font-bold text-blue-600">Pending Certification</p>
                </div>
                <Signature className="h-5 w-5 text-blue-400" />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Proposed Custom Schedule</h4>
              <div className="divide-y divide-accent/5 border border-accent/5">
                {project.reorganization?.proposedInstallments.map((ins, i) => (
                  <div key={i} className="p-6 flex items-center justify-between bg-white">
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-widest">{ins.label}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{ins.percentage}% Allocation</p>
                    </div>
                    <p className="text-xl font-headline italic text-accent">KES {ins.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="p-12 border-t border-accent/5 bg-secondary/5 flex justify-between gap-6">
            <Button onClick={() => setIsWitnessingReorg(false)} variant="ghost" className="rounded-none h-16 px-8 text-[11px] font-bold uppercase tracking-widest">Abort Witness Sync</Button>
            <Button onClick={handleWitnessReorg} disabled={isSyncingWitness} className="bg-blue-600 text-white rounded-none h-16 px-16 uppercase tracking-widest text-[11px] font-bold shadow-2xl transition-all hover:tracking-[0.2em] flex gap-4">
              {isSyncingWitness ? <><Loader2 className="h-5 w-5 animate-spin" /> Certifying Witness...</> : <><ShieldCheck className="h-5 w-5" /> Witness & Certify Reorganization</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
