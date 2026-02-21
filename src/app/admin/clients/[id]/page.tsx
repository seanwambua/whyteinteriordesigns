"use client";

import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, ProjectTask, AuditAllocation, FinancialAudit, SubTask } from "@/store/use-whyte-store";
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
  ChevronLeft,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Calendar as CalendarIcon,
  Timer,
  Banknote,
  Archive,
  BookOpen,
  ShieldAlert,
  FileText,
  Trash2,
  CheckCircle2,
  Scale,
  ExternalLink,
  ShieldQuestion,
  Lock,
  Loader2,
  MoreVertical,
  Check,
  CreditCard,
  History,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { format, differenceInDays, parse, isAfter } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ProjectMasterTerminal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject, financialSteward } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Payment Verification State
  const [verifyingInstallment, setVerifyingInstallment] = useState<number | null>(null);
  const [txnCode, setTxnCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Audit State
  const [auditTotalReceived, setAuditTotalReceived] = useState(0);
  const [auditRefund, setAuditRefund] = useState(0);
  const [auditAllocations, setAuditAllocations] = useState<AuditAllocation[]>([]);
  const [auditComments, setAuditComments] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const project = clientProjects.find((p) => p.id === id);

  useEffect(() => {
    if (project?.termination) {
      if (project.termination.audit) {
        setAuditTotalReceived(project.termination.audit.totalReceived);
        setAuditRefund(project.termination.audit.refundAmount);
        setAuditAllocations(project.termination.audit.allocations);
        setAuditComments(project.termination.audit.stewardComments);
      } else {
        const paid = project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
        setAuditTotalReceived(paid);
      }
    }
  }, [project]);

  if (!isMounted) return null;
  if (!project) return null;

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
    updateClientProject(project.id, { ...updates, lastActivity: `Lifecycle transitioned manually to ${status}.` });
  };

  const handleVerifyPayment = () => {
    if (verifyingInstallment === null || !txnCode) return;
    setIsVerifying(true);

    setTimeout(() => {
      const updatedInstallments = [...project.installments];
      updatedInstallments[verifyingInstallment] = {
        ...updatedInstallments[verifyingInstallment],
        status: 'Paid',
        transactionCode: txnCode
      };

      updateClientProject(project.id, {
        installments: updatedInstallments,
        lastActivity: `Payment Verified: ${updatedInstallments[verifyingInstallment].label}`
      });

      toast({
        title: "Financial Protocol Synchronized",
        description: `Installment ${updatedInstallments[verifyingInstallment].label} verified with code ${txnCode}.`
      });

      setIsVerifying(false);
      setVerifyingInstallment(null);
      setTxnCode("");
    }, 1200);
  };

  const handleSaveAudit = () => {
    if (!project.termination) return;
    const audit: FinancialAudit = {
      totalReceived: auditTotalReceived,
      allocations: auditAllocations,
      refundAmount: auditRefund,
      stewardComments: auditComments,
      isVerified: true
    };
    updateClientProject(project.id, {
      termination: { ...project.termination, audit }
    });
    toast({ title: "Financial Audit Synchronized", description: "Transparency breakdown updated by Steward." });
  };

  const addAllocation = () => {
    setAuditAllocations([...auditAllocations, { id: Math.random().toString(36).substr(2, 4), category: "", amount: 0, description: "" }]);
  };

  const updateAllocation = (idx: number, field: keyof AuditAllocation, value: any) => {
    const updated = [...auditAllocations];
    (updated[idx] as any)[field] = value;
    setAuditAllocations(updated);
  };

  const removeAllocation = (idx: number) => {
    setAuditAllocations(auditAllocations.filter((_, i) => i !== idx));
  };

  const totalAllocated = auditAllocations.reduce((sum, a) => sum + a.amount, 0);
  const netBalance = auditTotalReceived - totalAllocated - auditRefund;

  const handleStudioAgreeTermination = () => {
    if (!project.termination) return;
    updateClientProject(project.id, {
      termination: { ...project.termination, studioAgreed: true }
    });
    toast({ title: "Studio Resolution Signed", description: "Handover terms authorized." });
  };

  const handleFinalizeTermination = () => {
    updateClientProject(project.id, {
      status: 'Terminated',
      isArchived: true,
      lastActivity: "Commission Dissolved - Final Resolution Executed"
    });
    toast({ title: "Commission Terminated", description: "Dossier transitioned to Archives." });
  };

  // KANBAN LOGIC
  const handleMoveTask = (taskId: string, newStatus: ProjectTask['status']) => {
    const updatedTasks = (project.tasks || []).map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    const completed = updatedTasks.filter(t => t.status === 'Done').length;
    const progress = Math.round((completed / Math.max(1, updatedTasks.length)) * 100);

    updateClientProject(project.id, { 
      tasks: updatedTasks,
      progress,
      lastActivity: `Protocol status transition: ${taskId} to ${newStatus}`
    });
  };

  const handleAddTask = (status: ProjectTask['status']) => {
    const newTask: ProjectTask = {
      id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      title: "New Protocol",
      status,
      priority: "Medium",
      subtasks: []
    };
    const updatedTasks = [...(project.tasks || []), newTask];
    
    const completed = updatedTasks.filter(t => t.status === 'Done').length;
    const progress = Math.round((completed / Math.max(1, updatedTasks.length)) * 100);

    updateClientProject(project.id, { tasks: updatedTasks, progress });
    toast({ title: "Protocol Initiated", description: "New task appended to the site registry." });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = (project.tasks || []).filter(t => t.id !== taskId);
    const completed = updatedTasks.filter(t => t.status === 'Done').length;
    const progress = Math.round((completed / Math.max(1, updatedTasks.length)) * 100);
    updateClientProject(project.id, { tasks: updatedTasks, progress });
  };

  const handleAddSubtask = (taskId: string) => {
    const updatedTasks = (project.tasks || []).map(task => {
      if (task.id === taskId) {
        const sub: SubTask = { id: `S-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "Sub-protocol", isCompleted: false };
        return { ...task, subtasks: [...(task.subtasks || []), sub] };
      }
      return task;
    });
    updateClientProject(project.id, { tasks: updatedTasks });
  };

  const handleToggleSubtask = (taskId: string, subId: string) => {
    const updatedTasks = (project.tasks || []).map(task => {
      if (task.id === taskId) {
        const subs = (task.subtasks || []).map(s => 
          s.id === subId ? { ...s, isCompleted: !s.isCompleted } : s
        );
        return { ...task, subtasks: subs };
      }
      return task;
    });
    updateClientProject(project.id, { tasks: updatedTasks });
  };

  // FINANCIALS LOGIC
  const totalPaid = project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const remainingBalance = (project.totalBudget || 0) - totalPaid;

  const KanbanColumn = ({ status, tasks }: { status: ProjectTask['status'], tasks: ProjectTask[] }) => (
    <div className="flex-1 flex flex-col gap-6 min-w-[320px]">
      <div className="flex items-center justify-between pb-4 border-b border-accent/10">
        <div className="flex items-center gap-3">
          <div className={cn("h-2.5 w-2.5 rounded-full", 
            status === 'Todo' ? 'bg-accent/20' : 
            status === 'In Progress' ? 'bg-orange-400' : 'bg-green-500'
          )} />
          <h3 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent/60">{status} ({tasks.length})</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => handleAddTask(status)} className="h-8 w-8 hover:bg-accent/5">
          <Plus className="h-4.5 w-4.5 opacity-40" />
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {tasks.map(task => (
          <motion.div 
            key={task.id} 
            layoutId={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white border border-accent/5 p-6 shadow-sm hover:shadow-xl hover:border-accent/20 transition-all space-y-4"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-accent/20 uppercase tracking-widest">{task.id}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {status !== 'Todo' && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveTask(task.id, status === 'Done' ? 'In Progress' : 'Todo')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                {status !== 'Done' && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveTask(task.id, status === 'Todo' ? 'In Progress' : 'Done')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/40 hover:text-destructive" onClick={() => handleDeleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold uppercase tracking-widest leading-tight">{task.title}</h4>
              <div className="flex gap-2">
                <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest opacity-40 py-0.5">{task.priority} Priority</Badge>
              </div>
            </div>

            {/* Subtasks */}
            <div className="pt-4 border-t border-accent/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent/30">Sub-protocols</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddSubtask(task.id)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-2">
                {(task.subtasks || []).map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 group/sub">
                    <button 
                      onClick={() => handleToggleSubtask(task.id, sub.id)}
                      className={cn("h-4 w-4 border flex items-center justify-center transition-colors", 
                        sub.isCompleted ? "bg-accent border-accent" : "border-accent/20 bg-transparent"
                      )}
                    >
                      {sub.isCompleted && <Check className="h-2.5 w-2.5 text-white" />}
                    </button>
                    <span className={cn("text-[13px] font-light italic transition-all", 
                      sub.isCompleted ? "text-accent/30 line-through" : "text-accent/70"
                    )}>
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <div className="h-32 border border-dashed border-accent/5 flex items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent/10 italic">Empty Protocol Stack</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-body">
      {/* Header Cockpit */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link 
          href="/admin/clients" 
          className="inline-flex items-center gap-2 text-accent/40 hover:text-accent transition-all group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em]">Back to Master Registry</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-accent" />
              <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Project Terminal</span>
            </div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex items-center gap-6 text-[13px] text-muted-foreground uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2"><User className="h-4 w-4 opacity-40" /> {project.name}</span>
              <div className="h-1 w-1 bg-accent/20 rounded-full" />
              <span className="opacity-40">{project.id}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white p-6 border border-accent/5 shadow-2xl">
            <div className="space-y-1 pr-8 border-r border-accent/10">
              <Label className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Phase Lifecycle</Label>
              <Select value={project.status} onValueChange={(v: any) => handleUpdateStatus(v)}>
                <SelectTrigger className="rounded-none border-none h-8 p-0 text-[13px] font-bold uppercase tracking-widest text-accent focus:ring-0 w-44">
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
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
              <Badge className="rounded-none uppercase tracking-widest text-[11px] bg-accent text-white py-1">{project.tier}</Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto">
          {project.status === 'Termination' && (
            <TabsTrigger value="dissolution" className="rounded-none border-b-2 border-transparent data-[state=active]:border-destructive data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2 text-destructive">
              <ShieldAlert className="h-4 w-4" /> Dissolution Protocol
            </TabsTrigger>
          )}
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2">
            <Layout className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2">
            <PlayCircle className="h-4 w-4" /> Workflow
          </TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2">
            <Wallet className="h-4 w-4" /> Ledger
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dissolution" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Card className="rounded-none border-accent/10 bg-white p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Scale className="h-7 w-7 text-accent" />
                    <h3 className="text-2xl font-headline italic">Steward Financial Audit</h3>
                  </div>
                  <Badge variant="outline" className="rounded-none border-accent/20 text-[11px] uppercase tracking-widest">Authorized by {financialSteward}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Cumulative Received (KES)</Label>
                    <Input type="number" value={auditTotalReceived} onChange={(e) => setAuditTotalReceived(Number(e.target.value))} className="rounded-none h-12 text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Agreed Refund Amount (KES)</Label>
                    <Input type="number" value={auditRefund} onChange={(e) => setAuditRefund(Number(e.target.value))} className="rounded-none h-12 text-destructive font-bold text-lg" />
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-accent/5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-accent/40">Fund Allocation Breakdown</h4>
                    <Button variant="outline" size="sm" onClick={addAllocation} className="rounded-none h-9 text-[11px] uppercase tracking-widest"><Plus className="h-4 w-4 mr-1" /> Add Cost Row</Button>
                  </div>
                  <div className="space-y-4">
                    {auditAllocations.map((a, idx) => (
                      <div key={a.id} className="grid grid-cols-12 gap-4 items-end bg-secondary/5 p-4 border border-accent/5">
                        <div className="col-span-4 space-y-1">
                          <Label className="text-[11px] uppercase tracking-widest opacity-40">Category</Label>
                          <Input value={a.category} onChange={(e) => updateAllocation(idx, 'category', e.target.value)} placeholder="e.g., Site Mobilization" className="rounded-none h-10 text-sm" />
                        </div>
                        <div className="col-span-3 space-y-1">
                          <Label className="text-[11px] uppercase tracking-widest opacity-40">Amount (KES)</Label>
                          <Input type="number" value={a.amount} onChange={(e) => updateAllocation(idx, 'amount', Number(e.target.value))} className="rounded-none h-10 text-sm" />
                        </div>
                        <div className="col-span-4 space-y-1">
                          <Label className="text-[11px] uppercase tracking-widest opacity-40">Notes</Label>
                          <Input value={a.description} onChange={(e) => updateAllocation(idx, 'description', e.target.value)} placeholder="Technical details..." className="rounded-none h-10 text-sm" />
                        </div>
                        <div className="col-span-1">
                          <Button variant="ghost" size="icon" onClick={() => removeAllocation(idx)} className="h-10 w-10 text-destructive/40"><Trash2 className="h-5 w-5" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-black text-white space-y-4">
                  <div className="flex justify-between items-center text-[12px] uppercase tracking-[0.3em] font-bold">
                    <span>Reconciliation Summary</span>
                    <span className={cn(netBalance === 0 ? "text-green-400" : "text-orange-400")}>
                      {netBalance === 0 ? "Perfectly Balanced" : "Balance Mismatch"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-8 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-[11px] opacity-40 uppercase tracking-widest mb-1">Total Costs</p>
                      <p className="text-2xl font-headline italic">KES {totalAllocated.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] opacity-40 uppercase tracking-widest mb-1">Total Refund</p>
                      <p className="text-2xl font-headline italic">KES {auditRefund.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] opacity-40 uppercase tracking-widest mb-1">Final Balance</p>
                      <p className="text-2xl font-headline italic">KES {netBalance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Steward's Closing Comments</Label>
                  <Textarea value={auditComments} onChange={(e) => setAuditComments(e.target.value)} className="min-h-[100px] rounded-none italic font-light text-lg" />
                </div>

                <Button onClick={handleSaveAudit} className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl">Synchronize Financial Transparency</Button>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-none border-destructive/20 bg-white p-8 space-y-8">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-destructive/60">Execution Agreement</h3>
                <div className="space-y-6">
                  <div className={cn("p-6 border flex items-center justify-between", project.termination?.studioAgreed ? "border-green-600/20 bg-green-600/5" : "border-destructive/10")}>
                    <div className="space-y-1">
                      <p className="text-[12px] uppercase tracking-widest font-bold">Studio Agreement</p>
                      <p className="text-sm font-light italic">{project.termination?.studioAgreed ? "Signed & Authorized" : "Signature Required"}</p>
                    </div>
                    {project.termination?.studioAgreed ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <FileText className="h-6 w-6 text-destructive/20" />}
                  </div>
                  <div className={cn("p-6 border flex items-center justify-between", project.termination?.clientAgreed ? "border-green-600/20 bg-green-600/5" : "border-destructive/10")}>
                    <div className="space-y-1">
                      <p className="text-[12px] uppercase tracking-widest font-bold">Client Agreement</p>
                      <p className="text-sm font-light italic">{project.termination?.clientAgreed ? "Signed & Confirmed" : "Awaiting Client Review"}</p>
                    </div>
                    {project.termination?.clientAgreed ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <FileText className="h-6 w-6 text-destructive/20" />}
                  </div>

                  <Button onClick={handleStudioAgreeTermination} disabled={project.termination?.studioAgreed || !project.termination?.audit} className="w-full h-14 bg-destructive text-white rounded-none uppercase tracking-widest text-[12px] font-bold">Authorize Studio Resolution</Button>

                  {project.termination?.studioAgreed && project.termination?.clientAgreed && (
                    <Button onClick={handleFinalizeTermination} className="w-full h-14 bg-black text-white rounded-none uppercase tracking-widest text-[12px] font-bold">Execute Final Dissolution</Button>
                  )}
                </div>
              </Card>
              
              <div className="p-6 bg-secondary/10 border border-dashed border-accent/20 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent/40">Transparency Link</p>
                <p className="text-[13px] font-light italic leading-relaxed">Share this specialized financial link with the client for independent verification.</p>
                <Button asChild variant="outline" className="w-full h-10 rounded-none text-[11px] uppercase tracking-widest border-accent/10 font-bold">
                  <Link href={`/transparency/${project.id}`} target="_blank" className="flex gap-2 justify-center">View Transparency Portal <ExternalLink className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="m-0 space-y-12">
           <Card className="rounded-none border-accent/5 p-10 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                 <h3 className="text-base font-bold uppercase tracking-[0.3em] text-accent/40">Architectural Brief</h3>
                 <p className="text-xl font-light italic leading-relaxed text-accent/80 border-l-2 border-accent/10 pl-8">"{project.description || project.workScope}"</p>
               </div>
               <div className="space-y-6">
                 <h3 className="text-base font-bold uppercase tracking-[0.3em] text-accent/40">Temporal Status</h3>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-1">
                     <p className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Start Date</p>
                     <p className="font-headline italic text-2xl">{project.startDate}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Authorized Deadline</p>
                     <p className="font-headline italic text-2xl">{project.endDate}</p>
                   </div>
                 </div>
               </div>
             </div>
           </Card>
        </TabsContent>

        <TabsContent value="workflow" className="m-0">
           <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar">
             <KanbanColumn status="Todo" tasks={(project.tasks || []).filter(t => t.status === 'Todo')} />
             <KanbanColumn status="In Progress" tasks={(project.tasks || []).filter(t => t.status === 'In Progress')} />
             <KanbanColumn status="Done" tasks={(project.tasks || []).filter(t => t.status === 'Done')} />
           </div>
        </TabsContent>

        <TabsContent value="ledger" className="m-0 space-y-12">
           {/* Financial Summary Deck */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
               <Card className="rounded-none border-accent/10 bg-white p-8 relative overflow-hidden group hover:border-accent/30 transition-all">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp className="h-16 w-16" /></div>
                 <div className="space-y-4 relative z-10">
                   <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Capital Commitment</p>
                   <p className="text-4xl font-headline italic">KES {(project.totalBudget || 0).toLocaleString()}</p>
                   <div className="h-1 w-12 bg-accent/20" />
                 </div>
               </Card>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
               <Card className="rounded-none border-accent/10 bg-white p-8 relative overflow-hidden group hover:border-accent/30 transition-all">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck className="h-16 w-16" /></div>
                 <div className="space-y-4 relative z-10">
                   <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-green-600/60">Liquidated Funds</p>
                   <p className="text-4xl font-headline italic text-green-600">KES {totalPaid.toLocaleString()}</p>
                   <div className="h-1 w-12 bg-green-600/20" />
                 </div>
               </Card>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
               <Card className="rounded-none border-accent/10 bg-white p-8 relative overflow-hidden group hover:border-accent/30 transition-all">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><History className="h-16 w-16" /></div>
                 <div className="space-y-4 relative z-10">
                   <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-orange-600/60">Outstanding Balance</p>
                   <p className="text-4xl font-headline italic text-orange-600">KES {remainingBalance.toLocaleString()}</p>
                   <div className="h-1 w-12 bg-orange-600/20" />
                 </div>
               </Card>
             </motion.div>
           </div>

           {/* Transaction Registry */}
           <Card className="rounded-none border-accent/5 p-0 bg-white shadow-2xl overflow-hidden">
             <div className="bg-accent/5 px-10 py-6 border-b border-accent/5 flex justify-between items-center">
               <h3 className="text-[13px] font-bold uppercase tracking-[0.4em] text-accent/60 flex items-center gap-3">
                 <CreditCard className="h-5 w-5" /> Architectural Installment Registry
               </h3>
               <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest border-accent/10 text-accent/40 font-bold">
                 Stewardship Verified
               </Badge>
             </div>
             
             <div className="divide-y divide-accent/5">
               {project.installments.map((ins, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="group hover:bg-secondary/5 transition-colors"
                 >
                   <div className="flex flex-col lg:flex-row lg:items-center justify-between p-10 gap-8">
                     <div className="flex items-center gap-8">
                       <div className={cn(
                         "h-14 w-14 rounded-full flex items-center justify-center shrink-0 border",
                         ins.status === 'Paid' ? "bg-green-600/5 border-green-600/20 text-green-600" : "bg-orange-600/5 border-orange-600/20 text-orange-600"
                       )}>
                         {ins.status === 'Paid' ? <CheckCircle2 className="h-6 w-6" /> : <Timer className="h-6 w-6 animate-pulse" />}
                       </div>
                       <div className="space-y-1.5">
                         <div className="flex items-center gap-3">
                           <p className="text-base font-bold uppercase tracking-[0.2em]">{ins.label}</p>
                           <Badge className={cn(
                             "rounded-none text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold",
                             ins.status === 'Paid' ? "bg-green-600 text-white" : "bg-orange-600 text-white"
                           )}>
                             {ins.status}
                           </Badge>
                         </div>
                         <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                           <span className="flex items-center gap-1.5">
                             <FileText className="h-4 w-4 opacity-40" /> 
                             {ins.transactionCode ? `Ref: ${ins.transactionCode}` : 'Awaiting Studio Verification'}
                           </span>
                           <div className="h-1.5 w-1.5 rounded-full bg-accent/10" />
                           <span className="opacity-40">{ins.percentage}% Allocation</span>
                         </div>
                       </div>
                     </div>

                     <div className="flex items-center gap-12 justify-between lg:justify-end">
                       <div className="text-right">
                         <p className="text-[11px] font-bold uppercase tracking-widest text-accent/30 mb-1">Installment Value</p>
                         <p className="text-4xl font-headline italic text-accent tracking-tight">KES {ins.amount.toLocaleString()}</p>
                       </div>
                       
                       {ins.status === 'Pending' && (
                         <Button 
                          onClick={() => setVerifyingInstallment(i)}
                          variant="outline" 
                          className="rounded-none h-14 px-8 border-accent/20 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-white transition-all flex gap-3 shadow-sm group/btn"
                         >
                           <ShieldCheck className="h-5 w-5 transition-transform group-hover/btn:scale-110" /> Verify Ledger Entry
                         </Button>
                       )}
                       {ins.status === 'Paid' && (
                         <div className="h-14 w-14 rounded-full border border-green-600/10 flex items-center justify-center text-green-600 bg-green-600/[0.02]">
                           <Check className="h-7 w-7" />
                         </div>
                       )}
                     </div>
                   </div>
                 </motion.div>
               ))}
             </div>

             <div className="p-10 bg-secondary/10 border-t border-accent/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <Lock className="h-5 w-5 text-accent/30" />
                 <p className="text-[12px] font-bold uppercase tracking-widest text-accent/40 italic">
                   All transactions are recorded in the studio's encrypted financial archives.
                 </p>
               </div>
               <Button variant="ghost" className="text-[12px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent gap-2">
                 Export Ledger <ArrowUpRight className="h-4 w-4" />
               </Button>
             </div>
           </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Verification Dialog */}
      <Dialog open={verifyingInstallment !== null} onOpenChange={(open) => !open && setVerifyingInstallment(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-accent" />
                <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Protocol</span>
              </div>
              <DialogTitle className="text-3xl font-headline italic">Verify Transaction</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">
                Confirming receipt of the <strong>{verifyingInstallment !== null ? project.installments[verifyingInstallment].label : ""}</strong>. This record will be synchronized with the client's transparency portal.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-8">
              <div className="p-8 bg-secondary/30 border border-accent/5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5"><Banknote className="h-14 w-14" /></div>
                <div className="flex justify-between items-end relative z-10">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-accent/40">Authorized Amount</span>
                  <span className="text-3xl font-headline italic text-accent">KES {verifyingInstallment !== null ? project.installments[verifyingInstallment].amount.toLocaleString() : 0}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">External Transaction Reference</Label>
                <Input 
                  placeholder="E.g., TRX-9921-WHYTE" 
                  className="rounded-none border-accent/20 h-14 text-xl focus:ring-accent uppercase tracking-[0.2em] font-medium"
                  value={txnCode}
                  onChange={(e) => setTxnCode(e.target.value)}
                />
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground italic">Input the exact reference from the financial institution.</p>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl disabled:opacity-50 transition-all hover:tracking-[0.2em]"
                onClick={handleVerifyPayment}
                disabled={isVerifying || !txnCode}
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Finalizing Synchronization...</span>
                ) : "Authorize Entry Verification"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
