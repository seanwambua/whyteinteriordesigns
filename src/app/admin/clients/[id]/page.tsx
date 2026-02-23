
"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useWhyteStore, ClientProject, ProjectTask, SubTask, Inquiry, SiteReport } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  User, 
  Plus, 
  Wallet,
  Layout,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  Banknote,
  Trash2,
  CheckCircle2,
  Lock,
  Loader2,
  Check,
  CreditCard,
  History,
  TrendingUp,
  Timer,
  Clock,
  Calendar as CalendarIcon,
  AlertTriangle,
  Hourglass,
  MessageSquare,
  Mail,
  ShieldAlert,
  ZapOff,
  ClipboardList,
  Activity,
  PencilRuler,
  AlertCircle,
  Building2,
  TrendingDown,
  Scale,
  RefreshCcw,
  Landmark
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { parse, differenceInDays, isValid, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function ProjectMasterTerminal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, designers, stewards, updateClientProject, inquiries, updateInquiryStatus } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [verifyingInstallment, setVerifyingInstallment] = useState<number | null>(null);
  const [txnCode, setTxnCode] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [verifiedAmount, setVerifiedAmount] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const [isAddingReport, setIsAddingReport] = useState(false);
  const [newReport, setNewReport] = useState<Partial<SiteReport>>({
    type: 'Progress',
    content: '',
    urgency: 'Normal'
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const project = clientProjects.find((p) => p.id === id);
  const assignedDesigner = designers.find(d => d.id === project?.assignedDesignerId);
  const assignedSteward = stewards.find(s => s.id === project?.assignedStewardId);
  const projectInquiries = inquiries.filter(inq => inq.projectId === id);
  
  const isAuditVerified = project?.financialReportStatus === 'Verified';
  const isPendingActivation = project ? !project.isActivated : false;
  const isReadOnly = isAuditVerified || isPendingActivation || project?.status === 'Completion';

  useEffect(() => {
    if (verifyingInstallment !== null && project) {
      setVerifiedAmount(project.installments[verifyingInstallment].amount);
      setPaymentDate(new Date());
      setTxnCode("");
    }
  }, [verifyingInstallment, project]);

  if (!isMounted) return null;
  if (!project) return null;

  const handleUpdateStatus = (status: ClientProject['status']) => {
    if (isReadOnly) return;
    updateClientProject(project.id, { status, lastActivity: `Lifecycle transitioned manually to ${status}.` });
  };

  const handleVerifyPayment = () => {
    if (verifyingInstallment === null || !txnCode || isAuditVerified) return;
    setIsVerifying(true);
    setTimeout(() => {
      const updatedInstallments = [...project.installments];
      updatedInstallments[verifyingInstallment] = {
        ...updatedInstallments[verifyingInstallment],
        status: 'Paid',
        transactionCode: txnCode,
        amount: verifiedAmount,
        date: format(paymentDate, "MMM dd, yyyy")
      };
      updateClientProject(project.id, { 
        installments: updatedInstallments, 
        lastActivity: `Stewardship Protocol: Payment Verified — KES ${verifiedAmount.toLocaleString()} via Ref ${txnCode}` 
      });
      toast({ title: "Financial Protocol Synchronized", description: `Installment verified with code ${txnCode}.` });
      setIsVerifying(false);
      setVerifyingInstallment(null);
      setTxnCode("");
    }, 1200);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<ProjectTask>) => {
    if (isReadOnly) return;
    const updatedTasks = (project.tasks || []).map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    updateClientProject(project.id, { tasks: updatedTasks });
  };

  const handleMoveTask = (taskId: string, newStatus: ProjectTask['status']) => {
    if (isReadOnly) return;
    const updatedTasks = (project.tasks || []).map(task => task.id === taskId ? { ...task, status: newStatus } : task);
    const completed = updatedTasks.filter(t => t.status === 'Done').length;
    const progress = Math.round((completed / Math.max(1, updatedTasks.length)) * 100);
    updateClientProject(project.id, { tasks: updatedTasks, progress, lastActivity: `Protocol status transition: ${taskId} to ${newStatus}` });
  };

  const handleAddTask = (status: ProjectTask['status']) => {
    if (isReadOnly) return;
    const newTask: ProjectTask = { id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "New Protocol", status, priority: "Medium", subtasks: [] };
    const updatedTasks = [...(project.tasks || []), newTask];
    const completed = updatedTasks.filter(t => t.status === 'Done').length;
    const progress = Math.round((completed / Math.max(1, updatedTasks.length)) * 100);
    updateClientProject(project.id, { tasks: updatedTasks, progress });
  };

  const handleDeleteTask = (taskId: string) => {
    if (isReadOnly) return;
    const updatedTasks = (project.tasks || []).filter(t => t.id !== taskId);
    const completed = updatedTasks.filter(t => t.status === 'Done').length;
    const progress = Math.round((completed / Math.max(1, updatedTasks.length)) * 100);
    updateClientProject(project.id, { tasks: updatedTasks, progress });
  };

  const handleAddSubtask = (taskId: string) => {
    if (isReadOnly) return;
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
    if (isReadOnly) return;
    const updatedTasks = (project.tasks || []).map(task => {
      if (task.id === taskId) {
        const subs = (task.subtasks || []).map(s => s.id === subId ? { ...s, isCompleted: !s.isCompleted } : s);
        return { ...task, subtasks: subs };
      }
      return task;
    });
    updateClientProject(project.id, { tasks: updatedTasks });
  };

  const handleAddReport = () => {
    if (!newReport.content || isAuditVerified) return;
    const report: SiteReport = {
      id: `LOG-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      type: newReport.type as SiteReport['type'],
      content: newReport.content,
      urgency: newReport.urgency as SiteReport['urgency']
    };
    updateClientProject(project.id, { 
      siteReports: [report, ...(project.siteReports || [])],
      lastActivity: `Admin Site Log added: ${report.id}`
    });
    setIsAddingReport(false);
    setNewReport({ type: 'Progress', content: '', urgency: 'Normal' });
    toast({ title: "Site Entry Logged" });
  };

  const handleInquiryStatusChange = (inqId: string, status: Inquiry['status']) => {
    updateInquiryStatus(inqId, status);
    toast({ title: "Pipeline Synchronized", description: `Inquiry status updated to ${status}.` });
  };

  // FINANCIAL DERIVATIONS
  const totalPaid = project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const remainingBalance = project.totalBudget - totalPaid;
  const isLegerSynchronized = Math.abs(remainingBalance) < 1;
  const isOverpaid = remainingBalance < -1;

  const temporal = (() => {
    if (!project.isActivated) return { label: "Temporal Status", value: "Locked", icon: <ZapOff className="h-5 w-5" />, sub: "Pending Activation" };
    const start = parse(project.startDate, "MMM dd, yyyy", new Date());
    const end = parse(project.endDate, "MMM dd, yyyy", new Date());
    if (!isValid(start) || !isValid(end)) return null;
    const remaining = differenceInDays(end, new Date());
    return { 
      label: remaining < 0 ? "Overdue Protocol" : "Days to Handover", 
      value: Math.abs(remaining).toString(), 
      icon: remaining < 0 ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <Hourglass className="h-5 w-5" />,
      sub: `${differenceInDays(end, start)} Day Timeline`,
      isUrgent: remaining < 0
    };
  })();

  const KanbanColumn = ({ status, tasks }: { status: ProjectTask['status'], tasks: ProjectTask[] }) => (
    <div className="flex-1 flex flex-col gap-6 min-w-[320px]">
      <div className="flex items-center justify-between pb-4 border-b border-accent/10">
        <div className="flex items-center gap-3">
          <div className={cn("h-2.5 w-2.5 rounded-full", status === 'Todo' ? 'bg-accent/20' : status === 'In Progress' ? 'bg-orange-400' : 'bg-green-500')} />
          <h3 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent/60">{status} ({tasks.length})</h3>
        </div>
        {!isReadOnly && (
          <Button variant="ghost" size="icon" onClick={() => handleAddTask(status)} className="h-8 w-8 hover:bg-accent/5">
            <Plus className="h-4.5 w-4.5 opacity-40" />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {tasks.map(task => (
          <motion.div key={task.id} layoutId={task.id} className={cn("group relative bg-white border border-accent/5 p-6 shadow-sm hover:shadow-xl transition-all space-y-4", isReadOnly && "opacity-80")}>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-accent/20 uppercase tracking-widest">{task.id}</span>
              {!isReadOnly && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {status !== 'Todo' && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveTask(task.id, status === 'Done' ? 'In Progress' : 'Todo')}><ChevronLeft className="h-4 w-4" /></Button>}
                  {status !== 'Done' && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveTask(task.id, status === 'Todo' ? 'In Progress' : 'Done')}><ChevronRight className="h-4 w-4" /></Button>}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/40 hover:text-destructive" onClick={() => handleDeleteTask(task.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Textarea 
                value={task.title}
                onChange={(e) => handleUpdateTask(task.id, { title: e.target.value })}
                readOnly={isReadOnly}
                className="bg-transparent border-none p-0 resize-none focus-visible:ring-0 text-base font-bold uppercase tracking-widest leading-tight min-h-0 h-auto shadow-none"
              />
              <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest opacity-40">{task.priority} Priority</Badge>
            </div>
            <div className="pt-4 border-t border-accent/5 space-y-3">
              <div className="flex justify-between items-center"><span className="text-[12px] font-bold uppercase tracking-widest text-accent/30">Sub-protocols</span>{!isReadOnly && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddSubtask(task.id)}><Plus className="h-3.5 w-3.5" /></Button>}</div>
              <div className="space-y-2">{(task.subtasks || []).map(sub => (<div key={sub.id} className="flex items-center gap-3"><button onClick={() => !isReadOnly && handleToggleSubtask(task.id, sub.id)} disabled={isReadOnly} className={cn("h-4 w-4 border flex items-center justify-center", sub.isCompleted ? "bg-accent border-accent" : "border-accent/20")}>{sub.isCompleted && <Check className="h-2.5 w-2.5 text-white" />}</button><span className={cn("text-[13px] font-light italic", sub.isCompleted ? "text-accent/30 line-through" : "text-accent/70")}>{sub.title}</span></div>))}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-accent/40 hover:text-accent transition-all group"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /><span className="text-[12px] font-bold uppercase tracking-[0.3em]">Back to Master Registry</span></Link>
        {isAuditVerified && (<Alert className="rounded-none border-green-600/20 bg-green-600/[0.02]"><Lock className="h-4 w-4 text-green-600" /><AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-green-600">Dossier Locked — Audit Verified</AlertTitle><AlertDescription className="text-[13px] font-light italic">This commission has been reconciled and verified. All protocols are now read-only.</AlertDescription></Alert>)}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4"><div className="h-px w-8 bg-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Project Terminal</span></div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex flex-wrap items-center gap-6 text-[13px] text-muted-foreground uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2"><User className="h-4 w-4 opacity-40" /> {project.name}</span>
              <div className="h-1 w-1 bg-accent/20 rounded-full" />
              <span className="flex items-center gap-2"><PencilRuler className="h-4 w-4 opacity-40" /> {assignedDesigner ? assignedDesigner.name : "Unassigned Lead"}</span>
              <div className="h-1 w-1 bg-accent/20 rounded-full" />
              <span className="flex items-center gap-2"><Building2 className="h-4 w-4 opacity-40" /> {assignedSteward ? assignedSteward.name : "Unassigned Steward"}</span>
              <div className="h-1 w-1 bg-accent/20 rounded-full" />
              <span className="opacity-40">{project.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-white p-6 border border-accent/5 shadow-2xl">
            <div className="space-y-1 pr-8 border-r border-accent/10">
              <Label className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40">Phase Lifecycle</Label>
              <Select value={project.status} onValueChange={(v: any) => handleUpdateStatus(v)} disabled={isReadOnly}>
                <SelectTrigger className="rounded-none border-none h-8 p-0 text-[13px] font-bold uppercase tracking-widest text-accent focus:ring-0 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Execution">Execution</SelectItem>
                  <SelectItem value="Completion">Completion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="px-8 border-r border-accent/10">
              <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
              <Badge className="rounded-none uppercase tracking-widest text-[12px] bg-accent text-white py-1">{project.tier}</Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><Layout className="h-4 w-4" /> Overview</TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><PlayCircle className="h-4 w-4" /> Workflow</TabsTrigger>
          <TabsTrigger value="communications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><MessageSquare className="h-4 w-4" /> Communications</TabsTrigger>
          <TabsTrigger value="logs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><ClipboardList className="h-4 w-4" /> Site Logs</TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><Wallet className="h-4 w-4" /> Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0"><Card className="rounded-none border-accent/5 p-10 space-y-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-12"><div className="space-y-6"><h3 className="text-base font-bold uppercase tracking-[0.3em] text-accent/40">Architectural Brief</h3><p className="text-xl font-light italic leading-relaxed text-accent/80 border-l-2 border-accent/10 pl-8">"{project.description || project.workScope}"</p></div><div className="space-y-6"><h3 className="text-base font-bold uppercase tracking-[0.3em] text-accent/40">Temporal Protocol</h3><div className="grid grid-cols-2 gap-8 border-b border-accent/5 pb-8"><div className="space-y-1"><p className="text-[12px] uppercase tracking-widest opacity-40 font-bold">Commencement</p><p className="font-headline italic text-2xl">{project.startDate}</p></div><div className="space-y-1"><p className="text-[12px] uppercase tracking-widest opacity-40 font-bold">Delivery Target</p><p className="font-headline italic text-2xl">{project.endDate}</p></div></div>{temporal && (<div className={cn("p-6 flex items-center justify-between", temporal.isUrgent ? "bg-destructive/5 text-destructive" : "bg-accent/5 text-accent")}><div className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">{temporal.icon}</div><div className="space-y-0.5"><p className="text-[11px] font-bold uppercase tracking-widest opacity-60">{temporal.label}</p><p className="text-[12px] font-bold uppercase tracking-widest">{temporal.sub}</p></div></div><p className="text-4xl font-headline italic">{temporal.value}</p></div>)}</div></div></Card></TabsContent>

        <TabsContent value="workflow" className="m-0">{isPendingActivation ? (<div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 space-y-6"><div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto"><ShieldAlert className="h-8 w-8 text-accent/20" /></div><p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">Implementation Workflow Locked — Authorize Initialization</p></div>) : (<div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar"><KanbanColumn status="Todo" tasks={(project.tasks || []).filter(t => t.status === 'Todo')} /><KanbanColumn status="In Progress" tasks={(project.tasks || []).filter(t => t.status === 'In Progress')} /><KanbanColumn status="Done" tasks={(project.tasks || []).filter(t => t.status === 'Done')} /></div>)}</TabsContent>

        <TabsContent value="communications" className="m-0 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {projectInquiries.map((inq) => (
              <Card key={inq.id} className={cn("rounded-none border-accent/5 p-8 bg-white shadow-lg group relative", inq.urgency === 'critical' && "border-l-4 border-l-destructive")}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{inq.id}</span>
                      <Badge variant="outline" className={cn("rounded-none text-[9px] font-bold", inq.urgency === 'critical' ? 'text-destructive' : 'text-accent')}>{inq.urgency} Urgency</Badge>
                      <Badge className="rounded-none text-[9px] bg-accent text-white">{inq.status}</Badge>
                    </div>
                    <p className="text-base font-light italic text-accent/80 leading-relaxed border-l-2 border-accent/10 pl-6">"{inq.message}"</p>
                    <div className="flex items-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {inq.email}</span>
                      <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {inq.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">Pipeline Sync</Label>
                    <Select value={inq.status} onValueChange={(v: any) => handleInquiryStatusChange(inq.id, v)}>
                      <SelectTrigger className="rounded-none border-accent/10 h-10 text-[11px] font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">In Review</SelectItem>
                        <SelectItem value="closed">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
            {projectInquiries.length === 0 && (
              <div className="text-center py-24 border border-dashed border-accent/10 bg-secondary/5 space-y-4">
                <div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-accent/20" />
                </div>
                <p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">No consultations currently logged</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="m-0 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"><ClipboardList className="h-5 w-5 text-accent/40" /><h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent">Site Log Registry</h2></div>
            {!isAuditVerified && <Button onClick={() => setIsAddingReport(true)} className="rounded-none h-12 px-8 bg-accent text-white uppercase tracking-widest text-[10px] font-bold flex gap-3 shadow-xl"><Plus className="h-4 w-4" /> New Site Entry</Button>}
          </div>
          <div className="space-y-6">
            {(project.siteReports || []).map((log, index) => (
              <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="rounded-none border-accent/5 bg-white group shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className={cn("w-1.5 shrink-0", log.urgency === 'Critical' ? 'bg-red-500' : log.urgency === 'High' ? 'bg-orange-400' : 'bg-accent/20')} />
                    <div className="flex-1 p-8 space-y-4">
                      <div className="flex items-center justify-between"><div className="flex items-center gap-4"><span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">{log.id}</span><Badge variant="outline" className="rounded-none text-[9px] uppercase border-accent/10">{log.type}</Badge></div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{log.date}</span></div>
                      <p className="text-base font-light italic leading-relaxed text-accent/80">"{log.content}"</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {(!project.siteReports || project.siteReports.length === 0) && <div className="py-24 text-center border border-dashed border-accent/10 bg-secondary/5 italic text-[12px] uppercase tracking-widest text-muted-foreground font-light">No site log entries currently synchronized</div>}
          </div>
        </TabsContent>

        <TabsContent value="ledger" className="m-0 space-y-12">
           <Card className="rounded-none border-accent/10 bg-white p-10 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Landmark className="h-24 w-24" /></div>
             <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-4">
                 <Scale className="h-5 w-5 text-accent/40" />
                 <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent">Financial Reconciliation Index</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
                 <div className="space-y-2">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Capital Commitment</p>
                   <p className="text-3xl font-headline italic">KES {(project.totalBudget || 0).toLocaleString()}</p>
                 </div>
                 <div className="space-y-2">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-green-600/60">Liquidated Funds</p>
                   <p className="text-3xl font-headline italic text-green-600">KES {totalPaid.toLocaleString()}</p>
                 </div>
                 <div className={cn(
                   "p-6 border-l-2 space-y-2", 
                   isOverpaid ? "bg-green-50 border-green-500" : isLegerSynchronized ? "bg-accent/5 border-accent" : "bg-orange-50 border-orange-500"
                 )}>
                   <p className={cn("text-[10px] font-bold uppercase tracking-widest", isOverpaid ? "text-green-600" : isLegerSynchronized ? "text-accent" : "text-orange-600")}>
                     {isOverpaid ? "Surplus Balance" : "Net Balance Due"}
                   </p>
                   <p className={cn("text-4xl font-headline italic", isOverpaid ? "text-green-600" : isLegerSynchronized ? "text-accent" : "text-orange-600")}>
                     KES {Math.abs(remainingBalance).toLocaleString()}
                   </p>
                 </div>
               </div>

               <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-accent/40">
                   <span>Liquidation Velocity</span>
                   <span>{Math.min(100, Math.round((totalPaid / (project.totalBudget || 1)) * 100))}%</span>
                 </div>
                 <Progress value={(totalPaid / (project.totalBudget || 1)) * 100} className="h-1 bg-accent/5 rounded-none" />
               </div>
             </div>
           </Card>

           <Card className="rounded-none border-accent/5 p-0 bg-white shadow-2xl overflow-hidden">
             <div className="bg-accent/5 px-10 py-6 border-b border-accent/5 flex justify-between items-center">
               <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent/60 flex items-center gap-3">
                 <CreditCard className="h-5 w-5" /> Payment Plan Protocol
               </h3>
               <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest border-accent/10 text-accent/40 font-bold">Stewardship Lead: {assignedSteward?.name || 'Unassigned'}</Badge>
             </div>
             <div className="divide-y divide-accent/5">
               {project.installments.map((ins, i) => {
                 const projectedAmount = project.totalBudget * (ins.percentage / 100);
                 const variance = ins.amount - projectedAmount;
                 const hasVariance = ins.status === 'Paid' && Math.abs(variance) > 1;

                 return (
                   <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-10 gap-8 hover:bg-accent/[0.01] transition-colors">
                     <div className="flex items-center gap-8">
                       <div className={cn(
                         "h-12 w-12 rounded-full flex items-center justify-center shrink-0 border", 
                         ins.status === 'Paid' ? "bg-green-600/5 border-green-600/20 text-green-600" : "bg-orange-600/5 border-orange-600/20 text-orange-600"
                       )}>
                         {ins.status === 'Paid' ? <CheckCircle2 className="h-5 w-5" /> : <Timer className="h-5 w-5 animate-pulse" />}
                       </div>
                       <div className="space-y-1.5">
                         <div className="flex items-center gap-3">
                           <p className="text-base font-bold uppercase tracking-[0.2em]">{ins.label}</p>
                           <Badge className={cn("rounded-none text-[10px] uppercase tracking-widest px-2.5 py-0.5 font-bold", ins.status === 'Paid' ? "bg-green-600 text-white" : "bg-orange-600 text-white")}>
                             {ins.status}
                           </Badge>
                         </div>
                         <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                           <span>Ref: {ins.transactionCode || 'Awaiting Sync'}</span>
                           <div className="h-1.5 w-1.5 rounded-full bg-accent/10" />
                           <span>{ins.date || 'TBD'}</span>
                           <div className="h-1.5 w-1.5 rounded-full bg-accent/10" />
                           <span>{ins.percentage}% Allocation Protocol (Target: KES {projectedAmount.toLocaleString()})</span>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center gap-12 justify-between lg:justify-end">
                       <div className="text-right">
                         <p className="text-[11px] font-bold uppercase tracking-widest text-accent/30 mb-1">
                           {ins.status === 'Paid' ? 'Liquidated Value' : 'Projected Value'}
                         </p>
                         <p className={cn("text-2xl font-headline italic", ins.status === 'Pending' ? 'text-orange-600' : 'text-accent')}>
                           KES {ins.amount.toLocaleString()}
                         </p>
                         {hasVariance && (
                           <div className={cn(
                             "text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center justify-end gap-1.5",
                             variance > 0 ? "text-green-600" : "text-red-600"
                           )}>
                             {variance > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                             {variance > 0 ? 'Overpaid' : 'Underpaid'} by KES {Math.abs(variance).toLocaleString()}
                           </div>
                         )}
                       </div>
                       {ins.status === 'Pending' && !isAuditVerified && (
                         <Button onClick={() => setVerifyingInstallment(i)} variant="outline" className="rounded-none h-12 px-8 border-accent/20 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-white transition-all flex gap-3 shadow-sm group/btn">
                           <ShieldCheck className="h-4 w-4" /> Verify Entry
                         </Button>
                       )}
                       {ins.status === 'Paid' && (
                         <div className="h-12 w-12 rounded-full border border-green-600/10 flex items-center justify-center text-green-600 bg-green-600/[0.02]">
                           <Check className="h-6 w-6" />
                         </div>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
           </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddingReport} onOpenChange={setIsAddingReport}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Admin Documentation</span></div>
              <DialogTitle className="text-3xl font-headline italic">New Site Entry</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-sm">Log critical architectural observations or administrative directives for this dossier.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Entry Classification</Label>
                  <Select value={newReport.type} onValueChange={(v: any) => setNewReport({...newReport, type: v})}>
                    <SelectTrigger className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Progress">Deployment Progress</SelectItem>
                      <SelectItem value="Issue">Administrative Directive</SelectItem>
                      <SelectItem value="Log">Metadata Log</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Urgency Protocol</Label>
                  <Select value={newReport.urgency} onValueChange={(v: any) => setNewReport({...newReport, urgency: v})}>
                    <SelectTrigger className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Normal">Normal Visibility</SelectItem>
                      <SelectItem value="High">High Urgency</SelectItem>
                      <SelectItem value="Critical" className="text-red-600">Critical / Impasse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Log Content</Label>
                <Textarea value={newReport.content} onChange={(e) => setNewReport({...newReport, content: e.target.value})} placeholder="Administrative site notes..." className="min-h-[150px] rounded-none border-accent/10 p-6 font-light italic leading-relaxed focus:ring-accent bg-secondary/10" />
              </div>
            </div>
            <DialogFooter><Button onClick={handleAddReport} disabled={!newReport.content} className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[10px] font-bold shadow-2xl transition-all">Transmit to Registry</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={verifyingInstallment !== null} onOpenChange={(open) => !open && setVerifyingInstallment(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Protocol</span></div>
              <DialogTitle className="text-3xl font-headline italic">Verify Transaction</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base">Confirm receipt of <strong>{verifyingInstallment !== null ? project.installments[verifyingInstallment].label : ""}</strong>.</DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="p-8 bg-secondary/30 border border-accent/5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5"><Banknote className="h-14 w-14" /></div>
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-accent/40">Authorized Entry Value</span>
                  <span className="text-2xl font-headline italic text-accent">KES {verifiedAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[13px] font-bold uppercase tracking-widest opacity-60">Verified Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-[13px] border-accent/20 font-bold uppercase tracking-widest">
                          <CalendarIcon className="mr-3 h-5 w-5 opacity-40" />
                          {format(paymentDate, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none">
                        <Calendar mode="single" selected={paymentDate} onSelect={(d) => d && setPaymentDate(d)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[13px] font-bold uppercase tracking-widest opacity-60">Verified Amount (KES)</Label>
                    <Input 
                      type="number" 
                      className="rounded-none border-accent/20 h-14 text-xl font-headline italic" 
                      value={verifiedAmount} 
                      onChange={(e) => setVerifiedAmount(Number(e.target.value))} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[13px] font-bold uppercase tracking-widest opacity-60">Transaction Reference</Label>
                  <Input placeholder="E.g., TRX-9921-WHYTE" className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] font-medium" value={txnCode} onChange={(e) => setTxnCode(e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all" onClick={handleVerifyPayment} disabled={isVerifying || !txnCode || verifiedAmount <= 0}>
                {isVerifying ? <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Syncing...</span> : "Authorize Entry"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
