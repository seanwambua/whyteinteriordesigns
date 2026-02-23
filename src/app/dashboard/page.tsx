"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MessageSquare, 
  Clock, 
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  Flag,
  XCircle,
  ArrowRight,
  Wallet,
  Activity,
  Truck,
  HardHat,
  FileCheck,
  Calendar as CalendarIcon,
  Timer,
  Archive,
  History,
  Zap,
  BookOpen,
  ShieldAlert,
  FileText,
  Handshake,
  Scale,
  Building2,
  ExternalLink,
  Loader2,
  PencilRuler,
  X
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ClientSupportDialog } from "@/components/dashboard/client-support-dialog";
import { useWhyteStore, ClientProject, ProjectTask } from "@/store/use-whyte-store";
import { Badge } from "@/components/ui/badge";
import { parse, differenceInDays, isAfter, format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function ClientDashboardPage() {
  const { clientProjects, designers, updateClientProject, financialSteward } = useWhyteStore();
  const [verifiedProjectId, setVerifiedProjectId] = useState<string | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportType, setSupportType] = useState<"project_support" | "complaint" | "termination_request">("project_support");
  const [isMounted, setIsMounted] = useState(false);
  const [isBalanceAlertDismissed, setIsBalanceAlertDismissed] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const storedId = localStorage.getItem("whyte_verified_project_id");
    setVerifiedProjectId(storedId);
  }, []);

  const activeProject = clientProjects.find(p => p.id === verifiedProjectId) 
    || clientProjects.find(p => p.isActivated && !p.isArchived)
    || clientProjects.find(p => p.isArchived);

  // AUTOMATED ONBOARDING INITIALIZATION
  useEffect(() => {
    if (isMounted && !activeProject) {
      router.replace("/dashboard/onboarding");
    }
  }, [isMounted, activeProject, router]);

  if (!isMounted || !activeProject) {
    return (
      <div className="flex flex-col items-center justify-center py-48 space-y-6">
        <Loader2 className="h-10 w-10 text-accent/20 animate-spin" />
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Synchronizing Dossier...</p>
      </div>
    );
  }

  const assignedDesigner = designers.find(d => d.id === activeProject.assignedDesignerId);

  const handleClientAgreeTermination = () => {
    if (!activeProject.termination) return;
    updateClientProject(activeProject.id, {
      termination: {
        ...activeProject.termination,
        clientAgreed: true
      }
    });
    toast({
      title: "Resolution Terms Accepted",
      description: "You have digitally signed the dissolution agreement.",
    });
  };

  const openSupport = (type: "project_support" | "complaint" | "termination_request") => {
    setSupportType(type);
    setIsSupportOpen(true);
  };

  const completedTasksCount = (activeProject.tasks || []).filter(t => t.status === 'Done').length;

  const deadlineStr = activeProject.endDate || format(new Date(), "MMM dd, yyyy");
  const startStr = activeProject.startDate || format(new Date(), "MMM dd, yyyy");
  
  const deadline = parse(deadlineStr, "MMM dd, yyyy", new Date());
  const startDate = parse(startStr, "MMM dd, yyyy", new Date());
  
  const totalDuration = differenceInDays(deadline, startDate);
  const efficiencyRating = (activeProject.isArchived || activeProject.status === 'Terminated')
    ? (activeProject.isExtended ? 88 : 96) 
    : Math.round((completedTasksCount / Math.max(1, activeProject.tasks?.length || 1)) * 100);

  const totalPaid = activeProject.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const dueBalance = activeProject.totalBudget - totalPaid;
  const hasOutstandingBalance = dueBalance > 0;

  if (activeProject.status === 'Termination') {
    const audit = activeProject.termination?.audit;
    const totalAllocated = audit?.allocations.reduce((sum, a) => sum + a.amount, 0) || 0;

    return (
      <div className="max-w-6xl mx-auto space-y-12 font-body pb-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-4">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <span className="text-destructive text-[10px] font-bold uppercase tracking-[0.4em]">Dissolution Protocol Active</span>
          </div>
          <h1 className="text-6xl font-headline italic">Project <span className="not-italic">Conclusion.</span></h1>
          <p className="text-muted-foreground font-light italic">Detailed transparency report & mutual resolution agreement.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <Card className="rounded-none border-destructive/20 bg-white p-10 space-y-10 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Handshake className="h-5 w-5 text-destructive" />
                  <h3 className="text-2xl font-headline italic">Resolution terms</h3>
                </div>
                <p className="text-lg font-light italic leading-relaxed text-accent/80 border-l-2 border-destructive/20 pl-8">
                  "{activeProject.termination?.resolutionTerms || "The studio is currently drafting the final resolution terms. Please check back shortly."}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-destructive/10">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-destructive/60">Management Transparency</h4>
                  <p className="text-sm font-light leading-relaxed text-muted-foreground italic">
                    {activeProject.termination?.projectSummary || "Calculating work-to-date site protocols..."}
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-destructive/60">Financial Transparency</h4>
                  <p className="text-sm font-light leading-relaxed text-muted-foreground italic">
                    {activeProject.termination?.financialSummary || "Auditing procurement and site mobilization costs..."}
                  </p>
                </div>
              </div>
            </Card>

            {audit && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="rounded-none border-accent/10 bg-black text-white p-10 space-y-10 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Scale className="h-40 w-40" /></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <FileCheck className="h-5 w-5 text-green-400" />
                        <h3 className="text-2xl font-headline italic">Audited Financial Statement</h3>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Verified by {financialSteward}</p>
                    </div>
                    <Button asChild variant="outline" className="rounded-none border-white/20 text-white hover:bg-white hover:text-black h-12 uppercase tracking-widest text-[9px]">
                      <Link href={`/transparency/${activeProject.id}`} target="_blank" className="flex gap-2">View Full Dossier <ExternalLink className="h-3 w-3" /></Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10 border-t border-white/10 relative z-10">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-white/40">Cumulative Funds</p>
                      <p className="text-2xl font-headline italic text-green-400">KES {audit.totalReceived.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-white/40">Verified Site Costs</p>
                      <p className="text-2xl font-headline italic text-orange-400">KES {totalAllocated.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-white/40">Authorized Refund</p>
                      <p className="text-2xl font-headline italic">KES {audit.refundAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border-l-2 border-white/20 italic text-sm text-white/70 relative z-10">
                    "{audit.stewardComments}"
                  </div>
                </Card>
              </motion.div>
            )}

            <div className="space-y-8">
              <h2 className="text-2xl font-headline italic flex items-center gap-3">
                <Activity className="h-5 w-5 text-destructive/40" /> Final Workflow Audit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(activeProject.tasks || []).map((task) => (
                  <div key={task.id} className="p-6 border border-destructive/10 bg-white shadow-sm flex flex-col justify-between min-h-[140px] opacity-60">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-bold text-destructive/30 uppercase tracking-widest">{task.id}</span>
                        <Badge variant="ghost" className={`text-[8px] uppercase tracking-widest p-0 h-auto ${task.status === 'Done' ? 'text-green-600' : 'text-destructive'}`}>{task.status}</Badge>
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-widest leading-tight">{task.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="rounded-none border-destructive/20 bg-destructive/5 p-8 space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-destructive">Execution Agreement</h3>
              <div className="space-y-6">
                <div className={cn("p-6 border bg-white flex items-center justify-between", activeProject.termination?.studioAgreed ? "border-green-600/20" : "border-destructive/10")}>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold">Studio Agreement</p>
                    <p className="text-[9px] font-light italic">{activeProject.termination?.studioAgreed ? "Authorized" : "Pending"}</p>
                  </div>
                  {activeProject.termination?.studioAgreed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                </div>
                <div className={cn("p-6 border bg-white flex items-center justify-between", activeProject.termination?.clientAgreed ? "border-green-600/20" : "border-destructive/10")}>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold">Client Agreement</p>
                    <p className="text-[9px] font-light italic">{activeProject.termination?.clientAgreed ? "Signed" : "Signature Required"}</p>
                  </div>
                  {activeProject.termination?.clientAgreed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                </div>

                <Button 
                  onClick={handleClientAgreeTermination}
                  disabled={activeProject.termination?.clientAgreed || !activeProject.termination?.resolutionTerms}
                  className="w-full h-16 bg-destructive text-white hover:bg-destructive/90 rounded-none uppercase tracking-widest text-[10px] font-bold shadow-2xl"
                >
                  {activeProject.termination?.clientAgreed ? "Agreement Signed" : "Accept Resolution Terms"}
                </Button>
              </div>
            </Card>

            <Card className="rounded-none border-destructive/10 bg-white p-8 space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-destructive/40">Financial Record</h4>
              <div className="space-y-4">
                {activeProject.installments.map((ins, i) => (
                  <div key={i} className={`p-4 border ${ins.status === 'Paid' ? 'border-green-600/10 bg-green-600/[0.02]' : 'border-destructive/10'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{ins.label}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${ins.status === 'Paid' ? 'text-green-600' : 'text-destructive/40'}`}>{ins.status}</span>
                    </div>
                    <p className="text-sm font-bold tracking-widest">KES {ins.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        <ClientSupportDialog isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} projectId={activeProject.id} defaultType="termination_request" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
            {(activeProject.isArchived || activeProject.status === 'Terminated') ? "Commission Archive" : "Client Workspace"}
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-headline">
              {(activeProject.isArchived || activeProject.status === 'Terminated') ? "The Historical Record." : "The Evolution."}
            </h1>
            <p className="text-muted-foreground font-light italic">
              {(activeProject.isArchived || activeProject.status === 'Terminated') 
                ? "Archived Architectural Dossier — Nairobi Studio HQ" 
                : "Synchronized with Nairobi Studio HQ"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
            <span className="text-lg font-headline italic text-accent">{activeProject.tier} Commission</span>
            <div className="flex flex-col items-end gap-2 mt-2">
              <Badge variant="outline" className={`rounded-none uppercase tracking-widest text-[8px] border-accent/20 text-accent/60`}>
                Phase: {activeProject.status}
              </Badge>
              {(activeProject.isArchived || activeProject.status === 'Terminated') && (
                <Badge className="bg-black text-white rounded-none uppercase tracking-widest text-[8px] py-1 px-3 flex gap-2">
                  <Archive className="h-3 w-3" /> Historical Archive
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {hasOutstandingBalance && !isBalanceAlertDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="overflow-hidden"
          >
            <Alert className="rounded-none border-orange-500/20 bg-orange-500/[0.03] p-8 shadow-xl relative group">
              <button 
                onClick={() => setIsBalanceAlertDismissed(true)}
                className="absolute top-4 right-4 p-2 text-orange-600/40 hover:text-orange-600 transition-colors"
                title="Dismiss Protocol"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start">
                <Wallet className="h-6 w-6 text-orange-600 shrink-0" />
                <div className="ml-4 space-y-2 pr-8">
                  <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-orange-600">Pending Capital Commitment Identified</AlertTitle>
                  <AlertDescription className="text-sm font-light italic text-orange-600/80 leading-relaxed">
                    Our registry indicates an outstanding balance of **KES {dueBalance.toLocaleString()}**. 
                    Please coordinate with your Financial Lead to synchronize final settlements and unlock the handover audit.
                  </AlertDescription>
                  <Button 
                    variant="link" 
                    onClick={() => setIsBalanceAlertDismissed(true)}
                    className="text-[10px] uppercase font-bold tracking-widest text-orange-600/60 hover:text-orange-600 p-0 h-auto"
                  >
                    Dismiss Protocol
                  </Button>
                </div>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {(activeProject.isArchived || activeProject.status === 'Terminated') && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Card className="rounded-none border-black/10 bg-black p-8 text-white flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Efficiency Rating</p>
              <p className="text-5xl font-headline italic">{efficiencyRating}%</p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/10">
              <p className="text-[9px] uppercase tracking-widest text-white/40">Studio Performance Index</p>
            </div>
          </Card>

          <Card className="rounded-none border-accent/10 bg-white p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent/40">Handover Lifecycle</p>
              <p className="text-4xl font-headline italic">{totalDuration} Days</p>
            </div>
            <div className="pt-6 mt-6 border-t border-accent/5">
              <p className="text-[9px] uppercase tracking-widest text-accent/40">{activeProject.startDate} — {activeProject.endDate}</p>
            </div>
          </Card>

          <Card className="rounded-none border-accent/10 bg-accent/[0.03] p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent/40">Task Reconciliation</p>
              <p className="text-4xl font-headline italic">{completedTasksCount} Protocol(s)</p>
            </div>
            <div className="pt-6 mt-6 border-t border-accent/5">
              <p className="text-[9px] uppercase tracking-widest text-accent/40">Structural Protocol History</p>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className={cn("rounded-none border-accent/10 shadow-2xl overflow-hidden bg-white", (activeProject.isArchived || activeProject.status === 'Terminated') && "opacity-90")}>
              <div className={cn("h-1.5 w-full", (activeProject.isArchived || activeProject.status === 'Terminated') ? "bg-black" : "bg-accent")} />
              <CardHeader className="p-10 pb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.5em] block mb-2">{activeProject.id}</span>
                    <CardTitle className="text-4xl font-headline italic">{activeProject.project}</CardTitle>
                  </div>
                  <div className="flex gap-3">
                    {activeProject.status === 'Terminated' && (
                      <Badge className="bg-destructive text-white rounded-none uppercase tracking-widest text-[8px] py-1.5 flex gap-2">
                        <XCircle className="h-3 w-3" /> Dissolved Contract
                      </Badge>
                    )}
                    {activeProject.financialReportStatus === 'Verified' && (
                      <Badge className="bg-green-600 text-white rounded-none uppercase tracking-widest text-[8px] py-1.5 flex gap-2">
                        <FileCheck className="h-3 w-3" /> Audit Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2">
                    <BookOpen className="h-3 w-3" /> Architectural Brief
                  </h4>
                  <p className="text-lg font-light italic leading-relaxed text-accent/80 border-l-2 border-accent/10 pl-8">
                    "{activeProject.description || activeProject.workScope || "No brief synchronized for this dossier."}"
                  </p>
                </div>

                {!activeProject.isArchived && activeProject.status !== 'Terminated' && (
                  <div className="space-y-4 pt-6 border-t border-accent/5">
                    <div className="flex justify-between text-[9px] uppercase tracking-[0.4em] font-bold text-accent/60">
                      <span>Implementation Velocity</span>
                      <span>{activeProject.progress}%</span>
                    </div>
                    <Progress value={activeProject.progress} className="h-1 bg-secondary rounded-none" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div className="p-8 bg-secondary/30 border-l-2 border-accent italic">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2 mb-4">
                      <Clock className="h-3 w-3" /> {(activeProject.isArchived || activeProject.status === 'Terminated') ? "Archival Sync" : "Latest Site Entry"}
                    </h4>
                    <p className="text-sm font-light leading-relaxed text-accent/80">
                      "{activeProject.lastActivity || 'Architectural synchronization established.'}"
                    </p>
                  </div>

                  <div className={cn("p-8 border-l-2 italic", (activeProject.isArchived || activeProject.status === 'Terminated') ? "bg-secondary/50 border-black" : "bg-accent/5 border-accent")}>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 flex items-center gap-2 mb-4">
                      <Timer className="h-3 w-3" /> Delivery Framework
                    </h4>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                        {(activeProject.isArchived || activeProject.status === 'Terminated') ? "Closed On" : "Estimated Handover"}
                      </p>
                      <p className="text-2xl font-headline font-bold text-accent">
                        {activeProject.endDate || "Pending Schedule"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Activity className="h-4 w-4 text-accent" />
                <h2 className="text-2xl font-headline italic">
                  {(activeProject.isArchived || activeProject.status === 'Terminated') ? "Completed Protocol Index" : "Project Workflow Recap"}
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">{completedTasksCount} Tasks Logged</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeProject.tasks || []).map((task) => (
                <div key={task.id} className="p-6 border border-accent/5 bg-white shadow-sm flex flex-col justify-between min-h-[140px] group transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-bold text-accent/30 uppercase tracking-widest">{task.id}</span>
                      <Badge variant="ghost" className={`text-[8px] uppercase tracking-widest p-0 h-auto ${task.status === 'Done' ? 'text-green-600' : 'text-accent'}`}>{task.status}</Badge>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest leading-tight group-hover:text-accent transition-colors">{task.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className={cn("rounded-none shadow-xl bg-white p-8 space-y-8 transition-all border", hasOutstandingBalance ? "border-orange-500/20 ring-1 ring-orange-500/10" : "border-accent/5")}>
            <div className="text-center space-y-2">
              <h3 className={cn("text-[10px] font-bold uppercase tracking-[0.4em]", hasOutstandingBalance ? "text-orange-600" : "text-accent/40")}>Financial Ledger</h3>
              <p className="text-xs font-light italic text-muted-foreground">Commission Tier: {activeProject.tier}</p>
            </div>
            <div className="space-y-4">
              {activeProject.installments.map((ins, i) => (
                <div key={i} className={`p-4 border ${ins.status === 'Paid' ? 'border-green-600/20 bg-green-600/5' : 'border-orange-500/10 bg-orange-500/[0.02]'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{ins.label}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${ins.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>{ins.status}</span>
                  </div>
                  <p className={cn("text-sm font-bold tracking-widest", ins.status === 'Paid' ? 'text-accent' : 'text-orange-600')}>KES {ins.amount.toLocaleString()}</p>
                  {ins.transactionCode && <p className="text-[8px] uppercase tracking-widest opacity-40 mt-1 font-mono">Ref: {ins.transactionCode}</p>}
                </div>
              ))}
            </div>
            {hasOutstandingBalance && (
              <div className="p-4 bg-orange-600 text-white text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest">Total Due: KES {dueBalance.toLocaleString()}</p>
              </div>
            )}
            {!activeProject.isArchived && activeProject.status !== 'Terminated' && (
              <div className="pt-6 border-t border-accent/5">
                <Button onClick={() => openSupport("project_support")} variant="outline" className="w-full h-14 rounded-none border-accent/20 text-accent hover:bg-accent hover:text-white uppercase tracking-widest text-[9px] font-bold">Raise Studio Inquiry</Button>
              </div>
            )}
          </Card>

          <Card className="rounded-none border-accent/5 bg-secondary/30 p-8 space-y-6">
            <div className="space-y-1">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2">
                <PencilRuler className="h-3 w-3" /> Creative Lead
              </h4>
              <p className="text-lg font-headline italic text-accent">{assignedDesigner ? assignedDesigner.name : "Unassigned"}</p>
            </div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2 pt-4 border-t border-accent/5">
              <HardHat className="h-3 w-3" /> {(activeProject.isArchived || activeProject.status === 'Terminated') ? "Historical Network" : "Active Partner Matrix"}
            </h4>
            <div className="space-y-4">
              {(activeProject.vendorAllocations || []).map((vendor, vIdx) => (
                <div key={vIdx} className="flex items-center justify-between">
                  <div className="space-y-0.5"><p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">{vendor.vendorName}</p><p className="text-[9px] text-muted-foreground italic">{vendor.role}</p></div>
                  <Badge variant="ghost" className="text-[8px] uppercase tracking-widest opacity-40 p-0 h-auto">{vendor.category}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ClientSupportDialog isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} projectId={activeProject.id} defaultType={supportType} />
    </div>
  );
}
