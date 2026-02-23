
"use client";

import { use, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, AuditAllocation, AuditIncoming, FinancialAudit, ReorganizationDetails, Installment, StewardLog } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
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
  Signature,
  Calendar as CalendarIcon,
  Activity,
  Layout,
  PencilRuler
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StewardAuditWorkbench({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject, financialSteward, stewards } = useWhyteStore();
  const { toast } = useToast();
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingRegistry, setIsSyncingRegistry] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string | null>(null);

  const [isWitnessingReorg, setIsWitnessingReorg] = useState(false);
  const [isSyncingWitness, setIsSyncingWitness] = useState(false);

  // ACTIVATION VERIFICATION STATE
  const [isVerifyingActivation, setIsVerifyingActivation] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [activationAmount, setActivationAmount] = useState<number>(0);
  const [activationDate, setActivationDate] = useState<Date>(new Date());
  const [isSyncingActivation, setIsSyncingActivation] = useState(false);

  // STEWARD LOG STATE
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLog, setNewLog] = useState<Partial<StewardLog>>({
    type: 'Fiscal Review',
    content: '',
    urgency: 'Routine'
  });

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
      
      if (project.pendingActivationData) {
        setActivationCode(project.pendingActivationData.reference);
        setActivationAmount(project.pendingActivationData.amount);
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
  const isAwaitingActivation = !project.isActivated && project.pendingActivationData;

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

  const handleAddLog = () => {
    if (!newLog.content) return;
    const logEntry: StewardLog = {
      id: `SL-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      date: format(new Date(), "MMM dd, yyyy HH:mm"),
      type: newLog.type as StewardLog['type'],
      content: newLog.content,
      urgency: newLog.urgency as StewardLog['urgency']
    };
    
    updateClientProject(project.id, {
      stewardLogs: [logEntry, ...(project.stewardLogs || [])],
      lastActivity: `Steward Operation Logged: ${logEntry.type}`
    });
    
    setIsAddingLog(false);
    setNewLog({ type: 'Fiscal Review', content: '', urgency: 'Routine' });
    toast({ title: "Steward Operation Synchronized" });
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
        reorganizationCount: (project.reorganizationCount || 0) + 1,
        lastActivity: `Financing Protocol Authorized: Custom Payout Plan Witnessed by ${financialSteward}`
      });
      setIsSyncingWitness(false);
      setIsWitnessingReorg(false);
      toast({ title: "Reorganization Witnessed", description: "The project master ledger has been synchronized with the new terms." });
    }, 2000);
  };

  const handleVerifyActivation = () => {
    if (!activationCode || activationAmount <= 0) return;
    setIsSyncingActivation(true);
    
    setTimeout(() => {
      const updatedInstallments = project.installments.map(ins => 
        ins.label.toLowerCase().includes('deposit') 
          ? { 
              ...ins, 
              status: 'Paid' as const, 
              transactionCode: activationCode, 
              amount: activationAmount,
              date: format(activationDate, "MMM dd, yyyy")
            } 
          : ins
      );

      updateClientProject(project.id, {
        isActivated: true,
        initialDepositPaid: true,
        depositCode: activationCode,
        status: 'Execution',
        lastActivity: `Commission Activated — Initial Deposit of KES ${activationAmount.toLocaleString()} Forensic Verified by ${financialSteward}`,
        installments: updatedInstallments,
        pendingActivationData: undefined
      });

      setIsSyncingActivation(false);
      setIsVerifyingActivation(false);
      toast({ title: "Activation Certified", description: "Dossier authorized for Live Implementation." });
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

        {isAwaitingActivation && (
          <Alert className="rounded-none border-orange-500/20 bg-orange-50 p-8 shadow-xl">
            <ShieldAlert className="h-6 w-6 text-orange-600" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full ml-4">
              <div className="space-y-1">
                <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-orange-600">Forensic Activation Authorization Required</AlertTitle>
                <AlertDescription className="text-[13px] font-light italic text-orange-600/80">
                  Receipt of capital commitment has been logged. Professional certification of the initial deposit is mandatory to unlock the Execution phase.
                </AlertDescription>
              </div>
              <Button onClick={() => setIsVerifyingActivation(true)} className="bg-orange-600 text-white rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-bold shadow-lg hover:bg-orange-700 transition-all flex gap-3">
                <Banknote className="h-4 w-4" /> Certify Activation
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
          <div className="flex gap-4">
            <Badge className={cn("rounded-none uppercase tracking-[0.3em] text-[11px] font-bold py-2 px-6", project.financialReportStatus === 'Verified' ? "bg-green-600 text-white" : project.financialReportStatus === 'Awaiting Admin' ? "bg-accent/60 text-white" : "bg-slate-900 text-white")}>
              {project.financialReportStatus === 'Verified' ? "PROTOCOL VERIFIED" : project.financialReportStatus === 'Awaiting Admin' ? "AWAITING ADMIN" : "PENDING AUTHORIZATION"}
            </Badge>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-12">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Layout className="h-4 w-4" /> Stewardship Identity</TabsTrigger>
          <TabsTrigger value="audit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Scale className="h-4 w-4" /> Reconciliation Index</TabsTrigger>
          <TabsTrigger value="ops" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><ClipboardList className="h-4 w-4" /> Operations Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="rounded-none border-slate-200 bg-white p-8 space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Ledger Velocity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-3xl font-headline italic text-slate-900">KES {totalRegistryPaid.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Liquidated</p>
                </div>
                <Progress value={(totalRegistryPaid / project.totalBudget) * 100} className="h-1 bg-slate-50" />
                <p className="text-[10px] text-slate-400 italic uppercase">of KES {project.totalBudget.toLocaleString()} total commitment</p>
              </div>
            </Card>
            <Card className="rounded-none border-slate-200 bg-white p-8 space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Handover Sync</h3>
              <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 flex items-center justify-center border", project.handoverStatus === 'Passed' ? "bg-green-50 border-green-200 text-green-600" : "bg-slate-50 border-slate-100 text-slate-300")}>
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-headline italic text-slate-900">{project.handoverStatus || "Awaiting Site Finish"}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technical Quality Auth</p>
                </div>
              </div>
            </Card>
            <Card className="rounded-none border-slate-200 bg-white p-8 space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Commission Lead</h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center border bg-slate-50 border-slate-100 text-slate-400">
                  <PencilRuler className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-headline italic text-slate-900">Lead Architect</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Creative Authorization</p>
                </div>
              </div>
            </Card>
          </div>
          <Card className="rounded-none border-slate-200 bg-white p-12 space-y-8">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-slate-400">Commission Narrative</h3>
            <p className="text-3xl font-light italic leading-relaxed text-slate-700 border-l-4 border-slate-100 pl-12">"{project.description || project.workScope || "Dossier synchronized."}"</p>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="m-0 space-y-12">
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
                <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div className="flex items-center gap-4"><TrendingDown className="h-5 w-5 text-slate-400" /><h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">Site Cost Allocations</h2></div>{!isVerified && <Button onClick={handleAddAllocation} variant="ghost" size="sm" className="rounded-none text-slate-400 hover:text-slate-900 uppercase tracking-widest text-[10px] font-bold gap-2"><Plus className="h-3.5 w-3.5" /> Log Allocation</Button>}</div>
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
        </TabsContent>

        <TabsContent value="ops" className="m-0 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"><ClipboardList className="h-5 w-5 text-slate-400" /><h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">Stewardship Operation Registry</h2></div>
            <Button onClick={() => setIsAddingLog(true)} className="rounded-none h-12 px-8 bg-slate-900 text-white uppercase tracking-widest text-[10px] font-bold flex gap-3 shadow-xl"><Plus className="h-4 w-4" /> New Operation Entry</Button>
          </div>
          <div className="space-y-6">
            {(project.stewardLogs || []).map((log, index) => (
              <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="rounded-none border-slate-200 bg-white group shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className={cn("w-1.5 shrink-0", log.urgency === 'Flagged' ? 'bg-red-500' : log.urgency === 'Attention' ? 'bg-orange-400' : 'bg-slate-900')} />
                    <div className="flex-1 p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.id}</span>
                          <Badge variant="outline" className="rounded-none text-[9px] uppercase border-slate-100">{log.type}</Badge>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.date}</span>
                      </div>
                      <p className="text-base font-light italic leading-relaxed text-slate-700">"{log.content}"</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {(!project.stewardLogs || project.stewardLogs.length === 0) && <div className="py-24 text-center border border-dashed border-slate-200 bg-slate-50 italic text-[12px] uppercase tracking-widest text-slate-400 font-light">No stewardship operation logs currently synchronized</div>}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddingLog} onOpenChange={setIsAddingLog}>
        <DialogContent className="rounded-none border-slate-200 font-body sm:max-w-lg p-0 overflow-hidden bg-white">
          <div className="bg-slate-900 h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-slate-900" /><span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Documentation</span></div>
              <DialogTitle className="text-3xl font-headline italic">Log Operation</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-sm">Document professional oversight activities, fiscal reviews, or governance audits.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Activity Classification</Label>
                  <Select value={newLog.type} onValueChange={(v: any) => setNewLog({...newLog, type: v})}>
                    <SelectTrigger className="rounded-none border-slate-200 h-12 uppercase tracking-widest text-[10px] font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Fiscal Review">Fiscal Review</SelectItem>
                      <SelectItem value="Compliance Audit">Compliance Audit</SelectItem>
                      <SelectItem value="Procurement Sync">Procurement Sync</SelectItem>
                      <SelectItem value="Governance Note">Governance Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Urgency Level</Label>
                  <Select value={newLog.urgency} onValueChange={(v: any) => setNewLog({...newLog, urgency: v})}>
                    <SelectTrigger className="rounded-none border-slate-200 h-12 uppercase tracking-widest text-[10px] font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Routine">Routine Monitoring</SelectItem>
                      <SelectItem value="Attention">Requires Partner Attention</SelectItem>
                      <SelectItem value="Flagged" className="text-red-600">Governance Flag / Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Log Content</Label>
                <Textarea value={newLog.content} onChange={(e) => setNewLog({...newLog, content: e.target.value})} placeholder="Stewardship operation details..." className="min-h-[150px] rounded-none border-slate-200 p-6 font-light italic leading-relaxed focus:ring-slate-900 bg-slate-50/30" />
              </div>
            </div>
            <DialogFooter><Button onClick={handleAddLog} disabled={!newLog.content} className="w-full bg-slate-900 text-white h-16 rounded-none uppercase tracking-widest text-[10px] font-bold shadow-2xl transition-all">Transmit to Registry</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isVerifyingActivation} onOpenChange={setIsVerifyingActivation}>
        <DialogContent className="rounded-none border-slate-200 font-body sm:max-w-md p-0 overflow-hidden bg-white">
          <div className="bg-orange-600 h-1.5 w-full" />
          <div className="p-10 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-orange-600" /><span className="text-orange-600 text-[12px] font-bold uppercase tracking-[0.4em]">Forensic Activation Protocol</span></div>
              <DialogTitle className="text-3xl font-headline italic">Verify Activation Deposit</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-sm leading-relaxed">As the Financial Steward, certify that the client's initial deposit reference and amount are valid. Authorized certification will activate the commission journey.</DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="p-6 bg-orange-50/50 border border-orange-100 space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-orange-600/60">Reported Reference</span>
                  <span className="text-lg font-mono font-bold text-slate-900">{project.pendingActivationData?.reference || activationCode}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-orange-600/60">Reported Amount</span>
                  <span className="text-lg font-headline italic text-slate-900">KES {project.pendingActivationData?.amount.toLocaleString() || activationAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Certified Amount (KES)</Label>
                  <Input 
                    type="number" 
                    className="rounded-none border-slate-200 h-14 text-xl font-headline italic focus:ring-orange-600" 
                    value={activationAmount} 
                    onChange={(e) => setActivationAmount(Number(e.target.value))} 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Verified Transaction Reference</Label>
                  <Input 
                    className="rounded-none border-slate-200 h-14 text-lg tracking-widest font-bold focus:ring-orange-600 uppercase" 
                    value={activationCode} 
                    onChange={(e) => setActivationCode(e.target.value)} 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Verification Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-14 rounded-none justify-start text-[13px] border-slate-200 font-bold uppercase tracking-widest">
                        <CalendarIcon className="mr-3 h-5 w-5 opacity-40" />
                        {format(activationDate, "MMM dd, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none">
                      <Calendar mode="single" selected={activationDate} onSelect={(d) => d && setActivationDate(d)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button 
                className="w-full bg-orange-600 text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all" 
                onClick={handleVerifyActivation} 
                disabled={isSyncingActivation || !activationCode || activationAmount <= 0}
              >
                {isSyncingActivation ? <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Certifying...</span> : "Authorize & Activate Commission"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

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
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{ins.percentage}% Allocation Protocol</p>
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
