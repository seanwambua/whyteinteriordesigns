"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function HandoverProtocolPage() {
  const { clientProjects, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  
  // Track checklist per project locally before final sync
  const [verifications, setVerifications] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // HANDOVER: Projects in Execution with high progress (>85%) or in Completion phase but not yet reconciled
  const handoverProjects = useMemo(() => {
    return clientProjects.filter(p => 
      !p.isArchived && 
      p.isActivated && 
      (p.status === 'Completion' || (p.status === 'Execution' && p.progress >= 85))
    );
  }, [clientProjects]);

  const totalAwaiting = handoverProjects.filter(p => p.status === 'Execution').length;
  const totalReady = handoverProjects.filter(p => p.status === 'Completion').length;

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
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Awaiting Handover</span>
            <span className="text-2xl font-headline italic text-orange-600">{totalAwaiting} Dossiers</span>
          </div>
          <div className="bg-accent p-6 flex flex-col items-end gap-1 shadow-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">Total Concluded</span>
            <span className="text-2xl font-headline italic text-white">{totalReady} Dossiers</span>
          </div>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-8">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-accent mb-2">Final Delivery Framework</AlertTitle>
        <AlertDescription className="text-[14px] font-light italic text-muted-foreground leading-relaxed">
          Handover protocols manage the transition from site implementation to architectural completion. 
          Authorization requires a full audit of quality sign-offs, digital asset registry, and formal key transfer.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-12">
        <AnimatePresence mode="popLayout">
          {handoverProjects.map((project, index) => {
            const projectVerifications = verifications[project.id] || [];
            const isFullyVerified = projectVerifications.length === steps.length;
            const isCompleted = project.status === 'Completion';

            return (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "rounded-none border-accent/5 shadow-2xl bg-white group overflow-hidden transition-all duration-500",
                  isCompleted && "opacity-80"
                )}>
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* Sidebar Project Info */}
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
                        <Badge variant="outline" className={cn(
                          "rounded-none w-full justify-center py-1.5 uppercase tracking-widest text-[10px] font-bold",
                          isCompleted ? "bg-green-600/10 text-green-600 border-green-600/20" : "border-accent/20 text-accent"
                        )}>
                          Phase: {project.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Handover Checklist Protocol */}
                    <div className="flex-1 p-10 md:p-12 space-y-10">
                      <div className="flex items-center gap-4 border-b border-accent/5 pb-6">
                        <LayoutList className="h-5 w-5 text-accent/40" />
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent">Handover Synchronization Protocol</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {steps.map((step) => (
                          <div 
                            key={step.id} 
                            onClick={() => !isCompleted && toggleVerification(project.id, step.id)}
                            className={cn(
                              "p-6 border flex items-center justify-between group/step transition-all cursor-pointer",
                              projectVerifications.includes(step.id) || isCompleted
                                ? "bg-accent/5 border-accent/20" 
                                : "bg-white border-accent/5 hover:border-accent/40",
                              isCompleted && "cursor-default"
                            )}
                          >
                            <div className="flex items-center gap-5">
                              <div className={cn(
                                "h-10 w-10 flex items-center justify-center transition-all",
                                projectVerifications.includes(step.id) || isCompleted
                                  ? "bg-accent text-white" 
                                  : "bg-secondary/50 text-accent/20"
                              )}>
                                {step.icon}
                              </div>
                              <div className="space-y-0.5">
                                <p className={cn(
                                  "text-[12px] font-bold uppercase tracking-widest",
                                  projectVerifications.includes(step.id) || isCompleted ? "text-accent" : "text-accent/40"
                                )}>{step.label}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-light italic tracking-widest">{step.sub}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "h-5 w-5 border flex items-center justify-center transition-all",
                              projectVerifications.includes(step.id) || isCompleted
                                ? "bg-accent border-accent" 
                                : "border-accent/10"
                            )}>
                              {(projectVerifications.includes(step.id) || isCompleted) && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-accent/5 gap-8">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center border",
                            isFullyVerified || isCompleted ? "border-green-600/20 bg-green-600/5 text-green-600" : "border-accent/10 text-accent/20"
                          )}>
                            {isCompleted ? <ShieldCheck className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-accent/40">Operational Status</p>
                            <p className={cn(
                              "text-[13px] font-bold uppercase tracking-widest",
                              isCompleted ? "text-green-600" : isFullyVerified ? "text-accent" : "text-orange-600"
                            )}>
                              {isCompleted ? "Handover Protocol Finalized" : isFullyVerified ? "Ready for Authorization" : "Verification in Progress"}
                            </p>
                          </div>
                        </div>

                        {isCompleted ? (
                          <Button asChild variant="outline" className="rounded-none h-14 px-10 border-accent/10 text-accent hover:bg-accent hover:text-white uppercase tracking-widest text-[11px] font-bold transition-all shadow-sm flex gap-3">
                            <Link href={`/admin/operations/closing`}>
                              Go to Reconciliation <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <div className="flex items-center gap-4">
                            {!isFullyVerified && (
                              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-4 py-2 border border-orange-200">
                                <AlertTriangle className="h-3.5 w-3.5" /> Complete all verifications to authorize
                              </div>
                            )}
                            <Button 
                              onClick={() => handleAuthorizeHandover(project.id)}
                              disabled={isSyncing === project.id || !isFullyVerified}
                              className="h-16 px-12 bg-accent text-white rounded-none uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all hover:tracking-[0.2em] flex gap-3"
                            >
                              {isSyncing === project.id ? (
                                <span className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" /> Synchronizing...</span>
                              ) : (
                                <><Handshake className="h-5 w-5" /> Authorize Final Handover</>
                              )}
                            </Button>
                          </div>
                        )}
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
                No commissions currently prioritized for handover synchronization
              </p>
              <p className="text-[11px] text-accent/40 uppercase tracking-widest font-bold">
                Projects reach this phase when site implementation velocity exceeds 85%
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-none h-14 px-10 uppercase tracking-widest text-[11px] font-bold shadow-sm border-accent/20 hover:bg-accent hover:text-white transition-all">
              <Link href="/admin/operations/implementation">Monitor Active Deployment</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
