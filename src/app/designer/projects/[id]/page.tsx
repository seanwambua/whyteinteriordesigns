"use client";

import { use, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, ProjectTask, SiteReport, SubTask, Inquiry } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Camera, 
  ClipboardList, 
  AlertTriangle,
  Activity,
  History,
  Info,
  Loader2,
  Lock,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Check,
  PencilRuler,
  Layout,
  MessageSquare,
  Wallet,
  Mail,
  PlayCircle,
  CreditCard,
  Timer,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parse, differenceInDays, isValid, format } from "date-fns";

export default function DesignerProjectWorkbench({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject, inquiries } = useWhyteStore();
  const { toast } = useToast();
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("workflow");
  const [isAddingReport, setIsAddingReport] = useState(false);
  const [newReport, setNewReport] = useState<Partial<SiteReport>>({
    type: 'Progress',
    content: '',
    urgency: 'Normal'
  });

  const project = clientProjects.find(p => p.id === id);
  const projectInquiries = inquiries.filter(inq => inq.projectId === id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !project) return null;

  const isReadOnly = project.financialReportStatus === 'Verified' || project.isArchived;

  const handleUpdateTask = (taskId: string, updates: Partial<ProjectTask>) => {
    if (isReadOnly) return;
    const updatedTasks = (project.tasks || []).map(t => t.id === taskId ? { ...t, ...updates } : t);
    updateClientProject(project.id, { tasks: updatedTasks });
  };

  const handleMoveTask = (taskId: string, newStatus: ProjectTask['status']) => {
    if (isReadOnly) return;
    const updatedTasks = (project.tasks || []).map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    const completed = updatedTasks.filter(t => t.status === 'Done').length;
    const progress = Math.round((completed / Math.max(1, updatedTasks.length)) * 100);
    updateClientProject(project.id, { 
      tasks: updatedTasks, 
      progress, 
      lastActivity: `Site Protocol Synchronized: ${taskId} moved to ${newStatus}` 
    });
    toast({ title: "Protocol Synchronized" });
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
    const updatedTasks = (project.tasks || []).map(t => {
      if (t.id === taskId) {
        const sub: SubTask = { id: `S-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "New Sub-protocol", isCompleted: false };
        return { ...t, subtasks: [...(t.subtasks || []), sub] };
      }
      return t;
    });
    updateClientProject(project.id, { tasks: updatedTasks });
  };

  const handleToggleSubtask = (taskId: string, subId: string) => {
    if (isReadOnly) return;
    const updatedTasks = (project.tasks || []).map(t => {
      if (t.id === taskId) {
        const subs = (t.subtasks || []).map(s => s.id === subId ? { ...s, isCompleted: !s.isCompleted } : s);
        return { ...t, subtasks: subs };
      }
      return t;
    });
    updateClientProject(project.id, { tasks: updatedTasks });
  };

  const handleAddReport = () => {
    if (!newReport.content || isReadOnly) return;
    const report: SiteReport = {
      id: `LOG-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      type: newReport.type as SiteReport['type'],
      content: newReport.content,
      urgency: newReport.urgency as SiteReport['urgency']
    };
    updateClientProject(project.id, { 
      siteReports: [report, ...(project.siteReports || [])],
      lastActivity: `Site Entry Synchronized: ${report.id}`
    });
    setIsAddingReport(false);
    setNewReport({ type: 'Progress', content: '', urgency: 'Normal' });
    toast({ title: "Site Log Transmitted" });
  };

  const totalPaid = project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const remainingBalance = (project.totalBudget || 0) - totalPaid;

  const temporal = (() => {
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
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className={cn("h-2.5 w-2.5 rounded-full", status === 'Todo' ? 'bg-neutral-200' : status === 'In Progress' ? 'bg-orange-400' : 'bg-green-500')} />
          <h3 className="text-[13px] font-bold uppercase tracking-[0.3em] text-muted-foreground">{status} ({tasks.length})</h3>
        </div>
        {!isReadOnly && (
          <Button variant="ghost" size="icon" onClick={() => handleAddTask(status)} className="h-8 w-8 hover:bg-neutral-100">
            <Plus className="h-4.5 w-4.5 opacity-40" />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {tasks.map(task => (
          <motion.div key={task.id} layoutId={task.id} className={cn("group relative bg-white border border-neutral-100 p-6 shadow-sm hover:shadow-xl transition-all space-y-4", isReadOnly && "opacity-80")}>
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
            <div className="pt-4 border-t border-neutral-50 space-y-3">
              <div className="flex justify-between items-center"><span className="text-[12px] font-bold uppercase tracking-widest text-accent/30">Sub-protocols</span>{!isReadOnly && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddSubtask(task.id)}><Plus className="h-3.5 w-3.5" /></Button>}</div>
              <div className="space-y-2">{(task.subtasks || []).map(sub => (<div key={sub.id} className="flex items-center gap-3"><button onClick={() => !isReadOnly && handleToggleSubtask(task.id, sub.id)} disabled={isReadOnly} className={cn("h-4 w-4 border flex items-center justify-center transition-colors", sub.isCompleted ? "bg-accent border-accent" : "border-neutral-200")}>{sub.isCompleted && <Check className="h-2.5 w-2.5 text-white" />}</button><span className={cn("text-[13px] font-light italic", sub.isCompleted ? "text-accent/30 line-through" : "text-accent/70")}>{sub.title}</span></div>))}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/designer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-all group"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /><span className="text-[11px] font-bold uppercase tracking-[0.3em]">Back to Deployment Hub</span></Link>
        {isReadOnly && (<div className="p-6 bg-neutral-50 border border-neutral-200 flex items-center gap-4"><Lock className="h-5 w-5 text-muted-foreground" /><div className="space-y-0.5"><p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Commission Locked — Historical Archive</p><p className="text-[12px] text-muted-foreground/70 italic font-light">This dossier has been finalized and is currently in read-only mode.</p></div></div>)}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4"><PencilRuler className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Deployment Workbench</span></div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex items-center gap-6 text-[12px] text-muted-foreground uppercase tracking-widest font-bold"><span>Dossier: {project.id}</span><div className="h-1 w-1 bg-neutral-200 rounded-full" /><span>Phase: {project.status}</span></div>
          </div>
          <div className="flex flex-col items-end gap-4"><div className="text-right space-y-1"><div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-accent/40 mb-1 w-64"><span>Site Velocity</span><span>{project.progress}%</span></div><Progress value={project.progress} className="h-1 bg-neutral-100" /></div><Badge className="rounded-none bg-accent text-white uppercase tracking-[0.3em] text-[11px] font-bold py-2 px-6">EXECUTION ACTIVE</Badge></div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-transparent border-b border-neutral-200 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Layout className="h-4 w-4" /> Overview</TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-3"><PlayCircle className="h-4 w-4" /> Workflow</TabsTrigger>
          <TabsTrigger value="communications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-3"><MessageSquare className="h-4 w-4" /> Communications</TabsTrigger>
          <TabsTrigger value="logs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-3"><ClipboardList className="h-4 w-4" /> Site Logs</TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-3"><Wallet className="h-4 w-4" /> Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0"><Card className="rounded-none border-neutral-100 bg-white p-12 space-y-12 shadow-xl"><div className="space-y-6"><h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent/40">The Architectural Brief</h3><p className="text-3xl font-light italic leading-relaxed text-accent/80 border-l-4 border-accent/10 pl-12">"{project.description || project.workScope || "Brief pending synchronization."}"</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-neutral-50"><div className="space-y-6"><h3 className="text-base font-bold uppercase tracking-[0.3em] text-accent/40">Temporal Protocol</h3><div className="grid grid-cols-2 gap-8 border-b border-neutral-50 pb-8"><div className="space-y-1"><p className="text-[12px] uppercase tracking-widest opacity-40 font-bold">Commencement</p><p className="font-headline italic text-2xl">{project.startDate}</p></div><div className="space-y-1"><p className="text-[12px] uppercase tracking-widest opacity-40 font-bold">Delivery Target</p><p className="font-headline italic text-2xl">{project.endDate}</p></div></div>{temporal && (<div className={cn("p-6 flex items-center justify-between", temporal.isUrgent ? "bg-destructive/5 text-destructive" : "bg-accent/5 text-accent")}><div className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">{temporal.icon}</div><div className="space-y-0.5"><p className="text-[11px] font-bold uppercase tracking-widest opacity-60">{temporal.label}</p><p className="text-[12px] font-bold uppercase tracking-widest">{temporal.sub}</p></div></div><p className="text-4xl font-headline italic">{temporal.value}</p></div>)}</div><div className="space-y-6"><h3 className="text-base font-bold uppercase tracking-[0.3em] text-accent/40">Spatial Parameters</h3><div className="grid grid-cols-2 gap-8"><div className="space-y-1"><p className="text-[12px] uppercase tracking-widest opacity-40 font-bold">Capacity</p><p className="text-2xl font-headline italic">{project.roomsCount || 'N/A'} Rooms</p></div><div className="space-y-1"><p className="text-[12px] uppercase tracking-widest opacity-40 font-bold">Commission Tier</p><p className="text-2xl font-headline italic">{project.tier}</p></div></div></div></div></Card></TabsContent>

        <TabsContent value="workflow" className="m-0"><div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar"><KanbanColumn status="Todo" tasks={(project.tasks || []).filter(t => t.status === 'Todo')} /><KanbanColumn status="In Progress" tasks={(project.tasks || []).filter(t => t.status === 'In Progress')} /><KanbanColumn status="Done" tasks={(project.tasks || []).filter(t => t.status === 'Done')} /></div></TabsContent>

        <TabsContent value="communications" className="m-0 space-y-8"><div className="grid grid-cols-1 gap-6">{projectInquiries.map((inq) => (<Card key={inq.id} className={cn("rounded-none border-neutral-100 p-8 bg-white shadow-lg group relative", inq.urgency === 'critical' && "border-l-4 border-l-destructive")}><div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"><div className="space-y-4 flex-1"><div className="flex items-center gap-4"><span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{inq.id}</span><Badge variant="outline" className={cn("rounded-none text-[9px] font-bold uppercase tracking-widest px-3 py-1", inq.urgency === 'critical' ? 'text-destructive border-destructive/20 bg-destructive/5' : 'text-accent border-accent/20 bg-accent/5')}>{inq.urgency} Urgency</Badge><Badge className={cn("rounded-none text-[9px] font-bold uppercase tracking-widest px-3 py-1", inq.status === 'new' ? 'bg-accent text-white' : 'bg-green-600 text-white')}>{inq.status}</Badge></div><p className="text-base font-light italic text-accent/80 leading-relaxed border-l-2 border-accent/10 pl-6">"{inq.message}"</p><div className="flex items-center gap-6 text-[11px] text-muted-foreground uppercase tracking-widest font-bold"><span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {inq.email}</span><span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {inq.date}</span></div></div></div></Card>))}{projectInquiries.length === 0 && (<div className="text-center py-24 border border-dashed border-neutral-200 bg-neutral-50/50 space-y-4"><div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto"><MessageSquare className="h-8 w-8 text-accent/20" /></div><p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">No project consultations logged in pipeline</p></div>)}</TabsContent>

        <TabsContent value="logs" className="m-0 space-y-10">
          <div className="flex items-center justify-between"><div className="flex items-center gap-4"><ClipboardList className="h-5 w-5 text-accent/40" /><h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent">Site Log Registry</h2></div>{!isReadOnly && <Button onClick={() => setIsAddingReport(true)} className="rounded-none h-12 px-8 bg-accent text-white uppercase tracking-widest text-[10px] font-bold flex gap-3 shadow-xl"><Plus className="h-4 w-4" /> New Site Entry</Button>}</div>
          <div className="space-y-6">{(project.siteReports || []).map((log, index) => (<motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}><Card className="rounded-none border-neutral-100 bg-white group shadow-sm hover:shadow-md transition-all overflow-hidden"><div className="flex flex-col md:flex-row"><div className={cn("w-1.5 shrink-0", log.urgency === 'Critical' ? 'bg-red-500' : log.urgency === 'High' ? 'bg-orange-400' : 'bg-accent/20')} /><div className="flex-1 p-8 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">{log.id}</span><Badge variant="outline" className="rounded-none text-[9px] uppercase border-neutral-100">{log.type}</Badge></div><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{log.date}</span></div><p className="text-base font-light italic leading-relaxed text-accent/80">"{log.content}"</p></div></div></Card></motion.div>))}{(!project.siteReports || project.siteReports.length === 0) && <div className="py-24 text-center border border-dashed border-neutral-200 bg-neutral-50/50 italic text-[12px] uppercase tracking-widest text-muted-foreground font-light">No site log entries currently synchronized for this dossier</div>}</div>
        </TabsContent>

        <TabsContent value="ledger" className="m-0 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8"><Card className="rounded-none border-neutral-100 bg-white p-10 relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp className="h-12 w-12" /></div><div className="space-y-4 relative z-10"><p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Capital Commitment</p><p className="text-3xl font-headline italic text-accent">KES {(project.totalBudget || 0).toLocaleString()}</p></div></Card><Card className="rounded-none border-neutral-100 bg-white p-10 relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><CheckCircle2 className="h-12 w-12" /></div><div className="space-y-4 relative z-10"><p className="text-[11px] font-bold uppercase tracking-[0.4em] text-green-600/60">Liquidated Funds</p><p className="text-3xl font-headline italic text-green-600">KES {totalPaid.toLocaleString()}</p></div></Card><Card className="rounded-none border-neutral-100 bg-white p-10 relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><History className="h-12 w-12" /></div><div className="space-y-4 relative z-10"><p className="text-[11px] font-bold uppercase tracking-[0.4em] text-orange-600/60">Escrow Balance</p><p className="text-3xl font-headline italic text-orange-600">KES {remainingBalance.toLocaleString()}</p></div></Card></div>
          <Card className="rounded-none border-neutral-100 p-0 bg-white shadow-2xl overflow-hidden"><div className="bg-neutral-50 px-10 py-6 border-b border-neutral-100 flex justify-between items-center"><h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent/60 flex items-center gap-3"><CreditCard className="h-5 w-5" /> Architectural Registry</h3><Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest border-neutral-100 text-accent/40 font-bold">Registry Sync Active</Badge></div><div className="divide-y divide-neutral-50">{project.installments.map((ins, i) => (<div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-10 gap-8 hover:bg-neutral-50/50 transition-colors"><div className="flex items-center gap-8"><div className={cn("h-12 w-12 rounded-full flex items-center justify-center shrink-0 border", ins.status === 'Paid' ? "bg-green-600/5 border-green-600/20 text-green-600" : "bg-orange-600/5 border-orange-600/20 text-orange-600")}>{ins.status === 'Paid' ? <CheckCircle2 className="h-5 w-5" /> : <Timer className="h-5 w-5 animate-pulse" />}</div><div className="space-y-1.5"><div className="flex items-center gap-3"><p className="text-base font-bold uppercase tracking-[0.2em]">{ins.label}</p><Badge className={cn("rounded-none text-[10px] uppercase tracking-widest px-2.5 py-0.5 font-bold", ins.status === 'Paid' ? "bg-green-600 text-white" : "bg-orange-600 text-white")}>{ins.status}</Badge></div><div className="flex items-center gap-4 text-[12px] text-muted-foreground font-bold uppercase tracking-widest"><span>Ref: {ins.transactionCode || 'Awaiting Sync'}</span><div className="h-1.5 w-1.5 rounded-full bg-accent/10" /><span>{ins.percentage}% Allocation</span></div></div></div><div className="text-right"><p className="text-[11px] font-bold uppercase tracking-widest text-accent/30 mb-1">Value</p><p className="text-2xl font-headline italic text-accent">KES {ins.amount.toLocaleString()}</p></div></div>))}</div></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddingReport} onOpenChange={setIsAddingReport}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Site Documentation</span></div>
              <DialogTitle className="text-3xl font-headline italic">New Site Entry</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-sm">Log architectural progress, site issues, or general deployment metadata for this dossier.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Entry Classification</Label><Select value={newReport.type} onValueChange={(v: any) => setNewReport({...newReport, type: v})}><SelectTrigger className="rounded-none border-neutral-200 h-12 uppercase tracking-widest text-[10px] font-bold"><SelectValue /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="Progress">Deployment Progress</SelectItem><SelectItem value="Issue">Site Restriction / Issue</SelectItem><SelectItem value="Log">General Metadata Log</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Urgency Protocol</Label><Select value={newReport.urgency} onValueChange={(v: any) => setNewReport({...newReport, urgency: v})}><SelectTrigger className="rounded-none border-neutral-200 h-12 uppercase tracking-widest text-[10px] font-bold"><SelectValue /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="Normal">Normal Visibility</SelectItem><SelectItem value="High">High Urgency</SelectItem><SelectItem value="Critical" className="text-red-600">Critical / Impasse</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Log Content</Label><Textarea value={newReport.content} onChange={(e) => setNewReport({...newReport, content: e.target.value})} placeholder="Specific architectural observations..." className="min-h-[150px] rounded-none border-neutral-200 p-6 font-light italic leading-relaxed focus:ring-accent bg-neutral-50/30" /></div>
            </div>
            <DialogFooter><Button onClick={handleAddReport} disabled={!newReport.content} className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[11px] font-bold shadow-2xl transition-all">Transmit to Registry</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
