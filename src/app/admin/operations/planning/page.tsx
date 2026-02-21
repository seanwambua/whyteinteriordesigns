"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Plus, 
  Calendar as CalendarIcon, 
  User, 
  ArrowRight, 
  Banknote, 
  ShieldCheck, 
  Loader2, 
  Trash2,
  XCircle,
  FileText,
  ChevronRight,
  Users,
  Settings2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useWhyteStore, ClientProject, ProjectTask, Milestone, VendorAllocation } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { format, parse, isValid } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function ProjectPlanningPage() {
  const { clientProjects, updateClientProject, removeClientProject, collaborators } = useWhyteStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const [activationProject, setActivationProject] = useState<ClientProject | null>(null);
  const [depositCode, setDepositCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  const [editProject, setEditProject] = useState<ClientProject | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    project: "",
    tier: "Premium" as ClientProject['tier'],
    totalBudget: 0,
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    milestones: [] as Milestone[],
    tasks: [] as ProjectTask[],
    vendorAllocations: [] as VendorAllocation[]
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const pendingPlanning = clientProjects.filter(p => p.status === 'Planning' && !p.isArchived);

  const handleActivateJourney = () => {
    if (!activationProject || !depositCode) return;
    setIsActivating(true);
    setTimeout(() => {
      const updatedInstallments = activationProject.installments.map(ins => 
        ins.label.toLowerCase().includes('deposit') ? { ...ins, status: 'Paid' as const, transactionCode: depositCode } : ins
      );
      updateClientProject(activationProject.id, {
        isActivated: true,
        initialDepositPaid: true,
        depositCode: depositCode,
        status: 'Execution',
        lastActivity: "Journey Activated — Initial Transaction Verified",
        installments: updatedInstallments
      });
      setIsActivating(false);
      setActivationProject(null);
      setDepositCode("");
      toast({ title: "Journey Activated" });
      router.push("/admin/operations/implementation");
    }, 1500);
  };

  const handleOpenEdit = (project: ClientProject) => {
    setEditProject(project);
    let startD = new Date();
    let endD = new Date();
    try {
      const parsedStart = parse(project.startDate, "MMM dd, yyyy", new Date());
      if (isValid(parsedStart)) startD = parsedStart;
      const parsedEnd = parse(project.endDate, "MMM dd, yyyy", new Date());
      if (isValid(parsedEnd)) endD = parsedEnd;
    } catch (e) {}
    setEditFormData({
      name: project.name,
      email: project.email,
      project: project.project,
      tier: project.tier,
      totalBudget: project.totalBudget,
      description: project.description || project.workScope || "",
      startDate: startD,
      endDate: endD,
      milestones: JSON.parse(JSON.stringify(project.milestones || [])),
      tasks: JSON.parse(JSON.stringify(project.tasks || [])),
      vendorAllocations: JSON.parse(JSON.stringify(project.vendorAllocations || []))
    });
  };

  const updateTask = (idx: number, field: keyof ProjectTask, value: any) => {
    const updated = [...editFormData.tasks];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, tasks: updated }));
  };

  const addTask = () => {
    setEditFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "New Site Protocol", priority: "Medium", status: "Todo", subtasks: [] }]
    }));
  };

  const updateSubtask = (taskIdx: number, subIdx: number, title: string) => {
    const updated = [...editFormData.tasks];
    if (updated[taskIdx].subtasks) {
      updated[taskIdx].subtasks![subIdx].title = title;
      setEditFormData(prev => ({ ...prev, tasks: updated }));
    }
  };

  const handleSaveEdit = () => {
    if (!editProject) return;
    const budget = Number(editFormData.totalBudget) || 0;
    updateClientProject(editProject.id, {
      ...editFormData,
      startDate: format(editFormData.startDate, "MMM dd, yyyy"),
      endDate: format(editFormData.endDate, "MMM dd, yyyy"),
      totalBudget: budget,
      lastActivity: "Protocol Synchronized"
    });
    setEditProject(null);
    toast({ title: "Dossier Updated" });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4"><div className="h-px w-8 bg-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span></div>
          <h1 className="text-5xl font-headline italic">Project <span className="not-italic">Briefings.</span></h1>
        </div>
        <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold shadow-xl hover:tracking-[0.25em] transition-all"><Link href="/admin/clients/add"><Plus className="h-5 w-5" /> Initialize Briefing</Link></Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {pendingPlanning.map((project, index) => (
          <motion.div key={project.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-accent/10 shadow-xl bg-white overflow-hidden group min-h-[300px] border-l-4 border-l-orange-400">
              <div className="flex flex-col md:flex-row items-stretch h-full">
                <div className="p-10 border-b md:border-b-0 md:border-r border-accent/5 flex flex-col justify-between min-w-[280px] bg-secondary/10">
                  <div className="space-y-4"><span className="text-[12px] font-bold text-accent/40 uppercase tracking-[0.4em] block">{project.id}</span><Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[11px] font-bold py-1.5 px-4">{project.tier} Tier</Badge></div>
                  <div className="space-y-3"><p className="text-[11px] font-bold text-orange-600/60 uppercase tracking-widest">Protocol Status</p><div className="flex items-center gap-3 text-[13px] font-bold text-orange-600 uppercase tracking-widest"><Banknote className="h-4 w-4" /> Awaiting Deposit</div></div>
                </div>
                <div className="flex-1 p-10 flex flex-col justify-between">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                    <div className="space-y-6">
                      <h3 className="text-4xl font-headline italic leading-tight text-accent">{project.project}</h3>
                      <p className="text-base font-light italic text-accent/60 leading-relaxed border-l-2 border-accent/10 pl-6 max-w-2xl line-clamp-2">"{project.description || project.workScope}"</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Required Activation</span>
                      <span className="text-2xl font-headline italic text-orange-600">KES {(project.installments.find(i => i.label.includes('Deposit'))?.amount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 border-t border-accent/5 mt-8">
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => handleOpenEdit(project)} className="rounded-none h-12 px-8 text-[11px] uppercase tracking-widest font-bold border-accent/10 hover:bg-accent hover:text-white transition-all"><Settings2 className="h-4 w-4 mr-2" /> Comprehensive Edit</Button>
                      <Button variant="ghost" onClick={() => setDeleteId(project.id)} className="rounded-none h-12 px-8 text-[11px] uppercase tracking-widest font-bold text-destructive/40 hover:text-destructive hover:bg-destructive/5 transition-all"><Trash2 className="h-4 w-4 mr-2" /> Cancel Brief</Button>
                    </div>
                    <Button onClick={() => setActivationProject(project)} className="h-14 px-10 rounded-none bg-orange-600 text-white uppercase tracking-widest text-[11px] font-bold hover:bg-orange-700 transition-all flex gap-3 shadow-xl hover:tracking-[0.2em]"><ShieldCheck className="h-5 w-5" /> Activate Journey</Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="bg-accent h-1.5 w-full" />
          <DialogHeader className="p-10 pb-6 space-y-4">
            <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Architectural Dossier Synchronization</span></div>
            <DialogTitle className="text-4xl font-headline italic">Edit Briefing: {editProject?.id}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="identity" className="flex-1 overflow-hidden flex flex-col px-10">
            <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-10 mb-8">
              <TabsTrigger value="identity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-4 px-0">Identity & Temporal</TabsTrigger>
              <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-4 px-0">Site Protocols</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto pr-2 pb-10">
              <TabsContent value="identity" className="m-0 space-y-10">
                <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label><Input value={editFormData.project} onChange={(e) => setEditFormData({...editFormData, project: e.target.value})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20" /></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commencement Protocol</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-base border-accent/20 uppercase tracking-widest font-bold">
                          <CalendarIcon className="mr-3 h-5 w-5 opacity-40" />
                          {format(editFormData.startDate, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none" align="start">
                        <Calendar mode="single" selected={editFormData.startDate} onSelect={(d) => d && setEditFormData({...editFormData, startDate: d})} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Projected Delivery Target</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-base border-accent/20 uppercase tracking-widest font-bold">
                          <CalendarIcon className="mr-3 h-5 w-5 opacity-40" />
                          {format(editFormData.endDate, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none" align="start">
                        <Calendar mode="single" selected={editFormData.endDate} onSelect={(d) => d && setEditFormData({...editFormData, endDate: d})} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Narrative</Label><Textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="min-h-[200px] rounded-none p-6 font-light italic text-lg border-accent/20" /></div>
              </TabsContent>
              <TabsContent value="workflow" className="m-0 space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-1"><h4 className="text-[13px] font-bold uppercase tracking-widest text-accent">Site Protocols</h4></div>
                  <Button variant="outline" size="sm" onClick={addTask} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white"><Plus className="h-4 w-4 mr-2" /> Initialize Protocol</Button>
                </div>
                <div className="space-y-10">
                  {editFormData.tasks.map((task, idx) => (
                    <div key={task.id} className="p-10 border border-accent/5 bg-white shadow-lg space-y-8 relative">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Primary Site Protocol</Label>
                          <Input 
                            value={task.title} 
                            onChange={(e) => updateTask(idx, 'title', e.target.value)} 
                            className="rounded-none h-14 text-xl font-bold uppercase tracking-widest border-accent/10 focus:ring-accent" 
                          />
                        </div>
                        <div className="lg:col-span-4 space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Urgency</Label>
                          <Select value={task.priority} onValueChange={(v: any) => updateTask(idx, 'priority', v)}>
                            <SelectTrigger className="rounded-none h-14 text-[13px] font-bold uppercase"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none"><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-6 pt-8 border-t border-accent/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(task.subtasks || []).map((sub, sIdx) => (
                            <div key={sub.id} className="flex gap-4 items-center bg-secondary/5 p-4 border border-transparent hover:border-accent/10">
                              <Input placeholder="Describe step..." value={sub.title} onChange={(e) => updateSubtask(idx, sIdx, e.target.value)} className="h-10 rounded-none border-none text-[13px] font-light italic focus:ring-0 p-0 bg-transparent flex-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
          <DialogFooter className="p-10 border-t border-accent/5 bg-secondary/5 flex justify-between">
            <Button variant="ghost" onClick={() => setEditProject(null)} className="rounded-none h-14 px-8 uppercase tracking-widest text-[12px] font-bold text-accent/40">Abort Protocol Sync</Button>
            <Button onClick={handleSaveEdit} className="bg-accent text-white rounded-none h-16 px-12 uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all flex gap-4">Authorize Synchronization <ChevronRight className="h-5 w-5" /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body p-10">
          <AlertDialogHeader className="space-y-6"><div className="flex items-center gap-3"><XCircle className="h-6 w-6 text-destructive" /><span className="text-destructive text-[13px] font-bold uppercase tracking-[0.3em]">Critical Protocol Interruption</span></div><AlertDialogTitle className="text-3xl font-headline italic text-destructive">Confirm Dossier Purge?</AlertDialogTitle><AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-lg italic">This will permanently remove project briefing **{deleteId}** and all associated data.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="pt-10"><AlertDialogCancel className="rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-10 border-accent/10">Abort Cancellation</AlertDialogCancel><AlertDialogAction onClick={() => { if(deleteId) { removeClientProject(deleteId); setDeleteId(null); toast({title: "Briefing Purged"}); } }} className="bg-destructive text-white rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-12 hover:bg-destructive/90 shadow-xl">Confirm Purge</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={activationProject !== null} onOpenChange={(open) => !open && setActivationProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden">
          <div className="bg-orange-600 h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-orange-600" /><span className="text-orange-600 text-[12px] font-bold uppercase tracking-[0.4em]">Activation Protocol</span></div>
              <DialogTitle className="text-3xl font-headline italic">Verify Initial Transaction</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base">To transition <strong>{activationProject?.project}</strong> to execution, verify the initial capital commitment.</DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="p-8 bg-orange-500/5 border border-orange-500/10 space-y-4 relative overflow-hidden"><div className="absolute top-0 right-0 p-2 opacity-5"><Banknote className="h-14 w-14" /></div><div className="flex justify-between items-end relative z-10"><span className="text-[12px] uppercase tracking-widest font-bold text-orange-600/60">Authorized Deposit</span><span className="text-3xl font-headline italic text-orange-600">KES {activationProject ? (activationProject.installments.find(i => i.label.includes('Deposit'))?.amount || 0).toLocaleString() : 0}</span></div></div>
              <div className="space-y-3"><Label className="text-[13px] font-bold uppercase tracking-widest opacity-60">Transaction Reference</Label><Input placeholder="E.g., TRX-9921-WHYTE" className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] font-medium" value={depositCode} onChange={(e) => setDepositCode(e.target.value)} /></div>
            </div>
            <DialogFooter className="pt-4"><Button className="w-full bg-orange-600 text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all" onClick={handleActivateJourney} disabled={isActivating || !depositCode}>{isActivating ? <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Syncing...</span> : "Authorize Activation"}</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
