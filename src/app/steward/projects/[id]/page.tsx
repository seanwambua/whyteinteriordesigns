"use client";

import { use, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, AuditAllocation, AuditIncoming, FinancialAudit } from "@/store/use-whyte-store";
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
  CreditCard
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
  
  // Sync Discrepancy: Steward log doesn't match Studio Registry
  const hasSyncDiscrepancy = lastSyncTimestamp && totalIncomingLogged !== totalRegistryPaid;

  if (!isMounted || !project) return null;

  const isVerified = project.financialReportStatus === 'Verified';

  const handleRunSyncCheck = () => {
    setIsSyncingRegistry(true);
    setTimeout(() => {
      setIsSyncingRegistry(false);
      setLastSyncTimestamp(new Date().toLocaleTimeString());
      
      const registryTotal = project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
      
      if (totalIncomingLogged !== registryTotal) {
        toast({ 
          variant: "destructive",
          title: "Registry Discrepancy Identified", 
          description: `Logged funds (KES ${totalIncomingLogged.toLocaleString()}) do not match studio registry (KES ${registryTotal.toLocaleString()}).`
        });
      } else {
        toast({ 
          title: "Registry Sync Established", 
          description: "All logged incoming funds match the studio's verified transactions."
        });
      }
    }, 1500);
  };

  const handleAddIncoming = () => {
    if (isVerified) return;
    const newEntry: AuditIncoming = {
      id: `INC-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      label: "",
      amount: 0,
      reference: "",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      isVerified: false
    };
    setIncomingFunds([...incomingFunds, newEntry]);
  };

  const updateIncoming = (id: string, field: keyof AuditIncoming, value: any) => {
    if (isVerified) return;
    setIncomingFunds(incomingFunds.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleToggleVerifyIncoming = (id: string) => {
    if (isVerified) return;
    setIncomingFunds(incomingFunds.map(f => f.id === id ? { ...f, isVerified: !f.isVerified } : f));
    toast({ title: "Entry Protocol Synchronized" });
  };

  const removeIncoming = (id: string) => {
    if (isVerified) return;
    setIncomingFunds(incomingFunds.filter(f => f.id !== id));
  };

  const handleAddAllocation = () => {
    if (isVerified) return;
    const newAlloc: AuditAllocation = {
      id: `AL-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      category: "",
      amount: 0,
      description: ""
    };
    setAllocations([...allocations, newAlloc]);
  };

  const updateAllocation = (id: string, field: keyof AuditAllocation, value: any) => {
    if (isVerified) return;
    setAllocations(allocations.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAllocation = (id: string) => {
    if (isVerified) return;
    setAllocations(allocations.filter(a => a.id !== id));
  };

  const handleAuthorizeAudit = () => {
    if (isVerified || !lastSyncTimestamp || hasSyncDiscrepancy || !allFundsVerified) return;
    setIsSubmitting(true);
    
    const finalAudit: FinancialAudit = {
      totalReceived: totalIncomingLogged,
      incomingFunds,
      allocations,
      refundAmount,
      stewardComments,
      isVerified: true,
      submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setTimeout(() => {
      updateClientProject(project.id, {
        financialReportStatus: 'Pending',
        auditDetails: finalAudit,
        lastActivity: `Financial Audit Transmitted by ${financialSteward}`
      });
      setIsSubmitting(false);
      toast({ title: "Audit Synchronized", description: "Dossier has been locked and authorized in the master registry." });
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/steward" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Back to Terminal Registry</span>
        </Link>

        {isVerified && (
          <div className="p-6 bg-green-50 border border-green-200 flex items-center gap-4 shadow-sm">
            <Lock className="h-5 w-5 text-green-600" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-green-600">Audit Verified — Read-Only Mode</p>
              <p className="text-[12px] text-green-600/70 italic font-light">This dossier has been Reconciliation-Locked by Stewardship Protocol.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Scale className="h-5 w-5 text-slate-900" />
              <span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Workbench</span>
            </div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex items-center gap-6 text-[12px] text-slate-400 uppercase tracking-widest font-bold">
              <span>Ref: {project.id}</span>
              <div className="h-1 w-1 bg-slate-200 rounded-full" />
              <span>Client: {project.name}</span>
            </div>
          </div>
          <Badge className={cn(
            "rounded-none uppercase tracking-[0.3em] text-[11px] font-bold py-2 px-6",
            isVerified ? "bg-green-600 text-white" : "bg-slate-900 text-white"
          )}>
            {isVerified ? "PROTOCOL VERIFIED" : "PENDING AUTHORIZATION"}
          </Badge>
        </div>
      </motion.div>

      {!isVerified && (
        <Alert className={cn(
          "rounded-none p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border-dashed transition-all",
          hasSyncDiscrepancy ? "bg-red-50 border-red-200" : lastSyncTimestamp ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200 shadow-sm"
        )}>
          <div className="flex gap-4 items-start">
            {hasSyncDiscrepancy ? <AlertTriangle className="h-6 w-6 text-red-600 mt-1" /> : lastSyncTimestamp ? <ShieldCheck className="h-6 w-6 text-green-600 mt-1" /> : <RefreshCcw className="h-6 w-6 text-slate-400 mt-1" />}
            <div className="space-y-1">
              <AlertTitle className="text-[12px] font-bold uppercase tracking-widest">Protocol Sync Check</AlertTitle>
              <AlertDescription className="text-[13px] font-light italic text-muted-foreground leading-relaxed">
                {hasSyncDiscrepancy 
                  ? `Critical Discrepancy: Verified log (KES ${totalIncomingLogged.toLocaleString()}) does not match Studio Registry (KES ${totalRegistryPaid.toLocaleString()}). authorization locked.`
                  : lastSyncTimestamp 
                  ? `Synchronization established at ${lastSyncTimestamp}. All project installments verified against registry.` 
                  : "Establishing a sync check is mandatory before authorizing final capital reconciliation."}
              </AlertDescription>
            </div>
          </div>
          <Button 
            onClick={handleRunSyncCheck}
            disabled={isSyncingRegistry || isVerified}
            className={cn(
              "rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-bold flex gap-3 shadow-lg transition-all",
              hasSyncDiscrepancy ? "bg-red-600 text-white hover:bg-red-700" : lastSyncTimestamp ? "bg-green-600 text-white hover:bg-green-700" : "bg-slate-900 text-white hover:bg-black"
            )}
          >
            {isSyncingRegistry ? <><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...</> : <><RefreshCcw className="h-4 w-4" /> Run Sync Check</>}
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {/* INCOMING FUNDS REGISTRY */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-5 w-5 text-slate-400" />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">Incoming Funds Registry</h2>
              </div>
              {!isVerified && (
                <Button onClick={handleAddIncoming} variant="outline" size="sm" className="rounded-none border-slate-200 uppercase tracking-widest text-[10px] font-bold gap-2">
                  <Plus className="h-3.5 w-3.5" /> Log Payment
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {incomingFunds.map((entry) => (
                <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className={cn(
                    "rounded-none border transition-all group relative overflow-hidden",
                    entry.isVerified ? "border-green-600/20 bg-green-600/[0.01]" : "border-slate-200 bg-white"
                  )}>
                    {!isVerified && (
                      <Button 
                        onClick={() => removeIncoming(entry.id)}
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 h-8 w-8 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-3 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Payment Label</Label>
                          <Input 
                            value={entry.label} 
                            onChange={(e) => updateIncoming(entry.id, 'label', e.target.value)}
                            readOnly={isVerified}
                            placeholder="E.g., Initial Deposit" 
                            className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-slate-100 focus:ring-slate-900"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Amount (KES)</Label>
                          <Input 
                            type="number"
                            value={entry.amount} 
                            onChange={(e) => updateIncoming(entry.id, 'amount', Number(e.target.value))}
                            readOnly={isVerified}
                            className="rounded-none h-12 text-sm font-bold border-slate-100 focus:ring-slate-900"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Ref Code</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-200" />
                            <Input 
                              value={entry.reference} 
                              onChange={(e) => updateIncoming(entry.id, 'reference', e.target.value)}
                              readOnly={isVerified}
                              placeholder="TRX-XXXX" 
                              className="pl-10 rounded-none h-12 text-sm font-mono border-slate-100 focus:ring-slate-900"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Date</Label>
                          <Input 
                            value={entry.date} 
                            onChange={(e) => updateIncoming(entry.id, 'date', e.target.value)}
                            readOnly={isVerified}
                            placeholder="MMM DD, YYYY" 
                            className="rounded-none h-12 text-[11px] font-bold border-slate-100 focus:ring-slate-900"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                          <Button
                            variant={entry.isVerified ? "default" : "outline"}
                            size="icon"
                            disabled={isVerified}
                            onClick={() => handleToggleVerifyIncoming(entry.id)}
                            className={cn(
                              "h-12 w-full rounded-none transition-all",
                              entry.isVerified ? "bg-green-600 hover:bg-green-700 text-white" : "border-slate-200 text-slate-400 hover:text-slate-900"
                            )}
                            title={entry.isVerified ? "Protocol Verified" : "Awaiting Verification"}
                          >
                            {entry.isVerified ? <CheckCircle2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {incomingFunds.length === 0 && (
                <div className="py-20 text-center border border-dashed border-slate-200 bg-slate-50">
                  <p className="text-[11px] uppercase tracking-widest text-slate-400 italic">No incoming payments currently logged for verification</p>
                </div>
              )}
            </div>
          </div>

          {/* SITE COST ALLOCATIONS */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingDown className="h-5 w-5 text-slate-400" />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">Site Cost Allocations (Outgoing)</h2>
              </div>
              {!isVerified && (
                <Button onClick={handleAddAllocation} variant="outline" size="sm" className="rounded-none border-slate-200 uppercase tracking-widest text-[10px] font-bold gap-2">
                  <Plus className="h-3.5 w-3.5" /> Log Allocation
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {allocations.map((alloc) => (
                <motion.div key={alloc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="rounded-none border-slate-200 bg-white group relative overflow-hidden">
                    {!isVerified && (
                      <Button 
                        onClick={() => removeAllocation(alloc.id)}
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 h-8 w-8 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Classification</Label>
                          <Input 
                            value={alloc.category} 
                            onChange={(e) => updateAllocation(alloc.id, 'category', e.target.value)}
                            readOnly={isVerified}
                            placeholder="E.g., Structural Materials" 
                            className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-slate-100 focus:ring-slate-900"
                          />
                        </div>
                        <div className="md:col-span-5 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Professional Breakdown</Label>
                          <Input 
                            value={alloc.description} 
                            onChange={(e) => updateAllocation(alloc.id, 'description', e.target.value)}
                            readOnly={isVerified}
                            placeholder="Specific site protocol description" 
                            className="rounded-none h-12 text-sm italic border-slate-100 focus:ring-slate-900"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Verified Amount (KES)</Label>
                          <Input 
                            type="number"
                            value={alloc.amount} 
                            onChange={(e) => updateAllocation(alloc.id, 'amount', Number(e.target.value))}
                            readOnly={isVerified}
                            className="rounded-none h-12 text-sm font-bold border-slate-100 focus:ring-slate-900"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {allocations.length === 0 && (
                <div className="py-20 text-center border border-dashed border-slate-200 bg-slate-50">
                  <p className="text-[11px] uppercase tracking-widest text-slate-400 italic">No site cost allocations currently synchronized</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Stewardship findings & resolution</Label>
            <Textarea 
              value={stewardComments} 
              onChange={(e) => setStewardComments(e.target.value)}
              readOnly={isVerified}
              placeholder="Provide a professional summary of the financial audit and any capital reconciliation findings..." 
              className="min-h-[180px] rounded-none border-slate-200 p-8 font-light italic text-lg leading-relaxed focus:ring-slate-900 bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-slate-900 bg-slate-900 text-white p-10 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Scale className="h-40 w-40" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 relative z-10">Reconciliation Logic</h3>
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Verified Incoming Funds</p>
                <p className="text-3xl font-headline italic text-green-400">KES {totalIncomingLogged.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Verified Site Costs</p>
                <p className="text-3xl font-headline italic text-orange-400">KES {totalAllocated.toLocaleString()}</p>
              </div>
              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Authorized Refund</p>
                  <Input 
                    type="number" 
                    value={refundAmount} 
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    readOnly={isVerified}
                    className="bg-white/5 border-white/10 text-2xl font-headline italic text-white rounded-none h-14 focus:ring-slate-400"
                  />
                </div>
                <div className="pt-4 flex justify-between items-center border-t border-white/5 mt-4">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">Escrow Balance</span>
                  <span className={cn(
                    "text-xl font-headline italic",
                    hasDiscrepancy ? "text-red-400" : "text-white"
                  )}>KES {remainingBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {!isVerified && (
              <div className="space-y-4 relative z-10 pt-4">
                {hasDiscrepancy && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 flex gap-3 items-center">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-[10px] text-red-200 italic leading-relaxed">Capital Deficit identified. Check allocations against synchronized funds.</p>
                  </div>
                )}
                {hasSyncDiscrepancy && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 flex gap-3 items-center">
                    <Zap className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-[10px] text-red-200 italic leading-relaxed">Registry Sync Failed. Logged funds do not match studio records.</p>
                  </div>
                )}
                {!allFundsVerified && incomingFunds.length > 0 && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 flex gap-3 items-center">
                    <ShieldCheck className="h-4 w-4 text-orange-400 shrink-0" />
                    <p className="text-[10px] text-orange-200 italic leading-relaxed">Mandatory Verification Required. Certify all incoming entries to unlock authorization.</p>
                  </div>
                )}
                <Button 
                  onClick={handleAuthorizeAudit}
                  disabled={isSubmitting || totalIncomingLogged === 0 || !lastSyncTimestamp || hasDiscrepancy || hasSyncDiscrepancy || !allFundsVerified}
                  className={cn(
                    "w-full h-16 rounded-none uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all flex gap-4",
                    (!lastSyncTimestamp || hasSyncDiscrepancy || !allFundsVerified) ? "bg-white/5 text-white/40 cursor-not-allowed border-white/10" : "bg-white text-slate-900 hover:bg-slate-100"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" /> Synchronizing...</span>
                  ) : (
                    <><ShieldCheck className="h-6 w-6" /> Authorize Final Audit</>
                  )}
                </Button>
                {!lastSyncTimestamp && (
                  <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold">Registry Sync required to unlock</p>
                )}
              </div>
            )}
          </Card>

          <div className="p-8 border border-dashed border-slate-200 bg-slate-50 text-center space-y-6">
            <div className="flex justify-center"><History className="h-6 w-6 text-slate-300" /></div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 leading-relaxed italic">
              Verification protocol establishes an immutable financial record. Discrepancies between logged funds and studio records lock the authorization cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
