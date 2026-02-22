"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useWhyteStore, ClientProject, ProjectTask, SubTask } from "@/store/use-whyte-store";
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
  Timer
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectMasterTerminal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject, financialSteward } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [verifyingInstallment, setVerifyingInstallment] = useState<number | null>(null);
  const [txnCode, setTxnCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const project = clientProjects.find((p) => p.id === id);
  const isReadOnly = project?.financialReportStatus === 'Verified';

  if (!isMounted) return null;
  if (!project) return null;

  const handleUpdateStatus = (status: ClientProject['status']) => {
    if (isReadOnly) return;
    updateClientProject(project.id, { status, lastActivity: `Lifecycle transitioned manually to ${status}.` });
  };

  const handleVerifyPayment = () => {
    if (verifyingInstallment === null || !txnCode || isReadOnly) return;
    setIsVerifying(true);
    setTimeout(() => {
      const updatedInstallments = [...project.installments];
      updatedInstallments[verifyingInstallment] = {
        ...updatedInstallments[verifyingInstallment],
        status: 'Paid',
        transactionCode: txnCode
      };
      updateClientProject(project.id, { installments: updatedInstallments, lastActivity: `Payment Verified: ${updatedInstallments[verifyingInstallment].label}` });
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

  const totalPaid = project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const remainingBalance = (project.totalBudget || 0) - totalPaid;

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
          <motion.div 
            key={task.id} 
            layoutId={task.id} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={cn(
              "group relative bg-white border border-accent/5 p-6 shadow-sm hover:shadow-xl transition-all space-y-4",
              isReadOnly && "opacity-80"
            )}
          >
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
                placeholder="Protocol Title"
              />
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest opacity-40 py-0.5">{task.priority} Priority</Badge>
              </div>
            </div>
            <div className="pt-4 border-t border-accent/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold uppercase tracking-widest text-accent/30">Sub-protocols</span>
                {!isReadOnly && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddSubtask(task.id)}><Plus className="h-3.5 w-3.5" /></Button>}
              </div>
              <div className="space-y-2">
                {(task.subtasks || []).map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 group/sub">
                    <button 
                      onClick={() => !isReadOnly && handleToggleSubtask(task.id, sub.id)} 
                      disabled={isReadOnly}
                      className={cn("h-4 w-4 border flex items-center justify-center transition-colors", sub.isCompleted ? "bg-accent border-accent" : "border-accent/20 bg-transparent", isReadOnly && "cursor-default")}
                    >
                      {sub.isCompleted && <Check className="h-2.5 w-2.5 text-white" />}
                    </button>
                    <span className={cn("text-[13px] font-light italic", sub.isCompleted ? "text-accent/30 line-through" : "text-accent/70")}>{sub.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-accent/40 hover:text-accent transition-all group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em]">Back to Master Registry</span>
        </Link>

        {isReadOnly && (
          <Alert className="rounded-none border-green-600/20 bg-green-600/[0.02]">
            <Lock className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-green-600">Dossier Locked — Audit Verified</AlertTitle>
            <AlertDescription className="text-[13px] font-light italic text-muted-foreground">
              This commission has been reconciled and verified by **{financialSteward}**. All technical and financial protocols are now read-only.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4"><div className="h-px w-8 bg-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Project Terminal</span></div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex items-center gap-6 text-[13px] text-muted-foreground uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2"><User className="h-4 w-4 opacity-40" /> {project.name}</span>
              <div className="h-1 w-1 bg-accent/20 rounded-full" /><span className="opacity-40">{project.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-white p-6 border border-accent/5 shadow-2xl">
            <div className="space-y-1 pr-8 border-r border-accent/10">
              <Label className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40">Phase Lifecycle</Label>
              <Select value={project.status} onValueChange={(v: any) => handleUpdateStatus(v)} disabled={isReadOnly}>
                <SelectTrigger className="rounded-none border-none h-8 p-0 text-[13px] font-bold uppercase tracking-widest text-accent focus:ring-0 w-44"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="Planning">Planning</SelectItem><SelectItem value="Execution">Execution</SelectItem><SelectItem value="Completion">Completion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="px-8 border-r border-accent/10"><span className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span><Badge className="rounded-none uppercase tracking-widest text-[12px] bg-accent text-white py-1">{project.tier}</Badge></div>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><Layout className="h-4 w-4" /> Overview</TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><PlayCircle className="h-4 w-4" /> Workflow</TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-4 px-0 flex gap-2"><Wallet className="h-4 w-4" /> Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 space-y-12">
           <Card className="rounded-none border-accent/5 p-10 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6"><h3 className="text-base font-bold uppercase tracking-[0.3em] text-accent/40">Architectural Brief</h3><p className="text-xl font-light italic leading-relaxed text-accent/80 border-l-2 border-accent/10 pl-8">"{project.description || project.workScope}"</p></div>
               <div className="space-y-6"><h3 className="text-base font-bold uppercase tracking-[0.3em] text-accent/40">Temporal Status</h3>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-1"><p className="text-[12px] uppercase tracking-widest opacity-40 font-bold">Start Date</p><p className="font-headline italic text-2xl">{project.startDate}</p></div>
                   <div className="space-y-1"><p className="text-[12px] uppercase tracking-widest opacity-40 font-bold">Deadline</p><p className="font-headline italic text-2xl">{project.endDate}</p></div>
                 </div>
               </div>
             </div>
           </Card>
        </TabsContent>

        <TabsContent value="workflow" className="m-0"><div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar"><KanbanColumn status="Todo" tasks={(project.tasks || []).filter(t => t.status === 'Todo')} /><KanbanColumn status="In Progress" tasks={(project.tasks || []).filter(t => t.status === 'In Progress')} /><KanbanColumn status="Done" tasks={(project.tasks || []).filter(t => t.status === 'Done')} /></div></TabsContent>

        <TabsContent value="ledger" className="m-0 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="rounded-none border-accent/10 bg-white p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp className="h-12 w-12" /></div>
               <div className="space-y-4 relative z-10">
                 <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Capital Commitment</p>
                 <p className="text-3xl font-headline italic text-accent">KES {(project.totalBudget || 0).toLocaleString()}</p>
               </div>
             </Card>
             <Card className="rounded-none border-accent/10 bg-white p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><CheckCircle2 className="h-12 w-12" /></div>
               <div className="space-y-4 relative z-10">
                 <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-green-600/60">Liquidated Funds</p>
                 <p className="text-3xl font-headline italic text-green-600">KES {totalPaid.toLocaleString()}</p>
               </div>
             </Card>
             <Card className="rounded-none border-accent/10 bg-white p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><History className="h-12 w-12" /></div>
               <div className="space-y-4 relative z-10">
                 <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-orange-600/60">Outstanding Balance</p>
                 <p className="text-3xl font-headline italic text-orange-600">KES {remainingBalance.toLocaleString()}</p>
               </div>
             </Card>
           </div>
           
           <Card className="rounded-none border-accent/5 p-0 bg-white shadow-2xl overflow-hidden">
             <div className="bg-accent/5 px-10 py-6 border-b border-accent/5 flex justify-between items-center">
               <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent/60 flex items-center gap-3">
                 <CreditCard className="h-5 w-5" /> Architectural Registry
               </h3>
               <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest border-accent/10 text-accent/40 font-bold">Stewardship Verified</Badge>
             </div>
             <div className="divide-y divide-accent/5">
               {project.installments.map((ins, i) => (
                 <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-10 gap-8 hover:bg-accent/[0.01] transition-colors">
                   <div className="flex items-center gap-8">
                     <div className={cn("h-12 w-12 rounded-full flex items-center justify-center shrink-0 border", ins.status === 'Paid' ? "bg-green-600/5 border-green-600/20 text-green-600" : "bg-orange-600/5 border-orange-600/20 text-orange-600")}>
                       {ins.status === 'Paid' ? <CheckCircle2 className="h-5 w-5" /> : <Timer className="h-5 w-5 animate-pulse" />}
                     </div>
                     <div className="space-y-1.5">
                       <div className="flex items-center gap-3">
                         <p className="text-base font-bold uppercase tracking-[0.2em]">{ins.label}</p>
                         <Badge className={cn("rounded-none text-[10px] uppercase tracking-widest px-2.5 py-0.5 font-bold", ins.status === 'Paid' ? "bg-green-600 text-white" : "bg-orange-600 text-white")}>
                           {ins.status}
                         </Badge>
                       </div>
                       <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                         <span>Ref: {ins.transactionCode || 'Awaiting Sync'}</span>
                         <div className="h-1.5 w-1.5 rounded-full bg-accent/10" />
                         <span>{ins.percentage}% Allocation</span>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center gap-12 justify-between lg:justify-end">
                     <div className="text-right">
                       <p className="text-[11px] font-bold uppercase tracking-widest text-accent/30 mb-1">Value</p>
                       <p className="text-2xl font-headline italic text-accent">KES {ins.amount.toLocaleString()}</p>
                     </div>
                     {ins.status === 'Pending' && !isReadOnly && (
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
               ))}
             </div>
           </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={verifyingInstallment !== null} onOpenChange={(open) => !open && setVerifyingInstallment(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Protocol</span></div>
              <DialogTitle className="text-3xl font-headline italic">Verify Transaction</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base">Confirming receipt of the <strong>{verifyingInstallment !== null ? project.installments[verifyingInstallment].label : ""}</strong>.</DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="p-8 bg-secondary/30 border border-accent/5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5"><Banknote className="h-14 w-14" /></div>
                <div className="flex justify-between items-end relative z-10">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-accent/40">Authorized Amount</span>
                  <span className="text-2xl font-headline italic text-accent">KES {verifyingInstallment !== null ? project.installments[verifyingInstallment].amount.toLocaleString() : 0}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Transaction Reference</Label>
                <Input placeholder="E.g., TRX-9921-WHYTE" className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] font-medium" value={txnCode} onChange={(e) => setTxnCode(e.target.value)} />
              </div>
            </div>
            <DialogFooter className="pt-4"><Button className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all" onClick={handleVerifyPayment} disabled={isVerifying || !txnCode}>{isVerifying ? <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Syncing...</span> : "Authorize Entry"}</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
