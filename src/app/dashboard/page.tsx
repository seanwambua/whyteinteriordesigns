
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
  X,
  FileEdit,
  PenTool,
  ChevronRight,
  ShieldCheck,
  FileSearch,
  LayoutGrid,
  ChevronDown,
  RotateCcw,
  TrendingUp,
  Key,
  Lock,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { ClientSupportDialog } from "@/components/dashboard/client-support-dialog";
import { useWhyteStore, ClientProject, ProjectTask, ReorganizationDetails } from "@/store/use-whyte-store";
import { Badge } from "@/components/ui/badge";
import { parse, differenceInDays, isAfter, format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientDashboardPage() {
  const { clientProjects, designers, updateClientProject, financialSteward, addInquiry } = useWhyteStore();
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [verifiedProjectId, setVerifiedProjectId] = useState<string | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportType, setSupportType] = useState<"project_support" | "complaint" | "termination_request" | "financial_reorganization">("project_support");
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [isReviewingReorg, setIsReviewingReorg] = useState(false);
  const [isSigningReorg, setIsSigningReorg] = useState(false);
  const [signatureStep, setSignatureStep] = useState<1 | 2>(1);
  const [signatureText, setSignatureText] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const code = localStorage.getItem("whyte_client_access_code");
    setAccessCode(code);
    const storedId = localStorage.getItem("whyte_verified_project_id");
    setVerifiedProjectId(storedId);
  }, []);

  const allMyProjects = useMemo(() => {
    if (!accessCode) return [];
    return clientProjects.filter(p => p.accessCode?.toUpperCase() === accessCode.toUpperCase());
  }, [clientProjects, accessCode]);

  const activeProject = useMemo(() => {
    if (verifiedProjectId) {
      return allMyProjects.find(p => p.id === verifiedProjectId);
    }
    return allMyProjects.find(p => !p.isArchived && p.status !== 'Terminated') || allMyProjects[0];
  }, [allMyProjects, verifiedProjectId]);

  const isLocked = activeProject && !activeProject.isActivated;

  const portfolioStats = useMemo(() => {
    const active = allMyProjects.filter(p => !p.isArchived && p.status !== 'Terminated');
    const totalBudget = active.reduce((sum, p) => sum + p.totalBudget, 0);
    const totalPaid = active.reduce((sum, p) => {
      return sum + p.installments.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
    }, 0);
    const avgProgress = active.length > 0 
      ? Math.round(active.reduce((sum, p) => sum + p.progress, 0) / active.length)
      : 0;
    
    return { totalBudget, totalPaid, avgProgress, count: active.length };
  }, [allMyProjects]);

  const unifiedActivity = useMemo(() => {
    const activities: { id: string, date: string, project: string, content: string }[] = [];
    allMyProjects.forEach(p => {
      if (p.lastActivity) {
        activities.push({
          id: `ACT-${p.id}`,
          date: p.lastActivity.includes('—') ? p.lastActivity.split('—')[0].trim() : "Recent",
          project: p.project,
          content: p.lastActivity
        });
      }
    });
    return activities.slice(0, 5);
  }, [allMyProjects]);

  useEffect(() => {
    if (isMounted && allMyProjects.length === 0 && !accessCode) {
      router.replace("/dashboard/onboarding");
    }
  }, [isMounted, allMyProjects, accessCode, router]);

  if (!isMounted || !activeProject) {
    return (
      <div className="flex flex-col items-center justify-center py-48 space-y-6">
        <Loader2 className="h-10 w-10 text-accent/20 animate-spin" />
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Synchronizing Portfolio...</p>
      </div>
    );
  }

  const assignedDesigner = designers.find(d => d.id === activeProject.assignedDesignerId);

  const handleSwitchProject = (id: string) => {
    localStorage.setItem("whyte_verified_project_id", id);
    setVerifiedProjectId(id);
    toast({ title: "Workspace Context Shifted", description: `Synchronizing protocols for Dossier ${id}.` });
  };

  const handleAgreeToReorg = () => {
    if (!activeProject.reorganization || signatureText !== "AUTHORIZE") return;
    setIsSigningReorg(true);
    setTimeout(() => {
      updateClientProject(activeProject.id, {
        reorganization: {
          ...activeProject.reorganization!,
          clientAgreed: true
        },
        lastActivity: "Financing Protocol: Client Authorized Custom Payout Terms"
      });
      setIsReviewingReorg(false);
      setIsSigningReorg(false);
      setSignatureStep(1);
      setSignatureText("");
      toast({ title: "Terms Authorized", description: "Agreement transmitted to Financial Steward for witnessing." });
    }, 1500);
  };

  const openSupport = (type: "project_support" | "complaint" | "termination_request" | "financial_reorganization") => {
    setSupportType(type);
    setIsSupportOpen(true);
  };

  const currentTotalPaid = activeProject.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const currentDueBalance = activeProject.totalBudget - currentTotalPaid;
  const isOverpaid = currentDueBalance < -1;

  const isReorgPending = activeProject.reorganization?.status === 'Pending_Agreement' && !activeProject.reorganization.clientAgreed;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 font-body relative">
      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <Card className="max-w-md w-full rounded-none border-accent/20 shadow-2xl bg-white p-12 space-y-10 text-center">
              <div className="h-20 w-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping opacity-20" />
                <Lock className="h-10 w-10 text-accent" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-headline italic leading-tight">Dossier Locked.</h2>
                <p className="text-muted-foreground font-light italic text-sm leading-relaxed">
                  Your architectural workspace is restricted. Access is unlocked upon forensic certification of your initial commissioning deposit.
                </p>
              </div>
              
              {activeProject.reorganization?.status === 'Requested' ? (
                <div className="p-6 bg-orange-50 border border-orange-100 space-y-4">
                  <div className="flex items-center justify-center gap-3 text-orange-600">
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Financing Review in Progress</span>
                  </div>
                  <p className="text-[11px] text-orange-700/70 italic font-light leading-relaxed">
                    The studio is calibrating your custom payout schedule. Review and authorization will be required before activation.
                  </p>
                </div>
              ) : activeProject.reorganization?.status === 'Pending_Agreement' && !activeProject.reorganization.clientAgreed ? (
                <div className="p-6 bg-orange-50 border border-orange-100 space-y-6">
                  <div className="flex items-center justify-center gap-3 text-orange-600">
                    <PenTool className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Your Authorization</span>
                  </div>
                  <p className="text-[11px] text-orange-700/70 italic font-light leading-relaxed">
                    The studio has proposed updated financing terms. Forensic review and digital authorization are mandatory to proceed with activation.
                  </p>
                  <Button onClick={() => { setSignatureStep(1); setIsReviewingReorg(true); }} className="w-full bg-orange-600 text-white rounded-none h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg border-none transition-none shadow-none">
                    Review & Authorize Terms
                  </Button>
                </div>
              ) : activeProject.pendingActivationData ? (
                <div className="p-6 bg-accent/[0.02] border border-accent/10 space-y-2">
                  <div className="flex items-center justify-center gap-3 text-accent">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Forensic Sync</span>
                  </div>
                  <p className="text-[11px] text-accent/40 italic font-light">
                    Receipt details transmitted to Financial Steward for verification.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Next Protocol Step</p>
                  <Button asChild variant="outline" className="w-full rounded-none h-14 border-accent/10 text-accent uppercase tracking-widest text-[10px] font-bold shadow-sm transition-none">
                    <Link href="/dashboard/onboarding">Complete Activation Protocol</Link>
                  </Button>
                </div>
              )}
              
              <div className="pt-6 border-t border-accent/5">
                <Button asChild variant="ghost" className="text-accent/40 hover:text-accent uppercase tracking-widest text-[9px] font-bold transition-none shadow-none">
                  <Link href="/">Return to Site</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Portfolio Command Center</span>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-6xl font-headline italic leading-none">The <span className="not-italic">Workspace.</span></h1>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="rounded-none border-accent/10 text-accent/40 uppercase tracking-widest text-[9px] px-3 py-1 flex gap-2">
                  <Key className="h-3 w-3" /> {accessCode}
                </Badge>
                {allMyProjects.length > 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-10 px-6 rounded-none border-accent/10 text-accent font-bold uppercase tracking-widest text-[9px] flex gap-3 shadow-sm bg-white transition-none">
                        <LayoutGrid className="h-3.5 w-3.5" /> 
                        Switch Dossier 
                        <ChevronDown className="h-3 w-3 opacity-40" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="rounded-none border-accent/10 w-80 p-2 shadow-2xl">
                      <DropdownMenuLabel className="text-[9px] uppercase tracking-widest text-accent/40 mb-2 px-3">Active Commissions</DropdownMenuLabel>
                      {allMyProjects.filter(p => !p.isArchived).map(p => (
                        <DropdownMenuItem 
                          key={p.id} 
                          onClick={() => handleSwitchProject(p.id)}
                          className={cn(
                            "flex flex-col items-start gap-1 p-4 cursor-pointer mb-1 rounded-none transition-none",
                            p.id === activeProject.id ? "bg-accent text-white" : "hover:bg-accent/5"
                          )}
                        >
                          <span className={cn("text-[9px] font-bold uppercase tracking-widest", p.id === activeProject.id ? "text-white/60" : "text-accent/40")}>{p.id}</span>
                          <span className="text-sm font-headline italic">{p.project}</span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="bg-accent/5" />
                      <DropdownMenuLabel className="text-[9px] uppercase tracking-widest text-accent/40 mb-2 px-3">Historical Dossiers</DropdownMenuLabel>
                      {allMyProjects.filter(p => p.isArchived).map(p => (
                        <DropdownMenuItem 
                          key={p.id} 
                          onClick={() => handleSwitchProject(p.id)}
                          className="flex flex-col items-start gap-1 p-4 cursor-pointer mb-1 hover:bg-accent/5 rounded-none opacity-60 transition-none"
                        >
                          <span className={cn("text-[9px] font-bold uppercase tracking-widest text-accent/40")}>{p.id}</span>
                          <span className="text-sm font-headline italic">{p.project}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8 border border-accent/5 bg-white shadow-2xl">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Portfolio Value</p>
              <p className="text-xl font-headline italic text-accent">KES {portfolioStats.totalBudget.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Implementation</p>
              <p className="text-xl font-headline italic text-green-600">{portfolioStats.avgProgress}% Velocity</p>
            </div>
            <div className="space-y-1 hidden md:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Commissions</p>
              <p className="text-xl font-headline italic text-accent">{portfolioStats.count} Authorized</p>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isReorgPending && (
          <motion.div key="reorg" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Alert className="rounded-none border-orange-500/20 bg-orange-50 p-10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5"><FileEdit className="h-32 w-32" /></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><PenTool className="h-6 w-6 text-orange-600" /><h3 className="text-2xl font-headline italic text-orange-600">Financing Protocol Review Required</h3></div>
                  <p className="text-base font-light italic text-orange-600/80 leading-relaxed max-w-2xl">A new custom payout plan has been proposed for **{activeProject.project}**. Review and digital authorization are required.</p>
                </div>
                <Button onClick={() => { setSignatureStep(1); setIsReviewingReorg(true); }} className="bg-orange-600 text-white rounded-none h-16 px-12 uppercase tracking-widest text-[11px] font-bold shadow-xl flex gap-3 border-none transition-none shadow-none"><FileSearch className="h-4 w-4" /> Review Terms</Button>
              </div>
            </Alert>
          </motion.div>
        )}

        {activeProject.status === 'Termination' && (
          <motion.div key="termination" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Alert className="rounded-none border-destructive/20 bg-destructive/[0.02] p-10 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><ShieldAlert className="h-6 w-6 text-destructive" /><h3 className="text-2xl font-headline italic text-destructive">Dissolution Protocol Active</h3></div>
                  <p className="text-base font-light italic text-destructive/80 leading-relaxed max-w-2xl">Forensic verification and mutual resolution terms are being synchronized for the termination of **{activeProject.project}**.</p>
                </div>
                <Button onClick={() => openSupport("termination_request")} variant="outline" className="border-destructive text-destructive rounded-none h-16 px-12 uppercase tracking-widest text-[11px] font-bold shadow-xl transition-none shadow-none">View Exit Dossier</Button>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <Card className={cn(
            "rounded-none border-accent/10 shadow-2xl overflow-hidden bg-white",
            (activeProject.isArchived || activeProject.status === 'Terminated') && "opacity-90"
          )}>
            <div className={cn("h-1.5 w-full", (activeProject.isArchived || activeProject.status === 'Terminated') ? "bg-black" : "bg-accent")} />
            <CardHeader className="p-10 pb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.5em] block mb-2">{activeProject.id}</span>
                  <CardTitle className="text-4xl font-headline italic">{activeProject.project}</CardTitle>
                </div>
                <div className="flex gap-3">
                  {activeProject.status === 'Terminated' && <Badge className="bg-destructive text-white rounded-none uppercase tracking-widest text-[8px] py-1.5 flex gap-2"><XCircle className="h-3 w-3" /> Dissolved Contract</Badge>}
                  {activeProject.financialReportStatus === 'Verified' && <Badge className="bg-green-600 text-white rounded-none uppercase tracking-widest text-[8px] py-1.5 flex gap-2"><FileCheck className="h-3 w-3" /> Audit Verified</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-10">
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2"><BookOpen className="h-3 w-3" /> Architectural Brief</h4>
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
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2 mb-4"><Clock className="h-3 w-3" /> Latest Site Entry</h4>
                  <p className="text-sm font-light leading-relaxed text-accent/80">"{activeProject.lastActivity || 'Architectural synchronization established.'}"</p>
                </div>
                <div className={cn("p-8 border-l-2 italic", (activeProject.isArchived || activeProject.status === 'Terminated') ? "bg-secondary/50 border-black" : "bg-accent/5 border-accent")}>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 flex items-center gap-2 mb-4"><Timer className="h-3 w-3" /> Delivery Framework</h4>
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">{(activeProject.isArchived || activeProject.status === 'Terminated') ? "Closed On" : "Estimated Handover"}</p>
                    <p className="text-2xl font-headline font-bold text-accent">{activeProject.endDate || "Pending Schedule"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Zap className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-headline italic">Consolidated Site Feed</h2>
            </div>
            <div className="space-y-4">
              {unifiedActivity.map((act) => (
                <div key={act.id} className="p-6 border border-accent/5 bg-white shadow-sm flex items-center justify-between group hover:border-accent/20 transition-all cursor-pointer">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-accent/40">{act.project}</span>
                      <div className="h-1 w-1 bg-accent/10 rounded-full" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{act.date}</span>
                    </div>
                    <p className="text-base font-light italic text-accent/80 leading-relaxed">"{act.content}"</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-accent/20 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <Card className="rounded-none shadow-2xl bg-white p-8 space-y-10 border border-accent/5">
            <div className="text-center space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Financial Dossier</h3>
              <p className="text-xs font-light italic text-muted-foreground">{activeProject.project} — {activeProject.tier}</p>
            </div>
            <div className="space-y-4">
              {activeProject.installments.map((ins, i) => {
                const isReimbursement = ins.type === 'Reimbursement';
                const isClaim = ins.type === 'Studio_Claim';
                
                return (
                  <div key={i} className={cn(
                    "p-4 border transition-all",
                    isReimbursement ? "border-blue-200 bg-blue-50/30" :
                    isClaim ? "border-orange-200 bg-orange-50/30" :
                    ins.status === 'Paid' ? "border-green-600/20 bg-green-600/5" : "border-orange-500/10 bg-orange-500/[0.02]"
                  )}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{ins.label}</span>
                        {isReimbursement && <Badge variant="outline" className="rounded-none text-[7px] h-3.5 px-1 bg-blue-100 border-blue-200 text-blue-700 font-bold uppercase tracking-widest">Credit Return</Badge>}
                        {isClaim && <Badge variant="outline" className="rounded-none text-[7px] h-3.5 px-1 bg-orange-100 border-orange-200 text-orange-700 font-bold uppercase tracking-widest">Studio Claim</Badge>}
                      </div>
                      <span className={cn(
                        "text-[8px] font-bold uppercase tracking-widest",
                        ins.status === 'Paid' ? "text-green-600" : "text-orange-600"
                      )}>
                        {ins.status}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm font-bold tracking-widest", 
                      isReimbursement ? "text-blue-700" :
                      isClaim ? "text-orange-700" :
                      ins.status === 'Paid' ? "text-accent" : "text-orange-600"
                    )}>
                      {isReimbursement ? "-" : isClaim ? "+" : ""} KES {Math.abs(ins.amount).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
            {isOverpaid ? (
              <div className="p-4 bg-green-600 text-white text-center shadow-lg">
                <p className="text-[10px] font-bold uppercase tracking-widest">Surplus Balance: KES {Math.abs(currentDueBalance).toLocaleString()}</p>
              </div>
            ) : currentDueBalance > 0 && (
              <div className="p-4 bg-orange-600 text-white text-center shadow-lg">
                <p className="text-[10px] font-bold uppercase tracking-widest">Net Balance: KES {currentDueBalance.toLocaleString()}</p>
              </div>
            )}
            {!activeProject.isArchived && activeProject.status !== 'Terminated' && (
              <div className="pt-6 border-t border-accent/5 space-y-4">
                <Button onClick={() => openSupport("project_support")} variant="outline" className="w-full h-14 rounded-none border-accent/20 text-accent uppercase tracking-widest text-[9px] font-bold transition-none shadow-none bg-transparent">Raise Studio Inquiry</Button>
              </div>
            )}
          </Card>

          {allMyProjects.length > 1 && (
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2"><LayoutGrid className="h-3" /> Portfolio Matrix</h4>
              <div className="space-y-3">
                {allMyProjects.map(p => (
                  <div key={p.id} onClick={() => handleSwitchProject(p.id)} className={cn(
                    "p-4 border cursor-pointer flex flex-col gap-2 transition-all",
                    p.id === activeProject.id ? "bg-accent/[0.03] border-accent/20 shadow-inner" : "bg-white border-accent/5 hover:border-accent/10"
                  )}>
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">{p.id}</span>
                      <Badge variant="ghost" className="p-0 text-[8px] uppercase tracking-widest text-accent/60">{p.status}</Badge>
                    </div>
                    <p className="text-sm font-headline italic text-accent/80 truncate">{p.project}</p>
                    <div className="flex items-center gap-3">
                      <Progress value={p.progress} className="h-0.5 bg-accent/5 flex-1" />
                      <span className="text-[8px] font-bold text-accent/40">{p.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Card className="rounded-none border-accent/5 bg-secondary/30 p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2"><PencilRuler className="h-3 w-3" /> Creative Lead</h4>
              <p className="text-lg font-headline italic text-accent">{assignedDesigner ? assignedDesigner.name : "Unassigned"}</p>
            </div>
            <div className="pt-4 border-t border-accent/5 space-y-1">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2"><Building2 className="h-3 w-3" /> Audit Entity</h4>
              <p className="text-[13px] font-bold uppercase tracking-widest text-accent/60">{financialSteward}</p>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isReviewingReorg} onOpenChange={setIsReviewingReorg}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-3xl p-0 overflow-hidden bg-white max-h-[90vh] flex flex-col shadow-2xl">
          <div className="bg-orange-600 h-1.5 w-full" />
          <div className="p-12 space-y-10 overflow-y-auto custom-scrollbar flex-1">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><FileEdit className="h-5 w-5 text-orange-600" /><span className="text-orange-600 text-[12px] font-bold uppercase tracking-[0.4em]">Financing Protocol Agreement</span></div>
              <DialogTitle className="text-4xl font-headline italic">Review Custom Payout Terms</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">Please review the proposed architectural financing reorganization for **{activeProject.project}**.</DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {signatureStep === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="p-10 bg-secondary/30 border border-accent/5 space-y-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Agreement Rationale</h4>
                    <p className="text-lg font-light italic leading-relaxed text-accent/80 border-l-2 border-accent/20 pl-8">"{activeProject.reorganization?.terms}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeProject.reorganization?.studioClaim && (
                      <div className="p-10 border border-orange-500/20 bg-orange-50/30 space-y-6">
                        <div className="flex items-center gap-4">
                          <TrendingUp className="h-5 w-5 text-orange-600" />
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-600">Studio Claim</h4>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-orange-500/10">
                          <p className="text-base font-light italic text-accent/80">"{activeProject.reorganization.studioClaim.rationale}"</p>
                          <p className="text-2xl font-headline italic text-orange-600">+ KES {activeProject.reorganization.studioClaim.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {activeProject.reorganization?.reimbursement && (
                      <div className="p-10 border border-accent/10 bg-accent/[0.02] space-y-6">
                        <div className="flex items-center gap-4">
                          <RotateCcw className="h-5 w-5 text-accent" />
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Reimbursement</h4>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-accent/10">
                          <p className="text-base font-light italic text-accent/80">"{activeProject.reorganization.reimbursement.rationale}"</p>
                          <p className="text-2xl font-headline italic text-accent">- KES {activeProject.reorganization.reimbursement.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Proposed Installment Schedule</h4>
                    <div className="divide-y divide-accent/5 border border-accent/5 bg-white shadow-sm">
                      {activeProject.reorganization?.proposedInstallments.map((ins, i) => (
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
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 py-12">
                  <div className="text-center space-y-6">
                    <div className="h-20 w-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/10">
                      <PenTool className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="text-3xl font-headline italic">Digital Authorization</h3>
                    <p className="text-muted-foreground font-light text-base italic max-w-sm mx-auto leading-relaxed">By authorizing, you agree to the updated capital commitment and payout terms for your architectural commission.</p>
                  </div>
                  
                  <div className="max-w-md mx-auto space-y-6 p-10 bg-secondary/20 border border-accent/5">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/60 block text-center">Type "AUTHORIZE" to digitally sign</Label>
                      <Input 
                        value={signatureText}
                        onChange={(e) => setSignatureText(e.target.value.toUpperCase())}
                        placeholder="AUTHORIZE"
                        className="rounded-none h-16 text-2xl font-headline italic tracking-[0.2em] text-center border-accent/20 focus:ring-accent uppercase shadow-none transition-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <DialogFooter className="p-12 border-t border-accent/5 bg-secondary/5 flex justify-between gap-6">
            <Button onClick={() => { setIsReviewingReorg(false); setSignatureStep(1); }} variant="ghost" className="rounded-none h-16 px-8 text-[11px] font-bold uppercase tracking-widest transition-none border-none shadow-none bg-transparent">Abort Protocol Sync</Button>
            
            {signatureStep === 1 ? (
              <Button onClick={() => setSignatureStep(2)} className="bg-orange-600 text-white rounded-none h-16 px-16 uppercase tracking-widest text-[11px] font-bold shadow-2xl transition-none flex gap-4 border-none">
                Continue to Authorization <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleAgreeToReorg} disabled={isSigningReorg || signatureText !== "AUTHORIZE"} className="bg-accent text-white rounded-none h-16 px-16 uppercase tracking-widest text-[11px] font-bold shadow-2xl transition-none flex gap-4 border-none">
                {isSigningReorg ? <><Loader2 className="h-5 w-5 animate-spin" /> Authorizing...</> : <><ShieldCheck className="h-5 w-5" /> Sign & Sync Ledger</>}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClientSupportDialog isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} projectId={activeProject.id} defaultType={supportType} />
    </div>
  );
}
