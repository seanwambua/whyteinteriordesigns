"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Handshake, 
  Key, 
  FileCheck, 
  Camera, 
  Star, 
  ShieldCheck, 
  ChevronRight,
  Info,
  Clock,
  Loader2,
  CheckCircle2,
  Building2,
  User,
  LayoutList,
  AlertTriangle,
  ArrowRight,
  XCircle,
  PencilRuler
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function HandoverProtocolPage() {
  const { clientProjects, updateClientProject, designers } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  
  const [rejectingProject, setRejectingProject] = useState<ClientProject | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState("");

  const [verifications, setVerifications] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handoverProjects = useMemo(() => {
    return clientProjects.filter(p => 
      !p.isArchived && 
      p.isActivated && 
      p.handoverStatus === 'Pending'
    );
  }, [clientProjects]);

  const totalAwaiting = handoverProjects.length;
  const totalConcluded = clientProjects.filter(p => p.status === 'Completion' || p.isArchived).length;

  if (!isMounted) return null;

  const toggleVerification = (projectId: string, step: string) => {
    setVerifications(prev => {
      const current = prev[projectId] || [];
      const updated = current.includes(step) 
        ? current.filter(s => s !== step) 
        : [...current, step];
      return { ...prev, [projectId]: updated };
    });
  };

  const handleAuthorizeHandover = (projectId: string) => {
    setIsSyncing(projectId);
    setTimeout(() => {
      updateClientProject(projectId, { 
        status: 'Completion', 
        handoverStatus: 'Passed',
        lastActivity: "Handover Protocol Authorized — Site Keys & Quality Sign-off Verified",
        progress: 100
      });
      toast({ 
        title: "Handover Synchronized", 
        description: "Commission transitioned to historical completion phase." 
      });
      setIsSyncing(null);
    }, 1500);
  };

  const handleFailHandover = () => {
    if (!rejectingProject || !rejectionNotes) return;
    setIsSyncing(rejectingProject.id);
    
    setTimeout(() => {
      updateClientProject(rejectingProject.id, {
        status: 'Execution', // SEND BACK TO LIVE IMPLEMENTATION
        handoverStatus: 'Failed',
        handoverNotes: rejectionNotes,
        lastActivity: "Handover Rejected — Returned to Implementation for Fixes"
      });
      toast({ 
        variant: "destructive",
        title: "Handover Flagged", 
        description: "Dossier returned to Implementation phase with corrective directives." 
      });
      setIsSyncing(null);
      setRejectingProject(null);
      setRejectionNotes("");
    }, 1500);
  };

  const steps = [
    { id: 'qa', label: 'Site Quality Audit', icon: <FileCheck className="h-4 w-4" />, sub: 'Structural QA Verified' },
    { id: 'media', label: 'Digital Registry', icon: <Camera className="h-4 w-4" />, sub: 'Site Assets Archived' },
    { id: 'keys', label: 'Access Protocol', icon: <Key className="h-4 w-4" />, sub: 'Key Transfer Authorized' },
    { id: 'review', label: 'Review Session', icon: <Star className="h-4 w-4" />, sub: 'Final Consult Completed' },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Handover <span className="not-italic">Protocols.</span></h1>
        </div>
        
        <div className="flex gap-6">
          <div className="bg-white border border-accent/10 p-6 flex flex-col items-end gap-1 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Pending Review</span>
            <span className="text-2xl font-headline italic text-orange-600">{totalAwaiting} Dossiers</span>
          </div>
          <div className="bg-accent p-6 flex flex-col items-end gap-1 shadow-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">Total Concluded</span>
            <span className="text-2xl font-headline italic text-white">{totalConcluded} Dossiers</span>
          </div>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-8">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-accent mb-2">Final Delivery Framework</AlertTitle>
        <AlertDescription className="text-[14px] font-light italic text-muted-foreground leading-relaxed">
          Authorization requires a full audit of quality sign-offs, digital asset registry, and formal key transfer. 
          Flagging for fixes will return the dossier to the **Live Implementation** workbench.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-12">
        <AnimatePresence mode="popLayout">
          {handoverProjects.map((project, index) => {
            const projectVerifications = verifications[project.id] || [];
            const isFullyVerified = projectVerifications.length === steps.length;
            const assignedDesigner = designers.find(d => d.id === project.assignedDesignerId);

            return (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-none border-accent/5 shadow-2xl bg-white group overflow-hidden">
                  <div className="flex flex-col lg:flex-row h-full">
                    <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-accent/5 bg-secondary/10 p-10 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-accent/40 uppercase tracking-[0.4em] block">{project.id}</span>
                          <h3 className="text-3xl font-headline italic leading-tight text-accent">{project.project}</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                            <User className="h-4 w-4 opacity-40" /> {project.name}
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-accent font-bold uppercase tracking-widest">
                            <PencilRuler className="h-4 w-4 opacity-40" /> Lead: {assignedDesigner ? assignedDesigner.name : "Unassigned"}
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                            <Clock className="h-4 w-4 opacity-40" /> Target: {project.endDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-10">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-accent/60">
                          <span>Site Velocity</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1 bg-accent/5 rounded-none" />
                        <Badge variant="outline" className="rounded-none w-full justify-center py-1.5 uppercase tracking-widest text-[10px] font-bold border-accent/20 text-accent">
                          HANDOVER IN REVIEW
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 p-10 md:p-12 space-y-10">
                      <div className="flex items-center gap-4 border-b border-accent/5 pb-6">
                        <LayoutList className="h-5 w-5 text-accent/40" />
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent">Quality Assurance Synchronization</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {steps.map((step) => (
                          <div 
                            key={step.id} 
                            onClick={() => toggleVerification(project.id, step.id)}
                            className={cn(
                              "p-6 border flex items-center justify-between group/step transition-all cursor-pointer",
                              projectVerifications.includes(step.id)
                                ? "bg-accent/5 border-accent/20" 
                                : "bg-white border-accent/5 hover:border-accent/40"
                            )}
                          >
                            <div className="flex items-center gap-5">
                              <div className={cn(
                                "h-10 w-10 flex items-center justify-center transition-all",
                                projectVerifications.includes(step.id)
                                  ? "bg-accent text-white" 
                                  : "bg-secondary/50 text-accent/20"
                              )}>
                                {step.icon}
                              </div>
                              <div className="space-y-0.5">
                                <p className={cn(
                                  "text-[12px] font-bold uppercase tracking-widest",
                                  projectVerifications.includes(step.id) ? "text-accent" : "text-accent/40"
                                )}>{step.label}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-light italic tracking-widest">{step.sub}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "h-5 w-5 border flex items-center justify-center transition-all",
                              projectVerifications.includes(step.id)
                                ? "bg-accent border-accent" 
                                : "border-accent/10"
                            )}>
                              {projectVerifications.includes(step.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-accent/5 gap-8">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center border",
                            isFullyVerified ? "border-green-600/20 bg-green-600/5 text-green-600" : "border-accent/10 text-accent/20"
                          )}>
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-accent/40">Operational Status</p>
                            <p className={cn(
                              "text-[13px] font-bold uppercase tracking-widest",
                              isFullyVerified ? "text-accent" : "text-orange-600"
                            )}>
                              {isFullyVerified ? "Ready for Authorization" : "Verification in Progress"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Button 
                            onClick={() => setRejectingProject(project)}
                            variant="ghost"
                            className="rounded-none h-14 px-8 text-destructive/40 hover:text-destructive hover:bg-destructive/5 uppercase tracking-widest text-[11px] font-bold"
                          >
                            Flag for Fixes
                          </Button>
                          <Button 
                            onClick={() => handleAuthorizeHandover(project.id)}
                            disabled={isSyncing === project.id || !isFullyVerified}
                            className="h-16 px-12 bg-accent text-white rounded-none uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all hover:tracking-[0.2em] flex gap-3"
                          >
                            {isSyncing === project.id ? (
                              <span className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" /> Synchronizing...</span>
                            ) : (
                              <><Handshake className="h-5 w-5" /> Authorize & Pass</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {handoverProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-40 border border-dashed border-accent/10 bg-secondary/5 space-y-6"
          >
            <div className="h-20 w-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
              <Handshake className="h-10 w-10 text-accent/20" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-light italic text-muted-foreground uppercase tracking-[0.3em]">
                No commissions currently awaiting handover authorization
              </p>
              <p className="text-[11px] text-accent/40 uppercase tracking-widest font-bold">
                Designers initialize handovers once site protocols are complete.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <Dialog open={!!rejectingProject} onOpenChange={(open) => !open && setRejectingProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden bg-white">
          <div className="bg-destructive h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-destructive text-[12px] font-bold uppercase tracking-[0.4em]">Handover Flagging</span>
              </div>
              <DialogTitle className="text-3xl font-headline italic">Reject Handover Request</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-sm leading-relaxed">
                Provide technical directives for the Creative Lead. The dossier will be returned to the **Execution (Live Implementation)** phase.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Technical Fix Notes</Label>
              <Textarea 
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Specific site protocols requiring remediation before re-submission..."
                className="min-h-[150px] rounded-none border-accent/10 p-6 font-light italic leading-relaxed focus:ring-destructive bg-destructive/[0.02]"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button 
                onClick={handleFailHandover}
                disabled={!rejectionNotes || isSyncing === rejectingProject?.id}
                className="w-full bg-destructive text-white h-16 rounded-none uppercase tracking-widest text-[11px] font-bold shadow-2xl transition-all"
              >
                {isSyncing === rejectingProject?.id ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Transmitting...</span>
                ) : "Authorize Corrective Workflow"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
