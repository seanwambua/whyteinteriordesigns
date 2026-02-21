
"use client";

import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, ProjectTask, SubTask, Milestone } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  User, 
  Plus, 
  Activity,
  Wallet,
  Layout,
  Users,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
  Building2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Calendar as CalendarIcon,
  Timer,
  AlertTriangle,
  RefreshCcw,
  Trash2,
  CheckCircle2,
  Circle,
  Zap,
  BookOpen,
  Archive,
  Banknote,
  XCircle,
  ShieldAlert,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { format, differenceInDays, parse, isAfter } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ProjectMasterTerminal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [isExtending, setIsExtending] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(new Date());

  // Termination Agreement State
  const [resTerms, setResTerms] = useState("");
  const [finSum, setFinSum] = useState("");
  const [projSum, setProjSum] = useState("");

  // Payment Verification State
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verifyingIdx, setVerifyingIdx] = useState<number | null>(null);
  const [transactionCode, setTransactionCode] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const project = clientProjects.find((p) => p.id === id);

  useEffect(() => {
    if (project?.termination) {
      setResTerms(project.termination.resolutionTerms || "");
      setFinSum(project.termination.financialSummary || "");
      setProjSum(project.termination.projectSummary || "");
    }
  }, [project]);

  if (!isMounted) return null;
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <h2 className="text-3xl font-headline italic">Commission Not Found</h2>
        <Button asChild variant="outline" className="rounded-none px-8">
          <Link href="/admin/clients">Return to Directory</Link>
        </Button>
      </div>
    );
  }

  // --- TEMPORAL LOGIC ---
  const deadlineStr = project.endDate || format(new Date(), "MMM dd, yyyy");
  const startStr = project.startDate || format(new Date(), "MMM dd, yyyy");
  const deadline = parse(deadlineStr, "MMM dd, yyyy", new Date());
  const startDate = parse(startStr, "MMM dd, yyyy", new Date());
  const today = new Date();
  
  const daysRemaining = differenceInDays(deadline, today);
  const totalDuration = differenceInDays(deadline, startDate);
  const isOverdue = isAfter(today, deadline);

  const efficiencyRating = (project.isArchived || project.status === 'Terminated')
    ? (project.isExtended ? 88 : 96) 
    : 0;

  // --- HANDLERS ---

  const handleUpdateStatus = (status: ClientProject['status']) => {
    const updates: Partial<ClientProject> = { status };
    
    if (status === 'Termination' && !project.termination) {
      updates.termination = {
        reason: "Manual Studio Override",
        requestedBy: "Studio",
        requestedDate: format(new Date(), "MMM dd, yyyy"),
        financialSummary: "Awaiting Studio Audit",
        projectSummary: "Awaiting Site Protocol Audit",
        studioAgreed: false,
        clientAgreed: false
      };
    }

    updateClientProject(project.id, { 
      ...updates,
      lastActivity: `Lifecycle transitioned manually to ${status}.`
    });
    toast({
      title: "Lifecycle Updated",
      description: `Commission moved to ${status} phase.`,
    });
  };

  const handleSaveTerminationDetails = () => {
    if (!project.termination) return;
    updateClientProject(project.id, {
      termination: {
        ...project.termination,
        financialSummary: finSum,
        projectSummary: projSum,
        resolutionTerms: resTerms
      }
    });
    toast({
      title: "Dissolution Dossier Updated",
      description: "Transparency summaries have been synchronized.",
    });
  };

  const handleStudioAgreeTermination = () => {
    if (!project.termination) return;
    updateClientProject(project.id, {
      termination: {
        ...project.termination,
        studioAgreed: true
      }
    });
    toast({
      title: "Studio Resolution Signed",
      description: "Handover terms authorized by Studio Steward.",
    });
  };

  const handleFinalizeTermination = () => {
    updateClientProject(project.id, {
      status: 'Terminated',
      isArchived: true,
      lastActivity: "Commission Dissolved - Final Resolution Executed"
    });
    toast({
      title: "Commission Terminated",
      description: "Dossier transitioned to Permanent Archives.",
    });
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: ProjectTask['status']) => {
    const updatedTasks = (project.tasks || []).map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    
    recalculateVelocity(updatedTasks, `Task "${updatedTasks.find(t => t.id === taskId)?.title}" synchronized to ${newStatus}.`);
  };

  const handleToggleSubtask = (taskId: string, subId: string) => {
    const updatedTasks = (project.tasks || []).map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = (t.subtasks || []).map(s => 
          s.id === subId ? { ...s, isCompleted: !s.isCompleted } : s
        );
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    });
    
    recalculateVelocity(updatedTasks, "Sub-task protocol updated.");
  };

  const recalculateVelocity = (updatedTasks: ProjectTask[], activity: string) => {
    const done = updatedTasks.filter(t => t.status === 'Done').length;
    const total = updatedTasks.length;
    const velocity = total > 0 ? Math.round((done / total) * 100) : project.progress;

    updateClientProject(project.id, { 
      tasks: updatedTasks,
      progress: velocity,
      lastActivity: activity
    });
  };

  const handleToggleInstallment = (idx: number) => {
    const ins = project.installments[idx];
    if (ins.status === 'Paid') {
      const updated = [...project.installments];
      updated[idx] = { ...updated[idx], status: 'Pending', transactionCode: undefined };
      updateClientProject(project.id, { 
        installments: updated,
        lastActivity: `Financial Entry Revoked: ${ins.label}`
      });
    } else {
      setVerifyingIdx(idx);
      setTransactionCode("");
      setIsVerifyingPayment(true);
    }
  };

  const confirmVerification = () => {
    if (verifyingIdx === null || !transactionCode) return;
    const updated = [...project.installments];
    updated[verifyingIdx] = { 
      ...updated[verifyingIdx], 
      status: 'Paid', 
      transactionCode: transactionCode 
    };
    updateClientProject(project.id, { 
      installments: updated,
      lastActivity: `Payment Verified: ${updated[verifyingIdx].label}`
    });
    setIsVerifyingPayment(false);
    setVerifyingIdx(null);
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const KanbanCol = ({ status, title, color }: { status: ProjectTask['status'], title: string, color: string }) => {
    const tasks = (project.tasks || []).filter(t => t.status === status);
    return (
      <div className="flex-1 min-w-[320px] bg-secondary/5 border border-accent/5 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/60">{title}</h3>
          </div>
          <Badge variant="outline" className="rounded-none text-[9px] border-accent/10 opacity-40">{tasks.length}</Badge>
        </div>
        <div className="space-y-4">
          {tasks.map(task => {
            const isExpanded = expandedTasks.includes(task.id);
            const completedSubs = task.subtasks?.filter(s => s.isCompleted).length || 0;
            const totalSubs = task.subtasks?.length || 0;
            const subProgress = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0;

            return (
              <div key={task.id} className="bg-white border border-accent/5 shadow-md p-6 space-y-4 group">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-accent/30 uppercase tracking-widest">{task.id}</span>
                    <h4 className="text-sm font-bold uppercase tracking-widest leading-tight group-hover:text-accent transition-colors">{task.title}</h4>
                  </div>
                  <Badge variant="ghost" className="text-[8px] uppercase tracking-widest opacity-40 p-0 h-auto">{task.priority}</Badge>
                </div>

                {totalSubs > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] uppercase tracking-widest text-accent/40 font-bold">
                      <span>Protocols</span>
                      <span>{completedSubs}/{totalSubs}</span>
                    </div>
                    <Progress value={subProgress} className="h-0.5 bg-secondary" />
                  </div>
                )}

                {project.status !== 'Terminated' && project.status !== 'Termination' && (
                  <div className="flex items-center justify-between pt-4 border-t border-accent/5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="h-6 text-[8px] uppercase tracking-widest font-bold text-accent/40 p-0 hover:bg-transparent hover:text-accent"
                    >
                      {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                      {isExpanded ? "Hide Details" : "Manage Protocols"}
                    </Button>
                    
                    <div className="flex gap-2">
                      {status !== 'Todo' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-accent/40" onClick={() => handleUpdateTaskStatus(task.id, status === 'Done' ? 'In Progress' : 'Todo')}>
                          <ChevronRight className="h-4 w-4 rotate-180" />
                        </Button>
                      )}
                      {status !== 'Done' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-accent/40" onClick={() => handleUpdateTaskStatus(task.id, status === 'Todo' ? 'In Progress' : 'Done')}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {isExpanded && project.status !== 'Terminated' && project.status !== 'Termination' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-4 pt-4 border-t border-accent/5 border-dashed"
                    >
                      <div className="space-y-3">
                        {task.subtasks?.map(sub => (
                          <div key={sub.id} className="flex items-center gap-3 group/sub">
                            <Checkbox 
                              id={sub.id} 
                              checked={sub.isCompleted} 
                              onCheckedChange={() => handleToggleSubtask(task.id, sub.id)}
                              className="rounded-none border-accent/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                            />
                            <Label 
                              htmlFor={sub.id} 
                              className={`text-[11px] font-light italic transition-all ${sub.isCompleted ? 'line-through opacity-40' : 'text-accent/80'}`}
                            >
                              {sub.title}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-body">
      {/* Header Cockpit */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Button asChild variant="ghost" className="text-accent/40 hover:text-accent p-0 font-bold uppercase tracking-widest text-[9px] h-auto flex items-center gap-2">
          <Link href="/admin/clients"><ArrowLeft className="h-3 w-3" /> Back to Registry</Link>
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Project Terminal</span>
            </div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex items-center gap-6 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2"><User className="h-3.5 w-3.5 opacity-40" /> {project.name}</span>
              <div className="h-1 w-1 bg-accent/20 rounded-full" />
              <span className="opacity-40">{project.id}</span>
              {(project.isArchived || project.status === 'Terminated') && (
                <>
                  <div className="h-1 w-1 bg-black rounded-full" />
                  <span className="text-black flex items-center gap-2"><Archive className="h-3 w-3" /> Archived Dossier</span>
                </>
              )}
            </div>
          </div>

          {!project.isArchived && project.status !== 'Terminated' ? (
            <div className="flex flex-wrap items-center gap-4 bg-white p-6 border border-accent/5 shadow-2xl">
              <div className="space-y-1 pr-8 border-r border-accent/10">
                <Label className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40">Phase Lifecycle</Label>
                <Select value={project.status} onValueChange={(v: any) => handleUpdateStatus(v)}>
                  <SelectTrigger className="rounded-none border-none h-8 p-0 text-xs font-bold uppercase tracking-widest text-accent focus:ring-0 w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Execution">Execution</SelectItem>
                    <SelectItem value="Completion">Completion</SelectItem>
                    <SelectItem value="Termination" className="text-destructive">Termination Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="px-8 border-r border-accent/10">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
                <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${project.tier === 'Golden' ? 'bg-accent' : 'bg-accent/40'} text-white`}>
                  {project.tier}
                </Badge>
              </div>
              <div className="pl-4">
                {!project.isActivated ? (
                  <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-none uppercase tracking-widest text-[9px] h-10 px-6">
                    <Link href="/admin/operations/planning">Verify Activation</Link>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-[9px] font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-4 w-4" /> Active Journey
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-8 bg-black p-8 text-white shadow-2xl">
               <div className="space-y-1">
                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/40">Efficiency Rating</p>
                 <p className="text-2xl font-headline italic">{efficiencyRating}%</p>
               </div>
               <div className="h-10 w-px bg-white/10" />
               <div className="space-y-1">
                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/40">Total Lifecycle</p>
                 <p className="text-2xl font-headline italic">{totalDuration} Days</p>
               </div>
            </div>
          )}
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12">
          {project.status === 'Termination' && (
            <TabsTrigger value="dissolution" className="rounded-none border-b-2 border-transparent data-[state=active]:border-destructive data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2 text-destructive">
              <ShieldAlert className="h-3.5 w-3.5" /> Dissolution Protocol
            </TabsTrigger>
          )}
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <Layout className="h-3.5 w-3.5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <PlayCircle className="h-3.5 w-3.5" /> Site Workflow
          </TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <Wallet className="h-3.5 w-3.5" /> Ledger
          </TabsTrigger>
        </TabsList>

        {/* --- DISSOLUTION TAB --- */}
        <TabsContent value="dissolution" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <Card className="rounded-none border-destructive/20 bg-destructive/5 p-10 space-y-8">
                <div className="flex items-center gap-4">
                  <ShieldAlert className="h-6 w-6 text-destructive" />
                  <h3 className="text-2xl font-headline italic text-destructive">Dissolution Transparency Protocol</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-destructive">Financial Reconciliation Transparency</Label>
                    <Textarea 
                      value={finSum}
                      onChange={(e) => setFinSum(e.target.value)}
                      placeholder="Detail the financial status for both parties..."
                      className="min-h-[120px] rounded-none border-destructive/10 bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-destructive">Project Implementation Transparency</Label>
                    <Textarea 
                      value={projSum}
                      onChange={(e) => setProjSum(e.target.value)}
                      placeholder="Detail the work scope completed to date..."
                      className="min-h-[120px] rounded-none border-destructive/10 bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-destructive">Mutual Resolution Terms</Label>
                    <Textarea 
                      value={resTerms}
                      onChange={(e) => setResTerms(e.target.value)}
                      placeholder="Outline the terms of the project's early conclusion..."
                      className="min-h-[120px] rounded-none border-destructive/10 bg-white"
                    />
                  </div>
                  <Button onClick={handleSaveTerminationDetails} className="bg-destructive text-white rounded-none h-12 px-8 uppercase tracking-widest text-[10px]">
                    Synchronize Transparency Dossier
                  </Button>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-none border-destructive/20 bg-white p-8 space-y-8">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-destructive/60">Execution Agreement</h3>
                <div className="space-y-6">
                  <div className={cn("p-6 border flex items-center justify-between", project.termination?.studioAgreed ? "border-green-600/20 bg-green-600/5" : "border-destructive/10")}>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest font-bold">Studio Agreement</p>
                      <p className="text-xs font-light italic">{project.termination?.studioAgreed ? "Signed & Authorized" : "Signature Required"}</p>
                    </div>
                    {project.termination?.studioAgreed ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <FileText className="h-5 w-5 text-destructive/20" />}
                  </div>
                  <div className={cn("p-6 border flex items-center justify-between", project.termination?.clientAgreed ? "border-green-600/20 bg-green-600/5" : "border-destructive/10")}>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest font-bold">Client Agreement</p>
                      <p className="text-xs font-light italic">{project.termination?.clientAgreed ? "Signed & Confirmed" : "Awaiting Client Review"}</p>
                    </div>
                    {project.termination?.clientAgreed ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <FileText className="h-5 w-5 text-destructive/20" />}
                  </div>

                  <Button 
                    onClick={handleStudioAgreeTermination} 
                    disabled={project.termination?.studioAgreed}
                    className="w-full h-14 bg-destructive text-white hover:bg-destructive/90 rounded-none uppercase tracking-widest text-[10px] font-bold"
                  >
                    Authorize Studio Resolution
                  </Button>

                  {project.termination?.studioAgreed && project.termination?.clientAgreed && (
                    <Button 
                      onClick={handleFinalizeTermination}
                      className="w-full h-14 bg-black text-white hover:bg-black/90 rounded-none uppercase tracking-widest text-[10px] font-bold"
                    >
                      Execute Final Dissolution
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- OVERVIEW TAB --- */}
        <TabsContent value="overview" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Card className="rounded-none border-accent/5 shadow-xl bg-white overflow-hidden">
                <div className={cn("h-1.5 w-full", (project.isArchived || project.status === 'Terminated') ? "bg-black" : "bg-accent")} />
                <CardContent className="p-10 space-y-10">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">
                        {(project.isArchived || project.status === 'Terminated') ? "Finalized Velocity" : "Implementation Velocity"}
                      </p>
                      <h2 className="text-4xl font-headline italic">{project.progress}% Complete</h2>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">
                         {(project.isArchived || project.status === 'Terminated') ? "Archival Sync" : "Last Activity Sync"}
                       </p>
                       <p className="text-xs font-light italic text-muted-foreground">{project.lastActivity}</p>
                    </div>
                  </div>
                  <Progress value={project.progress} className="h-1 bg-secondary rounded-none" />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5" /> Architectural Brief
                </h3>
                <div className="p-10 border border-accent/5 bg-white shadow-xl relative">
                  <p className="text-lg font-light italic text-accent/80 leading-relaxed">
                    "{project.description || project.workScope || "No historical brief documented for this dossier."}"
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              {/* Temporal Health Card */}
              <Card className="rounded-none border-accent/5 shadow-xl bg-white p-8 space-y-6 relative overflow-hidden">
                <div className={cn("absolute top-0 right-0 p-4 opacity-5", isOverdue && !project.isArchived && project.status !== 'Terminated' ? "text-destructive" : "text-accent")}>
                  <Timer className="h-20 w-20" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">
                  {(project.isArchived || project.status === 'Terminated') ? "Dossier Timeline" : "Temporal Status"}
                </h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center pb-4 border-b border-accent/5">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest opacity-60 block">
                        {(project.isArchived || project.status === 'Terminated') ? "Handover Date" : "Authorized Deadline"}
                      </span>
                      <span className="text-sm font-bold flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 text-accent/40" /> {project.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest opacity-60 block">
                        {(project.isArchived || project.status === 'Terminated') ? "Total Implementation" : "Remaining Duration"}
                      </span>
                      <span className={cn("text-2xl font-headline italic", isOverdue && !project.isArchived && project.status !== 'Terminated' ? "text-destructive" : "text-accent")}>
                        {(project.isArchived || project.status === 'Terminated') ? `${totalDuration} Days` : isOverdue ? "Expired" : `${daysRemaining} Days`}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- WORKFLOW TAB --- */}
        <TabsContent value="workflow" className="m-0 space-y-12">
          {!project.isActivated && !project.isArchived ? (
            <div className="py-24 text-center border border-dashed border-accent/10 bg-secondary/5 space-y-6">
              <ClipboardList className="h-12 w-12 text-accent/20 mx-auto" />
              <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">Workflow initialization requires financial activation</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-headline italic">
                  {(project.isArchived || project.status === 'Terminated') ? "Finalized Protocol Index" : "Live Site Implementation"}
                </h2>
              </div>
              <div className="flex gap-8 overflow-x-auto pb-12 custom-scrollbar">
                <KanbanCol status="Todo" title={(project.isArchived || project.status === 'Terminated') ? "Pending (N/A)" : "Site Backlog"} color="bg-orange-400" />
                <KanbanCol status="In Progress" title={(project.isArchived || project.status === 'Terminated') ? "Active (N/A)" : "In Implementation"} color="bg-accent" />
                <KanbanCol status="Done" title="Task Completed" color="bg-green-600" />
              </div>
            </div>
          )}
        </TabsContent>

        {/* --- LEDGER TAB --- */}
        <TabsContent value="ledger" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-8">
                <div className="flex items-center gap-3"><Wallet className="h-5 w-5 text-accent/40" /><h3 className="text-xl font-headline italic">Installment Schedule</h3></div>
                <div className="space-y-6">
                  {project.installments.map((ins, i) => (
                    <div key={i} className={`p-8 border flex items-center justify-between ${ins.status === 'Paid' ? 'border-green-600/20 bg-green-600/5' : 'border-accent/10 bg-secondary/5'}`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">{ins.label}</span>
                          <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${ins.status === 'Paid' ? 'bg-green-600 text-white' : 'bg-accent/10 text-accent border-accent/20'}`}>{ins.status}</Badge>
                        </div>
                        <p className="text-2xl font-headline italic text-accent">KES {ins.amount.toLocaleString()}</p>
                        {ins.transactionCode && (
                          <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-muted-foreground font-bold italic">
                            <Banknote className="h-3 w-3" /> Ref: {ins.transactionCode}
                          </div>
                        )}
                      </div>
                      {!project.isArchived && project.isActivated && project.status !== 'Terminated' && project.status !== 'Termination' && (
                        <div className="flex items-center gap-4">
                          {i === 0 ? (
                            <Badge variant="outline" className="rounded-none text-[8px] uppercase tracking-widest opacity-40">System Verified</Badge>
                          ) : (
                            <Button 
                              variant="outline" 
                              onClick={() => handleToggleInstallment(i)} 
                              className="rounded-none h-12 uppercase tracking-widest text-[10px] border-accent/20"
                            >
                              {ins.status === 'Paid' ? 'Revoke Payment' : 'Verify Receipt'}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-none border-accent/10 bg-accent p-12 text-white shadow-2xl">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-10">Financial Health</h3>
                <div className="space-y-10">
                   <div className="space-y-1">
                     <p className="text-[10px] uppercase tracking-widest text-white/40">Authorized Budget</p>
                     <p className="text-3xl font-headline italic">KES {project.totalBudget.toLocaleString()}</p>
                   </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Verification Dialog */}
      <Dialog open={isVerifyingPayment} onOpenChange={setIsVerifyingPayment}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Banknote className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Financial Reconciliation</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">Verify Receipt</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Authorize the {verifyingIdx !== null ? project.installments[verifyingIdx].label : 'installment'} into the studio ledger.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="p-6 bg-secondary/30 border border-accent/5 space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Value Expected</p>
              <p className="text-2xl font-headline italic text-accent">
                KES {verifyingIdx !== null ? project.installments[verifyingIdx].amount.toLocaleString() : '0'}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Transaction Reference Code</Label>
              <Input 
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value)}
                placeholder="E.g., TRX-9982-KCB"
                className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent uppercase tracking-widest"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[10px] font-bold"
              onClick={confirmVerification}
              disabled={!transactionCode}
            >
              Authorize Ledger Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
