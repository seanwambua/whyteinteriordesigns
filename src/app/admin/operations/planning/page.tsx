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
  Settings2,
  Flag,
  Zap,
  Calculator,
  Briefcase,
  Mail
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

  const removeTask = (idx: number) => {
    setEditFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== idx)
    }));
  };

  const updateSubtask = (taskIdx: number, subIdx: number, title: string) => {
    const updated = [...editFormData.tasks];
    if (updated[taskIdx].subtasks) {
      updated[taskIdx].subtasks![subIdx].title = title;
      setEditFormData(prev => ({ ...prev, tasks: updated }));
    }
  };

  const addMilestone = () => {
    setEditFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { id: `M-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, label: "New Target", date: format(new Date(), "MMM dd, yyyy"), isCompleted: false, description: "" }]
    }));
  };

  const removeMilestone = (idx: number) => {
    setEditFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== idx)
    }));
  };

  const updateMilestone = (idx: number, field: keyof Milestone, value: any) => {
    const updated = [...editFormData.milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, milestones: updated }));
  };

  const addAllocation = () => {
    setEditFormData(prev => ({
      ...prev,
      vendorAllocations: [...(prev.vendorAllocations || []), { id: `VA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, vendorName: "", role: "", category: "Vendor", costType: "Fixed", costValue: 0, timelineDays: 0, materials: [] }]
    }));
  };

  const removeAllocation = (idx: number) => {
    setEditFormData(prev => ({
      ...prev,
      vendorAllocations: prev.vendorAllocations.filter((_, i) => i !== idx)
    }));
  };

  const updateAllocation = (idx: number, field: keyof VendorAllocation, value: any) => {
    const updated = [...editFormData.vendorAllocations];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, vendorAllocations: updated }));
  };

  const getInstallmentPlan = (tier: ClientProject['tier'], budget: number) => {
    if (tier === 'Premium') return [ 
      { label: "Initial Deposit (50%)", percentage: 50, amount: budget * 0.5, status: 'Pending' as const }, 
      { label: "Mid-way Installment (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const }, 
      { label: "Final Handover (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const } 
    ];
    if (tier === 'Deluxe') return [ 
      { label: "Initial Deposit (60%)", percentage: 60, amount: budget * 0.6, status: 'Pending' as const }, 
      { label: "Mid-way Installment (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const }, 
      { label: "Final Handover (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const } 
    ];
    return [ 
      { label: "Initial Deposit (70%)", percentage: 70, amount: budget * 0.7, status: 'Pending' as const }, 
      { label: "Final Handover (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const } 
    ];
  };

  const handleSaveEdit = () => {
    if (!editProject) return;
    const budget = Number(editFormData.totalBudget) || 0;
    
    // Auto-recalculate installments if budget or tier changed
    const installments = getInstallmentPlan(editFormData.tier, budget);

    updateClientProject(editProject.id, {
      ...editFormData,
      startDate: format(editFormData.startDate, "MMM dd, yyyy"),
      endDate: format(editFormData.endDate, "MMM dd, yyyy"),
      totalBudget: budget,
      installments,
      lastActivity: "Dossier Synchronized via Master Edit"
    });
    setEditProject(null);
    toast({ title: "Dossier Synchronized", description: "All architectural and financial protocols updated." });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4"><div className="h-px w-8 bg-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span></div>
          <h1 className="text-5xl font-headline italic">Commission <span className="not-italic">Initialization.</span></h1>
        </div>
        <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold shadow-xl hover:tracking-[0.25em] transition-all"><Link href="/admin/clients/add"><Plus className="h-5 w-5" /> Initialize Briefing</Link></Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {pendingPlanning.map((project, index) => (
          <motion.div key={project.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-accent/10 shadow-xl bg-white overflow-hidden group min-h-[300px] border-l-4 border-l-orange-400">
              <div className="flex flex-col md:flex-row items-stretch h-full">
                <div className="p-10 border-b md:border-b-0 md:border-r border-accent/5 flex flex-col justify-between min-w-[280px] bg-secondary/10">
                  <div className="space-y-4">
                    <span className="text-[12px] font-bold text-accent/40 uppercase tracking-[0.4em] block">{project.id}</span>
                    <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[11px] font-bold py-1.5 px-4">{project.tier} Tier</Badge>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-orange-600/60 uppercase tracking-widest">Protocol Status</p>
                    <div className="flex items-center gap-3 text-[13px] font-bold text-orange-600 uppercase tracking-widest"><Banknote className="h-4 w-4" /> Awaiting Deposit</div>
                  </div>
                </div>
                <div className="flex-1 p-10 flex flex-col justify-between">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                    <div className="space-y-6">
                      <h3 className="text-4xl font-headline italic leading-tight text-accent">{project.project}</h3>
                      <p className="text-base font-light italic text-accent/60 leading-relaxed border-l-2 border-accent/10 pl-6 max-w-2xl line-clamp-2">"{project.description || project.workScope}"</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Required Activation</span>
                      <span className="text-2xl font-headline italic text-orange-600">KES {(project.installments.find(i => i.label.toLowerCase().includes('deposit'))?.amount || 0).toLocaleString()}</span>
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
        {pendingPlanning.length === 0 && (
          <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 italic text-muted-foreground uppercase tracking-[0.3em] font-light">
            No pending briefings prioritized in current cycle
          </div>
        )}
      </div>

      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="bg-accent h-1.5 w-full" />
          <DialogHeader className="p-10 pb-6 space-y-4">
            <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Architectural Dossier Synchronization</span></div>
            <DialogTitle className="text-4xl font-headline italic">Edit Briefing: {editProject?.id}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="identity" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-8 mb-8 px-10">
              <TabsTrigger value="identity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0 flex gap-2"><User className="h-3.5 w-3.5" /> Identity</TabsTrigger>
              <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0 flex gap-2"><Calculator className="h-3.5 w-3.5" /> Framework</TabsTrigger>
              <TabsTrigger value="milestones" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0 flex gap-2"><Flag className="h-3.5 w-3.5" /> Milestones</TabsTrigger>
              <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0 flex gap-2"><Zap className="h-3.5 w-3.5" /> Protocols</TabsTrigger>
              <TabsTrigger value="network" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[11px] font-bold pb-4 px-0 flex gap-2"><Users className="h-3.5 w-3.5" /> Network</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
              <TabsContent value="identity" className="m-0 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Client Full Name</Label><Input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="rounded-none h-14 text-lg border-accent/20" /></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Contact Email</Label><Input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="rounded-none h-14 text-lg border-accent/20" /></div>
                </div>
                <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label><Input value={editFormData.project} onChange={(e) => setEditFormData({...editFormData, project: e.target.value})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20" /></div>
                <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Architectural Narrative</Label><Textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="min-h-[200px] rounded-none p-6 font-light italic text-lg border-accent/20 leading-relaxed" /></div>
              </TabsContent>

              <TabsContent value="financials" className="m-0 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                    <Select value={editFormData.tier} onValueChange={(v: any) => setEditFormData({...editFormData, tier: v})}>
                      <SelectTrigger className="rounded-none h-14 border-accent/20 uppercase tracking-widest text-[11px] font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="Premium">Premium (50/30/20 Plan)</SelectItem>
                        <SelectItem value="Deluxe">Deluxe (60/20/20 Plan)</SelectItem>
                        <SelectItem value="Golden">Golden (70/30 Priority Plan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Capital Commitment (KES)</Label><Input type="number" value={editFormData.totalBudget} onChange={(e) => setEditFormData({...editFormData, totalBudget: Number(e.target.value)})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commencement Protocol</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-[12px] border-accent/20 uppercase tracking-widest font-bold"><CalendarIcon className="mr-3 h-5 w-5 opacity-40" />{format(editFormData.startDate, "MMM dd, yyyy")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={editFormData.startDate} onSelect={(d) => d && setEditFormData({...editFormData, startDate: d})} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Projected Delivery Target</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-[12px] border-accent/20 uppercase tracking-widest font-bold"><CalendarIcon className="mr-3 h-5 w-5 opacity-40" />{format(editFormData.endDate, "MMM dd, yyyy")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={editFormData.endDate} onSelect={(d) => d && setEditFormData({...editFormData, endDate: d})} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="m-0 space-y-8">
                <div className="flex justify-between items-center"><h4 className="text-[12px] font-bold uppercase tracking-widest text-accent">Strategic Milestones</h4><Button variant="outline" size="sm" onClick={addMilestone} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white"><Plus className="h-4 w-4 mr-2" /> Append Target</Button></div>
                <div className="space-y-6">
                  {editFormData.milestones.map((m, idx) => (
                    <div key={m.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-6 relative group hover:bg-white hover:shadow-xl transition-all">
                      <Button variant="ghost" size="icon" onClick={() => removeMilestone(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Target Label</Label><Input value={m.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-accent/10" /></div>
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Sync Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full h-12 rounded-none justify-start text-[11px] border-accent/10 font-bold uppercase tracking-widest"><CalendarIcon className="mr-3 h-4 w-4 opacity-40" />{m.date}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={parse(m.date, "MMM dd, yyyy", new Date())} onSelect={(d) => d && updateMilestone(idx, 'date', format(d, "MMM dd, yyyy"))} initialFocus /></PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="workflow" className="m-0 space-y-8">
                <div className="flex justify-between items-center"><h4 className="text-[12px] font-bold uppercase tracking-widest text-accent">Site Protocols</h4><Button variant="outline" size="sm" onClick={addTask} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white"><Plus className="h-4 w-4 mr-2" /> Initialize Protocol</Button></div>
                <div className="space-y-10">
                  {editFormData.tasks.map((task, idx) => (
                    <div key={task.id} className="p-10 border border-accent/5 bg-white shadow-lg space-y-8 relative">
                      <Button variant="ghost" size="icon" onClick={() => removeTask(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-3"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Protocol Identity</Label><Input value={task.title} onChange={(e) => updateTask(idx, 'title', e.target.value)} className="rounded-none h-14 text-xl font-bold uppercase tracking-widest border-accent/10" /></div>
                        <div className="lg:col-span-4 space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Urgency</Label>
                          <Select value={task.priority} onValueChange={(v: any) => updateTask(idx, 'priority', v)}>
                            <SelectTrigger className="rounded-none h-14 text-[11px] font-bold uppercase"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none"><SelectItem value="Low">Low Priority</SelectItem><SelectItem value="Medium">Medium Priority</SelectItem><SelectItem value="High">High Urgency</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="network" className="m-0 space-y-8">
                <div className="flex justify-between items-center"><h4 className="text-[12px] font-bold uppercase tracking-widest text-accent">Partner Matrix</h4><Button variant="outline" size="sm" onClick={addAllocation} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white"><Plus className="h-4 w-4 mr-2" /> Link Resource</Button></div>
                <div className="space-y-6">
                  {(editFormData.vendorAllocations || []).map((alloc, idx) => (
                    <div key={alloc.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-8 relative group hover:bg-white hover:shadow-xl transition-all">
                      <Button variant="ghost" size="icon" onClick={() => removeAllocation(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Registry Resource</Label>
                          <Select value={alloc.vendorName} onValueChange={(v) => updateAllocation(idx, 'vendorName', v)}>
                            <SelectTrigger className="rounded-none h-12 text-[12px] font-bold uppercase border-accent/10"><SelectValue placeholder="SELECT FROM REGISTRY" /></SelectTrigger>
                            <SelectContent className="rounded-none">{collaborators.map(c => <SelectItem key={c.id} value={c.name} className="uppercase text-[10px] font-bold tracking-widest">{c.name} ({c.specialty})</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Professional Role</Label><Input value={alloc.role} onChange={(e) => updateAllocation(idx, 'role', e.target.value)} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-accent/10" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Cost Model</Label>
                          <Select value={alloc.costType} onValueChange={(v: any) => updateAllocation(idx, 'costType', v)}>
                            <SelectTrigger className="rounded-none h-12 text-[11px] font-bold uppercase border-accent/10"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none"><SelectItem value="Fixed">Fixed Contract</SelectItem><SelectItem value="Daily">Daily Rate</SelectItem><SelectItem value="Percentage">Percentage Split</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Allocation Value</Label><Input type="number" value={alloc.costValue} onChange={(e) => updateAllocation(idx, 'costValue', Number(e.target.value))} className="rounded-none h-12 text-sm font-bold border-accent/10" /></div>
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Engagement Days</Label><Input type="number" value={alloc.timelineDays} onChange={(e) => updateAllocation(idx, 'timelineDays', Number(e.target.value))} className="rounded-none h-12 text-sm font-bold border-accent/10" /></div>
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
              <div className="p-8 bg-orange-500/5 border border-orange-500/10 space-y-4 relative overflow-hidden"><div className="absolute top-0 right-0 p-2 opacity-5"><Banknote className="h-14 w-14" /></div><div className="flex justify-between items-end relative z-10"><span className="text-[12px] uppercase tracking-widest font-bold text-orange-600/60">Authorized Deposit</span><span className="text-3xl font-headline italic text-orange-600">KES {activationProject ? (activationProject.installments.find(i => i.label.toLowerCase().includes('deposit'))?.amount || 0).toLocaleString() : 0}</span></div></div>
              <div className="space-y-3"><Label className="text-[13px] font-bold uppercase tracking-widest opacity-60">Transaction Reference</Label><Input placeholder="E.g., TRX-9921-WHYTE" className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] font-medium" value={depositCode} onChange={(e) => setDepositCode(e.target.value)} /></div>
            </div>
            <DialogFooter className="pt-4"><Button className="w-full bg-orange-600 text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all" onClick={handleActivateJourney} disabled={isActivating || !depositCode}>{isActivating ? <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Syncing...</span> : "Authorize Activation"}</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}