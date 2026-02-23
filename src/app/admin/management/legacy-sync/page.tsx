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
  FileClock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useWhyteStore, ClientProject, Designer, Collaborator, VendorAllocation } from "@/store/use-whyte-store";
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
    archivalNotes: ""
  });

  const totalSteps = 5;
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

  const executeFinalSync = () => {
    setLoading(true);
    const id = `HIST-${Math.floor(Math.random() * 9000) + 1000}`;
    const budget = Number(formData.totalBudget) || 0;
    const liquidated = Number(formData.liquidatedFunds) || 0;
    
    // Construct linked vendor allocations for the archive
    const allocations: VendorAllocation[] = formData.linkedCollaborators.map(cid => {
      const col = collaborators.find(c => c.id === cid);
      return {
        id: `AL-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        vendorName: col?.name || "Unknown Entity",
        role: "Historical Collaborator",
        category: col?.category || "Vendor",
        costType: "Fixed",
        costValue: 0,
        timelineDays: 0,
        materials: []
      };
    });

    const historicalDossier: ClientProject = { 
      id, 
      name: formData.name, 
      email: formData.email, 
      project: formData.project, 
      tier: formData.tier, 
      status: "Completion", 
      progress: 100, 
      startDate: format(formData.startDate, "MMM dd, yyyy"), 
      endDate: format(formData.endDate, "MMM dd, yyyy"), 
      lastActivity: "Historical Dossier Reconciled & Archived", 
      isActivated: true, 
      initialDepositPaid: true, 
      totalBudget: budget, 
      milestones: [{ id: 'M-HIST', label: "Project Conclusion", date: format(formData.endDate, "MMM dd, yyyy"), isCompleted: true, description: "Historical record finalized." }], 
      tasks: [], 
      installments: [
        { label: "Historical Settlement", percentage: 100, amount: liquidated, status: 'Paid' as const, transactionCode: 'LEGACY-SYNC' }
      ], 
      description: formData.description,
      vendorAllocations: allocations,
      assignedDesignerId: formData.assignedDesignerId,
      isArchived: true,
      financialReportStatus: 'Verified',
      auditDetails: {
        totalReceived: liquidated,
        allocations: [],
        refundAmount: 0,
        stewardComments: `Historical reconciliation for project ${id}. ${formData.archivalNotes}`,
        isVerified: true,
        submissionDate: format(new Date(), "MMM dd, yyyy")
      }
    };

    setTimeout(() => { 
      addClientProject(historicalDossier); 
      setLoading(false); 
      toast({ title: "Historical Sync Complete", description: `Dossier ${id} has been archived in the master registry.` });
      router.push("/admin/clients"); 
    }, 1500);
  };

  const isStepValid = () => { 
    if (step === 1) return formData.name && formData.email && formData.project; 
    if (step === 2) return formData.totalBudget && formData.liquidatedFunds; 
    if (step === 3) return formData.assignedDesignerId !== "";
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
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-accent mb-1">Historical Archival Protocol</AlertTitle>
        <AlertDescription className="text-[13px] font-light italic text-muted-foreground">
          This terminal is used to retroactively register past commissions. Synchronized dossiers will be linked to respective designers and partners and placed directly into the **Master Archives**.
        </AlertDescription>
      </Alert>

      <div className="max-w-md mx-auto mb-12">
        <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] font-bold text-accent/40 mb-3">
          <span>Archival Stage {step} of {totalSteps}</span>
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
                  <div className="flex items-center gap-4 mb-2"><User className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Dossier Identity</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Client Identity</Label><Input placeholder="E.g., Adnan Kibet" className="rounded-none border-accent/20 h-14 text-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Email Context</Label><Input type="email" placeholder="client@historical.com" className="rounded-none border-accent/20 h-14 text-lg" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                  </div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label><Input placeholder="E.g., Karen Estate Refurbishment (2022)" className="rounded-none border-accent/20 h-14 text-xl font-headline italic" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} /></div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Calculator className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Fiscal Reconciliation</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Contract Value (KES)</Label>
                      <Input type="number" placeholder="Original Budget" className="rounded-none border-accent/20 h-14 text-2xl font-headline italic" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Liquidated Funds (KES)</Label>
                      <Input type="number" placeholder="Final Amount Received" className="rounded-none border-accent/20 h-14 text-2xl font-headline italic" value={formData.liquidatedFunds} onChange={(e) => setFormData({...formData, liquidatedFunds: e.target.value})} />
                    </div>
                  </div>
                  <div className="p-6 bg-accent/[0.03] border border-accent/10 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-accent/40">Archival Settlement Margin</span>
                    <span className="text-xl font-headline italic text-accent">
                      KES {(Number(formData.totalBudget) - Number(formData.liquidatedFunds)).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><PencilRuler className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Creative Lead Attribution</h3></div>
                  <div className="space-y-4">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Assign Historical Lead</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {designers.map(designer => (
                        <button
                          key={designer.id}
                          type="button"
                          onClick={() => setFormData({...formData, assignedDesignerId: designer.id})}
                          className={cn(
                            "p-6 border text-left transition-all group",
                            formData.assignedDesignerId === designer.id ? "bg-accent border-accent text-white" : "bg-white border-accent/10 hover:border-accent/40"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", formData.assignedDesignerId === designer.id ? "text-white/60" : "text-accent/40")}>{designer.id}</span>
                            {formData.assignedDesignerId === designer.id && <CheckCircle2 className="h-4 w-4" />}
                          </div>
                          <p className="text-xl font-headline italic mt-2">{designer.name}</p>
                          <p className={cn("text-[11px] uppercase tracking-widest font-bold mt-1", formData.assignedDesignerId === designer.id ? "text-white/40" : "text-muted-foreground/60")}>{designer.role}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Users className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Network Matrix Synergy</h3></div>
                  <div className="space-y-4">
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
                            <div className={cn(
                              "h-4 w-4 border rounded-none flex items-center justify-center transition-all",
                              formData.linkedCollaborators.includes(col.id) ? "bg-accent border-accent" : "border-accent/20"
                            )}>
                              {formData.linkedCollaborators.includes(col.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                          <p className="text-sm font-bold uppercase tracking-widest text-accent/80">{col.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><FileClock className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Archival Protocol</h3></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Historical Narrative</Label><Textarea placeholder="Final summary of architectural delivery..." className="min-h-[180px] rounded-none border-accent/20 text-lg p-8 font-light italic leading-relaxed focus:ring-accent" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Internal Archival Notes</Label><Textarea placeholder="Confidential metadata for stewardship..." className="min-h-[120px] rounded-none border-accent/20 text-base p-6 font-light italic leading-relaxed bg-secondary/10" value={formData.archivalNotes} onChange={(e) => setFormData({...formData, archivalNotes: e.target.value})} /></div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-12 flex items-center justify-between border-t border-accent/5">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={handleBack} className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[12px] group">
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Previous Protocol
                </Button>
              ) : <div />}
              
              {step < totalSteps ? (
                <Button type="submit" disabled={!isStepValid()} className="bg-accent text-white rounded-none h-16 px-12 uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em] flex gap-3">
                  Continue Onboarding <ChevronRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button type="button" onClick={() => setIsConfirmOpen(true)} disabled={loading || !isStepValid()} className="bg-accent text-white rounded-none h-16 px-16 uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em] flex gap-3">
                  <ShieldCheck className="h-5 w-5" /> Authorize Sync
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
            <AlertDialogTitle className="text-3xl font-headline italic">Authorize Historical Sync?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-lg italic">
              This will permanently register the historical dossier for <strong>{formData.project}</strong>. All financial reconciliations will be locked and attributed to the respective lead designer and partners.
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
