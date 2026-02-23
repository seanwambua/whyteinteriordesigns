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
  ShieldAlert
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useWhyteStore, ClientProject, Designer, Collaborator, VendorAllocation, Milestone, ProjectTask } from "@/store/use-whyte-store";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

type SyncPath = 'Implementation' | 'Handover' | 'Archive';

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
    syncPath: 'Archive' as SyncPath,
    name: "",
    email: "",
    project: "",
    tier: "Premium" as ClientProject['tier'],
    description: "",
    totalBudget: "",
    liquidatedFunds: "",
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date(),
    assignedDesignerId: "",
    linkedCollaborators: [] as string[],
    archivalNotes: "",
    // Path Specifics
    handoverChecklist: [] as string[],
    activeTasks: [] as ProjectTask[],
    milestones: [] as Milestone[]
  });

  const totalSteps = formData.syncPath === 'Archive' ? 5 : 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

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
    const liquidated = Number(formData.liquidatedFunds) || 0;
    
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

    const isArchived = formData.syncPath === 'Archive';
    const isHandover = formData.syncPath === 'Handover';

    const legacyDossier: ClientProject = { 
      id, 
      name: formData.name, 
      email: formData.email, 
      project: formData.project, 
      tier: formData.tier, 
      status: isArchived ? 'Completion' : 'Execution', 
      progress: isArchived ? 100 : isHandover ? 95 : 50, 
      startDate: format(formData.startDate, "MMM dd, yyyy"), 
      endDate: format(formData.endDate, "MMM dd, yyyy"), 
      lastActivity: `Legacy Sync: ${formData.syncPath} protocol established.`, 
      isActivated: true, 
      initialDepositPaid: true, 
      totalBudget: budget, 
      milestones: isArchived ? [{ id: 'M-HIST', label: "Legacy Conclusion", date: format(formData.endDate, "MMM dd, yyyy"), isCompleted: true, description: "Historical record finalized." }] : formData.milestones, 
      tasks: formData.activeTasks, 
      installments: [
        { label: "Historical Settlement", percentage: 100, amount: liquidated, status: 'Paid' as const, transactionCode: 'LEGACY-SYNC' }
      ], 
      description: formData.description,
      vendorAllocations: allocations,
      assignedDesignerId: formData.assignedDesignerId,
      isArchived: isArchived,
      financialReportStatus: isArchived ? 'Verified' : 'Pending',
      handoverStatus: isHandover ? 'Pending' : null,
      auditDetails: isArchived ? {
        totalReceived: liquidated,
        allocations: [],
        refundAmount: 0,
        stewardComments: `Historical reconciliation for project ${id}.`,
        isVerified: true,
        submissionDate: format(new Date(), "MMM dd, yyyy")
      } : undefined
    };

    setTimeout(() => { 
      addClientProject(legacyDossier); 
      setLoading(false); 
      toast({ title: "Legacy Sync Authorized", description: `Dossier ${id} registered. ${isArchived ? 'Direct Archive inject complete.' : 'Commission injected into pipeline for audit.'}` });
      router.push("/admin/clients"); 
    }, 1500);
  };

  const isStepValid = () => { 
    if (step === 1) return formData.syncPath;
    if (step === 2) return formData.name && formData.email && formData.project; 
    if (step === 3 && formData.syncPath === 'Handover') return formData.handoverChecklist.length > 0;
    if (step === 4) return formData.assignedDesignerId !== "";
    if (step === 5) return formData.totalBudget && formData.liquidatedFunds; 
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
        <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-accent mb-1">Operational Lifecycle Guardrail</AlertTitle>
        <AlertDescription className="text-base font-light italic text-muted-foreground leading-relaxed">
          Unless a historical item is synchronized directly to the **Master Archives**, it must pass all standard **Handover Protocols** and **Financial Audit** requirements before permanent archival.
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
                      { id: 'Implementation', label: 'Active Implementation', icon: PlayCircle, sub: 'Needs Handover + Audit' },
                      { id: 'Handover', label: 'Final Handover', icon: Handshake, sub: 'Needs Admin Review + Audit' },
                      { id: 'Archive', label: 'Historical Record', icon: Archive, sub: 'Bypass Pipeline — Direct Archive' },
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
                  {formData.syncPath === 'Implementation' && (
                    <div className="space-y-10">
                      <div className="flex items-center gap-4 mb-2"><PlayCircle className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Implementation Protocol</h3></div>
                      <Alert className="rounded-none border-accent/10 bg-accent/[0.02]">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-[12px] font-light italic">Define primary site tasks to initialize active tracking. This dossier must pass formal handover review.</AlertDescription>
                      </Alert>
                      <Button type="button" variant="outline" className="rounded-none h-12 uppercase tracking-widest text-[10px] font-bold border-accent/10 hover:bg-accent hover:text-white transition-all" onClick={() => setFormData({...formData, activeTasks: [...formData.activeTasks, { id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "", status: 'Todo', priority: 'Medium' }]})}><Plus className="h-4 w-4 mr-2" /> Append Protocol</Button>
                      <div className="space-y-4">
                        {formData.activeTasks.map((t, idx) => (
                          <div key={t.id} className="flex gap-4 items-center">
                            <Input value={t.title} onChange={(e) => { const nt = [...formData.activeTasks]; nt[idx].title = e.target.value; setFormData({...formData, activeTasks: nt}); }} className="rounded-none border-accent/10 h-12 flex-1" placeholder="Protocol Label" />
                            <Button variant="ghost" size="icon" onClick={() => setFormData({...formData, activeTasks: formData.activeTasks.filter((_, i) => i !== idx)})} className="h-12 w-12 text-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.syncPath === 'Handover' && (
                    <div className="space-y-10">
                      <div className="flex items-center gap-4 mb-2"><Handshake className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Handover Reconciliation</h3></div>
                      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] mb-6">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-[12px] font-light italic">This dossier will be injected directly into the Handover Review queue for Senior Partner verification.</AlertDescription>
                      </Alert>
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
                    </div>
                  )}
                  {formData.syncPath === 'Archive' && (
                    <div className="text-center py-20 border border-dashed border-accent/10 space-y-4">
                      <Archive className="h-12 w-12 text-accent/10 mx-auto" />
                      <p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">Protocol steps bypassed for historical archive inject.</p>
                      <Button variant="ghost" onClick={handleNext} className="text-accent uppercase text-[10px] font-bold tracking-widest">Proceed to Attribution <ChevronRight className="h-3 w-3 ml-2" /></Button>
                    </div>
                  )}
                </motion.div>
              )}

              {(step === 4 || (formData.syncPath === 'Archive' && step === 3)) && (
                <motion.div key="s-entities" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
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

              {(step === 5 || (formData.syncPath === 'Archive' && step === 4)) && (
                <motion.div key="s-fiscal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Calculator className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Fiscal Reconciliation</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Contract Value (KES)</Label><Input type="number" placeholder="Original Budget" className="rounded-none border-accent/20 h-14 text-2xl font-headline italic focus:ring-accent" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} /></div>
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Liquidated Funds (KES)</Label><Input type="number" placeholder="Amount Received" className="rounded-none border-accent/20 h-14 text-2xl font-headline italic focus:ring-accent" value={formData.liquidatedFunds} onChange={(e) => setFormData({...formData, liquidatedFunds: e.target.value})} /></div>
                  </div>
                  <div className="p-8 bg-accent/[0.03] border border-accent/10 space-y-4">
                    <div className="flex justify-between items-center"><span className="text-[11px] font-bold uppercase tracking-widest text-accent/40">Archival Settlement Margin</span><span className="text-2xl font-headline italic text-accent">KES {(Number(formData.totalBudget) - Number(formData.liquidatedFunds)).toLocaleString()}</span></div>
                    <Progress value={(Number(formData.liquidatedFunds) / Math.max(1, Number(formData.totalBudget))) * 100} className="h-1 bg-accent/5 rounded-none" />
                  </div>
                </motion.div>
              )}

              {(step === 6 || (formData.syncPath === 'Archive' && step === 5)) && (
                <motion.div key="s-final" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><FileClock className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Archival Finalization</h3></div>
                  <div className="space-y-6">
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Internal Archival Metadata</Label><Textarea placeholder="Confidential reconciliation notes for stewardship audit..." className="min-h-[180px] rounded-none border-accent/20 text-lg p-8 font-light italic leading-relaxed focus:ring-accent bg-secondary/5" value={formData.archivalNotes} onChange={(e) => setFormData({...formData, archivalNotes: e.target.value})} /></div>
                    <div className="p-8 border border-dashed border-accent/20 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Verification Protocol</p>
                        <p className="text-[13px] italic font-light text-muted-foreground">Confirming all historical site protocols and capital distributions are synchronized.</p>
                      </div>
                      <Button type="button" onClick={() => setIsConfirmOpen(true)} className="h-14 px-12 bg-accent text-white rounded-none uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all hover:tracking-[0.2em] flex gap-3"><ShieldCheck className="h-5 w-5" /> Authorize Sync</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-12 flex items-center justify-between border-t border-accent/5">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={handleBack} className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[12px] group">
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Previous Protocol
                </Button>
              ) : <div />}
              
              {step < totalSteps && (
                <Button type="submit" disabled={!isStepValid()} className="bg-accent text-white rounded-none h-16 px-12 uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em] flex gap-3">
                  Continue Synchronization <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body p-10">
          <AlertDialogHeader className="space-y-6">
            <div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.3em]">Archival Protocol</span></div>
            <AlertDialogTitle className="text-3xl font-headline italic">Authorize Legacy Sync?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-lg italic">
              {formData.syncPath === 'Archive' 
                ? `This will permanently register the historical dossier for ${formData.project} directly into the Master Archives.` 
                : `This will register the historical dossier for ${formData.project} into the active pipeline. It MUST pass handover authorization and financial audit before permanent archival.`}
            </AlertDialogDescription>
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
