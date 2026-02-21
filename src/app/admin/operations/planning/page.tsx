
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
  Edit2, 
  Trash2,
  XCircle,
  FileText,
  Flag,
  Activity,
  ChevronRight,
  Info,
  Users,
  HardHat
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useWhyteStore, ClientProject, ProjectTask, Milestone, SubTask, VendorAllocation } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
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
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function ProjectPlanningPage() {
  const { clientProjects, updateClientProject, removeClientProject, collaborators } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  
  // Activation State
  const [activationProject, setActivationProject] = useState<ClientProject | null>(null);
  const [depositCode, setDepositCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  // Edit State
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

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const pendingPlanning = clientProjects.filter(p => p.status === 'Planning' && !p.isArchived);

  const getDepositRequired = (project: ClientProject) => {
    const deposit = project.installments.find(ins => ins.label.includes('Deposit'));
    return deposit ? deposit.amount.toLocaleString() : "N/A";
  };

  const handleActivateJourney = () => {
    if (!activationProject || !depositCode) return;
    
    setIsActivating(true);
    setTimeout(() => {
      const updatedInstallments = activationProject.installments.map(ins => 
        ins.label.includes('Deposit') ? { ...ins, status: 'Paid' as const } : ins
      );

      updateClientProject(activationProject.id, {
        isActivated: true,
        initialDepositPaid: true,
        depositCode: depositCode,
        status: 'Execution',
        lastActivity: "Journey Activated - Deposit Verified",
        installments: updatedInstallments
      });
      
      toast({
        title: "Journey Activated",
        description: `Financial synchronization complete for ${activationProject.id}. Project transitioned to Execution.`,
      });
      
      setIsActivating(false);
      setActivationProject(null);
      setDepositCode("");
    }, 1500);
  };

  const handleOpenEdit = (project: ClientProject) => {
    setEditProject(project);
    setEditFormData({
      name: project.name,
      email: project.email,
      project: project.project,
      tier: project.tier,
      totalBudget: project.totalBudget,
      description: project.description || "",
      startDate: parse(project.startDate, "MMM dd, yyyy", new Date()),
      endDate: parse(project.endDate, "MMM dd, yyyy", new Date()),
      milestones: [...(project.milestones || [])],
      tasks: [...(project.tasks || [])].map(t => ({ ...t, subtasks: [...(t.subtasks || [])] })),
      vendorAllocations: [...(project.vendorAllocations || [])]
    });
  };

  // Milestone Handlers
  const addMilestone = () => {
    setEditFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { id: `M-${Math.random().toString(36).substr(2, 4)}`, label: "", date: format(new Date(), "MMM dd, yyyy"), isCompleted: false, description: "" }]
    }));
  };

  const updateMilestone = (idx: number, field: keyof Milestone, value: any) => {
    const updated = [...editFormData.milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, milestones: updated }));
  };

  const removeMilestone = (idx: number) => {
    setEditFormData(prev => ({ ...prev, milestones: prev.milestones.filter((_, i) => i !== idx) }));
  };

  // Task Handlers
  const addTask = () => {
    setEditFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: `T-${Math.random().toString(36).substr(2, 4)}`, title: "", priority: "Medium", status: "Todo", subtasks: [] }]
    }));
  };

  const updateTask = (idx: number, field: keyof ProjectTask, value: any) => {
    const updated = [...editFormData.tasks];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, tasks: updated }));
  };

  const removeTask = (idx: number) => {
    setEditFormData(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== idx) }));
  };

  const addSubtask = (taskIdx: number) => {
    const updated = [...editFormData.tasks];
    const subtasks = updated[taskIdx].subtasks || [];
    updated[taskIdx].subtasks = [...subtasks, { id: `S-${Math.random().toString(36).substr(2, 4)}`, title: "", isCompleted: false }];
    setEditFormData(prev => ({ ...prev, tasks: updated }));
  };

  const updateSubtask = (taskIdx: number, subIdx: number, title: string) => {
    const updated = [...editFormData.tasks];
    updated[taskIdx].subtasks![subIdx].title = title;
    setEditFormData(prev => ({ ...prev, tasks: updated }));
  };

  const removeSubtask = (taskIdx: number, subIdx: number) => {
    const updated = [...editFormData.tasks];
    updated[taskIdx].subtasks = updated[taskIdx].subtasks!.filter((_, i) => i !== subIdx);
    setEditFormData(prev => ({ ...prev, tasks: updated }));
  };

  // Vendor Handlers
  const addVendor = () => {
    setEditFormData(prev => ({
      ...prev,
      vendorAllocations: [...prev.vendorAllocations, { id: `VA-${Math.random().toString(36).substr(2, 4)}`, vendorName: "", role: "", category: "Vendor", costType: "Fixed", costValue: 0, timelineDays: 0, materials: [] }]
    }));
  };

  const updateVendor = (idx: number, field: keyof VendorAllocation, value: any) => {
    const updated = [...editFormData.vendorAllocations];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, vendorAllocations: updated }));
  };

  const removeVendor = (idx: number) => {
    setEditFormData(prev => ({ ...prev, vendorAllocations: prev.vendorAllocations.filter((_, i) => i !== idx) }));
  };

  const handleSaveEdit = () => {
    if (!editProject) return;
    
    const budget = Number(editFormData.totalBudget);
    const getInstallmentPlan = (tier: ClientProject['tier'], budget: number) => {
      if (tier === 'Premium') return [
        { label: "Initial Deposit (50%)", percentage: 50, amount: budget * 0.5, status: 'Pending' as const },
        { label: "Mid-way Installment (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const },
        { label: "Final Handover (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const },
      ];
      if (tier === 'Deluxe') return [
        { label: "Initial Deposit (60%)", percentage: 60, amount: budget * 0.6, status: 'Pending' as const },
        { label: "Mid-way Installment (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const },
        { label: "Final Handover (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const },
      ];
      return [
        { label: "Initial Deposit (70%)", percentage: 70, amount: budget * 0.7, status: 'Pending' as const },
        { label: "Final Handover (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const },
      ];
    };

    updateClientProject(editProject.id, {
      name: editFormData.name,
      email: editFormData.email,
      project: editFormData.project,
      tier: editFormData.tier,
      totalBudget: budget,
      description: editFormData.description,
      startDate: format(editFormData.startDate, "MMM dd, yyyy"),
      endDate: format(editFormData.endDate, "MMM dd, yyyy"),
      milestones: editFormData.milestones,
      tasks: editFormData.tasks,
      vendorAllocations: editFormData.vendorAllocations,
      installments: getInstallmentPlan(editFormData.tier, budget),
      lastActivity: "Comprehensive Protocol Synchronization"
    });

    toast({
      title: "Brief Synchronized",
      description: `Architectural dossier ${editProject.id} has been fully updated.`,
    });
    setEditProject(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    removeClientProject(deleteId);
    toast({
      title: "Brief Cancelled",
      description: "Project brief has been removed from the studio archives.",
      variant: "destructive"
    });
    setDeleteId(null);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Project <span className="not-italic">Briefings.</span></h1>
        </div>
        <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[10px] font-bold flex gap-2">
          <Link href="/admin/clients/add"><Plus className="h-4 w-4" /> Initialize Briefing</Link>
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {pendingPlanning.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`rounded-none border-accent/10 shadow-lg hover:border-accent/30 transition-all bg-white overflow-hidden group ${!project.isActivated ? 'border-l-4 border-l-orange-400' : ''}`}>
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="p-8 border-b md:border-b-0 md:border-r border-accent/5 flex flex-col justify-center min-w-[200px] bg-secondary/5">
                  <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.4em] mb-2">{project.id}</span>
                  <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[8px] w-fit">
                    {project.tier} Tier
                  </Badge>
                  {!project.isActivated && (
                    <div className="mt-4 flex items-center gap-2 text-[8px] font-bold text-orange-600 uppercase tracking-widest">
                      <Banknote className="h-3 w-3" /> Awaiting Deposit
                    </div>
                  )}
                </div>
                <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-headline italic">{project.project}</h3>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="text-[10px] uppercase tracking-widest">Client: {project.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span className="text-[10px] uppercase tracking-widest">Target: {project.endDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenEdit(project)}
                        className="rounded-none h-8 text-[9px] uppercase tracking-widest font-bold border-accent/10 hover:bg-accent hover:text-white"
                      >
                        <Edit2 className="h-3 w-3 mr-1.5" /> Comprehensive Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDeleteId(project.id)}
                        className="rounded-none h-8 text-[9px] uppercase tracking-widest font-bold text-destructive/40 hover:text-destructive hover:bg-destructive/5"
                      >
                        <Trash2 className="h-3 w-3 mr-1.5" /> Cancel Brief
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    {!project.isActivated ? (
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Required Deposit</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">KES {getDepositRequired(project)}</span>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Milestone</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">{project.status}</span>
                      </div>
                    )}
                    
                    {!project.isActivated ? (
                      <Button 
                        onClick={() => setActivationProject(project)}
                        className="h-12 px-6 rounded-none bg-orange-600 text-white uppercase tracking-widest text-[9px] font-bold hover:bg-orange-700 transition-all flex gap-2 shadow-lg"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" /> Activate Journey
                      </Button>
                    ) : (
                      <Button asChild variant="ghost" className="h-12 w-12 rounded-full border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all">
                        <Link href={`/admin/clients/${project.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {pendingPlanning.length === 0 && (
          <div className="text-center py-24 border border-dashed border-accent/10 bg-secondary/5">
            <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No project briefings currently in the planning phase</p>
          </div>
        )}
      </div>

      {/* Activation Dialog */}
      <Dialog open={!!activationProject} onOpenChange={(open) => !open && setActivationProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 text-[10px] font-bold uppercase tracking-[0.4em]">Financial Protocol Required</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">Activate {activationProject?.id}</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Confirm the initial deposit to move this commission into the active implementation deck.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 space-y-8">
            <div className="p-6 bg-secondary/30 border border-accent/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <span className="text-accent/40">Commission Tier</span>
                <span className="text-accent">{activationProject?.tier}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <span className="text-accent/40">Initial Deposit Required</span>
                <span className="text-orange-600">KES {activationProject ? getDepositRequired(activationProject) : 0}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verification Deposit Code</Label>
              <Input 
                value={depositCode}
                onChange={(e) => setDepositCode(e.target.value)}
                placeholder="E.g., DEP-XXXX-2024"
                className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent uppercase tracking-widest"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[10px] font-bold"
              onClick={handleActivateJourney}
              disabled={isActivating || !depositCode}
            >
              {isActivating ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Verifying Protocols...</span>
              ) : "Authorize Journey Activation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* COMPREHENSIVE EDIT DIALOG */}
      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-8 pb-4 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Comprehensive Protocol Synchronization</span>
            </div>
            <DialogTitle className="text-4xl font-headline italic">Edit Dossier: {editProject?.id}</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Modify the architectural, financial, and operational frameworks for this commission.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="identity" className="flex-1 overflow-hidden flex flex-col px-8">
            <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-8 mb-6">
              <TabsTrigger value="identity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[9px] font-bold pb-3 px-0">Identity & Brief</TabsTrigger>
              <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[9px] font-bold pb-3 px-0">Timeline & Financials</TabsTrigger>
              <TabsTrigger value="milestones" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[9px] font-bold pb-3 px-0">Milestones</TabsTrigger>
              <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[9px] font-bold pb-3 px-0">Workflow</TabsTrigger>
              <TabsTrigger value="network" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[9px] font-bold pb-3 px-0">Network Matrix</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-8">
              <TabsContent value="identity" className="m-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Client Full Name</Label>
                    <Input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="rounded-none h-12" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Contact Email</Label>
                    <Input value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="rounded-none h-12" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Title</Label>
                  <Input value={editFormData.project} onChange={(e) => setEditFormData({...editFormData, project: e.target.value})} className="rounded-none h-12" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Architectural Brief</Label>
                  <Textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="min-h-[150px] rounded-none p-4 font-light italic" />
                </div>
              </TabsContent>

              <TabsContent value="financials" className="m-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                    <Select value={editFormData.tier} onValueChange={(v: any) => setEditFormData({...editFormData, tier: v})}>
                      <SelectTrigger className="rounded-none h-12"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="Premium">Premium (50/30/20)</SelectItem>
                        <SelectItem value="Deluxe">Deluxe (60/20/20)</SelectItem>
                        <SelectItem value="Golden">Golden (70/30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Budget (KES)</Label>
                    <Input type="number" value={editFormData.totalBudget} onChange={(e) => setEditFormData({...editFormData, totalBudget: Number(e.target.value)})} className="rounded-none h-12" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Commencement Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 rounded-none justify-start"><CalendarIcon className="mr-2 h-4 w-4 opacity-40" />{format(editFormData.startDate, "PPP")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={editFormData.startDate} onSelect={(d) => d && setEditFormData({...editFormData, startDate: d})} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Authorized Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 rounded-none justify-start"><CalendarIcon className="mr-2 h-4 w-4 opacity-40" />{format(editFormData.endDate, "PPP")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={editFormData.endDate} onSelect={(d) => d && setEditFormData({...editFormData, endDate: d})} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="m-0 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Strategic Delivery Targets</h4>
                  <Button variant="outline" size="sm" onClick={addMilestone} className="rounded-none h-8 text-[9px] uppercase tracking-widest font-bold"><Plus className="h-3 w-3 mr-1.5" /> Append Target</Button>
                </div>
                <div className="space-y-4">
                  {editFormData.milestones.map((m, idx) => (
                    <div key={m.id} className="p-6 border border-accent/10 bg-secondary/5 space-y-4 relative group">
                      <Button variant="ghost" size="icon" onClick={() => removeMilestone(idx)} className="absolute top-2 right-2 h-8 w-8 text-destructive/40 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Milestone Identity</Label>
                          <Input value={m.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} className="rounded-none h-10 text-xs font-bold uppercase tracking-widest" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Target Sync Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full h-10 rounded-none justify-start text-xs"><CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-40" />{m.date}</Button>
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
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Operational Implementation Protocols</h4>
                  <Button variant="outline" size="sm" onClick={addTask} className="rounded-none h-8 text-[9px] uppercase tracking-widest font-bold"><Plus className="h-3 w-3 mr-1.5" /> Add Task</Button>
                </div>
                <div className="space-y-8">
                  {editFormData.tasks.map((task, idx) => (
                    <div key={task.id} className="p-8 border border-accent/10 bg-white shadow-sm space-y-6 relative group">
                      <Button variant="ghost" size="icon" onClick={() => removeTask(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/40 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Primary Task Identity</Label>
                          <Input value={task.title} onChange={(e) => updateTask(idx, 'title', e.target.value)} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Urgency Protocol</Label>
                          <Select value={task.priority} onValueChange={(v: any) => updateTask(idx, 'priority', v)}>
                            <SelectTrigger className="rounded-none h-12 text-xs font-bold uppercase tracking-widest"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none">
                              <SelectItem value="Low">Low Priority</SelectItem>
                              <SelectItem value="Medium">Medium Priority</SelectItem>
                              <SelectItem value="High">High Urgency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t border-accent/5">
                        <div className="flex justify-between items-center"><Label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-40">Sub-task Protocol</Label><Button variant="ghost" size="sm" onClick={() => addSubtask(idx)} className="h-6 text-[8px] uppercase tracking-widest font-bold text-accent hover:bg-accent/5 p-0"><Plus className="h-2.5 w-2.5 mr-1" /> Append Sub-task</Button></div>
                        <div className="space-y-2">
                          {task.subtasks?.map((sub, sIdx) => (
                            <div key={sub.id} className="flex gap-3 items-center group/sub">
                              <div className="h-1.5 w-1.5 rounded-full bg-accent/20" />
                              <Input placeholder="Sub-task objective..." value={sub.title} onChange={(e) => updateSubtask(idx, sIdx, e.target.value)} className="h-8 rounded-none border-none text-xs italic focus:ring-0 p-0" />
                              <Button variant="ghost" size="icon" onClick={() => removeSubtask(idx, sIdx)} className="h-6 w-6 text-destructive/20 hover:text-destructive opacity-0 group-hover/sub:opacity-100 transition-opacity"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="network" className="m-0 space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Network Resource Allocation</h4>
                  <Button variant="outline" size="sm" onClick={addVendor} className="rounded-none h-8 text-[9px] uppercase tracking-widest font-bold"><Plus className="h-3 w-3 mr-1.5" /> Allocate Partner</Button>
                </div>
                <div className="space-y-6">
                  {editFormData.vendorAllocations.map((v, idx) => (
                    <div key={v.id} className="p-8 border border-accent/10 bg-white shadow-sm space-y-6 relative group">
                      <Button variant="ghost" size="icon" onClick={() => removeVendor(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/40 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Partner Identity</Label>
                          <Select value={v.vendorName} onValueChange={(val) => updateVendor(idx, 'vendorName', val)}>
                            <SelectTrigger className="rounded-none h-12 text-sm font-bold uppercase tracking-widest"><SelectValue placeholder="Select Partner" /></SelectTrigger>
                            <SelectContent className="rounded-none">
                              {collaborators.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                              <SelectItem value="Manual Entry">Manual Entry (N/A)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Role in Commission</Label>
                          <Input placeholder="E.g., Fine Joinery" className="rounded-none h-12 text-sm" value={v.role} onChange={(e) => updateVendor(idx, 'role', e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Cost Model</Label>
                          <Select value={v.costType} onValueChange={(val: any) => updateVendor(idx, 'costType', val)}>
                            <SelectTrigger className="rounded-none h-12 text-xs font-bold uppercase tracking-widest"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none">
                              <SelectItem value="Fixed">Fixed Fee</SelectItem>
                              <SelectItem value="Daily">Daily Rate</SelectItem>
                              <SelectItem value="Percentage">Studio Percentage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Model Value</Label>
                          <Input type="number" className="rounded-none h-12" value={v.costValue} onChange={(e) => updateVendor(idx, 'costValue', Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Projected Days</Label>
                          <Input type="number" className="rounded-none h-12" value={v.timelineDays} onChange={(e) => updateVendor(idx, 'timelineDays', Number(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {editFormData.vendorAllocations.length === 0 && (
                    <div className="py-12 text-center border border-dashed border-accent/10">
                      <p className="text-[10px] font-light italic text-muted-foreground uppercase tracking-widest">No partners allocated to this brief matrix.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="p-8 border-t border-accent/5 bg-secondary/5">
            <Button variant="outline" onClick={() => setEditProject(null)} className="rounded-none h-14 px-10 uppercase tracking-widest text-[10px] font-bold border-accent/10">Abort Sync</Button>
            <Button onClick={handleSaveEdit} className="bg-accent text-white hover:bg-accent/90 rounded-none h-14 px-12 uppercase tracking-widest text-[10px] font-bold flex gap-3 shadow-2xl">
              Authorize Comprehensive Sync <ChevronRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive text-[10px] font-bold uppercase tracking-[0.3em]">Irreversible Protocol</span>
            </div>
            <AlertDialogTitle className="text-2xl font-headline italic text-destructive">Cancel Project Briefing?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed">
              This will permanently purge project brief **{deleteId}** from the studio registry. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[10px] font-bold h-12 border-accent/10">Abort Cancellation</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12 hover:bg-destructive/90"
            >
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
