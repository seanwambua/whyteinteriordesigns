
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
  PencilRuler,
  AlertCircle,
  FileClock,
  PenTool
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
    <div className="max-w-7xl mx-auto space-y-16 pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/steward" className="inline-flex items-center gap-2 text-accent/40 hover:text-accent transition-all group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em]">Back to Terminal Registry</span>
        </Link>

        {isAwaitingActivation && (
          <Alert className="rounded-none border-orange-500/20 bg-orange-50 p-10 shadow-2xl">
            <ShieldAlert className="h-8 w-8 text-orange-600" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 w-full ml-6">
              <div className="space-y-2">
                <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-orange-600">Activation Protocol Required</AlertTitle>
                <AlertDescription className="text-[14px] font-light italic text-orange-600/80 max-w-2xl leading-relaxed">
                  Forensic certification of the initial deposit is mandatory to unlock the Execution phase. Capital receipt details have been transmitted by Admin.
                </AlertDescription>
              </div>
              <Button onClick={() => setIsVerifyingActivation(true)} className="bg-orange-600 text-white rounded-none h-16 px-12 uppercase tracking-widest text-[11px] font-bold shadow-xl hover:bg-orange-700 transition-all flex gap-4">
                <Banknote className="h-5 w-5" /> Certify Activation
              </Button>
            </div>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Scale className="h-6 w-6 text-accent" />
              <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Audit Terminal</span>
            </div>
            <h1 className="text-6xl font-headline italic leading-tight">{project.project}</h1>
            <div className="flex items-center gap-8 text-[13px] text-muted-foreground uppercase tracking-widest font-bold">
              <span>Dossier: {project.id}</span>
              <div className="h-1.5 w-1.5 bg-accent/20 rounded-full" />
              <span>Client: {project.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <Badge className={cn(
              "rounded-none uppercase tracking-[0.4em] text-[11px] font-bold py-3 px-8 shadow-xl transition-all",
              project.financialReportStatus === 'Verified' ? "bg-green-600 text-white" : project.financialReportStatus === 'Awaiting Admin' ? "bg-accent/60 text-white" : "bg-accent text-white"
            )}>
              {project.financialReportStatus === 'Verified' ? "PROTOCOL VERIFIED" : project.financialReportStatus === 'Awaiting Admin' ? "AWAITING ADMIN AUTH" : "PENDING RECONCILIATION"}
            </Badge>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-16">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-16 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-6 px-0 flex gap-3"><Layout className="h-4.5 w-4.5" /> Identity Sync</TabsTrigger>
          <TabsTrigger value="audit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-6 px-0 flex gap-3"><Scale className="h-4.5 w-4.5" /> Reconciliation Terminal</TabsTrigger>
          <TabsTrigger value="ops" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-6 px-0 flex gap-3"><ClipboardList className="h-4.5 w-4.5" /> Operations Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="rounded-none border-accent/5 bg-white p-10 space-y-8 shadow-2xl">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Capital Velocity</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-4xl font-headline italic text-accent leading-none">KES {totalRegistryPaid.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">Liquidated</p>
                </div>
                <Progress value={(totalRegistryPaid / project.totalBudget) * 100} className="h-1 bg-accent/5 rounded-none" />
                <p className="text-[11px] text-muted-foreground italic uppercase tracking-widest font-bold">of KES {project.totalBudget.toLocaleString()} commitment</p>
              </div>
            </Card>
            <Card className="rounded-none border-accent/5 bg-white p-10 space-y-8 shadow-2xl">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Technical Sync</h3>
              <div className="flex items-center gap-6">
                <div className={cn(
                  "h-16 w-16 flex items-center justify-center border transition-all",
                  project.handoverStatus === 'Passed' ? "bg-green-50 border-green-200 text-green-600" : "bg-accent/[0.02] border-accent/10 text-accent/20"
                )}>
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-2xl font-headline italic text-accent leading-none">{project.handoverStatus || "Awaiting Final site signs"}</p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">Technical Quality Auth</p>
                </div>
              </div>
            </Card>
            <Card className="rounded-none border-accent/5 bg-white p-10 space-y-8 shadow-2xl">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Creative Lead</h3>
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 flex items-center justify-center border bg-accent/[0.02] border-accent/10 text-accent/40 shadow-inner">
                  <PencilRuler className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-2xl font-headline italic text-accent leading-none">Lead Architect</p>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">Dossier Attribution</p>
                </div>
              </div>
            </Card>
          </div>
          <Card className="rounded-none border-accent/5 bg-white p-16 space-y-10 shadow-2xl">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.5em] text-accent/40">The Briefing Narrative</h3>
            <p className="text-4xl font-light italic leading-relaxed text-accent/80 border-l-4 border-accent/10 pl-16">
              "{project.description || project.workScope || "Architectural narrative established in planning."}"
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="m-0 space-y-16">
          {!isVerified && (
            <Alert className={cn(
              "rounded-none p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 border-dashed transition-all shadow-2xl",
              hasSyncDiscrepancy ? "bg-red-50 border-red-200" : lastSyncTimestamp ? "bg-accent/[0.02] border-accent/20" : "bg-secondary/30 border-accent/10"
            )}>
              <div className="flex gap-6 items-start">
                {hasSyncDiscrepancy ? <AlertTriangle className="h-8 w-8 text-red-600 mt-1" /> : lastSyncTimestamp ? <ShieldCheck className="h-8 w-8 text-green-600 mt-1" /> : <RefreshCcw className="h-8 w-8 text-accent/30 mt-1" />}
                <div className="space-y-2">
                  <AlertTitle className="text-[14px] font-bold uppercase tracking-widest text-accent">Protocol Ledger Synchronization</AlertTitle>
                  <AlertDescription className="text-[15px] font-light italic text-muted-foreground leading-relaxed max-w-3xl">
                    {hasSyncDiscrepancy ? `Critical Discrepancy Identified: Incoming funds do not match registry payments. Authorization protocol locked.` : lastSyncTimestamp ? `Forensic synchronization established at ${lastSyncTimestamp}. Ledger data is consistent.` : "Establishing a forensic sync check is mandatory before authorizing final capital reconciliation."}
                  </AlertDescription>
                </div>
              </div>
              <Button onClick={handleRunSyncCheck} disabled={isSyncingRegistry || isVerified} className="rounded-none h-16 px-12 bg-accent text-white hover:tracking-[0.2em] uppercase tracking-widest text-[11px] font-bold flex gap-4 shadow-2xl transition-all">
                {isSyncingRegistry ? <><Loader2 className="h-5 w-5 animate-spin" /> Synchronizing...</> : <><RefreshCcw className="h-5 w-5" /> Execute Sync Check</>}
              </Button>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-20">
              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-accent/5 pb-6">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-6 w-6 text-accent/40" />
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.4em] text-accent">Verified Incoming Capital</h2>
                  </div>
                  {!isVerified && (
                    <Button onClick={handleAddIncoming} variant="ghost" size="sm" className="rounded-none text-accent/40 hover:text-accent uppercase tracking-widest text-[11px] font-bold gap-3 px-6 h-12 transition-all">
                      <Plus className="h-4 w-4" /> Log Capital Entry
                    </Button>
                  )}
                </div>
                <div className="space-y-6">
                  {incomingFunds.map((entry) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      <Card className={cn(
                        "rounded-none border transition-all group relative overflow-hidden",
                        entry.isVerified ? "border-green-600/30 bg-green-600/[0.02]" : "border-accent/10 bg-white hover:border-accent/30 shadow-sm"
                      )}>
                        <CardContent className="p-10 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
                            <div className="md:col-span-3 space-y-3"><Label className="text-[11px] uppercase font-bold text-accent/40 tracking-widest">Entry Designation</Label><Input value={entry.label} onChange={(e) => updateIncoming(entry.id, 'label', e.target.value)} readOnly={isVerified || entry.isVerified} className="rounded-none h-14 text-sm font-bold uppercase tracking-widest border-accent/10 focus:ring-accent bg-transparent shadow-none" /></div>
                            <div className="md:col-span-3 space-y-3"><Label className="text-[11px] uppercase font-bold text-accent/40 tracking-widest">Capital (KES)</Label><Input type="number" value={entry.amount} onChange={(e) => updateIncoming(entry.id, 'amount', Number(e.target.value))} readOnly={isVerified || entry.isVerified} className="rounded-none h-14 text-lg font-headline italic border-accent/10 focus:ring-accent bg-transparent shadow-none" /></div>
                            <div className="md:col-span-3 space-y-3"><Label className="text-[11px] uppercase font-bold text-accent/40 tracking-widest">Sync Code</Label><Input value={entry.reference} onChange={(e) => updateIncoming(entry.id, 'reference', e.target.value)} readOnly={isVerified || entry.isVerified} className="rounded-none h-14 text-sm font-mono border-accent/10 focus:ring-accent bg-transparent shadow-none" /></div>
                            <div className="md:col-span-3 space-y-3">
                              <Button 
                                variant={entry.isVerified ? "default" : "outline"} 
                                disabled={isVerified} 
                                onClick={() => handleToggleVerifyIncoming(entry.id)} 
                                className={cn(
                                  "h-14 w-full rounded-none uppercase tracking-widest text-[10px] font-bold flex gap-3 transition-all",
                                  entry.isVerified ? "bg-green-600 text-white border-green-600" : "border-accent/10 text-accent/40 hover:bg-accent hover:text-white"
                                )}
                              >
                                {entry.isVerified ? <><ShieldCheck className="h-4 w-4" /> Certified</> : "Certify Entry"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-accent/5 pb-6">
                  <div className="flex items-center gap-4">
                    <TrendingDown className="h-6 w-6 text-accent/40" />
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.4em] text-accent">Capital Allocations Index</h2>
                  </div>
                  {!isVerified && (
                    <Button onClick={handleAddAllocation} variant="ghost" size="sm" className="rounded-none text-accent/40 hover:text-accent uppercase tracking-widest text-[11px] font-bold gap-3 px-6 h-12 transition-all">
                      <Plus className="h-4 w-4" /> Log Allocation
                    </Button>
                  )}
                </div>
                <div className="space-y-6">
                  {allocations.map((alloc) => (
                    <motion.div key={alloc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      <Card className={cn(
                        "rounded-none border transition-all group relative overflow-hidden",
                        alloc.isVerified ? "border-green-600/30 bg-green-600/[0.02]" : "border-accent/10 bg-white hover:border-accent/30 shadow-sm"
                      )}>
                        <CardContent className="p-10 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
                            <div className="md:col-span-3 space-y-3"><Label className="text-[11px] uppercase font-bold text-accent/40 tracking-widest">Classification</Label><Input value={alloc.category} onChange={(e) => updateAllocation(alloc.id, 'category', e.target.value)} readOnly={isVerified || alloc.isVerified} className="rounded-none h-14 text-sm font-bold uppercase tracking-widest border-accent/10 focus:ring-accent bg-transparent" /></div>
                            <div className="md:col-span-3 space-y-3"><Label className="text-[11px] uppercase font-bold text-accent/40 tracking-widest">Capital (KES)</Label><Input type="number" value={alloc.amount} onChange={(e) => updateAllocation(alloc.id, 'amount', Number(e.target.value))} readOnly={isVerified || alloc.isVerified} className="rounded-none h-14 text-lg font-headline italic border-accent/10 focus:ring-accent bg-transparent" /></div>
                            <div className="md:col-span-3 space-y-3"><Label className="text-[11px] uppercase font-bold text-accent/40 tracking-widest">Description</Label><Input value={alloc.description} onChange={(e) => updateAllocation(alloc.id, 'description', e.target.value)} readOnly={isVerified || alloc.isVerified} className="rounded-none h-14 text-sm font-light italic border-accent/10 focus:ring-accent bg-transparent" /></div>
                            <div className="md:col-span-3 space-y-3">
                              <Button 
                                variant={alloc.isVerified ? "default" : "outline"} 
                                disabled={isVerified} 
                                onClick={() => handleToggleVerifyAllocation(alloc.id)} 
                                className={cn(
                                  "h-14 w-full rounded-none uppercase tracking-widest text-[10px] font-bold flex gap-3 transition-all",
                                  alloc.isVerified ? "bg-green-600 text-white border-green-600" : "border-accent/10 text-accent/40 hover:bg-accent hover:text-white"
                                )}
                              >
                                {alloc.isVerified ? <><ShieldCheck className="h-4 w-4" /> Certified</> : "Certify Allocation"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-accent/5">
                <Label className="text-[13px] font-bold uppercase tracking-[0.4em] text-accent">Stewardship findings & resolution</Label>
                <Textarea value={stewardComments} onChange={(e) => setStewardComments(e.target.value)} readOnly={isVerified} placeholder="Provide professional forensic summary of capital lifecycle..." className="min-h-[220px] rounded-none border-accent/10 p-10 font-light italic text-xl focus:ring-accent bg-white shadow-2xl leading-relaxed" />
              </div>
            </div>

            <div className="space-y-10">
              <Card className="rounded-none border-accent/20 bg-accent p-12 text-white space-y-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Scale className="h-48 w-48" /></div>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-white/40 relative z-10">Forensic Index</h3>
                <div className="space-y-12 relative z-10">
                  <div className="space-y-2"><p className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Verified Incoming Capital</p><p className="text-4xl font-headline italic text-green-400">KES {totalIncomingLogged.toLocaleString()}</p></div>
                  <div className="space-y-2"><p className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Verified Project Allocations</p><p className="text-4xl font-headline italic text-orange-400">KES {totalAllocated.toLocaleString()}</p></div>
                  <div className="pt-12 border-t border-white/10 space-y-6">
                    <div className="space-y-3"><p className="text-[11px] uppercase tracking-widest font-bold text-white/40">Authorized Client Refund</p><Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value))} readOnly={isVerified} className="bg-white/5 border-white/20 text-3xl font-headline italic text-white rounded-none h-16 shadow-inner focus-visible:ring-white/20" /></div>
                    <div className="pt-6 flex justify-between items-center border-t border-white/5 mt-6"><span className="text-[11px] uppercase tracking-widest font-bold text-white/40">Net Escrow Balance</span><span className={cn("text-2xl font-headline italic", hasDiscrepancy ? "text-red-400" : "text-white")}>KES {remainingBalance.toLocaleString()}</span></div>
                  </div>
                </div>
                {!isVerified && (
                  <Button 
                    onClick={handleAuthorizeAudit} 
                    disabled={isSubmitting || totalIncomingLogged === 0 || !lastSyncTimestamp || hasDiscrepancy || hasSyncDiscrepancy || !allFundsVerified || !allAllocationsVerified} 
                    className="w-full h-20 rounded-none bg-white text-accent hover:bg-white/90 uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all flex gap-4 items-center justify-center hover:tracking-[0.2em]"
                  >
                    {isSubmitting ? <><Loader2 className="h-6 w-6 animate-spin" /> Transmitting...</> : <><ShieldCheck className="h-6 w-6" /> Authorize & Transmit</>}
                  </Button>
                )}
              </Card>
              <div className="p-10 border border-dashed border-accent/20 text-center bg-secondary/10">
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-accent/40 italic leading-relaxed">
                  Dossiers transmitted to Admin are digitally locked for forensic verification.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ops" className="m-0 space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ClipboardList className="h-6 w-6 text-accent/40" />
              <h2 className="text-[13px] font-bold uppercase tracking-[0.4em] text-accent">Stewardship Operation Registry</h2>
            </div>
            <Button onClick={() => setIsAddingLog(true)} className="rounded-none h-14 px-10 bg-accent text-white uppercase tracking-widest text-[11px] font-bold flex gap-4 shadow-2xl transition-all hover:tracking-[0.2em]">
              <Plus className="h-5 w-5" /> New Operation Entry
            </Button>
          </div>
          <div className="space-y-8">
            {(project.stewardLogs || []).map((log, index) => (
              <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="rounded-none border-accent/5 bg-white group shadow-xl hover:shadow-2xl transition-all overflow-hidden">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className={cn("w-2 shrink-0", log.urgency === 'Flagged' ? 'bg-red-600' : log.urgency === 'Attention' ? 'bg-orange-500' : 'bg-accent')} />
                    <div className="flex-1 p-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <span className="text-[11px] font-bold text-accent/40 uppercase tracking-[0.4em]">{log.id}</span>
                          <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest border-accent/10 px-4 py-1 font-bold text-accent/60">{log.type}</Badge>
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{log.date}</span>
                      </div>
                      <p className="text-xl font-light italic leading-relaxed text-accent/80 border-l-2 border-accent/5 pl-8">"{log.content}"</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {(!project.stewardLogs || project.stewardLogs.length === 0) && (
              <div className="py-40 text-center border border-dashed border-accent/10 bg-secondary/5 italic text-[13px] uppercase tracking-[0.4em] text-accent/30 font-light">
                No stewardship operation logs currently synchronized for this dossier.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOGS CALIBRATION */}
      <Dialog open={isAddingLog} onOpenChange={setIsAddingLog}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden bg-white shadow-2xl">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-12 space-y-10">
            <DialogHeader className="space-y-6">
              <div className="flex items-center gap-4"><ClipboardList className="h-6 w-6 text-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.5em]">Stewardship Documentation</span></div>
              <DialogTitle className="text-4xl font-headline italic">Log Operation</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">Document professional oversight activities, forensic fiscal reviews, or legal governance audits for this dossier.</DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Classification</Label>
                  <Select value={newLog.type} onValueChange={(v: any) => setNewLog({...newLog, type: v})}>
                    <SelectTrigger className="rounded-none border-accent/10 h-14 uppercase tracking-widest text-[11px] font-bold focus:ring-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Fiscal Review" className="text-[11px] font-bold uppercase py-3 tracking-widest">Fiscal Review</SelectItem>
                      <SelectItem value="Compliance Audit" className="text-[11px] font-bold uppercase py-3 tracking-widest">Compliance Audit</SelectItem>
                      <SelectItem value="Procurement Sync" className="text-[11px] font-bold uppercase py-3 tracking-widest">Procurement Sync</SelectItem>
                      <SelectItem value="Governance Note" className="text-[11px] font-bold uppercase py-3 tracking-widest">Governance Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Urgency Protocol</Label>
                  <Select value={newLog.urgency} onValueChange={(v: any) => setNewLog({...newLog, urgency: v})}>
                    <SelectTrigger className="rounded-none border-accent/10 h-14 uppercase tracking-widest text-[11px] font-bold focus:ring-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Routine" className="text-[11px] font-bold uppercase py-3 tracking-widest">Routine Monitoring</SelectItem>
                      <SelectItem value="Attention" className="text-[11px] font-bold uppercase py-3 tracking-widest">Requires Partner Attention</SelectItem>
                      <SelectItem value="Flagged" className="text-[11px] font-bold uppercase py-3 tracking-widest text-red-600">Governance Flag / Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Professional Findings</Label>
                <Textarea value={newLog.content} onChange={(e) => setNewLog({...newLog, content: e.target.value})} placeholder="Professional forensic details..." className="min-h-[180px] rounded-none border-accent/10 p-8 font-light italic text-lg focus:ring-accent bg-secondary/5 leading-relaxed shadow-inner" />
              </div>
            </div>
            <DialogFooter><Button onClick={handleAddLog} disabled={!newLog.content} className="w-full bg-accent text-white h-20 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em]">Transmit to Master Registry</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isVerifyingActivation} onOpenChange={setIsVerifyingActivation}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden bg-white shadow-2xl">
          <div className="bg-orange-600 h-1.5 w-full" />
          <div className="p-12 space-y-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="space-y-6">
              <div className="flex items-center gap-4"><ShieldCheck className="h-6 w-6 text-orange-600" /><span className="text-orange-600 text-[13px] font-bold uppercase tracking-[0.5em]">Forensic Activation Protocol</span></div>
              <DialogTitle className="text-4xl font-headline italic">Verify Activation Deposit</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">As the Financial Steward, certify that the client's initial deposit reference and capital amount are valid. Authorized certification will programmatically activate the commission journey.</DialogDescription>
            </DialogHeader>
            <div className="space-y-10">
              <div className="p-10 bg-orange-50/50 border border-orange-100 space-y-6 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Banknote className="h-32 w-32" /></div>
                <div className="flex flex-col gap-2 relative z-10">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-orange-600/60">Reported Reference Context</span>
                  <span className="text-xl font-mono font-bold text-accent tracking-widest">{project.pendingActivationData?.reference || activationCode}</span>
                </div>
                <div className="flex flex-col gap-2 relative z-10">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-orange-600/60">Reported Capital Value</span>
                  <span className="text-3xl font-headline italic text-accent leading-none">KES {project.pendingActivationData?.amount.toLocaleString() || activationAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Certified Capital (KES)</Label>
                  <Input type="number" className="rounded-none border-accent/10 h-16 text-3xl font-headline italic focus:ring-orange-600 bg-white" value={activationAmount} onChange={(e) => setActivationAmount(Number(e.target.value))} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Verified Transaction Code</Label>
                  <Input className="rounded-none border-accent/10 h-16 text-xl tracking-[0.2em] font-bold focus:ring-orange-600 uppercase bg-white" value={activationCode} onChange={(e) => setActivationCode(e.target.value)} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Certification Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-16 rounded-none justify-start text-[14px] border-accent/10 font-bold uppercase tracking-widest focus:ring-orange-600 bg-white shadow-none">
                        <CalendarIcon className="mr-4 h-5 w-5 text-accent/40" />
                        {format(activationDate, "MMM dd, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={activationDate} onSelect={(d) => d && setActivationDate(d)} initialFocus /></PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-6">
              <Button className="w-full bg-orange-600 text-white h-20 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em]" onClick={handleVerifyActivation} disabled={isSyncingActivation || !activationCode || activationAmount <= 0}>
                {isSyncingActivation ? <span className="flex items-center gap-4 font-bold"><Loader2 className="h-6 w-6 animate-spin" /> Certifying...</span> : "Authorize & Activate Commission"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
