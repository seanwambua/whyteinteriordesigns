"use client";

import { use, useState, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, ProjectTask, SubTask, Inquiry, SiteReport, Installment, ReorganizationDetails, Milestone, VendorAllocation, ReimbursementClaim, StudioClaim } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Landmark,
  Settings2,
  FileEdit,
  Coins,
  FileText,
  Handshake,
  Compass,
  FileSearch,
  LayoutList,
  Calculator,
  Users,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { parse, differenceInDays, isValid, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface KanbanColumnProps {
  status: ProjectTask['status'];
  tasks: ProjectTask[];
  isReadOnly: boolean;
  handleAddTask: (status: ProjectTask['status']) => void;
  handleMoveTask: (taskId: string, newStatus: ProjectTask['status']) => void;
  handleDeleteTask: (taskId: string) => void;
  handleUpdateTask: (taskId: string, updates: Partial<ProjectTask>) => void;
  handleAddSubtask: (taskId: string) => void;
  handleToggleSubtask: (taskId: string, subId: string) => void;
  handleUpdateSubtask: (taskId: string, subId: string, title: string) => void;
}

const KanbanColumn = memo(({ 
  status, 
  tasks, 
  isReadOnly, 
  handleAddTask, 
  handleMoveTask, 
  handleDeleteTask, 
  handleUpdateTask,
  handleAddSubtask,
  handleToggleSubtask,
  handleUpdateSubtask
}: KanbanColumnProps) => (
  <div className="flex-1 flex flex-col gap-6 min-w-[320px]">
    <div className="flex items-center justify-between pb-4 border-b border-accent/10">
      <div className="flex items-center gap-3">
        <div className={cn("h-2.5 w-2.5 rounded-full", status === 'Todo' ? 'bg-accent/20' : status === 'In Progress' ? 'bg-orange-400' : 'bg-green-500')} />
        <h3 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent/60">{status} ({tasks.length})</h3>
      </div>
      {!isReadOnly && (
        <Button variant="ghost" size="icon" onClick={() => handleAddTask(status)} className="h-8 w-8 hover:bg-accent/5 rounded-none border-none transition-none">
          <Plus className="h-4.5 w-4.5 opacity-40" />
        </Button>
      )}
    </div>
    <div className="flex flex-col gap-4 flex-1">
      {tasks.map(task => (
        <motion.div key={task.id} layoutId={task.id} className={cn("group relative bg-white border border-accent/5 p-6 shadow-sm hover:shadow-xl space-y-4", isReadOnly && "opacity-80")}>
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-accent/20 uppercase tracking-widest">{task.id}</span>
            {!isReadOnly && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-none">
                {status !== 'Todo' && <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none border-none transition-none" onClick={() => handleMoveTask(task.id, status === 'Done' ? 'In Progress' : 'Todo')}><ChevronLeft className="h-4 w-4" /></Button>}
                {status !== 'Done' && <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none border-none transition-none" onClick={() => handleMoveTask(task.id, status === 'Todo' ? 'In Progress' : 'Done')}><ChevronRight className="h-4 w-4" /></Button>}
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/40 hover:text-destructive rounded-none border-none transition-none" onClick={() => handleDeleteTask(task.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Textarea 
              value={task.title}
              onChange={(e) => handleUpdateTask(task.id, { title: e.target.value })}
              readOnly={isReadOnly}
              className="bg-transparent border-none p-0 resize-none focus-visible:ring-0 text-base font-bold uppercase tracking-widest leading-tight min-h-0 h-auto shadow-none transition-none"
            />
            <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest opacity-40">
              {task.priority} Priority
            </Badge>
          </div>
          <div className="pt-4 border-t border-accent/5 space-y-3">
            <div className="flex justify-between items-center"><span className="text-[12px] font-bold uppercase tracking-widest text-accent/30">Sub-protocols</span>{!isReadOnly && <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none border-none transition-none" onClick={() => handleAddSubtask(task.id)}><Plus className="h-3.5 w-3.5" /></Button>}</div>
            <div className="space-y-2">
              {(task.subtasks || []).map(sub => (
                <div key={sub.id} className="flex items-center gap-3">
                  <button onClick={() => !isReadOnly && handleToggleSubtask(task.id, sub.id)} disabled={isReadOnly} className={cn("h-4 w-4 border flex items-center justify-center rounded-none transition-none", sub.isCompleted ? "bg-accent border-accent" : "border-accent/20")}>
                    {sub.isCompleted && <Check className="h-2.5 w-2.5 text-white" />}
                  </button>
                  <Input 
                    value={sub.title}
                    onChange={(e) => handleUpdateSubtask(task.id, sub.id, e.target.value)}
                    readOnly={isReadOnly}
                    className={cn(
                      "bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-[13px] font-light italic shadow-none rounded-none transition-none", 
                      sub.isCompleted ? "text-accent/30 line-through" : "text-accent/70"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
));
KanbanColumn.displayName = "KanbanColumn";

export default function ProjectMasterTerminal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, designers, stewards, updateClientProject, inquiries, updateInquiryStatus, collaborators } = useWhyteStore();
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

  const [isReorganizingPlan, setIsReorganizingPlan] = useState(false);
  const [tempInstallments, setTempInstallments] = useState<Installment[]>([]);
  const [reorgTerms, setReorgTerms] = useState("");
  const [reimbursement, setReimbursement] = useState<ReimbursementClaim | null>(null);
  const [studioClaim, setStudioClaim] = useState<StudioClaim | null>(null);

  const [isMasterEditing, setIsMasterEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<ClientProject>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const project = clientProjects.find((p) => p.id === id);
  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return clientProjects.filter(p => p.email === project.email && p.id !== project.id);
  }, [project, clientProjects]);

  const assignedDesigner = designers.find(d => d.id === project?.assignedDesignerId);
  const assignedSteward = stewards.find(s => s.id === project?.assignedStewardId);
  const projectInquiries = inquiries.filter(inq => inq.projectId === id);
  
  const isAuditVerified = project?.financialReportStatus === 'Verified';
  const isPendingActivation = project ? !project.isActivated : false;
  const isReadOnly = isAuditVerified || isPendingActivation || project?.status === 'Completion';

  const reorganizationFinalized = (project?.reorganizationCount || 0) >= 1;

  useEffect(() => {
    if (verifyingInstallment !== null && project) {
      setVerifiedAmount(project.installments[verifyingInstallment].amount);
      setPaymentDate(new Date());
      setTxnCode("");
    }
  }, [verifyingInstallment, project]);

  useEffect(() => {
    if (isReorganizingPlan && project) {
      const reorg = project.reorganization;
      if (reorg && (reorg.status === 'Pending_Agreement' || reorg.status === 'Requested')) {
        setTempInstallments(reorg.proposedInstallments.length > 0 ? [...reorg.proposedInstallments] : [...project.installments]);
        setReorgTerms(reorg.terms || "");
        setReimbursement(reorg.reimbursement || null);
        setStudioClaim(reorg.studioClaim || null);
      } else {
        setTempInstallments([...project.installments]);
        setReorgTerms("");
        setReimbursement(null);
        setStudioClaim(null);
      }
    }
  }, [isReorganizingPlan, project]);

  const handleOpenMasterEdit = () => {
    if (!project) return;
    setEditFormData({ ...project });
    setIsMasterEditing(true);
  };

  const handleSaveMasterEdit = () => {
    if (!project) return;
    updateClientProject(project.id, { 
      ...editFormData,
      lastActivity: "Architectural Dossier Synchronized via Comprehensive Master Edit." 
    });
    setIsMasterEditing(false);
    toast({ title: "Dossier Synchronized", description: "All technical and financial protocols have been updated." });
  };

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

  const handleAddTempInstallment = () => {
    const newIns: Installment = { 
      label: "Custom Payment Schedule", 
      percentage: 0, 
      amount: 0, 
      status: 'Pending' 
    };
    setTempInstallments([...tempInstallments, newIns]);
  };

  const handleRemoveTempInstallment = (idx: number) => {
    if (tempInstallments[idx].status === 'Paid') {
      toast({ title: "Protocol Violation", description: "Verified installments cannot be removed during reorganization.", variant: "destructive" });
      return;
    }
    setTempInstallments(tempInstallments.filter((_, i) => i !== idx));
  };

  const handleUpdateTempInstallment = (idx: number, field: keyof Installment, value: any) => {
    const updated = [...tempInstallments];
    updated[idx] = { ...updated[idx], [field]: value };
    
    const studioClaimAmt = studioClaim?.amount || 0;
    const reimbursementAmt = reimbursement?.amount || 0;
    const targetTotal = project.totalBudget + studioClaimAmt - reimbursementAmt;

    if (field === 'amount') {
      const budget = targetTotal || 1;
      updated[idx].percentage = Math.round((Number(value) / budget) * 100);
    }
    setTempInstallments(updated);
  };

  const handleSyncFinalToBalance = (idx: number) => {
    const otherAllocations = tempInstallments.reduce((sum, ins, i) => i === idx ? sum : sum + ins.amount, 0);
    const studioClaimAmt = studioClaim?.amount || 0;
    const reimbursementAmt = reimbursement?.amount || 0;
    
    const targetTotal = project.totalBudget + studioClaimAmt - reimbursementAmt;
    const balanceNeeded = targetTotal - otherAllocations;
    
    const updated = [...tempInstallments];
    updated[idx] = { 
      ...updated[idx], 
      amount: balanceNeeded,
      percentage: Math.round((balanceNeeded / (targetTotal || 1)) * 100)
    };
    setTempInstallments(updated);
    toast({ title: "Reconciliation Balance Established" });
  };

  const handleProposeReorganization = () => {
    const reorg: ReorganizationDetails = {
      status: 'Pending_Agreement',
      requestedBy: project.reorganization?.status === 'Requested' ? project.reorganization.requestedBy : 'Admin',
      terms: reorgTerms,
      proposedInstallments: tempInstallments,
      clientAgreed: false,
      stewardWitnessed: false,
      reimbursement: reimbursement || undefined,
      studioClaim: studioClaim || undefined
    };
    
    updateClientProject(project.id, { 
      reorganization: reorg,
      lastActivity: "Financing Protocol: Custom Payout Plan Proposed for Client Agreement"
    });
    setIsReorganizingPlan(false);
    toast({ title: "Proposal Transmitted", description: "The client must now authorize the reorganization terms." });
  };

  const handleAddReimbursement = () => {
    setReimbursement({ type: 'Overpayment Return', amount: 0, rationale: "" });
  };

  const handleAddStudioClaim = () => {
    setStudioClaim({ type: 'Project Expense', amount: 0, rationale: "" });
  };

  const totalPaid = project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const remainingBalance = project.totalBudget - totalPaid;
  const isLegerSynchronized = Math.abs(remainingBalance) < 1;
  const isOverpaid = remainingBalance < -1;

  const temporal = (() => {
    if (!project.isActivated) return { label: "Temporal Status", value: "Locked", icon: <ZapOff className="h-5 w-5" />, sub: "Pending Activation" };
    const startStr = project.startDate || format(new Date(), "MMM dd, yyyy");
    const endStr = project.endDate || format(new Date(), "MMM dd, yyyy");
    const start = parse(startStr, "MMM dd, yyyy", new Date());
    const end = parse(endStr, "MMM dd, yyyy", new Date());
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

  const tempTotalAssigned = tempInstallments.reduce((sum, i) => sum + i.amount, 0);
  const tempReimbursementAmt = reimbursement?.amount || 0;
  const tempStudioClaimAmt = studioClaim?.amount || 0;
  
  const targetTotal = project.totalBudget + tempStudioClaimAmt - tempReimbursementAmt;
  const tempVariance = tempTotalAssigned - targetTotal;

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

  const handleUpdateSubtask = (taskId: string, subId: string, title: string) => {
    if (isReadOnly) return;
    const updatedTasks = (project.tasks || []).map(task => {
      if (task.id === taskId) {
        const subs = (task.subtasks || []).map(s => s.id === subId ? { ...s, title } : s);
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

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-accent/40 hover:text-accent group border-none bg-transparent rounded-none transition-none"><ArrowLeft className="h-4 w-4" /><span className="text-[12px] font-bold uppercase tracking-[0.3em]">Back to Master Registry</span></Link>
        {isAuditVerified && (<Alert className="rounded-none border-green-600/20 bg-green-600/[0.02]"><Lock className="h-4 w-4 text-green-600" /><AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-green-600">Dossier Locked — Audit Verified</AlertTitle><AlertDescription className="text-[13px] font-light italic">This commission has been reconciled and verified. All protocols are now read-only.</AlertDescription></Alert>)}
        {project.reorganization?.status === 'Requested' && (
          <Alert className="rounded-none border-orange-500/20 bg-orange-50 p-6 shadow-xl">
            <ShieldAlert className="h-5 w-5 text-orange-600" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full ml-4">
              <div className="space-y-1">
                <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-orange-600">Financing Protocol Review Requested</AlertTitle>
                <AlertDescription className="text-[13px] font-light italic text-orange-600/80">
                  {project.reorganization.requestedBy === 'Designer' ? "The Creative Lead has documented incurring site costs on the client's behalf." : "The client has requested a formal review of the current payout schedule."} Open the Financing Protocol Workbench to initialize a new proposal.
                </AlertDescription>
              </div>
              <Button onClick={() => setIsReorganizingPlan(true)} className="bg-orange-600 text-white rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-bold shadow-lg flex gap-3 border-none transition-none"><FileEdit className="h-4 w-4" /> Initialize Review</Button>
            </div>
          </Alert>
        )}
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
                <SelectTrigger className="rounded-none border-none h-8 p-0 text-[13px] font-bold uppercase tracking-widest text-accent focus:ring-0 w-44 bg-transparent shadow-none transition-none">
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
              <span className="text-[12px] font-bold uppercase tracking-widest text-accent/40 block mb-1">Commission Tier</span>
              <Badge className="rounded-none uppercase tracking-widest text-[12px] bg-accent text-white py-1">{project.tier}</Badge>
            </div>
            <div className="pl-4">
              <Button onClick={handleOpenMasterEdit} variant="outline" className="h-12 px-6 rounded-none border-accent/10 text-accent uppercase tracking-widest text-[10px] font-bold hover:bg-accent hover:text-white shadow-sm flex gap-3 transition-none">
                <Settings2 className="h-4 w-4" /> Comprehensive Edit
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-9">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><Layout className="h-4 w-4" /> Overview</TabsTrigger>
              <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><PlayCircle className="h-4 w-4" /> Workflow</TabsTrigger>
              <TabsTrigger value="communications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><MessageSquare className="h-4 w-4" /> Communications</TabsTrigger>
              <TabsTrigger value="logs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><ClipboardList className="h-4 w-4" /> Site Logs</TabsTrigger>
              <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><Wallet className="h-4 w-4" /> Ledger</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="m-0">
              <Card className="rounded-none border-accent/5 p-10 space-y-12 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-accent/40" /><h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40">Architectural Narrative</h3></div>
                      <p className="text-2xl font-light italic leading-relaxed text-accent/80 border-l-2 border-accent/10 pl-8">"{project.description || "Narrative pending synchronization."}"</p>
                    </div>
                    <div className="space-y-6 pt-10 border-t border-accent/5">
                      <div className="flex items-center gap-3"><LayoutList className="h-4 w-4 text-accent/40" /><h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent/40">Scope of Works</h3></div>
                      <p className="text-lg font-light italic leading-relaxed text-accent/70 border-l-2 border-accent/10 pl-8">"{project.workScope || "Technical scope defined in contract archives."}"</p>
                    </div>
                  </div>
                  <div className="space-y-10 border-l border-accent/5 pl-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3"><Compass className="h-4 w-4 text-accent/40" /><h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40">Spatial Parameters</h3></div>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-secondary/30 p-6 border border-accent/5">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-accent/40 mb-1">Capacity</p>
                          <p className="text-3xl font-headline italic">{project.roomsCount || 'N/A'} Primary Rooms</p>
                        </div>
                        <div className="bg-secondary/30 p-6 border border-accent/5">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-accent/40 mb-1">Classification</p>
                          <p className="text-2xl font-headline italic">{project.tier} Service Level</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6 pt-10 border-t border-accent/5">
                      <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-accent/40" /><h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40">Temporal Protocol</h3></div>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1"><p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Commencement</p><p className="text-lg font-headline italic">{project.startDate}</p></div>
                          <div className="space-y-1"><p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Delivery Target</p><p className="text-lg font-headline italic">{project.endDate}</p></div>
                        </div>
                        {temporal && (<div className={cn("p-4 flex items-center justify-between", temporal.isUrgent ? "bg-destructive/5 text-destructive" : "bg-accent/5 text-accent")}><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center shrink-0">{temporal.icon}</div><div><p className="text-[9px] font-bold uppercase tracking-widest opacity-60">{temporal.label}</p><p className="text-[10px] font-bold uppercase tracking-widest">{temporal.sub}</p></div></div><p className="text-2xl font-headline italic">{temporal.value}</p></div>)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="m-0">
              {isPendingActivation ? (
                <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 space-y-6">
                  <div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="h-8 w-8 text-accent/20" />
                  </div>
                  <p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">Implementation Workflow Locked — Authorize Initialization</p>
                </div>
              ) : (
                <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar">
                  <KanbanColumn 
                    status="Todo" 
                    tasks={(project.tasks || []).filter(t => t.status === 'Todo')}
                    isReadOnly={isReadOnly}
                    handleAddTask={handleAddTask}
                    handleMoveTask={handleMoveTask}
                    handleDeleteTask={handleDeleteTask}
                    handleUpdateTask={handleUpdateTask}
                    handleAddSubtask={handleAddSubtask}
                    handleToggleSubtask={handleToggleSubtask}
                    handleUpdateSubtask={handleUpdateSubtask}
                  />
                  <KanbanColumn 
                    status="In Progress" 
                    tasks={(project.tasks || []).filter(t => t.status === 'In Progress')}
                    isReadOnly={isReadOnly}
                    handleAddTask={handleAddTask}
                    handleMoveTask={handleMoveTask}
                    handleDeleteTask={handleDeleteTask}
                    handleUpdateTask={handleUpdateTask}
                    handleAddSubtask={handleAddSubtask}
                    handleToggleSubtask={handleToggleSubtask}
                    handleUpdateSubtask={handleUpdateSubtask}
                  />
                  <KanbanColumn 
                    status="Done" 
                    tasks={(project.tasks || []).filter(t => t.status === 'Done')}
                    isReadOnly={isReadOnly}
                    handleAddTask={handleAddTask}
                    handleMoveTask={handleMoveTask}
                    handleDeleteTask={handleDeleteTask}
                    handleUpdateTask={handleUpdateTask}
                    handleAddSubtask={handleAddSubtask}
                    handleToggleSubtask={handleToggleSubtask}
                    handleUpdateSubtask={handleUpdateSubtask}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="communications" className="m-0 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {projectInquiries.map((inq) => (
                  <Card key={inq.id} className={cn("rounded-none border-accent/5 p-8 bg-white shadow-lg group relative", inq.urgency === 'critical' && "border-l-4 border-l-destructive")}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{inq.id}</span>
                          <Badge variant="outline" className={cn("rounded-none text-[9px] font-bold uppercase tracking-widest", inq.urgency === 'critical' ? 'text-destructive border-destructive/20 bg-destructive/5' : 'text-accent border-accent/20 bg-accent/5')}>
                            {inq.urgency} Urgency
                          </Badge>
                          <Badge className="rounded-none text-[9px] bg-accent text-white uppercase tracking-widest font-bold px-3 py-1">{inq.status}</Badge>
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
                          <SelectTrigger className="rounded-none border-accent/10 h-10 text-[11px] font-bold shadow-none bg-transparent transition-none">
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
                {!isAuditVerified && <Button onClick={() => setIsAddingReport(true)} className="rounded-none h-12 px-8 bg-accent text-white uppercase tracking-widest text-[10px] font-bold flex gap-3 shadow-xl border-none transition-none"><Plus className="h-4 w-4" /> New Site Entry</Button>}
              </div>
              <div className="space-y-6">
                {(project.siteReports || []).map((log, index) => (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card className="rounded-none border-accent/5 bg-white group shadow-sm hover:shadow-md transition-none overflow-hidden">
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
                 <div className="absolute top-0 right-0 p-4 opacity-5"><Landmark className="h-24 w-24" /></div>
                 <div className="relative z-10 space-y-8">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <Scale className="h-5 w-5 text-accent/40" />
                       <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent">Financial Reconciliation Index</h3>
                     </div>
                     {!isAuditVerified && (
                       <div className="flex gap-4">
                         {project.reorganization?.status === 'Pending_Agreement' && (
                           <Badge variant="outline" className="rounded-none bg-orange-50 text-orange-600 border-orange-200 uppercase tracking-widest text-[9px] px-4 py-2 flex gap-2">
                             <Clock className="h-3 w-3" /> Awaiting Client Agreement
                           </Badge>
                         )}
                         <Button 
                            onClick={() => setIsReorganizingPlan(true)} 
                            disabled={reorganizationFinalized}
                            variant="ghost" 
                            className="h-10 px-6 rounded-none text-accent uppercase tracking-widest text-[10px] font-bold border border-accent/10 hover:bg-accent hover:text-white shadow-sm transition-none"
                          >
                           <Settings2 className="h-4 w-4 mr-2" /> 
                           {reorganizationFinalized ? 'Reorganization Locked' : project.reorganization?.status === 'Pending_Agreement' ? 'Review Proposal' : 'Reorganize Financing'}
                         </Button>
                       </div>
                     )}
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
                     const isSpecial = ins.type === 'Reimbursement' || ins.type === 'Studio_Claim';
                     const projectedAmount = isSpecial ? 0 : project.totalBudget * (ins.percentage / 100);
                     const variance = ins.amount - projectedAmount;
                     const hasVariance = !isSpecial && ins.status === 'Paid' && Math.abs(variance) > 1;

                     return (
                       <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-10 gap-8 hover:bg-accent/[0.01] transition-none">
                         <div className="flex items-center gap-8">
                           <div className={cn(
                             "h-12 w-12 rounded-full flex items-center justify-center shrink-0 border transition-none", 
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
                               {ins.type === 'Reimbursement' && <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-widest border-blue-200 text-blue-600 bg-blue-50 font-bold px-2 py-0.5">Credit Return</Badge>}
                               {ins.type === 'Studio_Claim' && <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-widest border-orange-200 text-orange-600 bg-orange-50 font-bold px-2 py-0.5">Price Adjustment</Badge>}
                             </div>
                             <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                               <span>Ref: {ins.transactionCode || 'Awaiting Sync'}</span>
                               <div className="h-1.5 w-1.5 rounded-full bg-accent/10" />
                               <span>{ins.date || 'TBD'}</span>
                               {!isSpecial && (
                                 <>
                                   <div className="h-1.5 w-1.5 rounded-full bg-accent/10" />
                                   <span>{ins.percentage}% Allocation Protocol (Target: KES {projectedAmount.toLocaleString()})</span>
                                 </>
                               )}
                             </div>
                           </div>
                         </div>
                         <div className="flex items-center gap-12 justify-between lg:justify-end">
                           <div className="text-right">
                             <p className="text-[11px] font-bold uppercase tracking-widest text-accent/30 mb-1">
                               {ins.status === 'Paid' ? 'Liquidated Value' : 'Projected Value'}
                             </p>
                             <p className={cn(
                                "text-2xl font-headline italic", 
                                ins.status === 'Pending' ? 'text-orange-600' : 
                                ins.type === 'Reimbursement' ? 'text-blue-600' : 'text-accent'
                              )}>
                               {ins.type === 'Reimbursement' ? "-" : ""}KES {Math.abs(ins.amount).toLocaleString()}
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
                             <Button onClick={() => setVerifyingInstallment(i)} variant="outline" className="rounded-none h-12 px-8 border-accent/20 text-[11px] uppercase tracking-widest font-bold hover:bg-accent hover:text-white shadow-sm transition-none">
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
        </div>

        <div className="lg:col-span-3 space-y-8">
          <Card className="rounded-none border-accent/10 bg-accent p-8 text-white space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10"><LayoutList className="h-24 w-24" /></div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 relative z-10">Portfolio Context</h3>
            <div className="space-y-6 relative z-10">
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-bold text-white/60">Currently Auditing</p>
                <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                  <p className="text-[9px] font-bold uppercase text-white/40 tracking-widest">{project.id}</p>
                  <p className="text-sm font-bold uppercase tracking-widest">{project.project}</p>
                </div>
              </div>
              
              {relatedProjects.length > 0 ? (
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <p className="text-[10px] uppercase font-bold text-white/60">Other Linked Dossiers</p>
                  <div className="space-y-3">
                    {relatedProjects.map(rp => (
                      <Link key={rp.id} href={`/admin/clients/${rp.id}`} className="block p-4 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-none group">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[8px] font-bold uppercase text-white/30">{rp.id}</span>
                          <Badge variant="ghost" className="text-[7px] text-white/40 p-0 uppercase">{rp.status}</Badge>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest truncate group-hover:text-white transition-none">{rp.project}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-6 border-t border-white/10 italic text-[10px] text-white/30">
                  No other active commissions linked to this client identity.
                </div>
              )}
            </div>
          </Card>

          <div className="p-8 border border-dashed border-accent/20 bg-secondary/10 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 italic leading-relaxed">
              Dossier synchronization is governed by Studio Protocol. Unauthorized extraction is logged.
            </p>
          </div>
        </div>
      </div>

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
                    <SelectTrigger className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold shadow-none bg-transparent transition-none">
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
                    <SelectTrigger className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold shadow-none bg-transparent transition-none">
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
                <Textarea value={newReport.content} onChange={(e) => setNewReport({...newReport, content: e.target.value})} placeholder="Administrative site notes..." className="min-h-[150px] rounded-none border-accent/10 p-6 font-light italic leading-relaxed focus:ring-accent bg-secondary/10 transition-none" />
              </div>
            </div>
            <DialogFooter><Button onClick={handleAddReport} disabled={!newReport.content} className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[10px] font-bold shadow-2xl border-none transition-none">Transmit to Registry</Button></DialogFooter>
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
                <div className="absolute top-0 right-0 p-4 opacity-5"><Banknote className="h-14 w-14" /></div>
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
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-[13px] border-accent/20 font-bold uppercase tracking-widest shadow-none bg-transparent transition-none">
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
                      className="rounded-none border-accent/20 h-14 text-xl font-headline italic transition-none" 
                      value={verifiedAmount} 
                      onChange={(e) => setVerifiedAmount(Number(e.target.value))} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[13px] font-bold uppercase tracking-widest opacity-60">Transaction Reference</Label>
                  <Input placeholder="E.g., TRX-9921-WHYTE" className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] font-medium transition-none" value={txnCode} onChange={(e) => setTxnCode(e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl border-none transition-none" onClick={handleVerifyPayment} disabled={isVerifying || !txnCode || verifiedAmount <= 0}>
                {isVerifying ? <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Syncing...</span> : "Authorize Entry"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReorganizingPlan} onOpenChange={setIsReorganizingPlan}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-4xl p-0 overflow-hidden bg-white max-h-[90vh] flex flex-col">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar flex-1">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Coins className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Financing Protocol Workbench</span></div>
              <DialogTitle className="text-4xl font-headline italic">Reorganize Financing</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base">Transition to a custom payout schedule. A formal agreement will be generated for Client authorization and Steward witnessing.</DialogDescription>
            </DialogHeader>

            {project.reorganization?.status === 'Pending_Agreement' && (
              <Alert className="rounded-none border-orange-500/20 bg-orange-50 p-6">
                <Clock className="h-5 w-5 text-orange-600" />
                <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-orange-600">Pending Protocol Agreement</AlertTitle>
                <AlertDescription className="text-[13px] font-light italic text-orange-600/80">
                  A proposal is currently active. Modifying it now will reset the Client and Steward signature protocols.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-8 bg-secondary/30 border border-accent/5">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Base commitment</p>
                <p className="text-lg font-headline italic">KES {project.totalBudget.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600/60">Studio Claim (+)</p>
                <p className="text-lg font-headline italic text-orange-600">KES {tempStudioClaimAmt.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Reimbursement (-)</p>
                <p className="text-lg font-headline italic text-accent">KES {tempReimbursementAmt.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Target Total</p>
                <p className="text-lg font-headline italic">KES {targetTotal.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className={cn("text-[10px] font-bold uppercase tracking-widest", tempVariance === 0 ? "text-green-600" : "text-orange-600")}>Plan Variance</p>
                <p className={cn("text-lg font-headline italic", tempVariance === 0 ? "text-green-600" : "text-orange-600")}>KES {Math.abs(tempVariance).toLocaleString()} {tempVariance > 0 ? '(Over)' : tempVariance < 0 ? '(Under)' : ''}</p>
              </div>
            </div>

            <div className="space-y-10">
              {/* STUDIO CLAIM SECTION */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-accent/5 pb-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 flex items-center gap-3"><TrendingUp className="h-4 w-4" /> Studio Claim Protocol</h4>
                  {!studioClaim && <Button onClick={handleAddStudioClaim} variant="outline" className="h-10 px-6 rounded-none text-[10px] uppercase font-bold tracking-widest border-accent/10 hover:bg-accent hover:text-white bg-transparent shadow-none transition-none">Raise Claim</Button>}
                </div>
                {studioClaim && (
                  <div className="p-8 border border-orange-500/20 bg-orange-50/30 space-y-6 relative group">
                    <Button onClick={() => setStudioClaim(null)} variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 text-destructive/40 hover:text-destructive rounded-none border-none transition-none"><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Claim Classification</Label>
                        <Select value={studioClaim.type} onValueChange={(v: any) => setStudioClaim({...studioClaim, type: v})}>
                          <SelectTrigger className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold shadow-none bg-white transition-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            <SelectItem value="Material Procurement">Material Procurement</SelectItem>
                            <SelectItem value="Project Expense">Project Expense</SelectItem>
                            <SelectItem value="Service Scope Adjustment">Service Scope Adjustment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Adjustment Value (KES)</Label>
                        <Input type="number" value={studioClaim.amount} onChange={(e) => setStudioClaim({...studioClaim, amount: Number(e.target.value)})} className="rounded-none h-12 border-accent/10 text-xl font-headline italic bg-white" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[11px) font-bold uppercase tracking-widest opacity-60">Forensic Rationale</Label>
                      <Textarea value={studioClaim.rationale} onChange={(e) => setStudioClaim({...studioClaim, rationale: e.target.value})} placeholder="Detail the technical or architectural justification for this price adjustment..." className="min-h-[100px] rounded-none border-accent/10 p-6 font-light italic text-base focus:ring-accent bg-white transition-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* REIMBURSEMENT SECTION */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-accent/5 pb-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 flex items-center gap-3"><RotateCcw className="h-4 w-4" /> Reimbursement Protocol</h4>
                  {!reimbursement && <Button onClick={handleAddReimbursement} variant="outline" className="h-10 px-6 rounded-none text-[10px] uppercase font-bold tracking-widest border-accent/10 hover:bg-accent hover:text-white bg-transparent shadow-none transition-none">Add Return</Button>}
                </div>
                {reimbursement && (
                  <div className="p-8 border border-accent/5 bg-secondary/5 space-y-6 relative group">
                    <Button onClick={() => setReimbursement(null)} variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 text-destructive/40 hover:text-destructive rounded-none border-none transition-none"><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Claim Classification</Label>
                        <Select value={reimbursement.type} onValueChange={(v: any) => setReimbursement({...reimbursement, type: v})}>
                          <SelectTrigger className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold shadow-none bg-white transition-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            <SelectItem value="Overpayment Return">Overpayment Return</SelectItem>
                            <SelectItem value="Site Damage Adjustment">Site Damage Adjustment</SelectItem>
                            <SelectItem value="Operational Credit">Operational Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Return Value (KES)</Label>
                        <Input type="number" value={reimbursement.amount} onChange={(e) => setReimbursement({...reimbursement, amount: Number(e.target.value)})} className="rounded-none h-12 border-accent/10 text-xl font-headline italic bg-white" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Forensic Rationale</Label>
                      <Textarea value={reimbursement.rationale} onChange={(e) => setReimbursement({...reimbursement, rationale: e.target.value})} placeholder="Detail the technical or financial justification for this return..." className="min-h-[100px] rounded-none border-accent/10 p-6 font-light italic text-base focus:ring-accent bg-white transition-none" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Agreement Terms & Rationale</Label>
                  <Textarea 
                    value={reorgTerms} 
                    onChange={(e) => setReorgTerms(e.target.value)} 
                    placeholder="Detail the rationale for reorganization and any specific legal clauses..." 
                    className="min-h-[120px] rounded-none border-accent/10 p-6 font-light italic text-base focus:ring-accent bg-secondary/5 transition-none"
                  />
                </div>

                <div className="flex items-center justify-between border-b border-accent/5 pb-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Proposed Payout Schedule</h4>
                  <Button onClick={handleAddTempInstallment} variant="outline" className="h-10 px-6 rounded-none text-[10px] uppercase font-bold tracking-widest border-accent/10 hover:bg-accent hover:text-white bg-transparent shadow-none transition-none">
                    <Plus className="h-3.5 w-3.5 mr-2" /> Append Installment
                  </Button>
                </div>

                <div className="space-y-4">
                  {tempInstallments.map((ins, idx) => (
                    <div key={idx} className={cn(
                      "p-6 border flex flex-col md:flex-row items-center gap-6 rounded-none",
                      ins.status === 'Paid' ? "bg-green-50/50 border-green-600/10" : "bg-white border-accent/5 hover:border-accent/20"
                    )}>
                      <div className="flex-1 space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                          <div className="md:col-span-5 space-y-2">
                            <Label className="text-[10px] uppercase font-bold opacity-40">Label</Label>
                            <Input 
                              value={ins.label} 
                              onChange={(e) => handleUpdateTempInstallment(idx, 'label', e.target.value)}
                              readOnly={ins.status === 'Paid'}
                              className="rounded-none h-10 border-accent/10 text-xs font-bold uppercase tracking-widest transition-none"
                            />
                          </div>
                          <div className="md:col-span-4 space-y-2">
                            <Label className="text-[10px] uppercase font-bold opacity-40">Amount (KES)</Label>
                            <div className="relative">
                              <Input 
                                type="number"
                                value={ins.amount} 
                                onChange={(e) => handleUpdateTempInstallment(idx, 'amount', Number(e.target.value))}
                                readOnly={ins.status === 'Paid'}
                                className="rounded-none h-10 border-accent/10 text-sm font-bold pl-8 pr-12 transition-none"
                              />
                              <Coins className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-accent/20" />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-accent/40">{ins.percentage}%</span>
                            </div>
                          </div>
                          <div className="md:col-span-3 flex gap-2">
                            {ins.status === 'Pending' && (
                              <>
                                <Button onClick={() => handleSyncFinalToBalance(idx)} variant="ghost" size="icon" className="h-10 w-10 text-accent/40 hover:text-accent hover:bg-accent/5 rounded-none border-none transition-none" title="Sync to Remaining Balance"><RefreshCcw className="h-4 w-4" /></Button>
                                <Button onClick={() => handleRemoveTempInstallment(idx)} variant="ghost" size="icon" className="h-10 w-10 text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-none border-none transition-none" title="Remove Installment"><Trash2 className="h-4 w-4" /></Button>
                              </>
                            )}
                            {ins.status === 'Paid' && <Badge className="bg-green-600 text-white rounded-none uppercase text-[8px] h-10 px-4 flex items-center gap-2"><Lock className="h-3 w-3" /> Verified</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-10 border-t border-accent/5 bg-secondary/5 flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-accent/40 italic">
              <ShieldAlert className="h-4 w-4" /> Zero plan variance required for authorization.
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setIsReorganizingPlan(false)} variant="ghost" className="rounded-none h-14 px-8 text-[11px] font-bold uppercase tracking-widest bg-transparent border-none transition-none">Abort Reorganization</Button>
              <Button 
                onClick={handleProposeReorganization} 
                disabled={Math.abs(tempVariance) > 1 || !reorgTerms}
                className="bg-accent text-white rounded-none h-14 px-12 uppercase tracking-widest text-[11px] font-bold shadow-2xl flex gap-3 border-none transition-none"
              >
                Propose for Agreement <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMasterEditing} onOpenChange={setIsMasterEditing}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <DialogHeader className="p-12 pb-8 space-y-4">
            <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Architectural Dossier Synchronization</span></div>
            <DialogTitle className="text-4xl font-headline italic">Edit Briefing: {project.id}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="identity" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 mb-8 px-12 overflow-x-auto custom-scrollbar">
              <TabsTrigger value="identity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><User className="h-4 w-4" /> Identity</TabsTrigger>
              <TabsTrigger value="briefing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><LayoutList className="h-4 w-4" /> Scope</TabsTrigger>
              <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Calculator className="h-4 w-4" /> Framework</TabsTrigger>
              <TabsTrigger value="network" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Users className="h-4 w-4" /> Network</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto px-12 pb-12 custom-scrollbar">
              <TabsContent value="identity" className="m-0 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Client Identity</Label><Input value={editFormData.name || ""} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="rounded-none h-14 text-lg border-accent/20 focus:ring-accent transition-none" /></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Communication Protocol (Email)</Label><Input type="email" value={editFormData.email || ""} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="rounded-none h-14 text-lg border-accent/20 focus:ring-accent transition-none" /></div>
                </div>
                <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label><Input value={editFormData.project || ""} onChange={(e) => setEditFormData({...editFormData, project: e.target.value})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20 focus:ring-accent transition-none" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-accent/5">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commencement Protocol</Label>
                    <Input value={editFormData.startDate || ""} onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})} placeholder="MMM DD, YYYY" className="rounded-none h-14 border-accent/20 transition-none" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Projected Delivery Target</Label>
                    <Input value={editFormData.endDate || ""} onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})} placeholder="MMM DD, YYYY" className="rounded-none h-14 border-accent/20 transition-none" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="briefing" className="m-0 space-y-12">
                <div className="space-y-8">
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Architectural Narrative</Label><Textarea value={editFormData.description || ""} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} placeholder="Creative briefing summary..." className="min-h-[180px] rounded-none p-8 font-light italic text-xl border-accent/20 leading-relaxed focus:ring-accent shadow-none transition-none" /></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Scope of Works</Label><Textarea value={editFormData.workScope || ""} onChange={(e) => setEditFormData({...editFormData, workScope: e.target.value})} placeholder="Structural and implementation requirements..." className="min-h-[180px] rounded-none p-8 font-light italic text-base border-accent/20 leading-relaxed focus:ring-accent bg-secondary/5 shadow-none transition-none" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-accent/5">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2"><Compass className="h-3.5 w-3.5" /> Spatial Parameters (Rooms)</Label>
                      <Input type="number" value={editFormData.roomsCount || 0} onChange={(e) => setEditFormData({...editFormData, roomsCount: Number(e.target.value)})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20 focus:ring-accent transition-none" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="m-0 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                    <Select value={editFormData.tier} onValueChange={(v: any) => setEditFormData({...editFormData, tier: v})}>
                      <SelectTrigger className="rounded-none h-14 border-accent/20 uppercase tracking-widest text-[12px] font-bold focus:ring-accent shadow-none bg-transparent transition-none"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Golden">Golden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Capital Commitment (KES)</Label><Input type="number" value={editFormData.totalBudget || 0} onChange={(e) => setEditFormData({...editFormData, totalBudget: Number(e.target.value)})} className="rounded-none h-14 text-3xl font-headline italic border-accent/20 focus:ring-accent transition-none" /></div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Assigned Financial Steward</Label>
                  <Select value={editFormData.assignedStewardId} onValueChange={(v) => setEditFormData({...editFormData, assignedStewardId: v})}>
                    <SelectTrigger className="rounded-none border-accent/20 h-14 text-[12px] font-bold uppercase tracking-widest focus:ring-accent shadow-none bg-transparent transition-none"><SelectValue placeholder="Select Steward" /></SelectTrigger>
                    <SelectContent className="rounded-none">{stewards.map(s => <SelectItem key={s.id} value={s.id} className="uppercase text-[11px] font-bold py-3">{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="network" className="m-0 space-y-10">
                <div className="flex justify-between items-center pb-6 border-b border-accent/5"><h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent/60">Partner Matrix</h4><Button variant="outline" size="sm" onClick={() => setEditFormData(prev => ({ ...prev, vendorAllocations: [...(prev.vendorAllocations || []), { id: `VA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, vendorName: "", role: "", category: "Vendor", costType: "Fixed", costValue: 0, timelineDays: 0, materials: [] }] }))} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white bg-transparent shadow-none transition-none"><Plus className="h-3.5 w-3.5 mr-2" /> Link Resource</Button></div>
                <div className="space-y-6">
                  {(editFormData.vendorAllocations || []).map((alloc, idx) => (
                    <div key={alloc.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-8 relative group hover:bg-white hover:shadow-xl transition-none">
                      <Button variant="ghost" size="icon" onClick={() => setEditFormData(prev => ({ ...prev, vendorAllocations: prev.vendorAllocations?.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive rounded-none border-none transition-none"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Registry Resource</Label>
                          <Select value={alloc.vendorName} onValueChange={(v) => {
                            const updated = [...(editFormData.vendorAllocations || [])];
                            updated[idx] = { ...updated[idx], vendorName: v };
                            setEditFormData({...editFormData, vendorAllocations: updated});
                          }}>
                            <SelectTrigger className="rounded-none h-12 text-[12px] font-bold uppercase border-accent/10 focus:ring-accent shadow-none bg-transparent transition-none"><SelectValue placeholder="SELECT FROM REGISTRY" /></SelectTrigger>
                            <SelectContent className="rounded-none">{collaborators.map(c => <SelectItem key={c.id} value={c.name} className="uppercase text-[10px] font-bold tracking-widest">{c.name} ({c.specialty})</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Professional Role</Label><Input value={alloc.role} onChange={(e) => {
                          const updated = [...(editFormData.vendorAllocations || [])];
                          updated[idx] = { ...updated[idx], role: e.target.value };
                          setEditFormData({...editFormData, vendorAllocations: updated});
                        }} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-accent/10 focus:ring-accent transition-none" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
          <DialogFooter className="p-12 border-t border-accent/5 bg-secondary/5 flex justify-between">
            <Button variant="ghost" onClick={() => setIsMasterEditing(false)} className="rounded-none h-14 px-8 uppercase tracking-widest text-[12px] font-bold text-accent/40 bg-transparent border-none transition-none">Abort Protocol Sync</Button>
            <Button onClick={handleSaveMasterEdit} className="bg-accent text-white rounded-none h-16 px-16 uppercase tracking-widest text-[12px] font-bold shadow-2xl flex gap-4 border-none transition-none">Authorize Synchronization <ChevronRight className="h-5 w-5" /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
