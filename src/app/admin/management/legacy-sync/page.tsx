"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  History, 
  ChevronRight, 
  User, 
  Briefcase, 
  Calculator, 
  Plus, 
  Trash2,
  Calendar as CalendarIcon,
  ShieldCheck,
  Loader2,
  Users,
  Building2,
  ArrowLeft,
  Info,
  PencilRuler,
  CheckCircle2,
  FileClock,
  PlayCircle,
  Handshake,
  Archive,
  FileCheck,
  Key,
  Camera,
  Star,
  LayoutList,
  ShieldAlert,
  CreditCard,
  Banknote
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useWhyteStore, ClientProject, Designer, Collaborator, VendorAllocation, Milestone, ProjectTask, Installment } from "@/store/use-whyte-store";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SyncPath = 'Implementation' | 'Handover' | 'Archive_Review';

interface HistoricalSettlement {
  id: string;
  amount: string;
  code: string;
  date: Date;
}

export default function LegacyReconciliationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { addClientProject, designers, collaborators } = useWhyteStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    syncPath: 'Handover' as SyncPath,
    name: "",
    email: "",
    project: "",
    tier: "Premium" as ClientProject['tier'],
    description: "",
    totalBudget: "",
    settlements: [
      { id: 'S-1', amount: "", code: "", date: new Date() }
    ] as HistoricalSettlement[],
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date(),
    assignedDesignerId: "",
    linkedCollaborators: [] as string[],
    archivalNotes: "",
    handoverChecklist: [] as string[],
    activeTasks: [] as ProjectTask[],
    milestones: [] as Milestone[]
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const addSettlement = () => {
    setFormData({
      ...formData,
      settlements: [
        ...formData.settlements,
        { id: `S-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, amount: "", code: "", date: new Date() }
      ]
    });
  };

  const removeSettlement = (idx: number) => {
    if (formData.settlements.length <= 1) return;
    setFormData({
      ...formData,
      settlements: formData.settlements.filter((_, i) => i !== idx)
    });
  };

  const updateSettlement = (idx: number, field: keyof HistoricalSettlement, value: any) => {
    const updated = [...formData.settlements];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, settlements: updated });
  };

  const liquidatedTotal = formData.settlements.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const dueBalance = Math.max(0, (Number(formData.totalBudget) || 0) - liquidatedTotal);

  const toggleCollaborator = (id: string) => {
    setFormData(prev => ({
      ...prev,
      linkedCollaborators: prev.linkedCollaborators.includes(id)
        ? prev.linkedCollaborators.filter(c => c !== id)
        : [...prev.linkedCollaborators, id]
    }));
  };

  const toggleHandoverCheck = (id: string) => {
    setFormData(prev => ({
      ...prev,
      handoverChecklist: prev.handoverChecklist.includes(id)
        ? prev.handoverChecklist.filter(c => c !== id)
        : [...prev.handoverChecklist, id]
    }));
  };

  const executeFinalSync = () => {
    setLoading(true);
    const id = `LEG-${Math.floor(Math.random() * 9000) + 1000}`;
    const budget = Number(formData.totalBudget) || 0;
    
    const allocations: VendorAllocation[] = formData.linkedCollaborators.map(cid => {
      const col = collaborators.find(c => c.id === cid);
      return {
        id: `AL-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        vendorName: col?.name || "Unknown Entity",
        role: "Legacy Partner",
        category: col?.category || "Vendor",
        costType: "Fixed",
        costValue: 0,
        timelineDays: 0,
        materials: []
      };
    });

    const settlementInstallments: Installment[] = formData.settlements.map(s => ({
      label: "Historical Settlement",
      percentage: Math.round(((Number(s.amount) || 0) / Math.max(1, budget)) * 100),
      amount: Number(s.amount) || 0,
      status: 'Paid',
      transactionCode: s.code || 'LEGACY-SYNC',
      date: format(s.date, "MMM dd, yyyy")
    }));

    if (dueBalance > 0) {
      settlementInstallments.push({
        label: "Outstanding Balance",
        percentage: Math.round((dueBalance / budget) * 100),
        amount: dueBalance,
        status: 'Pending'
      });
    }

    const legacyDossier: ClientProject = { 
      id, 
      name: formData.name, 
      email: formData.email, 
      project: formData.project, 
      tier: formData.tier, 
      status: 'Completion', 
      progress: 95, 
      startDate: format(formData.startDate, "MMM dd, yyyy"), 
      endDate: format(formData.endDate, "MMM dd, yyyy"), 
      lastActivity: `Legacy Reconciliation: Dossier Transmitted to Handover Review.`, 
      isActivated: true, 
      initialDepositPaid: true, 
      totalBudget: budget, 
      milestones: formData.milestones.length > 0 ? formData.milestones : [{ id: 'M-LEG', label: "Legacy Data Sync", date: format(new Date(), "MMM dd, yyyy"), isCompleted: true, description: "Historical record synchronization." }], 
      tasks: formData.activeTasks, 
      installments: settlementInstallments, 
      description: formData.description,
      vendorAllocations: allocations,
      assignedDesignerId: formData.assignedDesignerId,
      isArchived: false,
      financialReportStatus: 'Pending',
      handoverStatus: 'Pending',
    };

    setTimeout(() => { 
      addClientProject(legacyDossier); 
      setLoading(false); 
      toast({ title: "Legacy Sync Authorized", description: `Dossier ${id} registered. Injected into pipeline for Handover and Financial Audit.` });
      router.push("/admin/operations/handover"); 
    }, 1500);
  };

  const isStepValid = () => { 
    if (step === 1) return formData.syncPath;
    if (step === 2) return formData.name && formData.email && formData.project; 
    if (step === 3) return formData.handoverChecklist.length > 0 || formData.activeTasks.length > 0 || formData.syncPath === 'Archive_Review';
    if (step === 4) return formData.assignedDesignerId !== "";
    if (step === 5) return formData.totalBudget && formData.settlements.every(s => s.amount && s.code);
    return true; 
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Studio Management</span>
        </div>
        <h1 className="text-5xl font-headline italic">Legacy <span className="not-italic">Reconciliation.</span></h1>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-6">
        <ShieldAlert className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-accent mb-1">Operational Mandate</AlertTitle>
        <AlertDescription className="text-base font-light italic text-muted-foreground leading-relaxed">
          Historical items synchronized via implementation or handover paths **must** pass technical handover and financial audit before archival.
        </AlertDescription>
      </Alert>

      <div className="max-w-md mx-auto mb-12">
        <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] font-bold text-accent/40 mb-3">
          <span>Synchronization Protocol Stage {step} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1 bg-accent/5 rounded-none" />
      </div>

      <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
        <CardContent className="p-10 md:p-16">
          <form onSubmit={(e) => { e.preventDefault(); if(step === totalSteps) setIsConfirmOpen(true); else handleNext(); }} className="space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><History className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Protocol Context</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { id: 'Implementation', label: 'Active Site Sync', icon: PlayCircle, sub: 'Needs Execution Completion' },
                      { id: 'Handover', label: 'Handover Entry', icon: Handshake, sub: 'Direct to Handover review' },
                      { id: 'Archive_Review', label: 'Archival Review', icon: Archive, sub: 'Historical Data Entry only' },
                    ].map((path) => (
                      <button
                        key={path.id}
                        type="button"
                        onClick={() => setFormData({...formData, syncPath: path.id as SyncPath})}
                        className={cn(
                          "p-8 border text-left space-y-4 transition-all",
                          formData.syncPath === path.id ? "bg-accent border-accent text-white" : "bg-white border-accent/5 hover:border-accent/20"
                        )}
                      >
                        <path.icon className={cn("h-8 w-8", formData.syncPath === path.id ? "text-white" : "text-accent/20")} />
                        <div className="space-y-1">
                          <p className="font-bold uppercase tracking-widest text-[13px]">{path.label}</p>
                          <p className={cn("text-[11px] font-light italic leading-relaxed", formData.syncPath === path.id ? "text-white/60" : "text-muted-foreground")}>{path.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><User className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Dossier Identity</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Client Identity</Label><Input placeholder="E.g., Adnan Kibet" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Email Context</Label><Input type="email" placeholder="client@historical.com" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                  </div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label><Input placeholder="E.g., Karen Estate Refurbishment" className="rounded-none border-accent/20 h-14 text-xl font-headline italic focus:ring-accent" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} /></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Narrative Summary</Label><Textarea placeholder="Briefing history..." className="min-h-[120px] rounded-none border-accent/20 text-lg p-6 font-light italic leading-relaxed focus:ring-accent" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><LayoutList className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Operational Status</h3></div>
                  {formData.syncPath === 'Archive_Review' ? (
                    <div className="text-center py-20 border border-dashed border-accent/10 space-y-4">
                      <Archive className="h-12 w-12 text-accent/10 mx-auto" />
                      <p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">Direct historical archival Review selected.</p>
                      <Button variant="ghost" onClick={handleNext} className="text-accent uppercase text-[10px] font-bold tracking-widest">Proceed to Attribution <ChevronRight className="h-3 w-3 ml-2" /></Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: 'qa', label: 'Site Quality Audit', icon: FileCheck, sub: 'Structural QA Verified' },
                        { id: 'media', label: 'Digital Registry', icon: Camera, sub: 'Site Assets Archived' },
                        { id: 'keys', label: 'Access Protocol', icon: Key, sub: 'Key Transfer Authorized' },
                        { id: 'review', label: 'Review Session', icon: Star, sub: 'Final Consult Completed' },
                      ].map((check) => (
                        <button
                          key={check.id}
                          type="button"
                          onClick={() => toggleHandoverCheck(check.id)}
                          className={cn(
                            "p-6 border text-left flex items-center justify-between group transition-all",
                            formData.handoverChecklist.includes(check.id) ? "bg-accent/5 border-accent/20" : "bg-white border-accent/5 hover:border-accent/20"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <check.icon className={cn("h-5 w-5", formData.handoverChecklist.includes(check.id) ? "text-accent" : "text-accent/20")} />
                            <div className="space-y-0.5">
                              <p className={cn("text-[12px] font-bold uppercase tracking-widest", formData.handoverChecklist.includes(check.id) ? "text-accent" : "text-accent/40")}>{check.label}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-light italic tracking-widest">{check.sub}</p>
                            </div>
                          </div>
                          <div className={cn("h-4 w-4 border flex items-center justify-center", formData.handoverChecklist.includes(check.id) ? "bg-accent border-accent" : "border-accent/10")}>
                            {formData.handoverChecklist.includes(check.id) && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><PencilRuler className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Creative & Network Attribution</h3></div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Assign Historical Lead</Label>
                      <Select value={formData.assignedDesignerId} onValueChange={(v) => setFormData({...formData, assignedDesignerId: v})}>
                        <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg font-headline italic focus:ring-accent"><SelectValue placeholder="Select Creative Lead" /></SelectTrigger>
                        <SelectContent className="rounded-none">{designers.map(d => <SelectItem key={d.id} value={d.id} className="font-headline italic text-lg">{d.name} — {d.role}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Linked Trade Partners</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {collaborators.map(col => (
                          <div
                            key={col.id}
                            onClick={() => toggleCollaborator(col.id)}
                            className={cn(
                              "p-6 border cursor-pointer transition-all flex flex-col justify-between h-32",
                              formData.linkedCollaborators.includes(col.id) ? "bg-accent/5 border-accent shadow-inner" : "bg-white border-accent/10 hover:border-accent/40"
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-accent/40">{col.id}</span>
                              <div className={cn("h-4 w-4 border flex items-center justify-center transition-all", formData.linkedCollaborators.includes(col.id) ? "bg-accent border-accent" : "border-accent/20")}>{formData.linkedCollaborators.includes(col.id) && <CheckCircle2 className="h-3 w-3 text-white" />}</div>
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-accent/80">{col.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Calculator className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Fiscal Reconciliation</h3></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Contract Value (KES)</Label><Input type="number" placeholder="Original Budget" className="rounded-none border-accent/20 h-14 text-2xl font-headline italic focus:ring-accent" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} /></div>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-accent/5 pb-4"><h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40">Historical Settlement Ledger</h4><Button type="button" variant="outline" size="sm" onClick={addSettlement} className="rounded-none h-10 px-6 text-[10px] uppercase tracking-widest font-bold border-accent/10 hover:bg-accent hover:text-white"><Plus className="h-3.5 w-3.5 mr-2" /> Append Entry</Button></div>
                    <div className="space-y-6">
                      {formData.settlements.map((s, idx) => (
                        <div key={s.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-8 relative group hover:bg-white hover:shadow-xl transition-all">
                          <Button variant="ghost" size="icon" onClick={() => removeSettlement(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-4 space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Amount (KES)</Label><Input type="number" value={s.amount} onChange={(e) => updateSettlement(idx, 'amount', e.target.value)} className="rounded-none h-12 text-sm font-bold border-accent/10" placeholder="0.00" /></div>
                            <div className="md:col-span-4 space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Ref Code</Label><div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-accent/20" /><Input value={s.code} onChange={(e) => updateSettlement(idx, 'code', e.target.value)} className="pl-10 rounded-none h-12 text-sm font-bold border-accent/10" placeholder="TRX-9921" /></div></div>
                            <div className="md:col-span-4 space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="w-full h-12 rounded-none justify-start text-[11px] border-accent/10 font-bold uppercase tracking-widest"><CalendarIcon className="mr-3 h-4 w-4 opacity-40" />{format(s.date, "MMM dd, yyyy")}</Button></PopoverTrigger><PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={s.date} onSelect={(d) => d && updateSettlement(idx, 'date', d)} initialFocus /></PopoverContent></Popover></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-accent/[0.03] border border-accent/10 space-y-4">
                    <div className="flex justify-between items-center"><div className="space-y-1"><span className="text-[11px] font-bold uppercase tracking-widest text-accent/40">Historical Due Balance</span><p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest italic">Automatically flagged for review</p></div><div className="text-right"><p className="text-[9px] uppercase font-bold text-accent/20 mb-1">Liquidated: KES {liquidatedTotal.toLocaleString()}</p><span className={cn("text-3xl font-headline italic", dueBalance > 0 ? "text-orange-600" : "text-green-600")}>KES {dueBalance.toLocaleString()}</span></div></div>
                    <Progress value={(liquidatedTotal / Math.max(1, Number(formData.totalBudget))) * 100} className="h-1 bg-accent/5 rounded-none" />
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><FileClock className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Sync Authorization</h3></div>
                  <div className="space-y-6">
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Archival Metadata</Label><Textarea placeholder="Verification notes for handover review..." className="min-h-[180px] rounded-none border-accent/20 text-lg p-8 font-light italic leading-relaxed focus:ring-accent bg-secondary/5" value={formData.archivalNotes} onChange={(e) => setFormData({...formData, archivalNotes: e.target.value})} /></div>
                    <div className="p-8 border border-dashed border-accent/20 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Handover Protocol Required</p>
                        <p className="text-[13px] italic font-light text-muted-foreground">Commission will be injected into Handover queue for final authorization.</p>
                      </div>
                      <Button type="button" onClick={() => setIsConfirmOpen(true)} className="h-14 px-12 bg-accent text-white rounded-none uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all hover:tracking-[0.2em] flex gap-3"><ShieldCheck className="h-5 w-5" /> Authorize & Sync</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-12 flex items-center justify-between border-t border-accent/5">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={handleBack} className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[12px] group"><ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Previous Step</Button>
              ) : <div />}
              {step < totalSteps && (
                <Button type="submit" disabled={!isStepValid()} className="bg-accent text-white rounded-none h-16 px-12 uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em] flex gap-3">Continue Synchronization <ChevronRight className="h-5 w-5" /></Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body p-10">
          <AlertDialogHeader className="space-y-6">
            <div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.3em]">Protocol Gate</span></div>
            <AlertDialogTitle className="text-3xl font-headline italic">Confirm Pipeline Injection?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-lg italic">This will register **{formData.project}** in the active Handover queue. It must pass formal technical review and financial audit before permanent archival.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-10">
            <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-8 border-accent/10">Abort Sync</AlertDialogCancel>
            <AlertDialogAction onClick={executeFinalSync} className="bg-accent text-white rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-10 hover:bg-accent/90 shadow-xl">Authorize Dossier</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
